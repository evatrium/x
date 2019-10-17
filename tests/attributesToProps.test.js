import {Element, x, h, Fragment} from "../src";
// import {Element, x, h, Fragment} from "../lib";
import {randomName, mount, till} from "./_testUtils";

var expectedCalls, tests, shouldReRender, tag, node, observable;

const createComponent = ({propTypes = {}, renderFunc}) => {

    let tag = randomName();

    x(tag, class extends Element {

        static shadow = true;
        static propTypes = propTypes;

        willRender() {
            expectedCalls.willRender();
            // return 'some truthy value to indicate that a re-render should NOT take place'
            return shouldReRender;
        }

        didRender() {
            expectedCalls.didRender();
        }

        lifeCycle() {
            expectedCalls.lifeCycle();
            this.unsubs.push(expectedCalls.unsubscribe) // adds 1 call to lifeCycle.unsubscribe
            return () => { // adds 1 call to lifeCycle.unsubscribe
                expectedCalls.willUnmount();
            }
        }

        render(props) {
            expectedCalls.render();
            return renderFunc ? renderFunc(props) : null;
        }
    });

    return tag;
};



describe('Element props', () => {


    beforeEach(function () {

        shouldReRender = undefined;


        expectedCalls = jasmine.createSpyObj('lifeCycles',

            ['renderedAttributesToProps','willRender', 'render', 'didRender', 'lifeCycle', 'willUnmount', 'unsubscribe']
        );


        tests = ({willRender, render, didRender, lifeCycle, willUnmount, unsubscribe}) => {
            (willRender || willRender === 0) && expect(expectedCalls.willRender.calls.count()).toEqual(willRender);
            (render || render === 0) && expect(expectedCalls.render.calls.count()).toEqual(render);
            (didRender || didRender === 0) && expect(expectedCalls.didRender.calls.count()).toEqual(didRender);
            (lifeCycle || lifeCycle === 0) && expect(expectedCalls.lifeCycle.calls.count()).toEqual(lifeCycle);
            (willUnmount || willUnmount === 0) && expect(expectedCalls.willUnmount.calls.count()).toEqual(willUnmount);
            (unsubscribe || unsubscribe === 0) && expect(expectedCalls.unsubscribe.calls.count()).toEqual(unsubscribe);
        };


    });


    it('passes attributes as props to the render method and converts the types into what they are declared as in the propTypes static property', async (done) => {


        const propTypes = {
            string: String,
            number: Number,
            boolean: Boolean,
            object: Object,
            array: Array
        };

        const attributes = {
            string: 'hello',
            number: 123,
            boolean: true,
            object: {heyo: 'sup sup'},
            array: ['a', 'b', 'c']
        };


        let expectedShadowDom = JSON.stringify(attributes);


        let results = await mount({

            attributes,

            tag: createComponent({
                propTypes,
                renderFunc:({Host, CSS, host, ...props})=>{
                    expectedCalls.renderedAttributesToProps(props);
                    return <Host>{JSON.stringify(props)}</Host>
                }
            })
        });


        let {node, tag, lightDomSnapshot, shadowSnapshot} = results;


        let expectedTestAttrs = 'string="hello" number="123" boolean="true" object="{&quot;heyo&quot;:&quot;sup sup&quot;}" array="[&quot;a&quot;,&quot;b&quot;,&quot;c&quot;]"';

        expect(lightDomSnapshot())
            .toBe(`<${tag} ${expectedTestAttrs}></${tag}>`);


        expect(expectedCalls.renderedAttributesToProps).toHaveBeenCalledWith(attributes);


        expect(shadowSnapshot()).toBe(expectedShadowDom);


        tests({
            willRender: 1,
            render: 1,
            didRender: 1,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });

        done();

    });



    it('ignores externally set attributes that are not declared as propTypes / observedAttributes', async (done) => {


        const propTypes = {number:Number};

        const attributes = {
            string: 'hello',
            number: 123,
            boolean: true,
            object: {heyo: 'sup sup'},
            array: ['a', 'b', 'c']
        };

        let results = await mount({

            attributes,

            tag: createComponent({
                propTypes,
                renderFunc:({Host, CSS, host, ...props})=>{
                    expectedCalls.renderedAttributesToProps(props);
                    return <Host>asdf</Host>
                }
            })
        });


        let {node, tag, lightDomSnapshot, shadowSnapshot} = results;


        expect(expectedCalls.renderedAttributesToProps).toHaveBeenCalledWith({number:123});


        expect(shadowSnapshot()).toBe('asdf');


        tests({
            willRender: 1,
            render: 1,
            didRender: 1,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });



        node.string = 'hello';

        await node.processing;


        tests({
            willRender: 1,
            render: 1,
            didRender: 1,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });



        done();

    });






    it('passes an attribute to props and re-renders when the value changes', async (done) => {


        const propTypes = {
            string: String,
        };

        const attributes = {
            string: 'hello',
        };


        let results = await mount({

            attributes,

            tag: createComponent({
                propTypes,
                renderFunc:({Host, CSS, host, ...props})=>{
                    expectedCalls.renderedAttributesToProps(props);
                    return <Host>{JSON.stringify(props)}</Host>
                }
            })
        });


        let {node, tag, lightDomSnapshot, shadowSnapshot} = results;


        expect(lightDomSnapshot())
            .toBe(`<${tag} string="hello"></${tag}>`);


        expect(expectedCalls.renderedAttributesToProps).toHaveBeenCalledWith(attributes);


        expect(shadowSnapshot()).toBe(JSON.stringify(attributes));


        tests({
            willRender: 1,
            render: 1,
            didRender: 1,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });

        node.setAttribute('string', 'hello again');

        await node.processing;

        tests({
            willRender: 2,
            render: 2,
            didRender: 2,
            lifeCycle: 1,
            willUnmount: 0,
            unsubscribe: 0
        });



        expect(lightDomSnapshot())
            .toBe(`<${tag} string="hello again"></${tag}>`);


        expect(shadowSnapshot()).toBe(JSON.stringify({string: 'hello again'}));

        done();

    });



});
