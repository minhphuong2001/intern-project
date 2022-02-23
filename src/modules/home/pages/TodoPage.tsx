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
import { Button, CircularProgress } from '@mui/material';

const TodoPage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [isLoading, setIsLoading] = useState(false);
  const { todos } = useSelector((state: AppState) => state.todo);
  const [todoData, setTodoData] = useState<ITodo[]>([]);
  const [limit, setLimit] = useState(5);
  
  const getTodos = useCallback(async () => {
    const response = await dispatch(fetchThunk('https://jsonplaceholder.typicode.com/photos', 'get'));

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
      <div>
        {
          todoData.slice(0,limit).map((todo, index) => {
            return (
              <TodoForm todo={todo} index={index} key={index} title={todo.title} setTitle={handleSetTitle}/>
            )
          })
        }
      </div>
      <Button
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '30px auto auto auto'  
        }}
        variant='contained'
        onClick={handleLoadmore}
      >
        {isLoading ? <CircularProgress size={20} color='inherit'/> : 'Load more'}
      </Button>
    </div>
  )
}

export default TodoPage;