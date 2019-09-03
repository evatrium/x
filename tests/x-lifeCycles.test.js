import {Xelement, element, x, h, Fragment, Host} from "../src";
import {randomName, mount} from "./testUtils";
import {till} from "./testUtils/testUtils";


var lifeCycles, tests, shouldNotRerender, tag, node;

const createXelement = () => {

    let tag = randomName();

    element(tag, class extends Xelement {

        static propTypes = {
            testText: {type: String, reflect: true, value: ''}
        };

        state = {test: 'abc'};

        willRender() {
            console.log('************ will render')
            lifeCycles.willRender();
            // return 'some truthy value to indicate that a re-render should NOT take place'
            return shouldNotRerender;
        }

        didRender() {
            console.log('************ did render')
            lifeCycles.didRender();

        }

        lifeCycle() {

            lifeCycles.lifeCycle();
            this._unsubs.push(lifeCycles.unsubscribe) // adds 1 call to lifeCycle.unsubscribe
            console.log(this._unsubs.length)
            return () => { // adds 1 call to lifeCycle.unsubscribe
                console.log('******** will unmount')
                lifeCycles.willUnmount();
            }
        }

        render({testText}) {

            lifeCycles.render();

            return (<h1>{testText}</h1>)
        }
    });

    return tag;
};


describe('Xelement lifeCycles', () => {


    beforeEach(function () {

        shouldNotRerender = false;


        tag = createXelement();


        lifeCycles = jasmine.createSpyObj('lifeCycles',
            ['willRender', 'render', 'didRender', 'lifeCycle', 'willUnmount', 'unsubscribe']
        );


        tests = ({willRender, render, didRender, lifeCycle, willUnmount, unsubscribe}) => {
            (willRender || willRender === 0) && expect(lifeCycles.willRender.calls.count()).toEqual(willRender);
            (render || render === 0) && expect(lifeCycles.render.calls.count()).toEqual(render);
            (didRender || didRender === 0) && expect(lifeCycles.didRender.calls.count()).toEqual(didRender);
            (lifeCycle || lifeCycle === 0) && expect(lifeCycles.lifeCycle.calls.count()).toEqual(lifeCycle);
            (willUnmount || willUnmount === 0) && expect(lifeCycles.willUnmount.calls.count()).toEqual(willUnmount);
            (unsubscribe || unsubscribe === 0) && expect(lifeCycles.unsubscribe.calls.count()).toEqual(unsubscribe);
        };

    });


    it('the initial render should call the correct lifecycle methods', async (done) => {


        let {node} = await mount({tag});


        // expect(lightDomSnapshot()).toBe(`<${tag} class="___"></${tag}>`);
        //
        // expect(shadowSnapshot()).toBe('<h1></h1>');

        tests({
            willRender: 1,
            render: 1,
            didRender: 1,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });

        node.remove();

        done();

    });


    it('setting an attribute (one which is observed) should trigger the correct lifecycle methods ', async (done) => {


        let {node} = await mount({tag});


        node.setAttribute('test-text', 'test1');

        await node._process;


        tests({
            willRender: 2,
            render: 2,
            didRender: 2,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });

        node.remove();

        done();

    });


    it('setting an attribute again with the same value should only trigger the willRender method ', async (done) => {

        let {node} = await mount({tag}); //1

        node.setAttribute('test-text', 'test1'); // 2

        await node._process;

        node.setAttribute('test-text', 'test1'); // 3

        await node._process;

        tests({
            willRender: 2,
            render: 2,
            didRender: 2,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });

        node.remove();

        done();

    });

    it('setting an attribute (one which is observed) again with a new value should trigger the correct lifecycle methods ', async (done) => {


        let {node} = await mount({tag});

        /*
           setting an attribute with the same value should NOT trigger a rerender
        */
        node.setAttribute('test-text', 'test1');
        await node._process;

        tests({
            willRender: 2,
            render: 2,
            didRender: 2,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });

        /*
          setting an attribute with a new value SHOULD trigger a rerender
        */
        node.setAttribute('test-text', 'test2');
        await node._process;

        tests({
            willRender: 3,
            render: 3,
            didRender: 3,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });


        node.remove();


        done();

    });


    it('returning a truthy value from willRender should prevent a re-render ', async (done) => {

        let {node} = await mount({tag});

        /*
             returning true from willRender should prevent re-rendering
             (hence - willRender will be called in order to return the value)
        */

        shouldNotRerender = true;

        node.setAttribute('test-text', 'test1');

        await node._process;

        tests({
            willRender: 2,
            render: 1,
            didRender: 1,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });


        node.remove();


        done();

    });


    it('calling setState should trigger the correct lifecycle methods ', async (done) => {

        let {node} = await mount({tag});


        node.setState({test: 123});


        await node._process;

        tests({
            willRender: 2,
            render: 2,
            didRender: 2,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });


        node.remove();


        done();

    });



    it('removing the element should call willUnmount and unsubscribe the subscriptions ', async (done) => {

        let {node} = await mount({tag});

        tests({
            willRender: 1,
            render: 1,
            didRender: 1,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });


        node.remove();


        tests({
            willRender: 1,
            render: 1,
            didRender: 1,
            lifeCycle: 1,
            willUnmount: 1,
            unsubscribe: 1
        });

        done();

    });

});