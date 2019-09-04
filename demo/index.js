import {x, Xelement, h, Fragment, globalStyles} from "../src";
import {todos} from "../demo/todos";
import {extend} from "@iosio/util";

import {obi} from "@iosio/obi";


globalStyles(// language=CSS
        `    html {
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        html, body {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            flex: 1 0 auto;
        }

        .asdf {
            color: pink;
        }

        .derp {
            background: purple;
        }

        *, *::before,
        *::after {
            box-sizing: border-box;
        }
    `
);


const Test = x('test', ({Host, name}) => (
    <Host>
        <h1>say hello - name: {name} </h1>
    </Host>
), {name: String});


const TestListItem = x('list-item', ({text}) => (
    <div>
        <b>{text}</b>
        <slot/>
    </div>
), {text: String})


const Lister = x('lister', class extends Xelement {

    observe = obi(todos);

    render({Host}) {
        return (
            <Host>
                {todos.displayList.map((t) => (
                    <TestListItem text={t.name} key={t.id}>
                        <button onClick={() => todos.removeTodo(t)}>X</button>
                    </TestListItem>
                ))}

            </Host>
        )
    }
});

export const App = x('app', class extends Xelement {

    static propTypes = {some: String, cool: Boolean, prop: Number, types: Object, yo: Array};

    state = {bool: true};
    // obi(extend(todos, {bool: true}));

    observe = obi(todos); // detects mutations on object values and triggers an update


    render({Host, ...props}, state) {

        const TextList = ({derp}) => (
            <Fragment>

                {todos.displayList.map(t => (<div onClick={derp} key={t.id}>{t.name}</div>))}

            </Fragment>

        );


        return (
            <Host>

                <style>
                    {// language=CSS
                            `
                            :host, *, *::before,
                            *::after {
                                box-sizing: border-box;
                            }

                            .asdf {
                                color: pink;
                            }


                            .derp {
                                background: red;
                            }
                        `}
                </style>


                {/*

                    ******************

                    changing the class on subsequent render will indicate that the fragment hack is not working correctly.
                    - if not working correctly it will change on the second re-render not the first re-render;
                    - if working, will change first re-render

                */}
                <h1 className={{derp: todos.todoName === ''}}>
                    TODOS!!!!
                </h1>


                <h1 style={state.bool ? {color: todos.todoName === '' ? 'blue' : 'red'} : 'color:green'}
                >
                    style object!!!!</h1>


                <h4> Num search results: {todos.displayList.length}</h4>


                {/*<Heyooo num={todos.displayList.length}/>*/}

                {/*<input ref={this.input} placeholder="add todo" value={todos.todoName}*/}
                {/*onInput={(e) => todos.todoName = e.target.value}/>*/}

                {/*<button onClick={() => state.bool = !state.bool}> show hid derp</button>*/}
                <button onClick={() => this.setState({bool: !state.bool})}> bool</button>


                {state.bool && <Test name={todos.todoName} onClick={() => console.log('shit balls')}/>}


                <button onClick={todos.makeABunch}>
                    make a bunch!!!
                </button>
                ... i dare you


                <br/>
                <br/>

                <input ref={this.input} placeholder="add todo" value={todos.todoName}
                       onInput={(e) => todos.todoName = e.target.value}/>

                <button onClick={todos.addTodo} style="color:blue">
                    Add todo !!! :
                </button>

                <br/>

                <input placeholder="search" value={todos.searchValue}
                       onInput={(e) => todos.setSearchValue(e.target.value)}/>

                <div style="width:100%;display:flex">

                    <div style="width:50%">

                        <Lister/>

                    </div>


                    {/*<div style="width:50%">*/}
                        {/*<TextList derp={() => console.log('derp')}/>*/}
                    {/*</div>*/}


                </div>


            </Host>
        )
    }

});
//
// export const App = x('app', class extends Xelement {
//
//     state = {bool: false};
//
//     render() {
//         return (
//             <div>
//
//                 hello
//                 {this.state.bool && <div>heyoo</div>}
//
//                 <button onClick={() => this.state.bool = !this.state.bool}> click me</button>
//             </div>
//         )
//     }
// })