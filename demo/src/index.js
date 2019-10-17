import {h, x, Element} from "../../src";
import {Root} from "./root";
import {Box} from "./Box";
import {todos} from "./todos";

import {obi} from "../../src/obi";
// import {Page} from "./page";

import {createStyleSheet} from "../../src/utils";


let takeABigSheet = createStyleSheet(`.tester{background:red}`);

const counter = obi({
    num: 0
})


const Tester = () => {

    return (
        <X observe={counter} render={() => {
            console.log('tester rendered')
            return (
                <h1>{counter.num}</h1>
            )
        }}/>
    )
}


const App = x('x-app', class extends Element {


    logEvent = ({detail}) => {
        console.log('event detail', detail)
    };

    render({Host, CSS}, {bool = true}) {

        console.log('app rendered')

        return (
            <Host>

                <CSS />
                <button onClick={() => {
                    console.log('clicky click')
                    this.setState(({bool}) => ({bool: !bool}))
                }}>
                    toggle bool
                </button>

                <button onClick={() => {
                    counter.num++
                }}>
                    inc
                </button>

                {bool &&
                <x-box ontestEvent={this.logEvent} style={'border: 2px solid red; border-radius: 30px'}/>
                }

                {bool && <x-shadow observe={counter} props={counter} render={({Host, CSS}) => {

                    console.log('tester rendered')
                    return (
                        <Host>
                            <CSS styleSheets={[takeABigSheet]}>{/*language=CSS*/jcss`
                               :host{
                                    display:block;
                                    background: green;
                                }
                            `}</CSS>
                            <button className={'tester'} onClick={todos.makeABunch}>
                                make a bunch!!!
                            </button>
                            <h1>{counter.num}</h1>
                        </Host>
                    )
                }}/>
                }


                {/*/!*----------- todos ----------------*!/*/}


                <div style={{alignSelf: 'flex-start'}}>






                    ... i dare you

                    <br/>
                    <br/>

                    <x-x observe={todos} render={({Host}) => {

                        return (
                            <Host>

                                <input placeholder="add todo" value={todos.todoName}
                                       onInput={(e) => todos.todoName = e.target.value}/>

                                <button onClick={todos.addTodo} style="color:blue">
                                    Add todo !!! :
                                </button>

                                <br/>

                                <input placeholder="search" value={todos.searchValue}
                                       onInput={(e) => todos.setSearchValue(e.target.value)}/>

                            </Host>
                        )
                    }}/>


                    <x-shadow observe={todos} style="width:100%;display:flex" render={() => (
                        <ul>
                            {todos.displayList.map((t) => (
                                <li key={t.id} style={{padding: 20}}>
                                    <button onClick={() => todos.removeTodo(t)}>X</button>
                                    <b>{t.name}</b>
                                </li>
                            ))}

                        </ul>
                    )}/>


                </div>


                {/*/!*----------- todos ----------------*!/*/}


            </Host>
        )
    }
});

// let mountPoint = document.createElem('div');
//
let mountPoint = document.getElementsByTagName('x-root')[0];


mountPoint.appendChild(document.createElement('x-app'))
