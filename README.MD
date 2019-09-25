# @iosio/x
<img src="https://img.shields.io/circleci/project/github/iosio/x.svg?style=flat-square" /><img src="https://img.shields.io/npm/v/@iosio/x.svg?style=flat-square" /><img src="https://img.shields.io/bundlephobia/minzip/@iosio/x.svg?style=flat-square" />
> create web components using vdom and jsx

Inspiration: stencil, superfine, atomico, preact and open-wc

## Installation 
```sh
npm install @iosio/x --save
```

### Quick example for now

use functional components

```js
import {h, x} from '@iosio/x';

export const ColorComponent = x('x-color',
 ({ Host, CSS, host, foo}, {color = 'red'}) => (
        <Host>
            <CSS>
            
            </CSS>
            <h1 style={{color}}>hello i am {color}</h1>

            <button onClick={() => {
                host.setState({color: color === 'red' ? 'blue' : 'red'})
                host.emit('btnClicked');
            }}>
                hello - {foo}
            </button>

            <slot/>

        </Host>
    ), 
    {
        propTypes: {foo: Number},
        shadow:true
     }
 );
```

or use class components

```js
import { Component, h, x } from '@iosio/x';

import {obi} from '@iosio/x/lib/obi'

import {todos as t} from './todosStateAndActions';

const todos = obi(t);

export const App = x('x-app', class extends Component {
    static shadow = true; 
    //set the propTypes for your observedAttributes
    //the incoming attributes will be converted to the 
    //types you have defined here and then passed to props
    static propTypes = {
        reflectMeAsAnAttributeWithADefaultValue: {
          type: String,
          reflect: true,
          value: 'my initial value as an attribute'  
        },
        some: String, 
        cool: Boolean,
        prop: Number,
        types: Object, 
        arrrrr: Array,
    };

    state = {bool: true};

    observe = todos; //global state reactivity ... more on this soon

    // (componentDidMount => componentWillUnmount)
    lifeCycle(){ 
        console.log('component mounted')
        
        return ()=>{ // called when the component unmounts
            // unsubcribe subscriptions here
            console.log('unmounted')
        }
    }
    
    // props, state, context
    render({Host, CSS, host, ...props}, {bool}) { //more on context soon

        return (
            <Host style={{width: '100%'}}>
                {/* 
                    CSS component will check for the existence of 
                    constructable style sheets
                    and adopt the css sheet to this class (once)
                    and all instances will share the same sheet.
                    Otherwise, if the browser does not support it, 
                    it will default to a style tag
                */}
                <CSS>{ // jcss is a babel plugin that will minify and auto prefix css
                    jcss`
                    :host {
                        display: block;
                        color: var(--myThemeColor);
                    }`
                }</CSS>

                <h1>
                    TODOS!!!!
                </h1>
               
               
               {/* Use components just like you would with react*/} 
                <ColorComponent/>
               
                {/* or use them by their tag name*/}
                <x-color onBtnClick={()=>console.log('the inside button was clicked')}>
                    heyooo
                </x-color>


                <button onClick={() => this.setState({bool: !bool})}> show me</button>
                
                {bool && <h1>HELLOO</h1>}

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


### License

[MIT]

[MIT]: https://choosealicense.com/licenses/mit/
