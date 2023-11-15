import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PostbillService from '../../../services/postbill.service';
import { showMessageByType } from '../../../helpers/handle-errors';
import { TYPE_ERROR } from '../../../helpers/handle-errors';
import { setLoaiDonHang } from '../../../actions';

const ListLoaiDonHang = (props) => {
    const [loaidonhang, setListLoaiDH] = useState([81]);
    const dispatch = useDispatch();

    const getLoaiDonHang = () => {
        const donVi = props.userInfo?.user?.donVi;
        PostbillService.getLoaiDonHang(donVi).then((res) => {
            setListLoaiDH(res.data);
        }).catch((error) => {
            showMessageByType(error, "Lấy thông tin loại đơn hàng thất bại", TYPE_ERROR.error)
        });
    }

    useEffect(() => {
        getLoaiDonHang();
    },[]);

    const handleChange = (event) => {
        dispatch(setLoaiDonHang(event.target.value));
    };
    
    return (
        <FormControl sx={{ m: 1 }} size="small" fullWidth>
            <InputLabel id="demo-select-small">Loại đơn hàng</InputLabel>
            <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={props.loaiDonHang}
                label="Loại đơn hàng"
                fullWidth
                onChange={handleChange}
            >
                {loaidonhang.map((item, idx) => {
                    return <MenuItem key={idx} value={item.no}>{item.data}</MenuItem>
                })}
            </Select>
        </FormControl>
    );
}
function mapStateToProps(state) {
    const { isLoggedIn } = state.appReducers.auth;
    const { message } = state.appReducers.message;
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { listThucDon, orderNewList, loaiDonHang } = state.appReducers.thucdon;
    const { table } = state.appReducers.setupTbl;

    return {
        isLoggedIn,
        message,
        isReFetchData,
        userInfo: user,
        listThucDon,
        orderNewList,
        table,
        loaiDonHang
    };
}

export default connect(mapStateToProps)(ListLoaiDonHang);