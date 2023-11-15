import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, connect } from 'react-redux';
import { TextField,FormControl,InputLabel } from '@mui/material';
import productService from '../../../services/product.service';
import { addMenuToOrder, hideLoading, showLoading, updateMenuOrder } from '../../../actions';
import { TYPE_ERROR, showMessageByType } from '../../../helpers/handle-errors';
const InputQRCode = (props) => {
    const [qrCode, setQRCode] = useState('');

    const dispatch = useDispatch();
    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            loadMatHangByCode();
        }
    }

    const inputRef = React.useRef();

    React.useEffect(() => {
      const timeout = setTimeout(() => {
        inputRef.current.focus();
      }, 100);
  
      return () => {
        clearTimeout(timeout);
      };
    }, []);

    const loadMatHangByCode = () => {
        dispatch(showLoading(true));
        productService.getMatHangByQRCode(qrCode).then(res => {
            handleChangeMH(res.data);
            dispatch(hideLoading());
        }).catch(err => {
            dispatch(hideLoading());
            console.log("error", err);
            showMessageByType(err, "Qr Code mặt hàng Không tồn tại.", TYPE_ERROR.error);
        })
    }
    const handleChangeMH = (mh) => {
        console.log("MH", mh);
        if (props.orderNewList?.length === 0) {
            dispatch(addMenuToOrder(mh));
        } else {
            var item = props.orderNewList?.find(x => x.id === mh.id);
            if (item) {
                mh.chietKhau = undefined;
                dispatch(updateMenuOrder(mh));
            } else {
                dispatch(addMenuToOrder(mh));
            }
        }
        setQRCode('');
    }
    return (
        <FormControl sx={{ m: 1 }} size="small" fullWidth>
            <TextField
                inputRef={inputRef}
                id="outlined-multiline-static"
                label="QR Code"
                fullWidth
                value={qrCode}
                size='small'
                onKeyDown={handleEnterKey}
                onChange={(e) => {setQRCode(e.target.value)}}
            />
        </FormControl>
    );
}

function mapStateToProps(state) {
    const { isLoggedIn } = state.appReducers.auth;
    const { message } = state.appReducers.message;
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { listThucDon, orderNewList, chietKhauBill, orderedList, loaiDonHang } = state.appReducers.thucdon;
    const { table } = state.appReducers.setupTbl;
    const { customer } = state.appReducers.customer;
    const { outlet } = state.appReducers.outlet;

    return {
        isLoggedIn,
        message,
        isReFetchData,
        userInfo: user,
        listThucDon,
        orderNewList,
        orderedList,
        chietKhauBill,
        table,
        loaiDonHang,
        customer,
        outlet
    };
}

export default connect(mapStateToProps)(InputQRCode);