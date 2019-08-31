import {x, X, h, Fragment, globalStyles} from "../src";
import {todos} from "../demo/todos";
import {extend} from "@iosio/util";

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

        *, *::before,
        *::after {
            box-sizing: border-box;
        }
    `
);


const Heyooo = x('heyo', (props) =>{
    let styles = "height:100px;width:100px";
    if(props.num % 2) styles = "";

    console.log('new styles', styles)
    return (

        <Fragment>
            <style>
                {// language=CSS
                    `
                    :host, *, *::before,
                    *::after {
                        box-sizing: border-box;
                    }

                    .derp {
                        background: red;
                    }
                `
                }
            </style>
            <div className="derp" style={styles}>
                heyooo: {typeof props.num} : {props.num}
            </div>
            <div className="derp" style={styles}>
                heyooo: {typeof props.num} : {props.num}
            </div>
        </Fragment>

    )
}, {num: Number});


const Derp = x('derp', ({host}, state) => {

    host.state = {
        count: 0
    };

    host.lifeCycle = () => {
        console.log('did mount ***');
        return () => console.log('unmounted');
    };

    host.willRender = () => {
        console.log('will render ****')
    };

    host.didRender = () => {
        console.log('did render ***')
    };


    let inc = () => host.state.count++;


    return ({name}, state, context) => {

        return (
            <Fragment>
                <style>
                    {// language=CSS
                            `
                            :host, *, *::before,
                            *::after {
                                box-sizing: border-box;
                            }

                            .derp {
                                background: red;
                            }
                        `
                    }
                </style>
                <h1>
                    heyooo : {name} ... count: {state.count}
                </h1>

                <button onClick={inc}>+</button>
                <slot/>

            </Fragment>
        )
    }

}, {name: String});


export const App = x('app', class extends X {

    state = extend(todos, {bool: true});


    didRender() {
        console.log('did render')
    }

    add = () => {

        todos.addTodo();
    };


    render(props, state) {

        console.log('rendered')

        return (
            <Fragment>

                <style>
                    {// language=CSS
                            `
                            :host, *, *::before,
                            *::after {
                                box-sizing: border-box;
                            }

                            .derp {
                                background: red;
                            }
                        `}
                </style>


                <h1 className={{derp: todos.todoName === ''}}> TODOS!!!!</h1>
                <h4> Num search results: {todos.displayList.length}</h4>

                <Heyooo num={todos.displayList.length}/>

                <input ref={this.input} placeholder="add todo" value={todos.todoName}
                       onInput={(e) => todos.todoName = e.target.value}/>

                <button onClick={() => state.bool = !state.bool}> show hid derp</button>

                {state.bool && <Derp name={todos.todoName}/>}



                <button onClick={todos.makeABunch}> make a bunch</button>


                <br/>

                <input ref={this.input} placeholder="add todo" value={todos.todoName}
                       onInput={(e) => todos.todoName = e.target.value}/>

                <button onClick={() => {
                    // todos.addTodo()
                    this.add();
                }} style="color:blue">
                    Add todo !!! :
                </button>

                <br/>

                <input placeholder="search" value={todos.searchValue}
                       onInput={(e) => todos.setSearchValue(e.target.value)}/>

                <div style="width:100%;display:flex">

                    <div style="width:50%">

                        <ul>

                            {todos.displayList.map((t) => (
                                <li key={t.id}>
                                    {t.name}
                                    <button onClick={() => todos.removeTodo(t)}>X</button>
                                </li>
                            ))}

                        </ul>

                    </div>


                    <div style="width:50%">

                        {todos.displayList.map(t => (<div key={t.id}>{t.name}</div>))}

                    </div>


                </div>


            </Fragment>
        )
    }

});
