'use client'

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccountAction } from '@/redux/account/accountSlice';
import { callFetchAccount } from '@/services/api';
import { router } from "next/router";

const useAccount = () => {
  const dispatch = useDispatch();
  const [isAccountFetched, setIsAccountFetched] = useState(false)
  const isAuthenticated = useSelector(state => state.account.isAuthenticated)
  useEffect(() => {
    if (isAccountFetched && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAccountFetched, isAuthenticated])

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