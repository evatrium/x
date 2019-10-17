import {h, x, Element} from "../../src";
import {Root} from "./root";
import {Box} from "./Box";
import {todos} from "./todos";
import {Page} from "./page";


const Tester = ()=>(
    <h1>
        Heeyyoo
    </h1>
)

const App = x('x-app', class extends Element {

    constructor() {
        super();
        this.state = {
            bool: true
        };
    }

    observe = todos;

    logEvent = ({detail}) => {
        console.log('event detail', detail)
    };

    render({Host, CSS}, {bool}) {
        return (
            <host>
                <css/>
                <button onClick={() =>{
                    console.log('clicky click')
                    this.setState(({bool}) => ({bool: !bool}))
                }}>
                    toggle bool
                </button>


                {/*----------- todos ----------------*/}


                <div style={{alignSelf: 'flex-start'}}>



                    <button onClick={() => this.setState({bool: !bool})}> show me</button>



                    <button onClick={todos.makeABunch}>
                        make a bunch!!!
                    </button>
                    ... i dare you

                    <br/>
                    <br/>

                    <input placeholder="add todo" value={todos.todoName}
                           onInput={(e) => todos.todoName = e.target.value}/>

                    <button onClick={todos.addTodo} style="color:blue">
                        Add todo !!! :
                    </button>

                    <br/>

                    <input placeholder="search" value={todos.searchValue}
                           onInput={(e) => todos.setSearchValue(e.target.value)}/>


                    {/*<MoveElementTest/>*/}

                    <div style="width:100%;display:flex">

                        <ul>
                            {todos.displayList.map((t) => (
                                <li key={t.id} style={{padding: 20}}>
                                    <button onClick={() => todos.removeTodo(t)}>X</button>
                                    <b>{t.name}</b>
                                </li>
                            ))}

                        </ul>

                    </div>
                </div>


                {/*----------- todos ----------------*/}












                {/*{bool &&*/}
                {/*<x-box ontestEvent={this.logEvent} style={{border: '2px solid red'}}/>*/}
                {/*}*/}
            </host>
        )
    }
});

// let mountPoint = document.createElement('div');
//
let mountPoint = document.getElementsByTagName('x-root')[0];


mountPoint.appendChild(document.createElement('x-app'))
// render(<App/>, mountPoint);