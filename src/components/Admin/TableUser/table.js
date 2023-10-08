'use client'
import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, notification, Popconfirm, message } from 'antd';
import InputSearch from './search';
import { callDeleteUser, callFetchListUser } from '@/services/api';
import UserViewDetail from './dataViewDetail';
import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import ModalCreateUser from './modalCreateUser';
import ModalImportUser from './modalUploadFile';
import * as XLSX from 'xlsx/xlsx.mjs';
import ModalUpdateUser from './modalUpdateUser';


// https://stackblitz.com/run?file=demo.tsx
const TableUser = () => {
    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(2)
    const [total, setTotal] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState('')
    const [sortQuery, setSortQuery] = useState('')
    const [dataViewDetail, setDataViewDetail] = useState(false)
    const [openViewDetail, setOpenViewDetail] = useState(false)
    const [showModalCreate, setShowModalCreate] = useState(false)
    const [showModalImport, setShowModalImport] = useState(false)
    const [showModalUpdate, setShowModalUpdate] = useState(false)
    const [dataUpdate, setDataUpdate] = useState(false)




    useEffect(() => {
        fetchUser();
    }, [current, pageSize, filter, sortQuery])
    console.log(listUser)
    const fetchUser = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;

        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        const res = await callFetchListUser(query)
        if (res && res.data) {
            setListUser(res.data.result)
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const handleDeleteUser = async (userId) => {
        const res = await callDeleteUser(userId)
        if(res && res.data){
            message.success("Xoá user thành công!")
            fetchUser()
        }else{
            notification.error({
                message: "có lỗi xảy ra",
                description: res.message
            })
        }

    }
    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a href='#' onClick={() => {
                        setDataViewDetail(record)
                        setOpenViewDetail(true)
                    }}>{record._id}</a>
                )
            }
        },
        {
            title: 'Tên Hiển Thị',
            dataIndex: 'fullName',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true
        },
        {
            title: 'Điện Thoại',
            dataIndex: 'phone',
            sorter: true
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'createdAt',
            sorter: true
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <>
                        <Button onClick={() => { setShowModalUpdate(true), setDataUpdate(record) }}><EditOutlined /></Button>
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xoá User"}
                            description="bạn có chắc chắn muốn xoá user này!"
                            onConfirm={() => handleDeleteUser(record._id)}
                            okText="Xác nhận"
                            cancelText="Huỷ"
                            trigger="click"
                        >
                            <span>
                                <Button><DeleteOutlined /></Button>
                            </span>
                        </Popconfirm>
                    </>
                )
            }

        }
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort= ${sorter.field}` : `sort= -${sorter.field}`
            setSortQuery(q);
        }
    };

    const handleSearch = (query) => {
        setFilter(query)
    }
    const handleExportUser = () => {
        if (listUser.length > 0) {

            const worksheet = XLSX.utils.json_to_sheet(listUser);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportDataUser.xlsx");
        }
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table list user</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type='primary'
                        onClick={() => handleExportUser()}
                    >Export</Button>
                    <Button
                        icon={<ImportOutlined />}
                        type="primary"
                        onClick={() => setShowModalImport(true)}
                    >Import</Button>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setShowModalCreate(true)}
                    >Thêm mới</Button>
                    <Button
                        type="ghost"
                        onClick={() => {
                            setFilter('');
                            setSortQuery('')
                        }}
                    >
                        <ReloadOutlined />

                    </Button>
                </span>
            </div >
        )
    }

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch
                        handleSearch={handleSearch}
                        setFilter={setFilter} />
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        loading={isLoading}
                        className='def'
                        columns={columns}
                        dataSource={listUser}
                        onChange={onChange}
                        pagination={
                            {
                                current: current,
                                pageSize: pageSize,
                                showSizeChanger: true,
                                total: total,
                                showTotal: (total, range) => {
                                    return (<div>{range[0]} - {range[1]} trên {total} rows</div>)
                                }
                            }
                        }
                    />
                </Col>
            </Row>
            <UserViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <ModalCreateUser
                showModalCreate={showModalCreate}
                setShowModalCreate={setShowModalCreate}
                fetchUser={fetchUser}
            />
            <ModalImportUser
                showModalImport={showModalImport}
                setShowModalImport={setShowModalImport}
            />
            <ModalUpdateUser
                showModalUpdate={showModalUpdate}
                setShowModalUpdate={setShowModalUpdate}
                fetchUser={fetchUser}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    )
}


export default TableUser;