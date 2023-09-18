'use client'
import LayoutAdmin from "@/components/Admin";
import TableUser from "@/components/Admin/TableUser/table";
import useAccount from "@/hooks/useAccount";
import RoleBaseRoute from "../../role";

const ManageUser = () => {
    useAccount();
    return (
        <RoleBaseRoute>
            <LayoutAdmin>
                <TableUser/>
            </LayoutAdmin>
        </RoleBaseRoute>
    )
}

export default ManageUser;