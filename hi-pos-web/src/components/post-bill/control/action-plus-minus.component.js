import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/system';
import RemoveIcon from '@mui/icons-material/Remove';
import { updateMenuOrder } from '../../../actions';
import IconButton from '@mui/material/IconButton';
import { GIA_TRI_CHIET_KHAU } from '../../../consts/constsCommon';
const PlusMinusQuantity = (props) => {
    const dispatch = useDispatch();
    const { rowData, soLuong } = props;

    const handleChietKhau = (item) => {
        let ck = 0;
        const chietKhau = item.chietKhau;
        if (chietKhau) {
            if (chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.SO_TIEN) {
                ck = chietKhau.valueCk;
            };

            if (chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.PHAN_TRAM) {
                ck = (item.gia_Ban * chietKhau.valueCk) / 100;
            };
            return item.gia_Ban - ck;
        }
        return 0;
    }

    const handlePlus = () => {
        const item = props.orderNewList?.find(x => x.id === rowData.id);
        if (item) {
            const chietKhau = handleChietKhau(item);
            dispatch(updateMenuOrder({ id: item.id, soLuong: 1, gia_Ban: chietKhau }));
        }
    }

    const handleMinus = () => {
        const item = props.orderNewList?.find(x => x.id === rowData.id);
        const chietKhau = handleChietKhau(item);
        if (item) {
            dispatch(updateMenuOrder({ id: item.id, soLuong: -1, gia_Ban: -(chietKhau) }));
        }
    }
    return (
        <Box>
            <IconButton color="error" aria-label="Thêm số lượng mặt hàng" onClick={handleMinus} sx={{ padding: 0.25 }}>
                <RemoveIcon />
            </IconButton> {soLuong}
            <IconButton color="primary" aria-label="Giảm số lượng mặt hàng" onClick={handlePlus} sx={{ padding: 0.25 }}>
                <AddIcon />

            </IconButton>
        </Box>)
}

function mapStateToProps(state) {
    const { isLoggedIn } = state.appReducers.auth;
    const { message } = state.appReducers.message;
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { listOutlet, outlet } = state.appReducers.outlet;
    const { listThucDon, orderNewList } = state.appReducers.thucdon;
    return {
        isLoggedIn,
        message,
        isReFetchData,
        userInfo: user,
        listOutlet: listOutlet,
        outlet: outlet,
        listThucDon: listThucDon,
        orderNewList: orderNewList
    };
}

export default connect(mapStateToProps)(PlusMinusQuantity);