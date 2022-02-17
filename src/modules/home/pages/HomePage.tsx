import Cookies from 'js-cookie';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'typesafe-actions';
import { ROUTES } from '../../../configs/routes';
import { AppState } from '../../../redux/reducer';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';
import { removeUserInfo } from '../../auth/redux/authReducer';
import '../../../scss/home.scss'
import { replace } from 'connected-react-router';

const HomePage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const handleLogout = () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    dispatch(removeUserInfo());
    dispatch(replace(ROUTES.login))
  }

  const handleTodoPage = () => {
    dispatch(replace(ROUTES.todo))
  }

  const handleUserDetailPage = () => {
    dispatch(replace(ROUTES.profile))
  }

  const handlePayrollPage = () => {
    dispatch(replace(ROUTES.payroll))
  }

  return (
    <div className='home'>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleTodoPage}>Todo Page</button>
      <button onClick={handleUserDetailPage}>Profile Page</button>
      <button onClick={handlePayrollPage}>Payroll Page</button>
    </div>
  )
}

export default HomePage;