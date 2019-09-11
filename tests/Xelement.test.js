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


    it('Host element behaves as expected', async (done) => {

        let tag = randomName();

        element(tag, class extends Xelement {
            propTypes = {myProp: String};

            render({Host}) {
                return (<div>hello</div>)
            }
        });

        let results = await mount({tag, attributes: {['my-prop']: 'hola'}});

        let {node, lightDomSnapshot, shadowSnapshot} = results;

        expect(lightDomSnapshot()).toBe(`<${tag} my-prop="hola"></${tag}>`);

        expect(shadowSnapshot()).toBe('<div>hello hola</div>');

        done();

    });


});
