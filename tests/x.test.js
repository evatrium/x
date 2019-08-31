import {X, element, x, h, Fragment} from "../src";
import {hashCustomElement, randomName} from "./testUtils/testUtils";
import {till} from "./testUtils/testUtils";
import {patch} from "../src/modified&condenced";


//https://github.com/jsdom/jsdom/issues/1030

const propTypes = {
    string: String,
    number: Number,
    boolean: Boolean,
    object: Object,
    array: Array,
    date: Date
};

class CustomElement extends X {
    static propTypes = propTypes;

    render() {
        return (
            <h1>derp</h1>
        );
    }
}

let innerRootExample = hashCustomElement(CustomElement);


let mapObjectToHTMLAttributes = (attributes) =>
    attributes ? Object.entries(attributes).reduce((previous, current) =>
        previous + ` ${current[0]}="${current[1]}"`, ""
    ) : "";


const mount = async (Component, attributes = {}, children) => {
    // tag = tag || randomName();

    // await customElements.whenDefined(tag);

    let mountPoint = document.createElement("div");

    // mountPoint.innerHTML = (`<${tag} ${mapObjectToHTMLAttributes(attributes) || ""}>${children || ""}</${tag}>`);

    document.body.appendChild(mountPoint);


    let elem = patch(mountPoint, <Component/>)
    // let elem = patch(div, h(tag,attributes))


    // let elem = document.getElementsByTagName(tag)[0];

    await elem._mounted;

    return {
        // tag,

        elem, mountPoint}
};


describe("X", () => {


    it("renders a tag to the dom", async () => {


        const tag = randomName();

       let Heyoo =  element(tag, ({host}) => {
            //
            // host.lifeCycle = ()=>{
            //     console.log('mounted')
            // }

            return <h1>X!</h1>

        }, {name: String});


        let {tag: t, elem, mountPoint} = await mount(Heyoo, {name: 'foo'}, 'heyyo');


        console.log(elem.shadowRoot.innerHTML)
        console.log(mountPoint)


        expect(elem.getAttribute('name')).toBe("foo");

        await till();


        // console.log(elem.shadowRoot.innerHTML)
        expect(mountPoint.innerHTML).toBe(`<${tag} name="foo">heyyo</${tag}>`);


    });


    //
    // it("renders a preact class component", async (done) => {
    //
    //   const tag = randomName();
    //
    //   const Rando = x(tag, class extends Component {
    //     render() {
    //       return <h1>PWC!</h1>
    //     }
    //   });
    //
    //   let mountingPoint = document.createElement('div');
    //
    //   document.body.appendChild(mountingPoint);
    //
    //   render(<Rando/>, mountingPoint);
    //
    //   let elem = document.getElementsByTagName('x-' + tag)[0];
    //
    //   await elem._mounted;
    //
    //   expect(mountingPoint.innerHTML).toBe(`<x-${tag}></x-${tag}>`);
    //
    //   expect(elem.shadowRoot.innerHTML).toBe('<h1>PWC!</h1>');
    //
    //   done();
    //
    // });
    //
    //
    // it("passes attributes as props to the preact component and reflects the attributes", async (done) => {
    //
    //   const tag = randomName();
    //
    //
    //   const Rando = x(tag, (props) => {
    //     return <div>{props.testValue}</div>
    //   }, {testValue: String});
    //
    //   let mountingPoint = document.createElement('div');
    //
    //   document.body.appendChild(mountingPoint);
    //
    //   render(<Rando test-value={'initial'}/>, mountingPoint);
    //
    //   let elem = document.getElementsByTagName('x-' + tag)[0];
    //
    //   await till();
    //
    //   expect(mountingPoint.innerHTML).toBe(`<x-${tag} test-value="initial" class="___"></x-${tag}>`);
    //
    //   expect(elem.getAttribute('test-value')).toBe('initial');
    //
    //   expect(elem.shadowRoot.innerHTML).toBe('<div>initial</div>');
    //
    //
    //   elem.setAttribute('test-value', 'updated');
    //
    //   await elem._process;
    //
    //   await till(); //
    //
    //   expect(mountingPoint.innerHTML).toBe(`<x-${tag} test-value="updated" class="___"></x-${tag}>`);
    //
    //   console.log(elem.shadowRoot.innerHTML);
    //
    //   expect(elem.shadowRoot.innerHTML).toBe('<div>updated</div>');
    //
    //   done();
    //
    // });
    //
    //
    //
    // it("Test field type string", async done => {
    //   let node = innerRootExample('string="hello"');
    //
    //   await node._mounted;
    //
    //   expect(node.string).toBe('hello');
    //
    //   done()
    // });
    //
    // it("Test field type number", async done => {
    //   let node = innerRootExample(`number="100"`);
    //
    //   await node._mounted;
    //
    //   expect(node.number).toBe(100);
    //
    //   done();
    // });
    //
    //
    // it("Test field type boolean", async done => {
    //   let node = innerRootExample(`boolean`);
    //
    //   await node._mounted;
    //
    //   expect(node.boolean).toBe(true);
    //
    //   done();
    // });
    // it("Test field type object", async done => {
    //   let node = innerRootExample(`object='{"field":true}'`);
    //
    //   await node._mounted;
    //
    //   expect(node.object).toEqual({field: true});
    //
    //   done();
    // });
    //
    // it("Test field type array", async done => {
    //   let node = innerRootExample(`array='[]'`);
    //
    //   await node._mounted;
    //
    //   expect(node.array).toEqual(jasmine.any(Array));
    //
    //   done();
    // });
    //
    // it("Test field type date", async done => {
    //   let time = "2020-01-01";
    //   let node = innerRootExample(`date='${time}'`);
    //
    //   await node._mounted;
    //
    //   expect(node.date).toEqual(jasmine.any(Date));
    //
    //   expect(new Date(time) + "").toBe(node.date + "");
    //
    //   done();
    // });

});
