'use client'
import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, notification, Popconfirm, message } from 'antd';
import { callBookList, callDeleteBook} from '@/services/api';
import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx/xlsx.mjs';
import BookSearch from './bookSearch';
import BookViewDetail from './bookViewDetail';
import ModalUploadBook from './modalUploadBook';
import ModalUpdateBook from './modalUpdateBook';


// https://stackblitz.com/run?file=demo.tsx
const BookList = () => {
    const [listBook, setlistBook] = useState([]);

    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState('')
    const [sortQuery, setSortQuery] = useState("sort =-updatedAt")
    const [dataViewDetail, setDataViewDetail] = useState(false)
    const [openViewDetail, setOpenViewDetail] = useState(false)
    const [showModalCreate, setShowModalCreate] = useState(false)
    // const [showModalImport, setShowModalImport] = useState(false)
    const [showModalUpdate, setShowModalUpdate] = useState(false)
    const [dataUpdate, setDataUpdate] = useState(false)




    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery])

    const fetchBook = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;

        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        const res = await callBookList(query)
        if (res && res.data) {
            setlistBook(res.data.result)
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const handleDeleteBook = async (bookId) => {
        const res = await callDeleteBook(bookId)
        if(res && res.data){
            message.success("Xoá user thành công!")
            fetchBook()
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
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            sorter: true
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true
        },
        {
            title: 'Giá',
            dataIndex: 'price',
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
                            title={"Xác nhận xoá Book"}
                            description="bạn có chắc chắn muốn xoá Sách này!"
                            onConfirm={() => handleDeleteBook(record._id)}
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

    const handleExportBook = () => {
        if (listBook.length > 0) {

            const worksheet = XLSX.utils.json_to_sheet(listBook);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportDataBook.xlsx");
        }
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table list book</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type='primary'
                        onClick={() => handleExportBook()}
                    >Export</Button>
                    {/* <Button
                        icon={<ImportOutlined />}
                        type="primary"
                        onClick={() => setShowModalImport(true)}
                    >Import</Button> */}
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
                    <BookSearch
                        handleSearch={handleSearch}
                        setFilter={setFilter} />
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        loading={isLoading}
                        className='def'
                        columns={columns}
                        dataSource={listBook}
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
            <BookViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <ModalUploadBook
                showModalCreate={showModalCreate}
                setShowModalCreate={setShowModalCreate}
                fetchBook={fetchBook}

            />
            <ModalUpdateBook
                showModalUpdate={showModalUpdate}
                setShowModalUpdate={setShowModalUpdate}
                fetchBook={fetchBook}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}

            />
            {/* <ModalCreateUser
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
            /> */}
        </>
    )
}


export default BookList;