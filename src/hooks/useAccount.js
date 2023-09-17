'use client'

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { doGetAccountAction } from '@/redux/account/accountSlice';
import { callFetchAccount } from '@/services/api';

const useAccount = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getAccount = async () => {
      const pathname = window.location.pathname;
      if (
        pathname === '/login' ||
        pathname === '/' ||
        pathname === '/register'
      ) {
        return;
      }
      const res = await callFetchAccount();
      if (res && res.data) {
        dispatch(doGetAccountAction(res.data));
      }
    };
    getAccount();
  }, []);
};

export default useAccount;