import React, { useEffect, useState } from 'react';
import { Checkbox, Divider, Form, Input, message, Modal, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { callOrderBook } from '@/services/api';
import { doPlaceOrderAction } from '@/redux/order/orderSlice';
import '../../app/order/order.scss'

const Payment = (props) => {
    const { totalPrice, carts, setCurentStep } = props;
    const dispatch = useDispatch();
    const user = useSelector(state => state.account.user)
    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setIsSubmit(true);
        const detailOrder = carts.map(item => {
            return {
                bookName: item.detail.mainText,
                quantity: item.quantity,
                _id: item._id,
            }
        });
        const data = {
            name: values.fullName,
            address: values.address,
            phone: values.phone,
            totalPrice: totalPrice,
            detail: detailOrder
        }
        const res = await callOrderBook(data);
        if (res && res.data) {
            message.success("Đặt hàng thành công");
            dispatch(doPlaceOrderAction())
            setCurentStep(2)
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra!',
                description: res.message
            })
        }
        setIsSubmit(false);

    }
    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <div className='order-sum'>

                    <Form
                        // name="basic"
                        onFinish={onFinish}
                        // autoComplete="off"
                        form={form}
                    >
                        <Form.Item
                            labelCol={{ span: 24 }} //whole column
                            label="Tên người nhận"
                            name="fullName"
                            initialValue={user?.fullName}
                            rules={[{ required: true, message: 'Tên không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }} //whole column
                            label="Số điện thoại"
                            name="phone"
                            initialValue={user?.phone}
                            rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 24 }} //whole column
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Form.Item name="remember" valuePropName="Checkbox" noStyle>
                                Hình thức thanh toán <br />
                                <Checkbox>Thanh toán khi nhận hàng</Checkbox>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item
                        // wrapperCol={{ offset: 6, span: 16 }}
                        >

                            {/* <div className='calculate'>
                                    <span>  Tạm tính</span>
                                    <span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}</span>
                                </div> */}
                            <Divider style={{ margin: "10px 0" }} />
                            <div className='calculate'>
                                <span> Tổng tiền</span>
                                <span className='sum-final'> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}</span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            {/* <button>Mua Hàng ({carts?.length ?? 0})</button> */}
                            <button type="primary" htmlType="submit" onClick={() => form.submit()} disabled={isSubmit}>
                                {isSubmit && <span><LoadingOutlined />&nbsp;</span>}
                                Mua Hàng ({carts?.length ?? 0})
                            </button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}
export default Payment;