'use client'

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { doGetAccountAction } from "@/redux/account/accountSlice";
import { callBookViewDetail, callFetchAccount } from "@/services/api";
import { Col, Divider, Rate, Row, Spin } from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import '../../../components/Book/bookdetail.scss'
import ImageGallery from "react-image-gallery";
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import ModalGallery from "@/components/Book/modalGallery";
import BookLoader from "@/components/Book/bookLoader";
import { doAddBookAction } from "@/redux/order/orderSlice";

const BookPage = ({ params: id }) => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const isLoading = useSelector(state => state.account.isLoading)
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dataBook, setDataBook] = useState([])
    const [currentQuantity, setCurrentQuantity] = useState(1)

    const refGallery = useRef(null);
    const getAccount = async () => {
        const res = await callFetchAccount()
        if (res && res.data) {
            dispatch(doGetAccountAction(res.data))
        }
    }
    useEffect(() => {
        getAccount();
    }, [])

    useEffect(() => {
        fetchBook(id.id)
    }, [id.id])

    const fetchBook = async (id) => {
        const res = await callBookViewDetail(id)
        if (res && res.data) {
            let raw = res.data;
            // console.log(raw)
            raw.items = getImages(raw);
            setDataBook(raw)

        }
    }
    const getImages = (raw) => {
        const images = [];
        if (raw.thumbnail) {
            images.push({
                original: `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/book/${raw.thumbnail}`,
                thumbnail: `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/book/${raw.thumbnail}`,
                originalClass: "original-image",
                thumbnailClass: "thumbnail-image"
            })
        }
        if (Array.isArray(raw.slider)) {
            raw.slider?.map(item => {
                images.push({
                    original: `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/book/${item}`,
                    thumbnail: `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/book/${item}`,
                    originalClass: "original-image",
                    thumbnailClass: "thumbnail-image"
                })
            })
        }
        return images;
    }
    const images = dataBook?.items ?? [];

    const handleOnClickImage = () => {
        //get current index onClick
        // alert(refGallery?.current?.getCurrentIndex());
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
        // refGallery?.current?.fullScreen()
    }

    const handleAddToCart = (quantity, book) => {
        dispatch(doAddBookAction({quantity, detail: book, _id: book._id}))
    }

    const handleChangeButton = (type) => {
        if(type==='MINUS'){
            if(currentQuantity -1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1)
        }
        if(type === 'PLUS'){
            if(currentQuantity === +dataBook.quantity) return;
            setCurrentQuantity(currentQuantity + 1)
        }
    }

    const handleChangeInput = (value)=>{
        if(!isNaN(value)){
            if(+value >0 && +value < +dataBook.quantity){
                setCurrentQuantity(+value)
            }
        }
    }
    return (
        <>
            <Header />
            <div style={{ backgroundColor: "#f5f5fa", padding: "20px 0" }}>

                <div className="view-detail-book" style={{ backgroundColor: "#fff", maxWidth: 1440, margin: '0 auto', borderRadius: "5px", padding: "16px" }}>
                    {dataBook && dataBook._id ?
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <ImageGallery
                                    // ref={refGallery}
                                    items={images}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>}//right arrow === <> </>
                                    slideOnThumbnailOver={true}  //onHover => auto scroll images
                                    onClick={() => handleOnClickImage()}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={images}
                                        showPlayButton={false} //hide play button
                                        showFullscreenButton={false} //hide fullscreen button
                                        renderLeftNav={() => <></>} //left arrow === <> </>
                                        renderRightNav={() => <></>}//right arrow === <> </>
                                        showThumbnails={false}
                                    />
                                </Col>
                                <Col md={14} xs={24}>
                                    <div className='author'>Tác giả: <a href='#'>{dataBook.author}</a> </div>
                                    <div className='title'>{dataBook.mainText}</div>
                                    <div className='rating'>
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                        <span className='sold'>
                                            <Divider type="vertical" />
                                            Đã bán: {dataBook.sold}</span>
                                    </div>
                                    <div className='price'>
                                        <span className='currency'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${dataBook.price}`)}
                                        </span>
                                    </div>
                                    <div className='delivery'>
                                        <div>
                                            <span className='left'>Vận chuyển</span>
                                            <span className='right'>Miễn phí vận chuyển</span>
                                        </div>
                                    </div>
                                    <div className='quantity'>
                                        <span className='left'>Số lượng</span>
                                        <span className='right'>
                                            <button onClick = {()=> handleChangeButton('MINUS')} ><MinusOutlined /></button>
                                            <input defaultValue={1} onChange = {(e)=> handleChangeInput(e.target.value)} value = {currentQuantity}/>
                                            <button onClick = {()=> handleChangeButton('PLUS')}><PlusOutlined /></button>
                                        </span>
                                    </div>
                                    <div className='buy'>
                                        <button className='cart' onClick= {()=>handleAddToCart(currentQuantity, dataBook)}>
                                            <ShoppingCartOutlined className='icon-cart' />
                                            <span>Thêm vào giỏ hàng</span>
                                        </button>
                                        <button className='now'>Mua ngay</button>
                                    </div>
                                </Col>
                            </Col>
                        </Row > :
                        <BookLoader />
                    }
                </div >
                <ModalGallery
                    isOpen={isOpenModalGallery}
                    setIsOpen={setIsOpenModalGallery}
                    currentIndex={currentIndex}
                    items={images}
                    title={"hardcode"}
                />
            </div>
            <Footer />
        </>
    )
}

export default BookPage;