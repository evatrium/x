import {Component, x, h, Fragment} from "../src";
// import {Component, x, h, Fragment} from "../lib";
import {randomName, mount, till} from "./_testUtils";

// import {obi} from "../lib/obi";
import {obi} from "../src/obi";


var lifeCycles, tests, shouldReRender, tag, node, observable;

const createComponent = () => {

    let tag = randomName();

    observable = obi({observableValue: 'hello'});

    x(tag, class extends Component {

        static propTypes = {
            testText: {type: String, reflect: true, value: ''}
        };

        observe = observable;

        state = {test: 'abc'};

        willMount() {
            lifeCycles.willMount();
        }


        willRender() {
            // console.log('************ will render');
            lifeCycles.willRender();
            // return 'some truthy value to indicate that a re-render should NOT take place'
            return shouldReRender;
        }

        render({testText}) {

            lifeCycles.render();

            return (<h1>{testText}</h1>)
        }

        // shouldUpdate(){
        //     return shouldReRender
        // }

        didRender() {
            // console.log('************ did render');
            lifeCycles.didRender();
        }

        willUpdate() {
            lifeCycles.willUpdate();
        }

        didUpdate() {
            lifeCycles.didUpdate();
        }

        didMount() {
            lifeCycles.didMount();
        }

        lifeCycle() {

            lifeCycles.lifeCycle();
            // adds 1 call to lifeCycle.unsubscribe
            return () => {
                return lifeCycles.unsubscribe()
                // adds 1 call to lifeCycle.unsubscribe
                // console.log('******** will unmount');

            }
        }

        willUnmount() {
            lifeCycles.willUnmount();
        }


    });

    return tag;
};


describe('Component lifeCycles', () => {


    beforeEach(function () {

        shouldReRender = undefined;

        tag = createComponent();

        lifeCycles = jasmine.createSpyObj('lifeCycles',
            ['willMount', 'willRender', 'render', 'didRender', 'willUpdate', 'didUpdate', 'didMount', 'lifeCycle', 'willUnmount', 'unsubscribe']
        );


        tests = ({willMount, willRender, render, didRender, willUpdate, didUpdate, didMount, lifeCycle, willUnmount, unsubscribe}) => {
            (willMount || willMount === 0) && expect(lifeCycles.willMount.calls.count()).toEqual(willMount);
            (willRender || willRender === 0) && expect(lifeCycles.willRender.calls.count()).toEqual(willRender);
            (render || render === 0) && expect(lifeCycles.render.calls.count()).toEqual(render);
            (didRender || didRender === 0) && expect(lifeCycles.didRender.calls.count()).toEqual(didRender);
            (willUpdate || willUpdate === 0) && expect(lifeCycles.willUpdate.calls.count()).toEqual(willUpdate);
            (didUpdate || didUpdate === 0) && expect(lifeCycles.didUpdate.calls.count()).toEqual(didUpdate);
            (didMount || didMount === 0) && expect(lifeCycles.didMount.calls.count()).toEqual(didMount);
            (lifeCycle || lifeCycle === 0) && expect(lifeCycles.lifeCycle.calls.count()).toEqual(lifeCycle);
            (willUnmount || willUnmount === 0) && expect(lifeCycles.willUnmount.calls.count()).toEqual(willUnmount);
            (unsubscribe || unsubscribe === 0) && expect(lifeCycles.unsubscribe.calls.count()).toEqual(unsubscribe);
        };

    });


    it('the initial render should call the correct lifecycle methods', async (done) => {


        let {node} = await mount({tag});

        tests({
            willMount: 1,
            willRender: 1,
            render: 1,
            didRender: 1,
            willUpdate: 0,
            didUpdate: 0,
            didMount: 1,
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
            willMount: 1,
            willRender: 2,
            render: 2,
            didRender: 2,
            willUpdate: 1,
            didUpdate: 1,
            didMount: 1,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });

        node.remove();

        done();

    });

    it('setting an attribute again with the same value should do nothing', async (done) => {

        let {node} = await mount({tag}); //1

        node.setAttribute('test-text', 'test1'); // 2

        await node._process;

        node.setAttribute('test-text', 'test1'); // 3

        await node._process;

        tests({
            willMount: 1,
            willRender: 2,
            render: 2,
            didRender: 2,
            willUpdate: 1,
            didUpdate: 1,
            didMount: 1,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });

        node.remove();

        done();

    });


    it('setting an attribute (one which is observed) again with a new value should trigger the correct lifecycle methods', async (done) => {


        let {node} = await mount({tag});


        node.setAttribute('test-text', 'test1');
        await node._process;

        tests({
            willMount: 1,
            willRender: 2,
            render: 2,
            didRender: 2,
            willUpdate: 1,
            didUpdate: 1,
            didMount: 1,
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
            willMount: 1,
            willRender: 3,
            render: 3,
            didRender: 3,
            willUpdate: 2,
            didUpdate: 2,
            didMount: 1,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });

        node.remove();


        done();

    });


    it('returning a falsy value (other than undefined) from willRender() should prevent a re-render ', async (done) => {

        let {node} = await mount({tag});

        /*
             returning false from willRender should prevent re-rendering
             ( willRender will be called in order to return the value)
        */

        shouldReRender = false;

        node.setAttribute('test-text', 'test1');

        await node._process;

        tests({
            willMount: 1,
            willRender: 2,
            render: 1,
            didRender: 1,
            willUpdate: 0,
            didUpdate: 0,
            didMount: 1,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });

        // node.remove();


        done();

    });


    it('calling setState should trigger the correct lifecycle methods ', async (done) => {

        let {node} = await mount({tag});

        node.setState({test: 123});

        await node._process;

        tests({
            willMount: 1,
            willRender: 2,
            render: 2,
            didRender: 2,
            willUpdate: 1,
            didUpdate: 1,
            didMount: 1,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });

        expect(node.state.test).toBe(123);

        node.remove();


        done();

    });



    it('updating an observed value should trigger a rerender', async (done) => {

        let {node} = await mount({tag});


        observable.observableValue = 'updated';


        await node._process;


        tests({
            willMount: 1,
            willRender: 2,
            render: 2,
            didRender: 2,
            willUpdate: 1,
            didUpdate: 1,
            didMount: 1,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });

        expect(node.observe.observableValue).toBe('updated');

        node.remove();


        done();

    });



    it('removing the element should call willUnmount and unsubscribe the subscriptions ', async (done) => {

        let {node} = await mount({tag});

        tests({
            willMount: 1,
            willRender: 1,
            render: 1,
            didRender: 1,
            willUpdate: 0,
            didUpdate: 0,
            didMount: 1,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });

        node.remove();

        tests({
            willMount: 1,
            willRender: 1,
            render: 1,
            didRender: 1,
            willUpdate: 0,
            didUpdate: 0,
            didMount: 1,
            lifeCycle: 1,
            willUnmount: 1,
            unsubscribe: 1
        });


        done();

    });

});