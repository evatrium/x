import {loremIpsum} from "./lorem";
import {obi} from "../../src/obi";

const todoStubs = [
    'Make sweet library', 'make cool apps',
    'test library', 'go buy dog food', 'register vehicles'
];

let count = 0;
const defaultTodos = todoStubs.map((name) => ({id: count++, name, completed: false}));
// [...Array(500)]
export const todos = obi({
    list: defaultTodos,
    displayList: defaultTodos,
    todoName: '',
    searchValue: '',
    testValue: true,
    makeABunch(){
        todos.displayList = todos.list = [
            ...todos.list,
            ...loremIpsum.split(' ').map((name) => ({id: count++, name, completed: false}))
                // .slice(0, 200)
        ];
    },
    removeTodo(todo) {
        let updated = todos.list.filter(mt => mt.id !== todo.id),
            filtered = todos.searchValue.length === 0
                ? updated
                : updated.filter(t => t.name.search(todos.searchValue) !== -1);
        todos.list = [...updated];
        todos.displayList = [...filtered]
    },
    setSearchValue(value) {
        todos.searchValue = value;
        value = value.toLowerCase();
        // todos.displayList = [...todos.list.filter(t => t.name.search(value) !== -1)];
        todos.displayList = value.length === 0
            ? [...todos.list]
            : [...todos.list.filter(t => t.name.toLowerCase().search(value) !== -1)];
    },
    addTodo(e) {
        e && e.preventDefault();
        todos.list.push({
            name: todos.todoName,
            id: count++,
            completed: false
        });
        todos.displayList = todos.list = [...todos.list];
        todos.searchValue = todos.todoName = '';
    },
    captureEnter(e) {
        if (((e.keyCode || e.which) === 13)) todos.addTodo(e);
    }
});