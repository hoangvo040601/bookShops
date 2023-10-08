'use client'

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { callHistoryOrder } from "@/services/api";
import { Col, Row, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import ReactJson from 'react-json-view'
import RoleBaseRoute from "../roleAdmin";

const History = () => {
    const [dataHistory, setDataHistory] = useState([])
    const columns = [
        {
            title: 'STT',
            dataIndex: '__v',
            render: (text, record, index) => {
                return (
                    <span>{index + 1}</span>
                )
            }
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            render: (text, record, index) => {
                return (
                    <span>{record.totalPrice} đ</span>
                )
            }
        },
        {
            title: 'Trạng thái',
            render: (text, record, index) => {
                return (
                    <span><Tag color="green">Thành công</Tag></span>
                )
            }
        },
        {
            title: 'Chi tiết',
            render: (text, record, index) => {
                return (
                    <span><ReactJson src={record} /></span>
                )
            }
        },

    ];
    useEffect(() => {
        fecthDataHistory();
    }, [])
    const fecthDataHistory = async () => {
        const res = await callHistoryOrder();
        if (res && res.data) {
            setDataHistory(res.data)
        }
    }
    return (
        <RoleBaseRoute>
            <>
                <Header />
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Table
                            // title={"Lịch sử mua hàng"}
                            // loading={isLoading}
                            className='def'
                            columns={columns}
                            dataSource={dataHistory}
                            pagination={false}
                        // onChange={}
                        />
                    </Col>
                </Row>
                <Footer />
            </>
        </RoleBaseRoute>
    )
}

export default History;