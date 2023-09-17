'use client'

import Footer from "@/components/Footer/Footer"
import Header from "@/components/Header/Header"
import Loading from "@/components/Loading/loading"
import { doGetAccountAction } from "@/redux/account/accountSlice"
import { callFetchAccount } from "@/services/api"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"


export default function Home() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isAuthenticated = useSelector(state => state.account.isAuthenticated)
  const getAccount = async () => {
    if (pathname === '/login'
    || pathname === '/'
    || pathname === '/register'
    ) return;
    const res = await callFetchAccount()
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data))
    }
  }
  useEffect(() => {
    getAccount();
  }, [])
  return (
    <>
      <Header />
      {isAuthenticated === true
        || pathname === '/login'
        || pathname === '/register'
        || pathname === '/' ?
        <>
          HomePage
        </> : <Loading />}
      <Footer />

    </>
  )
}
