import { Button, Result } from "antd";
import Link from "next/link";

const CompletePay = () => {
    return (
        <>
            <Result
                status="success"
                title="Đơn hàng đã được đặt thành công!"
                extra={[
                    <Button type="primary" key="console">
                        <Link href = "/">Trang chủ</Link>
                    </Button>,
                    <Button key="buy">
                        <Link href="/history">Lịch sử</Link>
                    </Button>,
                ]}
            />
        </>
    )
}

export default CompletePay;