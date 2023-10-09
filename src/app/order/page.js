'use client'

import { Col, Divider, Empty, InputNumber, Row, Steps } from 'antd';
import './order.scss';
import { DeleteOutlined } from '@ant-design/icons';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { doDeleteBookCart, doUpdateQuantityBookAction } from '@/redux/order/orderSlice';
import Payment from '@/components/Order/payment';
import CompletePay from '@/components/Order/completePayment';
import RoleBaseRoute from '../roleAdmin';

const ViewOrder = (props) => {
    const dispatch = useDispatch();
    const [totalPrice, setTotalPrice] = useState(0)
    const [curentStep, setCurentStep] = useState(0)
    const carts = useSelector(state => state.order.cart)

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => { sum += item.quantity * item.detail.price })
            setTotalPrice(sum);
        }
        else { setTotalPrice(0) }
    }, [carts])

    const handleOnChangeInput = (value, item) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(doUpdateQuantityBookAction({ quantity: value, detail: item, _id: item._id }))
        }
    }

    const handleDeleteBookCart = (_id) => {
        if (!_id) return;
        if (_id) {
            dispatch(doDeleteBookCart({ _id: _id }))

        }
    }
    return (
        <RoleBaseRoute>
            <>
                <Header />
                <div style={{ background: '#efefef', padding: "20px 0" }}>
                    <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                        <Steps
                            size="small"
                            current={curentStep}
                            items={[
                                {
                                    title: 'Đơn hàng',
                                },
                                {
                                    title: 'Đặt hàng',
                                },
                                {
                                    title: 'Thanh toán',
                                },
                            ]}
                        />
                        <br />
                        {
                            curentStep === 2 &&
                            <CompletePay />
                        }
                        <Row gutter={[20, 20]}>
                            {
                                curentStep === 1 &&
                                <>
                                    <Col md={18} xs={24}>
                                        {
                                            carts.length !== 0 ?
                                                carts.map((item, index) => {
                                                    const priceBook = item?.detail?.price;
                                                    return (
                                                        <div className='order-book' key={index}>
                                                            <div className='book-content' key={index}>
                                                                <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`} key={index}/>
                                                                <div className='title' key={index}>
                                                                    {item?.detail?.mainText}
                                                                </div>
                                                                <div className='price' key={index}>
                                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceBook)}
                                                                </div>
                                                            </div>
                                                            <div className='action' key={index}>
                                                                <div className='quantity' key={index}>
                                                                    <InputNumber onChange={(value) => handleOnChangeInput(value, item)} value={item.quantity} />
                                                                </div>
                                                                <div className='sum' key={index}>
                                                                    Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${priceBook * item.quantity}`)}
                                                                </div>
                                                                <DeleteOutlined onClick={() => handleDeleteBookCart(item?.detail?._id)} key={index} />
                                                            </div>
                                                        </div>
                                                    )
                                                }) : <Empty description={<div> Không có sản phẩm nào trong giỏ hàng!</div>} />
                                        }
                                    </Col>
                                    <Col md={6} xs={24} >
                                        <Payment
                                            totalPrice={totalPrice}
                                            carts={carts}
                                            setCurentStep={setCurentStep}
                                        />
                                    </Col>

                                </>
                            }
                            {
                                curentStep === 0 &&
                                <>
                                    <Col md={18} xs={24}>
                                        {
                                            carts.length !== 0 ?
                                                carts.map((item, index) => {
                                                    const priceBook = item?.detail?.price;
                                                    return (
                                                        <div className='order-book'  key={index}>
                                                            <div className='book-content'>
                                                                <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`} key={index}/>
                                                                <div className='title' key={index}>
                                                                    {item?.detail?.mainText}
                                                                </div>
                                                                <div className='price' key={index} >
                                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceBook)}
                                                                </div>
                                                            </div>
                                                            <div className='action' key={index}>
                                                                <div className='quantity' key={index}>
                                                                    <InputNumber onChange={(value) => handleOnChangeInput(value, item)} value={item.quantity}  key={index}/>
                                                                </div>
                                                                <div className='sum' key={index}>
                                                                    Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${priceBook * item.quantity}`)}
                                                                </div>
                                                                <DeleteOutlined onClick={() => handleDeleteBookCart(item?.detail?._id)} key={index} />
                                                            </div>
                                                        </div>
                                                    )
                                                }) : <Empty description={<div> Không có sản phẩm nào trong giỏ hàng!</div>} />
                                        }
                                    </Col>
                                    <Col md={6} xs={24} >
                                        <div className='order-sum'>
                                            <div className='calculate'>
                                                <span>  Tạm tính</span>
                                                <span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}</span>
                                            </div>
                                            <Divider style={{ margin: "10px 0" }} />
                                            <div className='calculate'>
                                                <span> Tổng tiền</span>
                                                <span className='sum-final'> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}</span>
                                            </div>
                                            <Divider style={{ margin: "10px 0" }} />
                                            <button onClick={() => setCurentStep(1)} >Mua Hàng ({carts?.length ?? 0})</button>
                                        </div>
                                    </Col>

                                </>
                            }
                        </Row>
                    </div>
                </div>
                <Footer />
            </>
        </RoleBaseRoute>
    )
}

export default ViewOrder;