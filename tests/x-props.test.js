// import {Xelement, element, x, h, Fragment, Host} from "../src";
// import {randomName, mount} from "./testUtils";
// import {till} from "./testUtils/testUtils";
//
//
// var lifeCycles, tests, shouldNotRerender, tag, node;
//
//
// const propTypes = {
//     string: String,
//     number: Number,
//     boolean: Boolean,
//     object: Object,
//     array: Array
// };
//
// const createXelement = () => {
//
//     let tag = randomName();
//
//     element(tag, class extends Xelement {
//
//         static propTypes = propTypes;
//
//         render({testText}) {
//
//             lifeCycles.render();
//
//             return (<h1>{testText}</h1>)
//         }
//     });
//
//     return tag;
// };
//
//
// describe('Xelement lifeCycles', () => {
//
//
//     beforeEach(function () {
//
//         shouldNotRerender = false;
//
//
//         tag = createXelement();
//
//
//         lifeCycles = jasmine.createSpyObj('lifeCycles',
//             ['willRender', 'render', 'didRender', 'lifeCycle', 'willUnmount', 'unsubscribe']
//         );
//
//
//         tests = ({willRender, render, didRender, lifeCycle, willUnmount, unsubscribe}) => {
//             (willRender || willRender === 0) && expect(lifeCycles.willRender.calls.count()).toEqual(willRender);
//             (render || render === 0) && expect(lifeCycles.render.calls.count()).toEqual(render);
//             (didRender || didRender === 0) && expect(lifeCycles.didRender.calls.count()).toEqual(didRender);
//             (lifeCycle || lifeCycle === 0) && expect(lifeCycles.lifeCycle.calls.count()).toEqual(lifeCycle);
//             (willUnmount || willUnmount === 0) && expect(lifeCycles.willUnmount.calls.count()).toEqual(willUnmount);
//             (unsubscribe || unsubscribe === 0) && expect(lifeCycles.unsubscribe.calls.count()).toEqual(unsubscribe);
//         };
//
//     });
//
//
//     it('the initial render should call the correct lifecycle methods', async (done) => {
//
//
//         let {node} = await mount({tag});
//
//
//         // expect(lightDomSnapshot()).toBe(`<${tag} class="___"></${tag}>`);
//         //
//         // expect(shadowSnapshot()).toBe('<h1></h1>');
//
//         tests({
//             willRender: 1,
//             render: 1,
//             didRender: 1,
//             lifeCycle: 1,
//             willUnmount: 0,
//             unsubscribe: 0
//         });
//
//         node.remove();
//
//         done();
//
//     });
//
//
// });