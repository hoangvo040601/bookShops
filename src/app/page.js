'use client'

import Footer from "@/components/Footer/Footer"
import Header from "@/components/Header/Header"
import HomePage from "@/components/Home/Home"
import Loading from "@/components/Loading/loading"
import { doGetAccountAction } from "@/redux/account/accountSlice"
import { callFetchAccount } from "@/services/api"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"


export default function Home() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isLoading = useSelector(state => state.account.isLoading)
  const getAccount = async () => {
    if (pathname === '/login'
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
    <div style={{
      backgroundColor: "#f5f5fa",
    }}>
      <Header />
      {
        <>
          <HomePage />
        </>}

    </div>
  )
}
