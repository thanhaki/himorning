import React, { useState, useEffect } from 'react';
import Footer from "../components/footer"
import Header from "../components/header"
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { connect } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MdataService from '../services/mdata.service';
import { setSalersList, setTTDonVi, showLoading, hideLoading, setNganhHangList, setLoaiDanhMucThuChi, setTinhTrangDonHang, logout } from '../actions/index';
import { useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import "./layout.css";
import Fab from '@mui/material/Fab';
import OrderDialog from '../components/post-bill/details.component';
import moment from 'moment';
import { PATH_HIDDEN_ORDER } from '../consts/constsCommon';

const Layout = (props) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const [openOrder, setOpenOrder] = useState(false);
    useEffect(() => {
        if (pathname === "/" && !props.isLoggedIn) {
            dispatch(logout());
            navigate('/sign-in');
        }
    });
    useEffect(() => {
        if (props.userInfo) {
            MdataService.getMaDataByGroupDataList().then((res) => {
                const { salers, ttDonVis, nganhHangs, loaiDanhMucThuChi, tinhTrangDonHang } = res.data
                dispatch(setSalersList(salers));
                dispatch(setTTDonVi(ttDonVis));
                dispatch(setNganhHangList(nganhHangs));
                dispatch(setLoaiDanhMucThuChi(loaiDanhMucThuChi));
                dispatch(setTinhTrangDonHang(tinhTrangDonHang));
            }).catch((error) => {
                console.log("Get data common", error)
            });
        }
    }, []);

    const fabStyle = {
        position: 'absolute',
        right: 0,
        top: '50%',
        borderRadius: "initial",
        width: "8px",
        '&:hover': {
            width: "100px",
            '&::before': {
                content: '"Bán hàng"',
            }
        }
    };
    const handleOpenOrder = () => {
        setOpenOrder(true);
    }

    const handleClose = () => {
        setOpenOrder(false);
    }

    return (
        <React.Fragment>
            {!PATH_HIDDEN_ORDER.includes(pathname) && 
            <Fab color="primary" aria-label="add" sx={fabStyle} size='small'
                onClick={handleOpenOrder}
            >
            </Fab>}
            <Header />
            {props.children}
            <Footer />
            <Backdrop
                sx={{ color: '#fff', zIndex: 9999999999 }}
                open={props.isShow ? true : false}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <ToastContainer
                position="top-right"
                autoClose={500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light" />

            <OrderDialog
                open={openOrder}
                thoiGianTamTinh={moment(new Date())}
                handleClose={handleClose}
            />
        </React.Fragment>)
}
function mapStateToProps(state) {
    const { isShow } = state.appReducers.message;
    const { isLoggedIn, user } = state.appReducers.auth;
    return {
        isShow,
        isLoggedIn,
        userInfo: user
    };
}

export default connect(mapStateToProps)(Layout);