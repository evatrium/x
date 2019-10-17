import {h,  Component, render} from "preact";
// import {Root} from "./root";
import {Box} from "./Box";

class App extends Component {




    logEvent = ({detail}) => {
        console.log('event detail', detail)
    };

    componentDidMount() {
        console.log(this.div, this.box)
    }


    render(_, {bool = true}) {

        return (
            <div ref={this.div}>
                <button onClick={() => this.setState({bool: !bool})}>
                    toggle bool
                </button>
                <h1> hellooo </h1>
                {bool &&
                <x-box ontestEvent={this.logEvent} ref={this.box}/>
                }
            </div>
        )
    }
}

render(<App/>, document.getElementsByTagName('x-root')[0]);