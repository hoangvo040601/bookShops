'use client'
import { callRegister } from '@/services/api';
import { Button, Divider, Form, Input, notification, message} from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import '../../globals.css'
import './register.scss';


const Register = () => {
    const [isloading, setIsLoading] = useState(false)
    const router = useRouter()
    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values;
        setIsLoading(true)
        const res = await callRegister(fullName, email, password, phone);
        setIsLoading(true)
        if (res?.data?._id) {
            message.success('Đăng ký tài khoản thành công!');
            router.push('/login')
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }

    };
    return (
        <div className="register-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng Ký Tài Khoản</h2>
                            <Divider />
                        </div>
                        <Form
                            name="basic"
                            // style={{ maxWidth: 600, margin: '0 auto' }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Họ tên"
                                name="fullName"
                                rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>


                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Email không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                            // wrapperCol={{ offset: 6, span: 16 }}
                            >
                                <Button type="primary" htmlType="submit" loading={isloading}>
                                    Đăng ký
                                </Button>
                            </Form.Item>
                            <Divider>Hoặc</Divider>
                            <p className="text text-normal">Đã có tài khoản ?
                                <span>
                                    <Link href='/login' > Đăng Nhập </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Register;