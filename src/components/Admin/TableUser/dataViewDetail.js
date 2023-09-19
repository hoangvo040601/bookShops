'use client'

import React from 'react';
import { Badge, Descriptions, Drawer } from 'antd';
import moment from 'moment';
const UserViewDetail = (props) => {
  const { setOpenViewDetail, setDataViewDetail, openViewDetail, dataViewDetail } = props;
  const onClose = () => {
    setOpenViewDetail(false)
    setDataViewDetail(null)
  }
  return (
    <>
      <Drawer
        title="Xem chi tiết"
        width={"50vw"}
        onClose={onClose}
        open={openViewDetail}
      >
        <Descriptions
          title='Thông tin User'
          bordered={true}
          column={2}
        >
          <Descriptions.Item label="Id">{dataViewDetail?._id}</Descriptions.Item>
          <Descriptions.Item label="tên hiển thị">{dataViewDetail?.fullName}</Descriptions.Item>
          <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{dataViewDetail?.phone}</Descriptions.Item>
          <Descriptions.Item label="Role" span={2}>
            <Badge status='processing' text={dataViewDetail?.role} />
          </Descriptions.Item>
          <Descriptions.Item label="Created At" >
            {moment(dataViewDetail?.createdAt).format('DD.MM.YYYY HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="Update At" span={2}>
            {moment(dataViewDetail?.updateAt).format('DD.MM.YYYY HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};
export default UserViewDetail;