import { replace } from 'connected-react-router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'typesafe-actions';
import { API_PATHS } from '../../../configs/api';
import { ROUTES } from '../../../configs/routes';
import { AppState } from '../../../redux/reducer'
import '../../../scss/profile.scss'
import { RESPONSE_STATUS_SUCCESS } from '../../../utils/httpResponseCode';
import { fetchThunk } from '../../common/redux/thunk';
import {ILocationParams} from '../../../models/auth'

export default function ProfilePage() {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { user } = useSelector((state: AppState) => state.profile);
  const [locations, setLocations] = useState<ILocationParams[]>([]);

  useEffect(() => {
    const getLocation = async () => {
      const response = await dispatch(fetchThunk(`${API_PATHS.getLocation}`, 'get'));
      
      if (response?.code === RESPONSE_STATUS_SUCCESS) {
        setLocations(response.data);
      }
    } 

    getLocation();
  }, [dispatch, user])
  

  return (
    <div className='profile'>
      <div className="back" onClick={() => dispatch(replace(ROUTES.home))}>
        Back to home
      </div>
      <div className="profile-main">
        <div className='profile-main__top'> 
          <img src={user?.avatar ? user.avatar : 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg'} alt="" />
          <div className="profile-info">
            <p className='name'>{user?.name}</p>
            <p className='email'>Email: {user?.email}</p>
            <p className='gender'>Gender: {user?.gender}</p>
            {
              locations.map((location) => (
                <p className='region' key={location.id}>{location.id === user?.region ? `Region: ${location.name}` : ''}</p>
              ))
            }
          </div>
        </div>
        <div className='profile-main__bottom'>
          <p>{user?.description ? user.description : `Hello. I'm ${user?.name}`}</p>
        </div>
      </div>
    </div>
  )
}