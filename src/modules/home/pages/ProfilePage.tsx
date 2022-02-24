import { replace } from 'connected-react-router';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
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
import { CustomDialog } from '../../payroll/components/CustomDialog';
import { Box, Button } from '@mui/material';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { generateAvatarUpload } from '../../auth/upload';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';
import { setUserInfo } from '../../auth/redux/authReducer';

export default function ProfilePage() {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { user } = useSelector((state: AppState) => state.profile);
  const [locations, setLocations] = useState<ILocationParams[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const imageRef = useRef<any>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState(user?.avatar);
  const [crop, setCrop] = useState<any>({ unit: '%', width: 30, aspect: 1 });
  const previewCanvasRef = useRef<any>(null);
  const [completedCrop, setCompletedCrop] = useState<any>(null);

  useEffect(() => {
    const getLocation = async () => {
      const response = await dispatch(fetchThunk(`${API_PATHS.getLocation}`, 'get'));
      
      if (response?.code === RESPONSE_STATUS_SUCCESS) {
        setLocations(response.data);
      }
    }

    getLocation();
  }, [dispatch, user])

  const hanldeCloseDialog = () => {
    setShowDialog(false);
  }

  const changeAvatar = () => {
    if (avatarInputRef.current !== null) {
      avatarInputRef.current.click();
    }
  }

  const onChooseAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    }

    if (files !== null && files.length) {
      reader.readAsDataURL(files[0]);
    }
    setShowDialog(true);
  }

  const onImageLoad = useCallback((image: any) => {
    imageRef.current = image;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imageRef.current) {
      return;
    }

    const image = imageRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop])

  const uploadAvatar = async() => {
    const file = await generateAvatarUpload(previewCanvasRef.current, completedCrop);
    console.log(file);
    if (file) {
      const formData = new FormData();
      formData.append('file', file, file.name);
      
      fetch(API_PATHS.userProfile, {
        method: 'PUT',
        headers: {
          Authorization: Cookies.get(ACCESS_TOKEN_KEY) || ''
        },
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data?.code === RESPONSE_STATUS_SUCCESS) {
            dispatch(setUserInfo(data.data));
          }
        })
        .catch(error => console.log(error))
    }
  }

  return (
    <div className='profile'>
      <div className="back" onClick={() => dispatch(replace(ROUTES.home))}>
        Back to home
      </div>
      <div className="profile-main">
        <div className='profile-main__top'> 
          <div className='avatar'>
            <img src={user?.avatar ? user.avatar : 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg'} alt="" />
            <div onClick={changeAvatar}>
              <input
                ref={avatarInputRef}
                hidden
                type="file"
                accept="image/*"
                onChange={onChooseAvatar}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm mt-2 w-100"
              >
                Upload Avatar
            </button>
            </div>
            
          </div>
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
        <div className='profile-main__bottom mt-3'>
          <p>{user?.description ? user.description : `Hello. I'm ${user?.name}`}</p>
        </div>
      </div>
      <CustomDialog
        open={showDialog}
        title='Upload Avatar'
        content={
          <Box>
            <ReactCrop 
              src={image ? image : ''}
              crop={crop}
              onChange={(newCrop) => {
                // console.log('new crop: ', newCrop);
                setCrop(newCrop)
              }}
              onImageLoaded={onImageLoad}
              onComplete={(e) => setCompletedCrop(e)}
            />
            <div>
              <canvas 
                ref={previewCanvasRef}
                style={{
                  width: Math.round(completedCrop?.width),
                  height: Math.round(completedCrop?.height)
                }}
              />
            </div>
          </Box>
        }
        actions={
          <Box width='100%' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant='contained'
              sx={{ marginRight: '1rem' }}
              size='small'
              onClick={() => {
                setShowDialog(false);
                uploadAvatar()
              }}
            >
                save image
            </Button>
            <Button
                variant='outlined'
                onClick={hanldeCloseDialog}
                size='small'
            >
                cancel
            </Button>
          </Box>
        }
    />
    </div>
  )
}