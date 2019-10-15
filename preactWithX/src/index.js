import {h, x, Component, render} from "../../src";
// import {Root} from "./root";
import {Box} from "./Box";

const App = x('x-app', class extends Component {


    logEvent = ({detail}) => {
        console.log('event detail', detail)
    };

    render(_, {bool = true}) {

        return (
            <div>
                <button onClick={() => this.setState({bool: !bool})}>
                    toggle bool
                </button>
                <h1> hellooo </h1>
                {bool &&
                <x-box ontestEvent={this.logEvent}/>
                }
            </div>
        )
    }
});

render(<App/>, document.getElementsByTagName('x-root')[0]);