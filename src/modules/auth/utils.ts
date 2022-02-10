import { IRegisterParams, IRegisterValidation } from './../../models/auth';
import { ILoginParams, ILoginValidation } from '../../models/auth';
import { validEmailRegex } from '../../utils';

const validateEmail = (email: string) => {
  if (!email) {
    return 'emailRequire';
  }

  if (!validEmailRegex.test(email)) {
    return 'emailInvalid';
  }

  return '';
};

const validatePassword = (password: string) => {
  if (!password) {
    return 'passwordRequire';
  }

  if (password.length < 4) {
    return 'minPasswordInvalid';
  }

  return '';
};

const validateRepeatPassword = (password: string, repeatPassword: string) => {
  if (!repeatPassword) {
    return 'passwordRequire'
  }
  
  if (password !== repeatPassword) {
    return 'notMatch'
  }

  return '';
}

const validateField = (field: string, value: string) => {
  if (value) return;
  let fieldRequire = '';

  switch (field) {
    case 'name':
      fieldRequire = 'nameRequire';
      break;
    case 'gender':
      fieldRequire = 'genderRequire';
      break;
    case 'region':
      fieldRequire = 'regionRequire';
      break;
    case 'state':
      fieldRequire = 'stateRequire';
      break;
  }

  return fieldRequire;
}

export const validateLogin = (values: ILoginParams): ILoginValidation => {
  return {
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  };
};

export const validLogin = (values: ILoginValidation) => {
  return !values.email && !values.password;
};

export const validateRegister = (values: IRegisterParams): IRegisterValidation => {
  return {
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    repeatPassword: validateRepeatPassword(values.password, values.repeatPassword),
    name: validateField('name', values.name) as string,
    gender: validateField('gender', values.gender) as string,
    region: validateField('region', values.region) as string,
    state: validateField('state', values.state) as string,
  }
}

export const validRegister = (values: IRegisterValidation) => {
  return !values.email && !values.password && !values.repeatPassword && !values.name && !values.gender && !values.region && !values.state;
};