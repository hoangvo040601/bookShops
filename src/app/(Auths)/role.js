import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const RoleBaseRoute = ({ children }) => {
    const pathname = usePathname();
    const isAdminRole = pathname.startsWith("/admin")
    const user = useSelector(state => state.account.user)
    const userRole = user.role;
    console.log(isAdminRole)

    if (isAdminRole && userRole === "ADMIN") {
        return (<>{children}</>)
    } else {
        return (<div> Not role </div>)
    }
}
export default RoleBaseRoute;