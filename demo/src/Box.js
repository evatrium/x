import {x, h, Element} from "../../src";


export const Box = x('x-box', class extends Element {
    static shadow = true;

    static propTypes = {
        style: String
    };

    count = 0;

    componentDidMount() {
        // this.interval = setInterval(() => {
        //     let count = this.count++;
        //     console.log('emitting event: ' + count);
        //     this.emit('testEvent', 'heyyooo: ' + count)
        // }, 2000)
        // this.getAttribute('class')
    }


    render({Host, CSS, style}) {

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
            </Host>
        )
    }
});