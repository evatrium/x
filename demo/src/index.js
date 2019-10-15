import {h, x, Component} from "../../src";
import {Root} from "./root";
import {Box} from "./Box";

const App = x('x-app', class extends Component {


    logEvent = ({detail}) => {
        console.log('event detail', detail)
    };

    render({Host, CSS}, {bool = true}) {

        return (
            <Host>
                <CSS/>
                <button onClick={() => this.setState({bool: !bool})}>
                    toggle bool
                </button>
                <h1> hellooo </h1>
                {bool &&
                <x-box ontestEvent={this.logEvent} style={{border: '2px solid red'}}/>
                }
            </Host>
        )
    }
});

// let mountPoint = document.createElement('div');
//
let mountPoint = document.getElementsByTagName('x-root')[0];


mountPoint.appendChild(document.createElement('x-app'))
// render(<App/>, mountPoint);