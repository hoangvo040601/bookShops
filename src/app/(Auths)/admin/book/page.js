'use client'

import LayoutAdmin from "@/components/Admin";
import BookList from "@/components/Admin/Books/bookList";
import useAccount from "@/hooks/useAccount";
import RoleBaseRoute from "../../role";

const ManageBook = () => {
    useAccount();
    return (
        <RoleBaseRoute>
            <LayoutAdmin>
                <BookList/>
            </LayoutAdmin>
        </RoleBaseRoute>
    )
}

export default ManageBook;