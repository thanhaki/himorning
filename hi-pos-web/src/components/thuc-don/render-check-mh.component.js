import React, { useState, useEffect, useRef } from 'react';
import { updateIsCheckMatHang } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { connect } from "react-redux";
import Checkbox from '@mui/material/Checkbox';

const RenderCheckMhComponent = (props) => {
    const { dataMh } = props;
    const [isCheck, setIsCheck] = useState(dataMh.row.isCheck);
    const dispatch = useDispatch();

    const handleChangeChk = () => {
        setIsCheck(!isCheck);
        const dataUpdate = {
            ma_MH: dataMh.row.ma_MH,
            isCheck: !isCheck
        }
        dispatch(updateIsCheckMatHang(dataUpdate));
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
    const { danhSachMH } = state.appReducers.product;
    return {
        message,
        isReFetchData,
        userInfo: user,
        danhSachMH: danhSachMH
    };
}

export default connect(mapStateToProps)(RenderCheckMhComponent);