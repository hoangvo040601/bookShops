import React, { useMemo, useState } from 'react';
// import { FaReact } from 'react-icons/fa'
// import { FiShoppingCart } from 'react-icons/fi';
// import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, message, Avatar, Popover, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import './header.scss';
import { doLogoutAction } from '@/redux/account/accountSlice';
import { callLogout } from '../../services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import logoHome from '../../../public/logo.png'
import Image from 'next/image';

const Header = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const orderNumber = useSelector(state => state.order.cart)
    const router = useRouter();
    const dispatch = useDispatch()


    const [showArrow, setShowArrow] = useState(true);
    const [arrowAtCenter, setArrowAtCenter] = useState(false);
    const mergedArrow = useMemo(() => {
        if (arrowAtCenter)
            return {
                pointAtCenter: true,
            };
        return showArrow;
    }, [showArrow, arrowAtCenter]);

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(doLogoutAction());
            message.success('Đăng xuất thành công');
            router.push('/')

        }
    }

    let items = [
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
        items.unshift({
            label: <Link href='/admin'>Trang quản trị</Link>,
            key: 'admin',
        })
    }
    const contentPopover = () => {
        return (
            <div className="popover-body">
                <div className="popover-content">
                    {orderNumber.map((book, index) => {
                        return (
                            <div className="book" key={book.index}>
                                <div className="book-body">
                                    <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} className='book-img' />
                                    <div className="book-title">{book?.detail?.mainText}</div>
                                </div>
                                <div className="book-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${book?.detail?.price}`)}</div>
                            </div>
                        )
                    })}
                </div>
                <div className='popover-footer'>
                    <Link href="/order">
                        <Button >Xem giỏ hàng</Button>
                    </Link>
                </div>
            </div>
        )
    }



    const urlAvatar = `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/avatar/${user?.avatar}`;
    return (
        <>
            <div className='header-container'>
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => {
                            setOpenDrawer(true)
                        }}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo'>
                                <Link href="/">
                                    <div className='icon-react'>
                                        <Image
                                            src={logoHome}
                                            width={50}
                                            height={50}
                                            alt="Picture of the author"
                                        />
                                    </div>
                                </Link>

                            </span>
                            <input
                                className="input-search" type={'text'}
                                placeholder="Bạn tìm gì hôm nay"
                            />
                        </div>

                    </div>
                    <div className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                <Popover
                                    className='popover-cart'
                                    rootClassName='popover-cart'
                                    placement="bottomRight"
                                    title={"Giỏ hàng"}
                                    content={contentPopover}
                                    arrow={mergedArrow}>
                                    <Badge
                                        count={isAuthenticated === true ? orderNumber?.length : 0}
                                        size={"small"}
                                    >
                                        <div className='icon-cart' >
                                            <ShoppingCartOutlined />
                                        </div>
                                    </Badge>
                                </Popover>
                            </li>
                            <li className="navigation__item mobile"><Divider type='vertical' /></li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ?
                                    <span onClick={() => router.push('/login')}> Tài Khoản</span>
                                    :
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <Avatar src={urlAvatar} />
                                                {user?.fullName}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                }
                            </li>
                        </ul>
                    </div>
                </header>
            </div >
            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Quản lý tài khoản</p>
                <Divider />
                <label
                    onClick={() => handleLogout()}
                >Đăng xuất</label>
                <Divider />
            </Drawer>
        </>
    )
};

export default Header;
