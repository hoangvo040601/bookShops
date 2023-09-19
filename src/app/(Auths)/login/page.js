'use client'
import { callLogin } from '@/services/api';
import { Button, Divider, Form, Input, notification, message } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import '../../../styles/globals.scss'
import './login.scss'
import { useDispatch } from 'react-redux';
import { doLoginAction } from '@/redux/account/accountSlice';


const Login = () => {
    const [isloading, setIsLoading] = useState(false)
    const router = useRouter()
    const dispatch = useDispatch()
    const onFinish = async (values) => {
        const { username, password } = values;
        setIsLoading(true)
        const res = await callLogin(username, password);
        setIsLoading(false)
        if (res?.data) {
            message.success('Đăng nhập thành công!');
            localStorage.setItem('access_token', res.data.access_token)
            dispatch(doLoginAction(res.data.user))
            router.push('/')
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
        <div className="login-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng nhập</h2>
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
                                label="Email"
                                name="username"
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
                            // wrapperCol={{ offset: 6, span: 16 }}
                            >
                                <Button type="primary" htmlType="submit" loading={isloading}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <Divider>Hoặc</Divider>
                            <p className="text text-normal"> Chưa có tài khoản ?
                                <span>
                                    <Link href='/register' > Đăng ký </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Login;