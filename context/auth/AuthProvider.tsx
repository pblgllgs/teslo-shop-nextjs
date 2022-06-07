import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { FC, ReactNode, useReducer, useEffect } from 'react';
import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const Auth_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

interface Props {
  children: ReactNode;
}

export interface RegisterProps {
  hasError: boolean;
  message?: string;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    if (!Cookies.get('token')) {
      return;
    }
    try {
      const { data } = await tesloApi.get('/user/validate-token');
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
    } catch (error) {
      Cookies.remove('token');
      dispatch({ type: '[Auth] - Logout' });
    }
  };

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/user/login', { email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<RegisterProps> => {
    try {
      const { data } = await tesloApi.post('/user/register', {
        email,
        password,
        name,
      });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return {
        hasError: false,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError;
        return {
          hasError: true,
          message: error.message,
        };
      }
      return {
        hasError: true,
        message: 'Error registering user. Please try again.',
      };
    }
  };

  const logoutUser = () => {
    Cookies.remove('token');
    Cookies.remove('cart');
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('zip');
    Cookies.remove('city');
    Cookies.remove('country');
    Cookies.remove('phone');
    router.reload();
  };

  return (
    <AuthContext.Provider
      value={{ ...state, loginUser, registerUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
