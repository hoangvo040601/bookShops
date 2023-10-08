'use client'
import React, { useState } from 'react';
import {
    AppstoreOutlined,
    DollarCircleOutlined,
    DownOutlined,
    ExceptionOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu, message, Space } from 'antd';
import Footer from '../Footer/Footer';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import './index.scss'
import { callLogout } from '@/services/api';
import { doLogoutAction } from '@/redux/account/accountSlice';
import { useRouter } from 'next/navigation';
const { Content, Sider } = Layout;
const items = [
    {
        label: <Link href='/admin'>Dashboard</Link>,
        key: 'dashboard',
        icon: <AppstoreOutlined />
    },
    {
        label: <span>Manage Users</span>,
        // key: 'user',
        icon: <UserOutlined />,
        children: [
            {
                label: <Link href='/admin/user'>CRUD</Link>,
                key: 'crud',
                icon: <TeamOutlined />,
            },
        ]
    },
    {
        label: <Link href='/admin/book'>Manage Books</Link>,
        key: 'book',
        icon: <ExceptionOutlined />
    },
    {
        label: <Link href='/admin/order'>Manage Orders</Link>,
        key: 'order',
        icon: <DollarCircleOutlined />
    },

];
const LayoutAdmin = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const user = useSelector(state => state.account.user);
    const router = useRouter();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(doLogoutAction());
            message.success('Đăng xuất thành công');
        }
        router.push('/')
    }

    const itemsDropdown = [
        {
            label: <label style={{ cursor: 'pointer' }}>Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];
    if (user?.role === 'ADMIN') {
        itemsDropdown.unshift({
            label: <Link href='/'>Trang chủ</Link>,
            key: 'home',
        })
    }
    const urlAvatar = `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/avatar/${user?.avatar}`;
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
            className='layout-admin'
            hasSider
        >
            <Sider
                theme='light'
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                    Admin
                </div>
                <Menu
                    defaultSelectedKeys={[activeMenu]}
                    mode="inline"
                    items={items}
                    onClick={(e) => setActiveMenu(e.key)}
                />
            </Sider>
            <Layout>
                <div className='admin-header'>
                    <span>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                        })}
                    </span>
                    <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Avatar src ={urlAvatar}/>
                                {user?.fullName}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
                <Content>
                    {children}
                </Content>
                <Footer />
            </Layout>
        </Layout>
    );
};
export default LayoutAdmin;