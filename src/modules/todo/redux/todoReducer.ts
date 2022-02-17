import { createCustomAction, ActionType, getType } from 'typesafe-actions';
import { ITodo } from "../../../models/todo";

export interface TodoState {
    todos: Array<ITodo>;
}

export const setTodo = createCustomAction('todos/setTodo', (data: Array<ITodo>)=> ({
    data
}))

const actions = { setTodo };
type Action = ActionType<typeof actions>;

export default function reducer(state: TodoState = { todos: [] }, action: Action) {
    switch (action.type) {
        case getType(setTodo):
            return {
                ...state,
                todos: action.data
            }
        default:
            return state;
    }
}
