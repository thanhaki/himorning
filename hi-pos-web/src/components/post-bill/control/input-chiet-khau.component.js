import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { updateMenuOrder, setChietKhauBill } from '../../../actions';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { GIA_TRI_CHIET_KHAU } from '../../../consts/constsCommon';
import GridKeyBoard from '../../common/keyboard.component';

const InputChietKhau = (props) => {
    const { open, handleClose, matHang, ckBill} = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [loaiCk, setLoaiCk] = useState(1);
    const [valueCk, setvalueCk] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        if (matHang && !ckBill) {
            const chietKhau = matHang.chietKhau;
            if (chietKhau) {
                setLoaiCk(chietKhau.loaiCk);
                setvalueCk(chietKhau.valueCk);
            } else {
                setLoaiCk(1);
                setvalueCk("0");
            }
        } else {
            setLoaiCk(props.chietKhauBill.loaiCk);
            setvalueCk(props.chietKhauBill.valueCk);
        }
    }, [matHang, props.chietKhauBill]);

    const handleCls = (event, reason) => {
        if (reason !== 'backdropClick') {
            if (handleClose) {
                handleClose();
            }
        }
    };

    const handleChange = (event) => {
        setLoaiCk(event.target.value)
    }

    const handleValueCK = (value) => {
        setvalueCk(value)
    }

    const handleUpdateCk = () => {
        const chietKhau = {
            loaiCk: loaiCk,
            valueCk: valueCk
        }
        if (!ckBill) {
            dispatch(updateMenuOrder({ id: matHang.id, chietKhau: chietKhau, ghiChu: matHang.ghiChu}));
        } else {
            dispatch(setChietKhauBill(chietKhau));
        }

        if (handleClose) {
            handleClose();
        }
    }
    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleCls}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                {"Chiết khấu"}
            </DialogTitle>
            <DialogContent>
                <FormControl sx={{ mt: 1 }} size="small" fullWidth>
                    <InputLabel id="demo-simple-select-label">Loại chiết khấu</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={loaiCk}
                        label="Loại chiết khấu"
                        onChange={handleChange}
                        size='small'
                    >
                        <MenuItem value={GIA_TRI_CHIET_KHAU.PHAN_TRAM}>Chiết khấu %</MenuItem>
                        <MenuItem value={GIA_TRI_CHIET_KHAU.SO_TIEN}>Chiết khấu tiền</MenuItem>
                    </Select>
                </FormControl>
                <GridKeyBoard
                valueCurrent={valueCk}
                handleReturnValue={handleValueCK}
                handleOK={handleUpdateCk}
                handleClose={handleCls}
                icon={loaiCk === GIA_TRI_CHIET_KHAU.PHAN_TRAM ? '%': 'đ'}
                />
            </DialogContent>
            {/* <DialogActions>
                <Button autoFocus onClick={handleCls}>
                    Quay lại
                </Button>
                <Button onClick={handleUpdateCk} autoFocus>
                    OK
                </Button>
            </DialogActions> */}
        </Dialog>
    );
}

function mapStateToProps(state) {
    const { isLoggedIn } = state.appReducers.auth;
    const { message } = state.appReducers.message;
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { chietKhauBill} = state.appReducers.thucdon;

    return {
        isLoggedIn,
        message,
        isReFetchData,
        userInfo: user,
        chietKhauBill: chietKhauBill
    };
}

export default connect(mapStateToProps)(InputChietKhau);