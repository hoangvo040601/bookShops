'use client'

import { callBookList, callFetchCategory } from '@/services/api';
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Spin } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Footer from '../Footer/Footer';
import './homePage.scss'
const HomePage = () => {
    const [listCategory, setListCategory] = useState([])

    const [listBook, setlistBook] = useState([]);
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(6)
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState('')
    const [sortQuery, setSortQuery] = useState("sort=-sold")


    const [form] = Form.useForm();
    const handleChangeFilter = (changedValues, values) => {
        console.log(">>> check handleChangeFilter", changedValues, values)
        console.log("chekkk", changedValues.category)
        if (changedValues.category) {
            const cate = values.category;
            if (cate && cate.length > 0) {
                const f = cate.join(",");
                setFilter(`category=${f}`)

            } else {
                setFilter('');
            }
        }
    }

    const onFinish = (values) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let f = `price>=${values.range.from}&price<=${values.range.to}`
            if (values?.category?.length) {
                const cate = values?.category?.join(",")
                f += `&category=${cate}`
            }
            setFilter(f)
        }
    }
    useEffect(() => {
        const fetchCatlegory = async () => {
            const res = await callFetchCategory();

            if (res && res.data) {
                const d = res.data.map((item) => {
                    return {
                        label: item,
                        value: item
                    }
                })
                setListCategory(d)
            }
        }
        fetchCatlegory()
    }, [])

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

    const handleOnChange = (pagination, sorter) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
        // if (sorter && sorter.field) {
        //     const q = sorter.order === 'ascend' ? `sort= ${sorter.field}` : `sort= -${sorter.field}`
        //     setSortQuery(q);
        // }
    };

    const items = [
        {
            key: "sort=-sold",
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: "sort=-updatedAt",
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: "sort=price",
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: "sort=-price",
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ];
    return (
        <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>

            <Row gutter={[20, 20]}>
                <Col md={4} sm={0} xs={0}>
                    <div style={{ backgroundColor: "#ffff", padding: "16px", borderRadius: "10px" }}>
                        <div style={{ display: 'flex', justifyContent: "space-between" }}>
                            <span> <FilterTwoTone /> Bộ lọc tìm kiếm</span>
                            <ReloadOutlined title="Reset" onClick={() => form.resetFields()} />
                        </div>
                        <Divider />
                        <Form
                            onFinish={onFinish}
                            form={form}
                            onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                        >
                            <Form.Item
                                name="category"
                                label="Danh mục sản phẩm"
                                labelCol={{ span: 24 }}
                            >
                                <Checkbox.Group>
                                    <Row>
                                        {
                                            listCategory.map(item => {
                                                return (
                                                    <Col span={24}>
                                                        <Checkbox value={item.value} >
                                                            {item.label}
                                                        </Checkbox>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                            <Divider />
                            <Form.Item
                                label="Khoảng giá"
                                labelCol={{ span: 24 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                    <Form.Item name={["range", 'from']}>
                                        <InputNumber
                                            name='from'
                                            min={0}
                                            placeholder="đ TỪ"
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        />
                                    </Form.Item>
                                    <span >-</span>
                                    <Form.Item name={["range", 'to']}>
                                        <InputNumber
                                            name='to'
                                            min={0}
                                            placeholder="đ ĐẾN"
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Button onClick={() => form.submit()}
                                        style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                                </div>
                            </Form.Item>
                            <Divider />
                            <Form.Item
                                label="Đánh giá"
                                labelCol={{ span: 24 }}
                            >
                                <div>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text"></span>
                                </div>
                                <div>
                                    <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
                <Col md={20} xs={24}>
                    <Spin spinning={isLoading} tip="loading...">
                        <div style={{ backgroundColor: "#ffff", padding: "16px", borderRadius: "10px", minHeight: "720px" }}>

                            <Row>
                                <Tabs defaultActiveKey="1" items={items} onChange={(value) => { setSortQuery(value) }} />
                            </Row>

                            <Row className='customize-row'>
                                {
                                    listBook.map(item => {
                                        return (

                                            <Link className="column" href={`/book/` + item?._id} key={item?._id}>
                                                <div className='wrapper'>
                                                    <div className='thumbnail' >
                                                        <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/book/${item.thumbnail}`} alt="thumbnail book" />
                                                    </div>
                                                    <div className='text' >{item.mainText}</div>
                                                    <div className='price' >
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${item.price}`)}
                                                    </div>
                                                    <div className='rating'>
                                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                        <span>Đã bán {item.sold}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                            </Row>

                            <Row style={{ display: "flex", justifyContent: "center", paddingTop: "32px" }}>
                                <Pagination
                                    defaultCurrent={current}
                                    total={total}
                                    pageSize={pageSize}
                                    onChange={(p, s) => handleOnChange({ current: p, pageSize: s })}
                                    responsive
                                />
                            </Row>
                        </div>
                    </Spin>
                    <Footer />
                </Col>
            </Row >
        </div >
    )
}

export default HomePage;