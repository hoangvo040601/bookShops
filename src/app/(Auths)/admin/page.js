'use client'
import useAccount from '@/hooks/useAccount';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { router } from "next/router";
// import { usePathname } from 'next/navigation';
import NotFound from '@/app/not-found';
import RoleBaseRoute from '../role';


// const RoleBaseRoute = ({ children }) => {
//   const pathname = usePathname();
//     const isAdminRole = pathname.startsWith("/admin")
//     const user = useSelector(state => state.account.user)
//     const userRole = user.role;

//     if (isAdminRole && userRole === "ADMIN") {
//         return (<>{children}</>)
//     } else {
//         return (<div> Not role </div>)
//     }
// }

const GetAccount = () => {
    const [isAccountFetched, setIsAccountFetched] = useState(false)
    const isAuthenticated = useSelector(state => state.account.isAuthenticated)
    useAccount();
    useEffect(() => {
        if (isAccountFetched && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAccountFetched, isAuthenticated])

    // if (!isAuthenticated) {
    //     return <NotFound/>
    // }
    return (
        <>
            <RoleBaseRoute>
                Admin Pages
            </RoleBaseRoute>
        </>
    )

}

export default GetAccount;
