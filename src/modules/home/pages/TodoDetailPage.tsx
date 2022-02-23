import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router'
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'typesafe-actions';
import { ROUTES } from '../../../configs/routes';
import { ITodo } from '../../../models/todo';
import { AppState } from '../../../redux/reducer';
import { fetchThunk } from '../../common/redux/thunk';
import TodoDetail from '../../todo/components/TodoDetail';
import '../../../scss/todo-detail.scss'

export default function TodoDetailPage() {
    const { id }: any = useParams();
    const history = useHistory();
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
    const [todo, setTodo] = useState<ITodo>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getTodoDetail = async () => {
            setIsLoading(true);

            const response = await dispatch(fetchThunk(`https://jsonplaceholder.typicode.com/photos/${id}`, 'get'));
            setIsLoading(false);
            setTodo(response);
        }

        getTodoDetail();
    }, [dispatch, id])

    return ( isLoading ?
        <div style={{ height: '100vh' }} className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden"></span>
            </div>
        </div> : <div className='todo-detail'>
            <button className="back" onClick={() => history.push(ROUTES.todo)}>
                Back
            </button>
            <TodoDetail todoItem={todo as ITodo} />
        </div> 
    )
}