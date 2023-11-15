import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from "react-redux";
import Checkbox from '@mui/material/Checkbox';
import { updateIsCheckTheTv } from '../../actions/thethanhvien';

const RenderIsCheckDsDTComponent = (props) => {
    const { dataKhTTv } = props;
    const [isCheck, setIsCheck] = useState(dataKhTTv.row.isCheck);
    const dispatch = useDispatch();

    const handleChangeChk = () => {
        setIsCheck(!isCheck);
        const dataUpdate = {
            ma: dataKhTTv.row.ma,
            isCheck: !isCheck
        }
        dispatch(updateIsCheckTheTv(dataUpdate));
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
	const { danhSachDT, danhSachTTV } = state.appReducers.thethanhvien;
    return {
        message,
        isReFetchData,
        userInfo: user,
        danhSachDT: danhSachDT,
        danhSachTTV: danhSachTTV
    };
}

export default connect(mapStateToProps)(RenderIsCheckDsDTComponent);