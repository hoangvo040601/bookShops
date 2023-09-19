'use client'
import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button } from 'antd';
import InputSearch from './search';
import { callFetchListUser } from '@/services/api';
import UserViewDetail from './dataViewDetail';

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


    useEffect(() => {
        fetchUser();
    }, [current, pageSize, filter, sortQuery])

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
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <>
                        <Button>Delete</Button>
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
            const q = sorter.order === 'acsend' ? `sort =${sorter.field}` : `sort = -${sorter.field}`
            setSortQuery(q);
        }
        // console.log('params', pagination, filters, sorter, extra);
    };

    const handleSearch = (query) => {
        setFilter(query)
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
                        // title={renderHeader}
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
        </>
    )
}


export default TableUser;