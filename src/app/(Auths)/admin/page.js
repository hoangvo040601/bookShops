'use client'
import useAccount from '@/hooks/useAccount';
import LayoutAdmin from '@/components/Admin';
import RoleBaseRoute from '../role';

const GetAccount = () => {
    useAccount();
    return (
        <>
            <RoleBaseRoute>
                <LayoutAdmin>
                    Admin page
                </LayoutAdmin>
            </RoleBaseRoute>
        </>
    )

}

export default GetAccount;
