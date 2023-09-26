'use client'

import React, { useEffect, useState } from 'react';
import { Badge, Descriptions, Divider, Drawer } from 'antd';
import moment from 'moment';
import { Modal, Upload } from 'antd';
import { v4 as uuidv4 } from 'uuid';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });



const BookViewDetail = (props) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || (file.preview));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) =>
        setFileList(newFileList);





    const { setOpenViewDetail, setDataViewDetail, openViewDetail, dataViewDetail } = props;
    const onClose = () => {
        setOpenViewDetail(false)
        setDataViewDetail(null)
    }

    useEffect(() => {
        if (dataViewDetail) {
            let imgThumbnail = {};
            let imgSlider = [];
            if (dataViewDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataViewDetail.thumbnail,
                    status: 'done',
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/book/${dataViewDetail.thumbnail}`
                }
            }
            if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
                dataViewDetail.slider.map((item) => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/book/${item}`
                    })
                })
            }
            // console.log(dataViewDetail)
            setFileList([imgThumbnail, ...imgSlider])
        }
    }, [dataViewDetail])

    return (
        <>
            <Drawer
                title="Xem chi tiết"
                width={"50vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title='Thông tin Sách'
                    bordered={true}
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên sách">{dataViewDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Tác giả">{dataViewDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Giá tiền">{dataViewDetail?.price}</Descriptions.Item>
                    <Descriptions.Item label="Số lượng">{dataViewDetail?.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Đã bán">{dataViewDetail?.sold}</Descriptions.Item>
                    <Descriptions.Item label="Thể loại" span={2}>
                        <Badge status='processing' text={dataViewDetail?.category} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At" >
                        {moment(dataViewDetail?.createdAt).format('DD.MM.YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Update At" span={2}>
                        {moment(dataViewDetail?.updateAt).format('DD.MM.YYYY HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left">Ảnh books</Divider>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Drawer>
        </>
    );
};
export default BookViewDetail;



