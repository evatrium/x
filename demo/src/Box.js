import {x, h, Element} from "../../src";


const TestBox = ({color = 'red'})=>(
    <div style={{height: 100, width: 100, background: color}}>

    </div>
)

export const Box = x('x-box', class extends Element {
    static shadow = true;

    static propTypes = {
        style: String,
        hello: Function,
    };

    count = 0;

    state = {
        color: 'red'
    };


    componentDidMount() {
        // this.interval = setInterval(() => {
        //     let count = this.count++;
        //     console.log('emitting event: ' + count);
        //     this.emit('testEvent', 'heyyooo: ' + count)
        // }, 2000)
        // this.getAttribute('class')
    }


    render({Host, CSS, style}, {color}) {

        // console.log(style);

        return (
            <Host style={{...style, border: '3px solid blue', height: 300}}>
                <CSS>{/*language=CSS*/jcss`
                    :host {
                        display: block;
                        height: 500px;
                        width: 500px;
                        background: aliceblue;
                    }
                    .hello{
                        height: 100px;
                        width: 100px;
                        background: green;
                    }
                `}</CSS>
                <button onClick={() => {
                    console.log('click', this.count)
                    this.emit('testEvent', 'heyyooo: ' + this.count++)
                }}> emit
                </button>

                <button onClick={() => {
                    console.log('click', this.count)
                    this.emit('testEvent', 'heyyooo: ' + this.count++)
                }}> emit
                </button>

                <button onClick={() => {
                    console.log('click', this.count)
                    this.emit('testEvent', 'heyyooo: ' + this.count++)
                }}> emit
                </button>
                <br/>
                <br/>
                <br/>
                <div>
                    <button onClick={()=> this.setState({color: color === 'red' ? 'blue' : 'red'})}>
                        test
                    </button>

                    <TestBox color={color}/>

                    <div dangerouslySetInnerHTML={{__html: '<div class="hello"></div>'}}>

                        <TestBox color={color}/>

                    </div>

                </div>
            </Host>
        )
    }
});