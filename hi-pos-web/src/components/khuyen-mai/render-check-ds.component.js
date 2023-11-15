import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from "react-redux";
import Checkbox from '@mui/material/Checkbox';
import { updateIsCheckKhuyenMaiAD } from '../../actions/product';
import { updateIsCheckDanhMuc } from '../../actions/product';

const RenderIsCheckDsComponent = (props) => {
    const { dataKm } = props;
    const [isCheck, setIsCheck] = useState(dataKm.row.isCheck);
    const dispatch = useDispatch();

    const handleChangeChk = () => {
        setIsCheck(!isCheck);
        const dataUpdate = {
            ma: dataKm.row.id,
            isCheck: !isCheck
        }
        if (dataKm.row.selectedValueAD == 1) {
            dispatch(updateIsCheckDanhMuc(dataUpdate));
        } else {
            dispatch(updateIsCheckKhuyenMaiAD(dataUpdate));
        }
    }
    return <Checkbox
        checked={isCheck}
        value={isCheck}
        onChange={handleChangeChk}
    />
}


function mapStateToProps(state) {
    const { message } = state.appReducers;
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
	const { danhSachKmAd,danhSacDanhMuc } = state.appReducers.product;
    return {
        message,
        isReFetchData,
        userInfo: user,
        danhSachKmAd: danhSachKmAd,
		danhSacDanhMuc: danhSacDanhMuc
    };
}

export default connect(mapStateToProps)(RenderIsCheckDsComponent);