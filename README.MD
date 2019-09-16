# @iosio/x
<img src="https://img.shields.io/circleci/project/github/iosio/x.svg?style=flat-square" /><img src="https://img.shields.io/npm/v/@iosio/x.svg?style=flat-square" /><img src="https://img.shields.io/bundlephobia/minzip/@iosio/x.svg?style=flat-square" />
> create web components using vdom

Inspiration: stencil, superfine, atomico, preact and open-wc

## Installation 
```sh
npm install @iosio/x --save
```

### Quick example for now

use functional components

```js
import {h, x} from '@iosio/x';

export const ColorComponent = x('color-component',
    ({foo, host, Host}, {color = 'red'}) => {

        return (
            <Host>

                <h1 style={{color}}>hello i am {color}</h1>

                <button onClick={()=>{
                    host.setState({color:color === 'red' ? 'blue' : 'red'})
                    host.emit('btnClicked');
                }}>
                    hello - {foo}
                </button>

                <slot/>

            </Host>
        )

    }, {foo: Number}); // propTypes
```

or use class components

```js
// x will auto prepend your tagname with x- ...but you can import element to use whatever
export const App = x('app', class extends Xelement {

    //set the propTypes for your observedAttributes
    //will convert the attributes to the types you have defined here and then pass them to props
    static propTypes = {some: String, cool: Boolean, prop: Number, types: Object, arrrrr: Array};

    state = {bool: true};

    observe = obi(todos); //global state reactivity ... more on this soon
    
    // component will update
    // before render
    willRender(){
        // return false // return any falsy value other than undefined to prevent re-renderng 
    } 
    
    // component did update
    // after render
    didRender(){} 

    // component did mount
    lifeCycle(){ 
        console.log('component mounted')
        return ()=>{ // component will unmount
            // unsubcribe subscriptions here
            console.log('unmounted')
        }
    }

    render({Host, CSS, host, ...props}, {bool}, context) { //more on context soon

        return (
            <Host style={{width: '100%'}}>
                {/* 
                    CSS component will check for the existence of constructable style sheets
                    and adopt the css sheet to this class (once) and all instances will share the same sheet.
                    Otherwise, if the browser does not support it, it will default to a style tag
                */}
                <CSS>{ // jcss is a babel plugin that will minify and auto prefix css
                    jcss`:host, *, *::before, *::after {
                        box-sizing: border-box;
                    }

                    :host {
                        display: block
                    }`
                }</CSS>

                <h1>
                    TODOS!!!!
                </h1>
               
               
               {/* 
                    Use components just like you would with react
               */} 
                <ColorComponent/>
               
                 {/* 
                     or use tyem by their tag name
                 */}
                 
                 <x-color-component>
                    heyooo
                 </x-color-component>


                <button onClick={() => this.setState({bool: !bool})}> show me</button>

                <button onClick={todos.makeABunch}>
                    make a bunch!!! ... i dare you
                </button>
                

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

                <div>
                
                    <ul>
                        {todos.displayList.map((t) => (
                            <li key={t.id} style={{padding: 20}}>
                                <button onClick={() => todos.removeTodo(t)}>X</button>
                                <b>{t.name}</b>
                            </li>
                        ))}

                    </ul>

                </div>


            </Host>
        )
    }

});


```

### Coming soon*
**@iosio/x-boilerplate** - starter that will include modern build tools and dependencies for creating apps and libs with x

then eventually

**@iosio/create-x** - a CLI to scaffold UI libraries and apps


### License

[MIT]

[MIT]: https://choosealicense.com/licenses/mit/
