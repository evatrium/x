// import {x, Component, globalStyles, h, Fragment} from "../src";
//
// // import {h, render, Fragment, Component} from "preact";
//
//
// import {todos} from "../demo/todos";
// import {extend} from "@iosio/util";
//
// import {obi} from "@iosio/obi";
//
//
// globalStyles(// language=CSS
//     `    html {
//             -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
//             -webkit-font-smoothing: antialiased;
//             -moz-osx-font-smoothing: grayscale;
//             -ms-text-size-adjust: 100%;
//             -webkit-text-size-adjust: 100%;
//         }
//
//         html, body {
//             height: 100%;
//             width: 100%;
//             margin: 0;
//             padding: 0;
//             display: flex;
//             flex-direction: column;
//             flex: 1 0 auto;
//         }
//
//         .asdf {
//             color: pink;
//         }
//
//         .derp {
//             background: purple;
//         }
//
//         *, *::before,
//         *::after {
//             box-sizing: border-box;
//         }
//     `
// );
//
//
// const Test = x('test', class extends Component {
//
//     static propTypes = {name: String};
//
//     // constructor(){
//     //     super();
//     //     console.log('test constructed')
//     // }
//     //
//     // lifeCycle() {
//     //     // let interval = setInterval(() => {
//     //     //
//     //     // })
//     //     console.log('test mounted');
//     //     return () =>{
//     //         console.log('test unmounted')
//     //     }
//     // }
//
//     render({Host, name}) {
//         return (
//             <div>
//                 <h1>name: {name}</h1>
//                 <slot/>
//             </div>
//         )
//     }
// });
//
//
// const TestListItem = x('list-item', class extends Component {
//     static propTypes = {text: String};
//
//     render() {
//         return (
//             <div>
//                 <b>{text}</b>
//                 <slot/>
//             </div>
//         )
//     }
// })
//
// const test = obi({
//     count: 0,
// });
//
//
// const counter = {
//     count: 0,
//     interval: null,
//     start() {
//         counter.stop();
//         counter.interval = setInterval(() => {
//             test.count = test.count + 1
//         }, 1000);
//     },
//     stop() {
//         clearInterval(counter.interval);
//     }
// };
//
// const $counter = obi(counter);
//
// const Counter = x('counter', class extends Component {
//     static propTypes = {color: String};
//
//     observe = test;
//
//     state = {mounted: false};
//     //
//     lifeCycle() {
//         // let interval = setInterval(() => {
//         //
//         // })
//         // console.log('mounted');
//         this.setState({mounted: true});
//         return () =>{
//             console.log('i unmounted', this.color)
//             this.setState({mounted: false})
//         }
//     }
//
//
//     render({Host, color}, {mounted}) {
//         return (
//             <Host style={{border: '2px solid purple', width: '100%'}}>
//                 <style>{`
//                      *, *::before,
//                         *::after {
//                             box-sizing: border-box;
//                         }
//                 `}</style>
//                 <span style={{color: 'blue', background: mounted ? 'white' : 'red'}}>{test.count}</span>
//             </Host>
//         )
//     }
// });
//
//
// const Lister = x('lister', class extends Component {
//
//     constructor() {
//         super();
//         console.log('lister constructed')
//     }
//
//     observe = obi(todos);
//
//     lifeCycle() {
//         // let interval = setInterval(() => {
//         //
//         // })
//         console.log('lister mounted');
//         return () => {
//             console.log('lister unmounted')
//         }
//     }
//
//     /*
//         <TestListItem text={t.name} key={t.id}>
//                         <button onClick={() => todos.removeTodo(t)}>X</button>
//         </TestListItem>
//     */
//
//     render({Host}) {
//         return (
//             <ul>
//                 {todos.displayList.map((t) => (
//                     <li key={t.id}>
//                         <b>{t.name}</b>
//                         <button onClick={() => todos.removeTodo(t)}>X</button>
//                         <Counter/>
//                     </li>
//                 ))}
//
//             </ul>
//         )
//     }
// });
//
//
// const MoveElementTest = x('move', class extends Component {
//
//
//     move = () => {
//
//
//         this.ul.insertBefore(this.redRef, this.blueRef);
//     };
//
//     render({Host}) {
//         return (
//             <Host style={{width: '100%', border: '2px solid purple', }}>
//
//                 <style>{`
//                      *, *::before,
//                         *::after {
//                             box-sizing: border-box;
//                         }
//                 `}</style>
//
//                 <button onClick={this.move}>toggle move</button>
//
//                 <ul ref={r => this.ul = r} style={{width: '100%'}}>
//
//                     <li ref={r => this.greenRef = r} style={{width: '100%'}}>
//                         <Counter color={'green'}/>
//                     </li>
//
//                     <li ref={r => this.blueRef = r} style={{width: '100%'}}>
//                         <Counter color={'blue'}/>
//                     </li>
//
//                     <li ref={r => this.redRef = r} style={{width: '100%'}}>
//                         <Counter color={'red'}/>
//                     </li>
//                 </ul>
//             </Host>
//         )
//     }
// });
//
//
// export const App = x('app', class extends Component {
//
//     static propTypes = {some: String, cool: Boolean, prop: Number, types: Object, yo: Array};
//
//     state = {bool: true};
//     // obi(extend(todos, {bool: true}));
//
//     observe = obi(todos); // detects mutations on object values and triggers an update
//
//
//     render({Host, CSS, ...props}, state) {
//
//         const TextList = ({derp}) => (
//             <Fragment>
//
//                 {todos.displayList.map(t => (<div onClick={derp} key={t.id}>{t.name}</div>))}
//
//             </Fragment>
//
//         );
//
//
//         return (
//             <Host style={{width: '100%'}}>
//
//                 <CSS>
//                     {// language=CSS
//                         `
//                             :host, *, *::before,
//                             *::after {
//                                 box-sizing: border-box;
//                             }
//
//                             .asdf {
//                                 color: pink;
//                             }
//
//
//                             .derp {
//                                 background: red;
//                             }
//                         `}
//                 </CSS>
//
//
//                 <MoveElementTest/>
//
//
//                 <h1 className={todos.todoName === '' ? 'derp' : null}>
//                     TODOS!!!!
//                 </h1>
//
//
//                 <h1 style={state.bool ? {color: todos.todoName === '' ? 'blue' : 'red'} : 'color:green'}
//                 >
//                     style object!!!!</h1>
//
//
//                 <h4> Num search results: {todos.displayList.length}</h4>
//
//
//                 {/*<Heyooo num={todos.displayList.length}/>*/}
//
//                 {/*<input ref={this.input} placeholder="add todo" value={todos.todoName}*/}
//                 {/*onInput={(e) => todos.todoName = e.target.value}/>*/}
//
//                 {/*<button onClick={() => state.bool = !state.bool}> show hid derp</button>*/}
//                 <button onClick={() => this.setState({bool: !state.bool})}> bool</button>
//
//                 <button onClick={$counter.start}> start counter</button>
//                 <button onClick={$counter.stop}> stop counter</button>
//
//
//                 {state.bool && <Test name={todos.todoName} onClick={() => console.log('shit balls')}/>}
//
//
//                 <button onClick={todos.makeABunch}>
//                     make a bunch!!!
//                 </button>
//                 ... i dare you
//
//
//                 <br/>
//                 <br/>
//
//                 <input ref={this.input} placeholder="add todo" value={todos.todoName}
//                        onInput={(e) => todos.todoName = e.target.value}/>
//
//                 <button onClick={todos.addTodo} style="color:blue">
//                     Add todo !!! :
//                 </button>
//
//                 <br/>
//
//                 <input placeholder="search" value={todos.searchValue}
//                        onInput={(e) => todos.setSearchValue(e.target.value)}/>
//
//                 <div style="width:100%;display:flex">
//
//                     <div style="width:50%">
//
//                         <x-lister></x-lister>
//
//                     </div>
//
//
//                     {/*<div style="width:50%">*/}
//                     {/*<TextList derp={() => console.log('derp')}/>*/}
//                     {/*</div>*/}
//
//
//                 </div>
//
//
//             </Host>
//         )
//     }
//
// });
// //
// // export const App = x('app', class extends Xelement {
// //
// //     state = {bool: false};
// //
// //     render() {
// //         return (
// //             <div>
// //
// //                 hello
// //                 {this.state.bool && <div>heyoo</div>}
// //
// //                 <button onClick={() => this.state.bool = !this.state.bool}> click me</button>
// //             </div>
// //         )
// //     }
// // })