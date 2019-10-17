import {x, Element, h, Fragment, render} from "../../src";
import {globalStyles} from "../../src/utils";
import {todos} from "./todos";
import {obi} from "../../src/obi";
import {Root} from "./root";
import {Page} from "./page";

import {Nav} from "./nav";

let css = jcss`:host, *, *::before, *::after {box-sizing: border-box;} :host{display:block}`;

const TestListItem = x('x-list-item', class extends Element {
    static shadow = true;

    state = {bool: true};

    lifeCycle() {

        return () => {

        }
    }


    render({Host, CSS}, {bool}) {
        return (
            <Host style={{background: bool ? 'green' : 'red'}} className={bool ? 'yellow' : 'red'}>

                <CSS>{ ':host(.red){color:white} :host(.yellow){color:orange}'}</CSS>
                <button onClick={() => this.setState({bool: !bool})}>click me</button>
                <span style={{fontWeight: 'bold', padding: 10}}>
                    <slot/>
                </span>
            </Host>
        )
    }

});
//
const MoveElementTest = x('x-move', class extends Element {


    move = () => {


        this.derp.insertBefore(this.redRef, this.blueRef);
    };

    render({Host}) {
        return (
            <Host style={{width: '100%', border: '2px solid purple', '--bg': 'red'}}>

                <style>{css}</style>

                <button onClick={this.move}>toggle move</button>

                <div ref={r => this.derp = r} style={{width: '100%'}}>

                    <div ref={r => this.greenRef = r}
                         style={{width: '100%', background: 'green', padding: 10, '--bg': 'red'}}>
                        <h3>Im green!</h3>
                    </div>

                    <div ref={r => this.blueRef = r} style={{width: '100%', background: 'blue'}}>
                        <h3>Im blue!</h3>
                    </div>

                    <div ref={r => this.redRef = r} style={{width: '100%', background: 'red'}}>
                        <h3>Im red!</h3>
                    </div>
                </div>
            </Host>
        )
    }
});


const Box = x('x-box', class extends Element {
    static shadow = true;
    // didMount() {
    //     console.log(this.nodesListening)
    // }
    //
    // willUnmount() {
    //     console.log(this.nodesListening)
    // }

    render({Host, CSS, host}, {bool = true}) {

        return (
            <Host>
                <CSS>{/*language=CSS*/jcss`
                    :host {
                        background: aliceblue;
                    }
                `}</CSS>
                <div style={{background: 'aliceblue'}} onClick={() => console.log('asdf')}>
                    <button onClick={() => this.emit('hideClick', 'hello')}> hide me</button>
                    <span style={{fontSize: 30, fontWeight: 'bold'}}>hello</span>
                </div>
            </Host>
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


export const App = x('x-app', class extends Element {
    static shadow = true;
    static propTypes = {some: String, cool: Boolean, prop: Number, types: Object, arrrrr: Array};

    state = {bool: true, count: 0};

    observe = obi(todos); //global state reactivity ... more on this soon


    didRender() {
        // console.log(this.__xAllListeners)
        // console.log(this.__xAllListeners.get(this.makeAbunch));
        // console.log(typeof Object.keys(this.__xAllListeners)[0])

    }


    didMount() {
        // this.nodesListening.add(this.makeAbunch);
        // this.nodesListening.add(this.page);
        // this.nodesListening.add(this.div1);
        // this.nodesListening.add(this.div2);
    }

    didUpdate() {

        // console.log('has it?', this.nodesListening.has(this.div1));
    }

    render({Host, CSS, host, ...props}, {bool, count}, context) { //more on context soon

        return (
            <Host style={{width: '100%'}}
                // className={bool ? '' : 'derp'}
            >

                <CSS>{// language=CSS  //jcss is a babel plugin that will minify and auto prefix css
                    jcss`
                        :host {
                            display: block
                        }`
                }</CSS>


                <Nav>
                    hello nav :)
                </Nav>

                <Page navTop ref={r => this.page = r}>

                    <div style={{alignSelf: 'flex-start'}} ref={r => this.div1 = r}>
                        <button onClick={() => this.setState({count: count + 1})}
                                className={todos.todoName === '' ? 'derp' : null} children={'TODOS!!!!' + count}/>

                        <button onClick={() => this.setState({bool: !bool})}> show me</button>

                        <div ref={r => this.div2 = r}>
                            {bool ? <Box onHideClick={() => this.setState({bool: !bool})}/> : <div/>}
                        </div>


                        {/*<button onClick={bool ? null : ()=>console.log('click')} style={{color: bool ? 'red' : 'green'}}>*/}
                        {/*test click*/}
                        {/*</button>*/}

                        <button onClick={todos.makeABunch} ref={r => this.makeAbunch = r}>
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
                                        <x-list-item className={bool ? 'red' : 'yellow'}
                                                     style={{background: bool ? 'purple' : 'blue'}}><b>{t.name}</b>
                                        </x-list-item>
                                    </li>
                                ))}

                            </ul>

                        </div>
                    </div>
                </Page>
            </Host>
        )
    }

});


render(<App/>, document.getElementsByTagName('x-root')[0])
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