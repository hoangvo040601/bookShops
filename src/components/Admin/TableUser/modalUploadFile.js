import React, { useState } from 'react';
import { Divider, Modal, Table, Upload, message, notification } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx/xlsx.mjs';
import { callCreateListUser } from '@/services/api';
import dataExcelExample from "./dataExcelExample.xlsx"


const { Dragger } = Upload;

const ModalImportUser = (props) => {
    const { showModalImport, setShowModalImport } = props;
    const [dataExcel, setDataExcel] = useState([]);

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess('ok');
        }, 1000);
    };

    const handleSubmit = async () => {
        const data = dataExcel.map((item) => {
            item.password = "123456";
            return item;
        })
        const res = await callCreateListUser(data)
        if (res && res.data) {
            notification.success({
                description: `Success ${res.data.countSuccess}, Error ${res.data.countError}`,
                message: "Upload thành công"
            })
        } else {
            notification.error({
                description: res.message,
                message: "Đã có lỗi xảy ra"
            })
        }
    }


    const propsModal = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        customRequest: dummyRequest,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e) {
                        const data = new Uint8Array(reader.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheet = workbook.Sheets[workbook.SheetNames[0]];
                        const json = XLSX.utils.sheet_to_json(sheet, {
                            header: ['fullName', 'email', 'phone'],
                            range: 1
                        });
                        console.log("check:", json);
                        if (json && json.length > 0) setDataExcel(json);
                    };
                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Dữ liệu upload</span>
            </div>
        );
    };

    const columns = [
        {
            key: 1,
            title: 'Tên Hiển Thị',
            dataIndex: 'fullName',
        },
        {
            key: 2,
            title: 'Email',
            dataIndex: 'email',
        },
        {
            key: 3,
            title: 'Điện Thoại',
            dataIndex: 'phone',
        },
    ];

    return (
        <>
            <Modal
                title="Import data user"
                width={"50vh"}
                visible={showModalImport}
                onOk={() => handleSubmit()}
                onCancel={() => {
                    setShowModalImport(false)
                    setDataExcel([])
                }}
                okText="Import data"
                okButtonProps={{
                    disabled: dataExcel.lenght < 1
                }}
                maskClosable={false}
            >
                <Dragger {...propsModal}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                        {/* don't fix bug download */}
                        &nbsp; <a onClick={e => e.stopPropagation()} href={dataExcelExample} download>Download Sample file</a>
                    </p>
                </Dragger>
                <Divider />
                <Table
                    title={renderHeader}
                    columns={columns}
                    dataSource={dataExcel}
                    size="small"
                    pagination={false}
                />
            </Modal>
        </>
    );
};

export default ModalImportUser;