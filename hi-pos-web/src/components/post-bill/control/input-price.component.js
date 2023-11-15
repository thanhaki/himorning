import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DoneIcon from '@mui/icons-material/Done';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputMoney from '../../common/input-money.component';
import { formatMoney } from '../../../helpers/utils';

const InputPriceToSell = (props) => {
    const { open, handleClose, matHang, handleCallbackFunc } = props;
    const [giaNhap, setGiaNhap] = useState(0);
    const [soLuong, setSoLuong] = useState(1);

    const [optionGia, setOptionGia] = useState(matHang?.isNhapGiaBan ? 'NhapGia' : 'DF');
    useEffect(() => {
        setOptionGia(matHang?.isNhapGiaBan ? 'NhapGia' : 'DF');
        setSoLuong(matHang.soLuong === 0 ? 1 : matHang.soLuong);
        setGiaNhap(0);
    },[open]);
    const handleCls = () => {
        if (handleClose) {
            handleClose();
        }
    }

    const handleGiaNhap = (data) => {
        setGiaNhap(data);
    }

    const handleChangeGia = (e) => {
        if (e.target.value === "DF") {
            setGiaNhap(0);
        }
        setOptionGia(e.target.value);
    }

    const handleSoLuong = (e) => {
        setSoLuong(e.target.value);
    }

    const handleOk = ()  => {
        if (optionGia === 'NhapGia') {
            matHang.gia_Ban = !giaNhap ? 0 : parseInt(giaNhap.replace(/\D/g, ""));
        } else {
            matHang.isNhapGiaBan = false;
        }
        matHang.soLuong = isNaN(parseInt(soLuong)) ? 1 : parseInt(soLuong);
        if (handleCallbackFunc) {
            handleCallbackFunc(matHang);
        }
        handleCls();
    }
    return (
        <Dialog
            open={open}
            onClose={handleCls}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Mặt hàng "} <i>{matHang?.ten_MH}</i>
            </DialogTitle>
            <DialogContent>
                {matHang?.isNhapGiaBan && <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                value={optionGia}
                                name="radio-buttons-group"
                                onChange={handleChangeGia}
                            >
                                <FormControlLabel value="DF" control={<Radio />} label="Giá bán" />
                                <FormControlLabel value="NhapGia" control={<Radio />} label="Nhập giá bán" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputMoney
                            id="giaBan"
                            value={formatMoney(matHang?.gia_Default)}
                            disabled={true}
                        />
                        <InputMoney
                            id="giaNhap"
                            value={giaNhap}
                            onChange={handleGiaNhap}
                            disabled={optionGia !== 'NhapGia'}
                            styleClass="pt-1"
                        />
                    </Grid>
                    
                    <Grid item xs={6} sm={6}>
                        <Typography component="p" variant="p">
                            Số lượng
                        </Typography>
                    </Grid>

                    <Grid item xs={6} sm={6}>
                        <TextField
                            fullWidth
                            id="outlined-size-small"
                            size="small"
                            onChange={handleSoLuong}
                            className='text-right'
                            value={soLuong}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', className:'text-right' }}
                        />
                    </Grid>
                </Grid>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCls} startIcon={<ArrowBackIcon />} variant='outlined' size='small'>Quay lại</Button>
                <Button onClick={handleOk} startIcon={<DoneIcon />} variant='outlined' size='small' autoFocus>
                    Hoàn tất
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function mapStateToProps(state) {
    const { isLoggedIn } = state.appReducers.auth;
    const { message } = state.appReducers.message;
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { chietKhauBill } = state.appReducers.thucdon;

    return {
        isLoggedIn,
        message,
        isReFetchData,
        userInfo: user,
        chietKhauBill: chietKhauBill
    };
}

export default connect(mapStateToProps)(InputPriceToSell);