import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import Stack from '@mui/material/Stack';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box, Typography } from '@mui/material';

import { showLoading, hideLoading, reFetchData, setSelectedCustomer } from "../../actions/index";
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import khachHangService from '../../services/khachHang.service';
import { LOAI_KHACH_HANG } from '../../consts/constsCommon';

const SearchCustomer = (props) => {
    const [listKhachHang, setListKhachHang] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        
        if (props.isReFetchData) {
            dispatch(reFetchData(false))
        }
        getAllKhachHang();
    }, [props.isReFetchData])

    useEffect(() => {
        if (props.orderedList && props.orderedList.maKhachHang > 0) {
            var cust = listKhachHang.find(x=>x.ma_KH === props.orderedList.maKhachHang);
            if (cust) {
                dispatch(setSelectedCustomer(cust));
            }
        }
    }, [props.orderedList, listKhachHang])
    const getAllKhachHang = () => {
        dispatch(showLoading(true));
        khachHangService.GetListKhByLoaiKHThanhToan(LOAI_KHACH_HANG.KHACH_HANG).then((result) => {
            setListKhachHang(result.data);
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error);
        })
    }
    const filterOptions = (options, state) => {
        let newOptions = [];
        options.forEach((element) => {
            if (
                element.dienThoai_KH
                    .toLowerCase()
                    .includes(state.inputValue.toLowerCase()) ||
                element.ten_KH
                    .toLowerCase()
                    .includes(state.inputValue.toLowerCase()) ||
                element.maHienThi_KH?.toLowerCase()
                    .includes(state.inputValue.toLowerCase())
            ) 
                newOptions.push(element);
        });
        return newOptions;
    }

    const handleChangeCustomer = (cus) => {
        dispatch(setSelectedCustomer(cus));
    }

    const renderLabel = (props, option) => {
        return (
            <Box>
                <Typography variant="caption" component="li"  {...props}>
                    {option.maHienThi_KH && <b>{option.maHienThi_KH + " - "}</b>}
                    <b>{option.ten_KH + " - "}</b>
                    <i>{option.dienThoai_KH}</i>
                </Typography>
            </Box>)
    }
    return (
        <Stack spacing={2}>
            <Autocomplete
                fullWidth
                id="size-small-standard"
                size="medium"
                value={props.customer}
                onChange={(event, value) => handleChangeCustomer(value)}
                options={listKhachHang}
                filterOptions={filterOptions}
                getOptionLabel={(option) => option.ten_KH}
                renderOption={(props, option) => renderLabel(props, option)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Tìm khách theo tên hoặc số điện thoại"
                        placeholder="Tìm khách theo tên hoặc số điện thoại"
                    />
                )}
                option
            />
        </Stack>
    );
}

function mapStateToProps(state) {
    const { isLoggedIn, user } = state.appReducers.auth;
    const { message, isReFetchData} = state.appReducers.message;
    const {orderedList } = state.appReducers.thucdon;
    const { customer } = state.appReducers.customer;

    return {
        isReFetchData,
        isLoggedIn,
        message,
        userInfo: user,
        orderedList,
        customer
    };
}

export default connect(mapStateToProps)(SearchCustomer);