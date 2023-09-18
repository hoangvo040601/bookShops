'use client'

import LayoutAdmin from "@/components/Admin";
import useAccount from "@/hooks/useAccount";
import RoleBaseRoute from "../../role";

const ManageBook = () => {
    useAccount();
    return (
        <RoleBaseRoute>
            <LayoutAdmin>
                Book pages
            </LayoutAdmin>
        </RoleBaseRoute>
    )
}

export default ManageBook;