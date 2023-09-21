import React, { useState } from 'react';
import { Divider, Form, Input, message, Modal, notification } from 'antd';
// import { useForm } from 'antd/es/form/Form';
import { callCreateAUser } from '@/services/api';
const ModalCreateUser = (props) => {
    const { showModal, setShowModal } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async(values)=>{
        const {fullName, email, password, phone} = values;
        console.log(values)
        setIsSubmit(true);
        const res = await callCreateAUser(fullName,email,password,phone);
        if(res && res.data){
            message.success("Tạo User thành công!");
            form.resetFields();//xoá data trong form
            setShowModal(false);
            await props.fetchUser();
        }else{
            notification.error({
                message : 'Đã có lỗi xảy ra!',
                description: res.message
            })
        }
        setIsSubmit(false);

    }
    return (
        <>
            <Modal
                title="Thêm người dùng mới"
                open={showModal}
                onCancel={()=> setShowModal(false)}
                onOk = {()=>{form.submit()}}
                okText = {"Tạo mới"}
                cancelText = {"Huỷ"}
                confirmLoading ={isSubmit}
            >
                <Divider/>
                <Form
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                    style = {{maxWidth : 600}}
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
                </Form>
            </Modal>
        </>
    );
};
export default ModalCreateUser;