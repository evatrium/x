import {Element, x, h} from "../src";
// import {Element, x, h, Fragment} from "../lib";
import {randomName, mount} from "./_testUtils";


describe('Component', () => {

    it('creates a custom element that extends Element', async (done) => {

        let tag = randomName();

        x(tag, class extends Element {
            render() {
                return (<div>hello</div>)
            }
        });

        let results = await mount({tag});

        let {node, lightDomSnapshot, shadowSnapshot} = results;

        expect(lightDomSnapshot()).toBe(`<${tag}><div>hello</div></${tag}>`);

        done();

    });


    it('creates a web component with shadow dom that extends Element', async (done) => {

        let tag = randomName();

        x(tag, class extends Element {
            static shadow = true;

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

        x(tag, () => (<div>hello</div>));

        let results = await mount({tag});

        let {node, lightDomSnapshot, shadowSnapshot} = results;

        expect(lightDomSnapshot()).toBe(`<${tag}><div>hello</div></${tag}>`);

        // expect(shadowSnapshot()).toBe('<div>hello</div>');

        done();

    });

    it('creates a web component with shadowDom using a functional component', async (done) => {

        let tag = randomName();

        x(tag, () => (<div>hello</div>), {shadow: true});

        let results = await mount({tag});

        let {node, lightDomSnapshot, shadowSnapshot} = results;

        expect(lightDomSnapshot()).toBe(`<${tag}></${tag}>`);

        expect(shadowSnapshot()).toBe('<div>hello</div>');

        done();

    });


    //
    it('creates a custom element using a functional component and with propTypes passed to the third parameter', async (done) => {

        let tag = randomName();

        x(tag, ({myProp}) => (<div>hello {myProp}</div>), {
            propTypes: {
                myProp: {
                    type: String,
                    reflect: true,
                    value: 'hola'
                }
            }, shadow: true
        });

        let results = await mount({tag});

        let {node, lightDomSnapshot, shadowSnapshot} = results;

        expect(lightDomSnapshot()).toBe(`<${tag} my-prop="hola"></${tag}>`);

        expect(shadowSnapshot()).toBe('<div>hello hola</div>');

        done();
    });

    it('Element re-renders correct content when state is updated', async (done) => {

        let tag = randomName();

        x(tag, class extends Element {

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

        await node.processing;

        expect(counter.innerHTML).toBe('1');

        click('#inc');

        await node.processing;

        expect(counter.innerHTML).toBe('2');

        done();

    });


    it('vHostNode merges user assigned styles into the host dom element styles correctly, allowing it to keep its own style', async (done) => {

        let tag = randomName();

        let USER_ASSIGNED_STYLE = 'border: 1px solid red; color: blue';

        x(tag, class extends Element {
            static propTypes = {style: String};
            static shadow = true;
            state = {count: 0};

            inc = () => this.setState(state => ({count: state.count + 1}));

            render({Host, style}, {count}) {

                return (
                    <Host style={{...style, color: 'red'}}>
                        <span id="count">{count}</span>
                        <button id="inc" onClick={this.inc}>inc</button>
                    </Host>
                )
            }
        });

        let results = await mount({tag, attributes: {style: USER_ASSIGNED_STYLE}});

        let {node, lightDomSnapshot, shadowSnapshot, select, click} = results;



        expect(lightDomSnapshot()).toBe(`<${tag} style="border: 1px solid red; color: red;"></${tag}>`);

        click('#inc');

        await node.processing;

        //style stays the same when re-rendering
        expect(lightDomSnapshot()).toBe(`<${tag} style="border: 1px solid red; color: red;"></${tag}>`);

        node.style.border = '2px solid purple';
        node.style.color = 'purple';

        await node.processing;

        expect(lightDomSnapshot()).toBe(`<${tag} style="border: 2px solid purple; color: red;"></${tag}>`);


        /**
         * @TODO - add more tests!
         */

        done();

    });


});
