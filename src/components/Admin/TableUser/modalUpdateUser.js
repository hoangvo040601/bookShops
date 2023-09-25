import React, { useEffect, useState } from 'react';
import { Divider, Form, Input, message, Modal, notification } from 'antd';
import { callUpdateUser } from '@/services/api';
const ModalUpdateUser = (props) => {
    const { showModalUpdate, setShowModalUpdate, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { _id, fullName, phone } = values;
        setIsSubmit(true);
        const res = await callUpdateUser(_id, fullName, phone);
        if (res && res.data) {
            message.success("Update thành công");
            form.resetFields();//xoá data trong form
            setShowModalUpdate(false);
            await props.fetchUser();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra!',
                description: res.message
            })
        }
        setIsSubmit(false);

    }
    useEffect(()=>{
        form.setFieldsValue(dataUpdate)
    },[dataUpdate])
    return (
        <>
            <Modal
                title="Chỉnh sửa người dùng"
                open={showModalUpdate}
                onCancel={() => {
                    setShowModalUpdate(false)
                    setDataUpdate(null)
                }}
                onOk={() => { form.submit() }}
                okText={"Update"}
                cancelText={"Huỷ"}
                confirmLoading={isSubmit}
                maskClosable={false}
                okButtonProps={{
                    disabled: true,
                }}
            >
                <Divider />
                <Form
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item
                        hidden
                        labelCol={{ span: 24 }} //whole column
                        label="Id"
                        name="_id"
                        rules={[{ required: true, message: 'Vui lòng nhập Id!' }]}
                    >
                        <Input />
                    </Form.Item>
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
                        <Input disabled/>
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
export default ModalUpdateUser;