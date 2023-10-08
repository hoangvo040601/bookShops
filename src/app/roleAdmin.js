'use client'
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import NotRoute from "./not-route";

const RoleBaseRoute = ({ children }) => {
    const pathname = usePathname();
    const isAdminRole = pathname.startsWith("/admin")
    const user = useSelector(state => state.account.user)
    const userRole = user.role;

    if (isAdminRole && userRole === "ADMIN" || !isAdminRole && (userRole === "USER" || userRole === "ADMIN")) {
        return (<>{children}</>)
    } else {
        return (<div><NotRoute/></div>)
    }
}
export default RoleBaseRoute;