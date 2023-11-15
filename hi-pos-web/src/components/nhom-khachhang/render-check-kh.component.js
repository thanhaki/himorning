import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from "react-redux";
import Checkbox from '@mui/material/Checkbox';
import { updateIsCheckKhachHang } from '../../actions/khachhang';

const RenderIsCheckComponent = (props) => {
    const { dataKh } = props;
    const [isCheck, setIsCheck] = useState(dataKh.row.isCheck);
    const dispatch = useDispatch();

    const handleChangeChk = () => {
        setIsCheck(!isCheck);
        const dataUpdate = {
            ma_KH: dataKh.row.ma_KH,
            isCheck: !isCheck
        }
        dispatch(updateIsCheckKhachHang(dataUpdate));
    }
    return  <Checkbox 
        checked={isCheck} 
        value={isCheck} 
        onChange={handleChangeChk}
    />
}


function mapStateToProps(state) {
    const { message } = state.appReducers;
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { danhSachKH } = state.appReducers.product;
    return {
        message,
        isReFetchData,
        userInfo: user,
        danhSachKH: danhSachKH
    };
}

export default connect(mapStateToProps)(RenderIsCheckComponent);