'use client';
import {
  BuyerDto,
  SellerDto,
  TransporterDto,
} from '@/features/authentication/types/onboarding.types';
import { UserType } from '@/types/user.types';
import Cookies from 'js-cookie';
import { createContext, useState } from 'react';

type UserState = {
  isLoggedIn: boolean;
  token: string;
  data: UserType | null;
};

type ProfileState = SellerDto | BuyerDto | TransporterDto | null;

type ProviderValueType = {
  user?: UserState | null;
  profile?: ProfileState | null;
  storeUser?: (payload: UserState) => void;
  storeProfile?: (payload: ProfileState) => void;
  resetUser?: () => void;
};

const AuthContext = createContext<ProviderValueType>({});
const { Provider } = AuthContext;

const initState: UserState = {
  isLoggedIn: false,
  data: null,
  token: '',
};

const profileInitState: ProfileState = null;

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserState | null>(() => {
    const storedUserData = Cookies.get('user');
    return storedUserData ? JSON.parse(storedUserData) : initState;
  });

  const [profile, setProfile] = useState<ProfileState | null>(() => {
    const storedProfileData = Cookies.get('profile');
    return storedProfileData ? JSON.parse(storedProfileData) : profileInitState;
  });

  const storeUser = (payload: UserState) => {
    setUser(payload);
    Cookies.set('user', JSON.stringify(payload));
    if (payload.token) {
      Cookies.set('token', payload.token);
    }
  };

  const storeProfile = (payload: ProfileState) => {
    setProfile(payload);
    Cookies.set('profile', JSON.stringify(payload));
  };

  const resetUser = () => {
    setUser({ ...initState });
    Cookies.remove('token');
    Cookies.remove('user');
    Cookies.remove('profile');
    Cookies.remove('active-tab');
  };

  return (
    <Provider value={{ user, storeUser, resetUser, profile, storeProfile }}>
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
