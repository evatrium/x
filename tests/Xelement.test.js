import {Xelement, element, x, h, Fragment} from "../src";
import {randomName, mount} from "./_testUtils";

import {obi} from "@iosio/obi";


describe('Xelement', () => {

    it('creates a custom element that extends Xelement', async (done) => {

        let tag = randomName();

        element(tag, class extends Xelement {
            render() {
                return (<div>hello</div>)
            }
        });

        let results = await mount({tag});

        let {node, lightDomSnapshot, shadowSnapshot} = results;

        expect(lightDomSnapshot()).toBe(`<${tag}></${tag}>`);

        expect(shadowSnapshot()).toBe('<div>hello</div>');

        done();

    });

    it('creates a custom element using a functional component', async (done) => {

        let tag = randomName();

        element(tag, () => (<div>hello</div>));

        let results = await mount({tag});

        let {node, lightDomSnapshot, shadowSnapshot} = results;

        expect(lightDomSnapshot()).toBe(`<${tag}></${tag}>`);

        expect(shadowSnapshot()).toBe('<div>hello</div>');

        done();

    });

    it('creates a custom element using a functional component and with propTypes passed as a third parameter', async (done) => {

        let tag = randomName();

        element(tag, ({myProp}) => (<div>hello {myProp}</div>), {myProp: String});

        let results = await mount({tag, attributes: {['my-prop']: 'hola'}});

        let {node, lightDomSnapshot, shadowSnapshot} = results;

        expect(lightDomSnapshot()).toBe(`<${tag} my-prop="hola"></${tag}>`);

        expect(shadowSnapshot()).toBe('<div>hello hola</div>');

        done();
    });

    it('Xelement re-renders correct content when state is updated', async (done) => {

        let tag = randomName();

        element(tag, class extends Xelement {

            state = {count: 0};

            inc = () => this.setState({count: this.state.count + 1});

            render(props, {count}) {
                return (
                    <div>

                        <span id="count">{count}</span>

                        <button id="inc" onClick={this.inc}>inc</button>

                    </div>
                )
            }
        });

        let results = await mount({tag});

        let {node, select, click} = results;

        let counter = select('#count');

        expect(counter.innerHTML).toBe('0');

        click('#inc');

        await node._process;

        expect(counter.innerHTML).toBe('1');

        click('#inc');

        await node._process;

        expect(counter.innerHTML).toBe('2');

        done();

    });


    it('Host element behaves as expected', async (done) => {

        let tag = randomName();

        let USER_ASSIGNED_CLASS = 'userAssignedClass';
        let USER_ASSIGNED_STYLE = 'border: 1px solid red;';


        element(tag, class extends Xelement {

            state = {applyClass: true, applyStyles: true, count: 0};

            inc = () => this.setState(state => ({count: state.count + 1}));

            toggleTestClass = () => this.setState(state => ({applyClass: !state.applyClass}));

            toggleTestStyles = () => this.setState(state => ({applyStyles: !state.applyStyles}));

            render({Host}, {applyClass, applyStyles, count}) {

                return (
                    <Host className={applyClass ? 'testClass' : null} style={applyStyles ? {color: 'red'} : null}>
                        <span id="count">{count}</span>
                        <button id="testClass" onClick={this.toggleTestClass}>testStyles</button>
                        <button id="testStyles" onClick={this.toggleTestStyles}>testClass</button>
                        <button id="inc" onClick={this.inc}>inc</button>
                    </Host>
                )
            }
        });

        let results = await mount({tag, attributes: {'class': USER_ASSIGNED_CLASS, style: USER_ASSIGNED_STYLE}});

        let {node, lightDomSnapshot, shadowSnapshot, select, click} = results;

        expect(shadowSnapshot()).toBe('<span id="count">0</span><button id="testClass">testStyles</button><button id="testStyles">testClass</button><button id="inc">inc</button>')

        /**
         * @TODO -update these!
         */
        // expect(lightDomSnapshot()).toBe(`<${tag} class="${USER_ASSIGNED_CLASS} testClass" style="${USER_ASSIGNED_STYLE} color: red;"></${tag}>`);

        //
        // click('#inc');
        //
        // await node._process;
        //
        // expect(shadowSnapshot()).toBe('<span id="count">1</span><button id="testClass">testStyles</button><button id="testStyles">testClass</button><button id="inc">inc</button>')
        //
        //
        // expect(lightDomSnapshot()).toBe(`<${tag} class="${USER_ASSIGNED_CLASS} testClass" style="${USER_ASSIGNED_STYLE} color: red;"></${tag}>`);
        //
        // click('#testClass');
        //
        // await node._process;
        //
        // expect(lightDomSnapshot()).toBe(`<${tag} class="${USER_ASSIGNED_CLASS}" style="${USER_ASSIGNED_STYLE} color: red;"></${tag}>`);
        //
        // expect(shadowSnapshot()).toBe('<span id="count">1</span><button id="testClass">testStyles</button><button id="testStyles">testClass</button><button id="inc">inc</button>')
        //
        // click('#testClass');
        //
        // await node._process;
        //
        // expect(lightDomSnapshot()).toBe(`<${tag} class="${USER_ASSIGNED_CLASS} testClass" style="${USER_ASSIGNED_STYLE} color: red;"></${tag}>`);
        // expect(shadowSnapshot()).toBe('<span id="count">1</span><button id="testClass">testStyles</button><button id="testStyles">testClass</button><button id="inc">inc</button>')
        //
        // click('#testStyles');
        //
        // await node._process;
        //
        // expect(lightDomSnapshot()).toBe(`<${tag} class="${USER_ASSIGNED_CLASS} testClass" style="${USER_ASSIGNED_STYLE}"></${tag}>`);
        // expect(shadowSnapshot()).toBe('<span id="count">1</span><button id="testClass">testStyles</button><button id="testStyles">testClass</button><button id="inc">inc</button>')
        //
        // click('#testStyles');
        //
        // await node._process;
        //
        // expect(lightDomSnapshot()).toBe(`<${tag} class="${USER_ASSIGNED_CLASS} testClass" style="${USER_ASSIGNED_STYLE} color: red;"></${tag}>`);
        // expect(shadowSnapshot()).toBe('<span id="count">1</span><button id="testClass">testStyles</button><button id="testStyles">testClass</button><button id="inc">inc</button>')
        //
        // click('#testStyles');
        //
        // click('#testClass');
        //
        // await node._process;
        //
        // expect(lightDomSnapshot()).toBe(`<${tag} class="${USER_ASSIGNED_CLASS}" style="${USER_ASSIGNED_STYLE}"></${tag}>`);
        // expect(shadowSnapshot()).toBe('<span id="count">1</span><button id="testClass">testStyles</button><button id="testStyles">testClass</button><button id="inc">inc</button>')

        done();

    });


});
