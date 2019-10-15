import {x, h, Component} from "../../src";


export const Box = x('x-box', class extends Component {
    static shadow = true;

    count = 0;

    didMount() {
        // this.interval = setInterval(() => {
        //     let count = this.count++;
        //     console.log('emitting event: ' + count);
        //     this.emit('testEvent', 'heyyooo: ' + count)
        // }, 2000)
        this.getAttribute('class')
    }

    render({Host, CSS}) {

        return (
            <Host>
                <CSS useStyleTag>{/*language=CSS*/jcss`
                    :host {
                        display: block;
                        height: 500px;
                        width: 500px;
                        background: aliceblue;
                    }
                `}</CSS>
                <button onClick={()=>{
                    console.log('click', this.count)
                    this.emit('testEvent', 'heyyooo: ' + this.count++)
                }}> emit </button>

                <button onClick={()=>{
                    console.log('click', this.count)
                    this.emit('testEvent', 'heyyooo: ' + this.count++)
                }}> emit </button>

                <button onClick={()=>{
                    console.log('click', this.count)
                    this.emit('testEvent', 'heyyooo: ' + this.count++)
                }}> emit </button>
            </Host>
        )
    }
});