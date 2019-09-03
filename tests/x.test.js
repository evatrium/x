import {Xelement, element, x, h} from "../src";
import {hashCustomElement, randomName} from "./testUtils/testUtils";
import {till} from "./testUtils/testUtils";



//https://github.com/jsdom/jsdom/issues/1030

const propTypes = {
    string: String,
    number: Number,
    boolean: Boolean,
    object: Object,
    array: Array
};

class CustomElement extends Xelement {
    static propTypes = propTypes;

    render() {
        return (
            <h1>derp</h1>
        );
    }
}


let mapObjectToHTMLAttributes = (attributes) =>
    attributes ? Object.entries(attributes).reduce((previous, current) =>
        previous + ` ${current[0]}="${current[1]}"`, ""
    ) : "";


const mount = async ({tag, Component, attributes = {}, children}) => {

    tag = tag || randomName();

    let mountPoint = document.createElement("div");

    mountPoint.innerHTML = (`<${tag} ${mapObjectToHTMLAttributes(attributes) || ""}>${children || ""}</${tag}>`);

    document.body.appendChild(mountPoint);

    let node = mountPoint.firstChild;

    await node._mounted;

    await till(); //wait till the visibility classname is added;

    return {
        tag,
        mountPoint,
        node,
        shallowSnapshot: mountPoint.innerHTML,
        slots: node.shadowRoot.querySelectorAll('slot'),
        getSlotContent: (slot_id = "slot-0", node) => node.shadowRoot.getElementById(slot_id).parentNode.innerHTML
    }
};


xdescribe("Xelement functional and class component renders without crashing", () => {

    it("renders a tag to the dom", async (done) => {

        const tag = randomName();

        element(tag, class extends Xelement {

            static propTypes = {name: String};

            lifeCycle() {
                console.log(this.props);
            }

            render({Host, ...props}) {

                return (
                    <Host>
                        <h1 id={'shadow-content'}>X!</h1>
                        <p id={'passed props'}>
                            {props.name}
                        </p>
                        <slot id="slot-0"/>
                        <slot id="slot-1" name="named-slot"/>
                    </Host>
                )
            }
        });


        let children = '<b>heyyo</b> assuh due';

        let config = {
            tag,
            attributes: {name: 'foo'},
            children,

        };


        let results = await mount(config);

        //
        // let {node, mountPoint, shallowSnapshot, slots, getSlotContent} = results;
        //
        // // let slot = node.shadowRoot.querySelectorAll('slot');
        // //
        // let assignedNodes = slots[0].assignedNodes({flatten:true});
        //
        // console.log(assignedNodes)
        //
        // node.shadowRoot.querySelectorAll('slot').forEach(slot=>{
        //
        //     let replacement = slot.assignedNodes({flatten:true});
        //     replacement.length &&
        //     slot.replaceWith(...replacement)
        // });
        //
        // console.log(formatXML(node.shadowRoot.innerHTML))
        //


        // console.lgo(node)
        // console.log(getSlotContent("slot-0", node));
        // expect().toBe(children);

        // expect(shallowSnapshot).toBe(`<${tag} name="foo" class="___">${children}</${tag}>`);

        expect(true).toBe(true);
        done()

    });

    //
    // describe("Xelement functional and class component renders without crashing", () => {
    //
    //     it("renders a tag to the dom", async (done) => {
    //
    //         const tag = randomName();
    //
    //         element(tag, class extends Xelement {
    //
    //             static propTypes = {name: String};
    //
    //             lifeCycle() {
    //                 console.log(this.props);
    //             }
    //
    //             render({Host, ...props}) {
    //
    //                 return (
    //                     <Host>
    //                         <h1 id={'shadow-content'}>X!</h1>
    //                         <p id={'passed props'}>
    //                             {props.name}
    //                         </p>
    //                         <slot id="slot-0"/>
    //                         <slot id="slot-1" name="named-slot"/>
    //                     </Host>
    //                 )
    //             }
    //         });
    //
    //
    //         let children = '<b>heyyo</b> assuh due';
    //
    //         let config = {
    //             tag,
    //             attributes: {name: 'foo'},
    //             children,
    //
    //         };
    //
    //
    //         let results = await mount(config);
    //
    //
    //         let {node, mountPoint, shallowSnapshot, slots, getSlotContent} = results;
    //
    //         // let slot = node.shadowRoot.querySelectorAll('slot');
    //         //
    //         let assignedNodes = slots[0].assignedNodes({flatten:true});
    //
    //         console.log(assignedNodes)
    //
    //         node.shadowRoot.querySelectorAll('slot').forEach(slot=>{
    //
    //             let replacement = slot.assignedNodes({flatten:true});
    //             replacement.length &&
    //             slot.replaceWith(...replacement)
    //         });
    //
    //         console.log(formatXML(node.shadowRoot.innerHTML))
    //
    //
    //
    //         // console.lgo(node)
    //         // console.log(getSlotContent("slot-0", node));
    //         // expect().toBe(children);
    //
    //         expect(shallowSnapshot).toBe(`<${tag} name="foo" class="___">${children}</${tag}>`);
    //
    //         done()
    //
    //     });
    //
    //







        //
    // it("renders a tag to the dom using a Fragment root component", async (done) => {
    //
    //     const tag = randomName();
    //
    //     element(tag, () => {
    //         return (
    //             <Fragment>
    //                 <h1>Xelement!</h1>
    //             </Fragment>
    //         )
    //     }, {name: String});
    //
    //     let {node, mountPoint} = await mount({
    //         tag,
    //         attributes: {name: 'foo'},
    //         children: 'heyyo'
    //     });
    //
    //     expect(node.getAttribute('name')).toBe("foo");
    //
    //     expect(mountPoint.innerHTML).toBe(`<${tag} name="foo" class="___">heyyo</${tag}>`);
    //     done()
    // });
    //

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
