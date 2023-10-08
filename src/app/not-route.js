import { Button, Result } from "antd";
import Link from "next/link";
import '../styles/globals.scss'
const NotRoute = () => {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Xin lỗi, bạn không có quyền truy cập vào trang này."
            extra={<Button type="primary"><Link href="/login">Đăng nhập</Link></Button>}
        />
    )
}
export default NotRoute;