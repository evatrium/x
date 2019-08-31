

/*

{
  "name": "enzyme-preact-counter-example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "mocha -r @babel/register"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.5.5",
    "@babel/preset-env": "^7.5.5",
    "@babel/preset-react": "^7.0.0",
    "@babel/register": "^7.5.5",
    "chai": "^4.2.0",
    "enzyme": "^3.10.0",
    "enzyme-adapter-preact-pure": "^2.0.1",
    "jsdom": "^15.1.1",
    "mocha": "^6.2.0"
  },
  "dependencies": {
    "preact": "^10.0.0-rc.0"
  }
}





import { JSDOM } from 'jsdom';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';

// Setup JSDOM
const dom = new JSDOM('', {
  // Enable `requestAnimationFrame` which Preact uses internally.
  pretendToBeVisual: true,
});

global.Event = dom.window.Event;
global.Node = dom.window.Node;
global.window = dom.window;
global.document = dom.window.document;
global.requestAnimationFrame = dom.window.requestAnimationFrame;

// Setup Enzyme
configure({ adapter: new Adapter() });








import { mount } from 'enzyme';

const wrapper = mount(<div class="widget"/>);
wrapper.props() // Returns `{ children: [], className: 'widget' }`
wrapper.find('.widget').length // Returns `1`






import { act } from 'preact/test-utils';

// Any effects scheduled by the initial render will run before `mount` returns.
const wrapper = mount(<Widget showInputField={false}/>);

// Perform an action outside of Enzyme which triggers effects in the parent
// `Widget`. Since Enzyme doesn't know about this, we have to wrap the calls
// with `act` to make effects execute before we call `wrapper.update`.
act(() => {
  wrapper.find(ChildWidget).props().onButtonClicked();
});

// Update the Enzyme wrapper's snapshot
wrapper.update();





import { mount } from 'enzyme';

const wrapper = mount(<div class="widget"/>);
wrapper.props() // Returns `{ children: [], className: 'widget' }`
wrapper.find('.widget').length // Returns `1`


 */




