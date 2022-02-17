import { replace } from 'connected-react-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'typesafe-actions';
import { ROUTES } from '../../../configs/routes';
import { ITodo } from '../../../models/todo';
import { AppState } from '../../../redux/reducer';
import { fetchThunk } from '../../common/redux/thunk';
import TodoForm from '../../todo/components/TodoForm';
import { setTodo } from '../../todo/redux/todoReducer';
import '../../../scss/todo.scss'

const TodoPage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [isLoading, setIsLoading] = useState(false);
  const { todos } = useSelector((state: AppState) => state.todo);
  const [todoData, setTodoData] = useState<ITodo[]>([]);
  const [limit, setLimit] = useState(5);
  
  const getTodos = useCallback(async () => {
    setIsLoading(true);
    const response = await dispatch(fetchThunk('https://jsonplaceholder.typicode.com/photos', 'get'));

    setIsLoading(false);
    dispatch(setTodo(response.slice(0, 500)));
  }, [dispatch]);

  useEffect(() => {
    getTodos();
  }, [getTodos])

  useEffect(() => {
    setTodoData([...todos]);
  }, [todos])

  const handleSetTitle = (index:  number, title: string) => {
    setTodoData((prev) => {
      const prevTitle = [...prev]
      const newTitle = { ...prevTitle[index], title: title }
      prevTitle[index] = newTitle;
      return prevTitle;
    })
  }

  const handleConfirm = () => {
    dispatch(setTodo([...todoData]))
  }

  const handleReset = () => {
    setTodoData([...todos]);
  }

  const handleLoadmore = () => {
    setIsLoading(true);

    setTimeout(() => {
      setLimit(limit + 5);
      setIsLoading(false);
    }, 1000)
  }

  return (
    <div className='todo-page'>
      <button className="back" onClick={() => dispatch(replace(ROUTES.home))}>
        Back to home
      </button>
      <div className="buttons">
        <button disabled={JSON.stringify(todos) === JSON.stringify(todoData)} onClick={handleConfirm}>confirm</button>
        <button disabled={JSON.stringify(todos) === JSON.stringify(todoData)} onClick={handleReset}>reset</button>
      </div>
      {
        isLoading ?
          <div style={{ height: '100vh' }} className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div> : <div>
            {
              todoData.slice(0,limit).map((todo, index) => {
                return (
                  <TodoForm todo={todo} index={index} key={index} title={todo.title} setTitle={handleSetTitle}/>
                )
              })
            }
          </div>
      }
      <button onClick={handleLoadmore} className="loadmore">
        {isLoading ? '...loading' : 'Load more'}
      </button>
    </div>
  )
}

export default TodoPage;