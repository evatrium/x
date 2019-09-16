import {x, Xelement, globalStyles} from "../src";
import {h, Fragment} from "../src";

// import {h, render, Fragment, Component} from "preact";


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

        .red {
            color: red
        }

        .yellow {
            color: yellow
        }
    `
);

let css = jcss`:host, *, *::before, *::after {box-sizing: border-box;} :host{display:block}`;

const TestListItem = x('list-item', class extends Xelement {

    state = {bool: true};

    lifeCycle() {

        return () => {

        }
    }

    render({Host, host}, {bool}) {
        return (
            <Host style={{background: bool ? 'green' : 'red'}} className={bool ? 'yellow' : 'red'}>

                <style>{css + ':host(.red){color:red} :host(.yellow){color:yellow}'}</style>
                <button onClick={() => this.setState({bool: !bool})}>click me</button>
                <span style={{fontWeight: 'bold', padding: 10}}>
                    <slot/>
                </span>
            </Host>
        )
    }

});

const MoveElementTest = x('move', class extends Xelement {


    move = () => {


        this.derp.insertBefore(this.redRef, this.blueRef);
    };

    render({Host}) {
        return (
            <Host style={{width: '100%', border: '2px solid purple', '--bg': 'red'}}>

                <style>{css}</style>

                <button onClick={this.move}>toggle move</button>

                <div ref={r => this.derp = r} style={{width: '100%'}}>

                    <TestListItem ref={r => this.greenRef = r}
                                  style={{width: '100%', background: 'green', padding: 10, '--bg': 'red'}}>
                        <h3>Im green!</h3>
                    </TestListItem>

                    <TestListItem ref={r => this.blueRef = r} style={{width: '100%', background: 'blue'}}>
                        <h3>Im blue!</h3>
                    </TestListItem>

                    <TestListItem ref={r => this.redRef = r} style={{width: '100%', background: 'red'}}>
                        <h3>Im red!</h3>
                    </TestListItem>
                </div>
            </Host>
        )
    }
});


const Box = x('box', class extends Xelement {

    render({Host, host}, {bool = true}) {
        return (
            <div style={{background: 'aliceblue'}}>
                <button onClick={() => this.emit('hideClick', 'hello')}> hide me</button>
                <span style={{fontSize: 30, fontWeight: 'bold'}}>hello</span>
            </div>
        )
    }

});


// const TestListItem = x('list-item', ({host, Host}, {bool = true}) => {
//     return (
//         <Host style={{background: bool ? 'green' : 'red'}}>
//                 <span style={{fontWeight: 'bold', padding: 10}}>
//                 <button onClick={() => host.setState({bool: !bool})}>click me</button>
//                     <slot/>
//                 </span>
//         </Host>
//     )
// });


export const App = x('app', class extends Xelement {

    static propTypes = {some: String, cool: Boolean, prop: Number, types: Object, arrrrr: Array};

    state = {bool: true};

    observe = obi(todos); //global state reactivity ... more on this soon


    render({Host, CSS, host, ...props}, {bool}, context) { //more on context soon

        return (
            <Host style={{width: '100%'}}
                // className={bool ? '' : 'derp'}
            >

                <CSS>{// language=CSS  //jcss is a babel plugin that will minify and auto prefix css
                    jcss`:host, *, *::before, *::after {
                        box-sizing: border-box;
                    }

                    :host {
                        display: block
                    }`
                }</CSS>

                <h1 className={todos.todoName === '' ? 'derp' : null}>
                    TODOS!!!!
                </h1>

                <button onClick={() => this.setState({bool: !bool})}> show me</button>

                <div>
                    {bool ? <Box onHideClick={() => this.setState({bool: !bool})}/> : <div/>}
                </div>


                {/*<button onClick={bool ? null : ()=>console.log('click')} style={{color: bool ? 'red' : 'green'}}>*/}
                {/*test click*/}
                {/*</button>*/}

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

                    <ul>
                        {todos.displayList.map((t) => (
                            <li key={t.id} style={{padding: 20}}>
                                <button onClick={() => todos.removeTodo(t)}>X</button>
                                <x-list-item className={bool ? 'red' : 'yellow'}
                                             style={{background: bool ? 'purple' : 'blue'}}><b>{t.name}</b>
                                </x-list-item>
                            </li>
                        ))}

                    </ul>

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