import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import RegisterForm from '../components/RegisterForm';
import { AppState } from '../../../redux/reducer'
import { Action } from 'typesafe-actions';
import { IRegisterParams } from '../../../models/auth';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../configs/api';
import { RESPONSE_STATUS_SUCCESS } from '../../../utils/httpResponseCode';
import { setUserInfo } from '../redux/authReducer';
import { replace } from 'connected-react-router';
import { ROUTES } from '../../../configs/routes';
import { getErrorMessageResponse } from '../../../utils';
import logo from '../../../logo-420-x-108.png';

export default function RegisterPage() {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [locations, setLocations] = useState([]);
  const [cities, setCites] = useState([]);

  const getLocation = useCallback(async () => {
    setLoading(true);
    const json = await dispatch(fetchThunk(API_PATHS.getLocation, 'get'));
    setLoading(false);

    if (json?.code === RESPONSE_STATUS_SUCCESS) {
      setLocations(json.data);
    }
  }, [dispatch]);

  useEffect(() => {
    getLocation()
  }, [getLocation]);

  const getCities = useCallback(async (pid: string | number) => {
    const response = await dispatch(fetchThunk(`${API_PATHS.getLocation}?pid=${pid}`, 'get'));
    
    if (response?.code === RESPONSE_STATUS_SUCCESS) {
      setCites(response.data);
    }

  }, [dispatch]);

  const onRegister = useCallback(async (values: IRegisterParams) => {
    setErrorMessage('');
    setLoading(true);

    const json = await dispatch(fetchThunk(API_PATHS.signUp, 'post', {
      email: values.email,
      password: values.password,
      repeatPassword: values.repeatPassword,
      name: values.name,
      gender: values.gender,
      region: values.region,
      state: values.state,
    }));

    setLoading(false);
    console.log(json);

    if (json?.code === RESPONSE_STATUS_SUCCESS) {
      dispatch(setUserInfo(json.data));
      dispatch(replace(ROUTES.login));
    }

    setErrorMessage(getErrorMessageResponse(json));
    
  }, [dispatch])

  return (
    <div className='container'
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      <img src={logo} alt="" style={{ maxWidth: '250px', marginBottom: '24px', marginTop: '16px'}} />
      <h2>Sign Up</h2>
      <RegisterForm
        onRegister={onRegister}
        loading={loading}
        errorMessage={errorMessage}
        locations={locations}
        cities={cities}
        getCities={getCities}
      />
    </div>
  )
}
