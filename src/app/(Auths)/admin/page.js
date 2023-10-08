'use client'
import useAccount from '@/hooks/useAccount';
import LayoutAdmin from '@/components/Admin';
import RoleBaseRoute from '../../roleAdmin';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import CountUp from 'react-countup';
import { callFetchDashboard } from '@/services/api';

const GetAccount = () => {
    const [data, setData]= useState({})
    useAccount();
    const formatter = (value) => <CountUp end={value} separator="," />;
    const fetchDashboard =async()=>{
        const dataDashboard = await callFetchDashboard();
        if(dataDashboard && dataDashboard.data){
            setData(dataDashboard.data)
        }
    }
    useEffect(()=>{
        fetchDashboard();
    },[])
    return (
        <>
            <RoleBaseRoute>
                <LayoutAdmin>
                    <Row gutter={[40, 40]}>
                        <Col span={10}>
                            <Card

                                title=""
                                bordered={false}
                            >
                                <Statistic
                                    title="Tổng User"
                                    value={data?.countOrder}
                                    formatter={formatter} />

                            </Card>
                        </Col>
                        <Col span={10}>
                            <Card
                                title=""
                                bordered={false}
                            >
                                <Statistic
                                    title="Tổng đơn hàng"
                                    value={data?.countUser}
                                    formatter={formatter} />

                            </Card>
                        </Col>
                    </Row>
                </LayoutAdmin>
            </RoleBaseRoute>
        </>
    )

}

export default GetAccount;
