import path from 'path';
import { required } from './env';

export const BASE_URL = required('SAUCEDEMO_BASE_URL');

export const STANDARD_USER = {
  username: required('SAUCEDEMO_USERNAME'),
  password: required('SAUCEDEMO_PASSWORD'),
} as const;

export const storageState = path.resolve(__dirname, '..', '.auth', 'standard.json');
