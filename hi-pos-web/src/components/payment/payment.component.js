import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import {
    DialogContent, DialogActions, DialogContentText, DialogTitle, Dialog, Grid,
    MenuItem, FormControl, Select, Box, Button, Typography, Divider
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveAltOutlined from '@mui/icons-material/SaveAltOutlined';
import moment from 'moment';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import IconButton from '@mui/material/IconButton';
import CustomerDialog from '../customer/customer.component';
import InputLabel from '@mui/material/InputLabel';
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import ClearIcon from '@mui/icons-material/Clear';
import { formatMoney } from '../../helpers/utils';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import postbillService from '../../services/postbill.service';
import { showLoading, hideLoading, getAllHttt } from '../../actions';
import { FORMAT_DD_MM_YYYY_HH_MM, GIA_TRI_CHIET_KHAU } from '../../consts/constsCommon'
import PrintConfirmation from '../print-templates/print-confirm.component';
import DoneIcon from '@mui/icons-material/Done';
import { returnAmountMHTheoGio, returnAmountNotCkBill } from '../post-bill/calculator-money';
const PaymentDialog = (props) => {
    const { open, handleClose, datePayment } = props;
    const [openDialogCustomer, setOpenCustomer] = useState(false);
    const [openDialogPrint, setOpenDialogPrint] = useState(false);
    const [openEventPayment, setopenEventPayment] = useState(false);

    const [httt, setHTTT] = useState('0');
    const [valMoney, setValMoney] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [lineMoney, setLineMoney] = useState([]);
    const [moneyInputCust, setMoneyInputCust] = useState(0);
    const listMoneySuggest = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 0];

    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const dispatch = useDispatch();
    const handleClosePrint = () => {
        setOpenDialogPrint(false);
    }

    const returnAmountTotalAfterCkBill = () => {
        var totalMHTheoGio = returnAmountMHTheoGio(props.orderNewList);
        const chietKhau = props.chietKhauBill;
        const amount = returnAmountNotCkBill(props.orderNewList, datePayment);
        let ck = 0;
        if (chietKhau) {
          chietKhau.valueCk = (chietKhau.valueCk + "").replace(/\D/g, '');
          const value = parseFloat(chietKhau.valueCk)
          if (chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.SO_TIEN) {
            ck = value;
          };
          var totalSubtract = (amount - totalMHTheoGio)
          if (chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.PHAN_TRAM) {
            ck = (totalSubtract * value) / 100;
          };
        }
        return amount - ck;
    }

    useEffect(() => {
        if (open) {
            setMoneyInputCust(0);
            const amount = Math.round(returnAmountTotalAfterCkBill());
            setTotalAmount(amount);
            setValMoney(amount);

            dispatch(getAllHttt()).then((res) => {
                setHTTT(props.dataHttt.htttDefault);
            }).catch((error) => {

            });
        }
    }, [open]);

    const handleChange = (event) => {
        setHTTT(event.target.value);
        
    };
   
    const handlePayment = () => {
        const data = {
            soDonHang: props.orderedList.soDonHang,
            maDonHang: props.orderedList.maDonHang,
            maKhachHang: props.customer && props.customer.ma_KH ? props.customer.ma_KH : 0,
            paymentInfo: lineMoney,
            timestamp: props.orderedList.timestamp,
            gioRa:  datePayment ? moment(datePayment.toDate()).format() : null
        };
        if(httt == 92 ){

            const data = {
                soDonHang: props.orderedList.soDonHang,
                maDonHang: props.orderedList.maDonHang,
                amount: lineMoney[0]['soTien'],
            };

            dispatch(showLoading(true));
            postbillService.vnPayQr(data).then((res) => {
                setIsPaymentSuccess(true);
                if (res.data) {
                    const paymentUrl = res.data;
                    window.location.href = paymentUrl;
                    setopenEventPayment(true);
                }
                dispatch(hideLoading());
            }).catch((error) => {
                showMessageByType(error, null, TYPE_ERROR.error);
                setOpenDialogPrint(false);
                dispatch(hideLoading());
            })
        }
        else{
            var totalMoney = returnAmount();
            if (totalMoney < totalAmount) {
                showMessageByType(null, "Số tiền thanh toán chưa chính xác, kiểm tra lại!", TYPE_ERROR.error);
                return;
            }
            if (data.soDonHang && data.soDonHang > 0) {
                dispatch(showLoading(true));
                postbillService.payment(data).then((res) => {
                    showMessageByType(null, 'Thanh toán thành công', TYPE_ERROR.success);
                    setIsPaymentSuccess(true);
                    if (res.statusText === "OK" && res.data.length > 2) {
                        showMessageByType(null, res.data, TYPE_ERROR.success);
                    }
                    setOpenDialogPrint(true);
                    dispatch(hideLoading());
                }).catch((error) => {
                    showMessageByType(error, null, TYPE_ERROR.error);
                    setOpenDialogPrint(false);
                    dispatch(hideLoading());
                })
            } else {
                showMessageByType(null, 'Đơn hàng đã thanh toán, vui lòng kiểm tra lại.', TYPE_ERROR.error);
            }
            setopenEventPayment(false);
        }

        
    }

    const handleCls = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;

        if (isPaymentSuccess) {
            localStorage.removeItem("dataPrint");
            window.location.href = '/map-table';
        } else {
            if (handleClose) { handleClose() }
            setLineMoney([]);
            setHTTT(props.dataHttt.htttDefault);
            setValMoney(0);
        }
    }

    const handleSearchCustomer = (event) => {
        setOpenCustomer(true);
    }

    const handleCloseCustomer = () => {
        setOpenCustomer(false);
    }

    const returnAmount = () => {
        const initialValue = 0;
        const sumWithInitial = lineMoney.reduce((currentValue, item) => {
            return item.soTien + currentValue;
        }, initialValue);
        return sumWithInitial;
    }

    const handleAddMoney = (event) => {
        let money = 0;

        if (typeof valMoney === 'number') {
            money = valMoney;
        } else {
            money = parseFloat((valMoney + "").replace(/\D/g, ''));
        }

        var htttCurrent = props.dataHttt.httt.find(x => x.maHinhThucThanhToan === httt);
        htttCurrent.soTien = money;

        const currentMoney = returnAmount();

        if (htttCurrent.soTien === 0 || htttCurrent.soTien < 0 || (currentMoney + htttCurrent.soTien > totalAmount)) {
            showMessageByType(null, 'Số tiền không hợp lệ. Vui lòng nhập đúng số tiền', TYPE_ERROR.warning);
            return;
        }

        let tempList = [...lineMoney];
        if (lineMoney.length === 0) {
            tempList.push(htttCurrent);
        } else {
            const line = lineMoney.find(x => x.maHinhThucThanhToan === httt);
            if (!line) {
                showMessageByType(null, "Chỉ chấp nhận một hình thức thanh toán.", TYPE_ERROR.warning);
                return;
            } else {
                tempList[line.id - 1].soTien = line.soTien + htttCurrent.soTien;
            }
        }

        const lt = tempList.map((item, index) => ({ id: index + 1, ...item }));
        setLineMoney(lt);
        setValMoney(totalAmount - (currentMoney + htttCurrent.soTien));
    }

    const formatNumberMoney = (value) => {
        const input = value.trim() === "" ? "0" : value;
        const formattedValue = parseFloat(input.replace(/\D/g, '')).toLocaleString('vi');
        return formattedValue;
    }

    const handleInputMoney = (event) => {
        setValMoney(formatNumberMoney(event.target.value));
    }

    const handleRemoveLineMoney = (item) => {
        var listFilter = lineMoney.filter(x => x.id !== item.id);
        const tempList = listFilter.map((item, index) => ({ id: index + 1, ...item }));
        setLineMoney(tempList);

        const currentMoney = returnAmount();
        if (tempList.length === 0) {
            setValMoney(totalAmount);
        } else {
            setValMoney(totalAmount - currentMoney);
        }
    };

    const handlemoneyInputCust = (event) => {
        setMoneyInputCust(formatNumberMoney(event.target.value));
    }

    const moneyReturnOutCust = () => {
        const money = parseFloat((moneyInputCust + "").replace(/\D/g, ''));
        if (money > 0) {
            const refund = money - returnAmount();
            if (refund > 0) {
                return refund;
            }
        }
        return 0;
    }

    const isValidMoney = () => {

        if (lineMoney.length === 0) {
            return false;
        }
        const amount = returnAmount();
        const money = parseFloat((moneyInputCust + "").replace(/\D/g, ''));
        if (amount > 0 && (money === 0 || money > 0)) {
            const refund = money - amount;
            return refund > 0 || refund === 0;
        }
        return false;
    }
    const handleMoneyButton = (val) => {
        if (val === 0) {
            setMoneyInputCust(0);
        } else {
            setMoneyInputCust(val + moneyInputCust);
        }
    }
    return (
        <Box>

            <Dialog
                open={open}
                onClose={handleCls}
                maxWidth={'xs'}
            >
                <DialogTitle align='center'>
                    {"Thanh Toán "}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="h7" component="div">
                                    <i>Thông tin hóa đơn:</i>
                                </Typography>
                                <Box sx={{ ml: 5 }}>
                                    <Typography variant="caption" component="div">
                                        <i>- Hóa đơn số: {props.orderedList.maDonHang}</i>
                                    </Typography>
                                    <Typography variant="caption" component="div">
                                        <i>- Ngày thanh toán: {moment().format(FORMAT_DD_MM_YYYY_HH_MM)}</i>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="h7" component="div">
                                    <i>Thông tin khách hàng:</i>
                                </Typography>
                                <Box sx={{ border: '1px solid black' }} textAlign={'center'}>
                                    <Typography variant="caption" component="div">
                                        {props.customer?.ten_KH}
                                        <IconButton aria-label="Tìm kiếm khách hàng" size="small" color='primary' onClick={handleSearchCustomer} disabled={isPaymentSuccess}>
                                            <PersonSearchIcon fontSize="inherit" />
                                        </IconButton>
                                    </Typography>

                                    {props.customer && props.customer.ma_KH > 0 && <>
                                        <Typography variant="caption" component="div" color={'black'}>
                                            <b>Loại thẻ: {props.customer.ten_TTV} - {props.customer.diemTichLuy} điểm</b>
                                        </Typography>
                                        <Typography variant="caption" component="div" color={'black'}>
                                            <b>{formatMoney(totalAmount)} tích {isNaN(totalAmount / props.customer.tyLeQuyDoi) ? 0 : Math.round(totalAmount / props.customer.tyLeQuyDoi)} điểm</b>
                                        </Typography>
                                    </>
                                    }

                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Grid container spacing={1}>
                                    <Grid item xs={6} sm={6}>
                                        <Typography variant="h7" component="div">
                                            <i>Thông tin thanh toán:</i>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <FormControl variant="outlined">
                                            <OutlinedInput
                                                id="add-line-money"
                                                type='text'
                                                value={formatMoney(totalAmount)}
                                                readOnly
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            edge="end"
                                                            disabled
                                                        >
                                                            <AddIcon sx={{ visibility: 'hidden' }} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                size='small'
                                                inputProps={{ style: { textAlign: 'right', paddingTop: 0 } }}
                                                sx={{
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: "red",
                                                        border: 'none'
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="httt-select-label">Hình thức thanh toán</InputLabel>
                                            <Select
                                                labelId="httt-select-label"
                                                id="httt-select"
                                                value={httt}
                                                label="Hình thức thanh toán"
                                                size='small'
                                                disabled={isPaymentSuccess}
                                                onChange={handleChange}
                                            >
                                                {
                                                    props.dataHttt.httt.map((item, index) => {
                                                        return (<MenuItem value={item.maHinhThucThanhToan} key={index}>{item.tenHinhThucThanhToan}</MenuItem>)
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <FormControl variant="outlined">
                                            <OutlinedInput
                                                id="add-line-money"
                                                type='text'
                                                value={valMoney}
                                                onChange={handleInputMoney}
                                                disabled={isPaymentSuccess}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="Thêm dòng tiền"
                                                            onClick={handleAddMoney}
                                                            disabled={isPaymentSuccess}
                                                            edge="end"
                                                            color='primary'
                                                        >
                                                            <AddIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                size='small'
                                                inputProps={{ style: { textAlign: 'right' } }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    {lineMoney.map((item, index) => {
                                        return (
                                            <>
                                                <Grid item xs={6} sm={6} key={index + 'title'}>
                                                    <Typography variant="subtitle1" component="div">
                                                        {item.tenHinhThucThanhToan}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={6} sm={6} key={index + 'money'}>
                                                    <FormControl variant="filled">
                                                        <OutlinedInput
                                                            id="add-line-money"
                                                            type='text'
                                                            value={formatMoney(item.soTien)}
                                                            endAdornment={
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        disabled={isPaymentSuccess}
                                                                        color='error'
                                                                        edge="end"
                                                                        onClick={() => handleRemoveLineMoney(item)}
                                                                    >
                                                                        <ClearIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            }
                                                            size='small'
                                                            inputProps={{ style: { textAlign: 'right', padding: 0 } }}
                                                            readOnly
                                                            sx={{
                                                                "& .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: "red",
                                                                    border: 'none'
                                                                }
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        )
                                    })}
                                </Grid>
                                {lineMoney.length > 0 && <Divider />}
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <Typography variant="subtitle1" component="div">
                                    <b>Tổng:</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <FormControl variant="filled">
                                    <OutlinedInput
                                        id="add-line-money"
                                        type='text'
                                        value={formatMoney(returnAmount())}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    color='error'
                                                    edge="end"
                                                    disabled
                                                >
                                                    <ClearIcon sx={{ visibility: 'hidden' }} />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        size='small'
                                        inputProps={{ style: { textAlign: 'right', padding: 0 } }}
                                        readOnly
                                        sx={{
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "red",
                                                border: 'none'
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <Typography variant="subtitle1" component="div">
                                    <b>Tiền khách trả:</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <FormControl variant="filled">
                                    <OutlinedInput
                                        id="add-line-money"
                                        type='text'
                                        value={moneyInputCust}
                                        onChange={handlemoneyInputCust}
                                        disabled={isPaymentSuccess}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    color='error'
                                                    edge="end"
                                                    disabled
                                                >
                                                    <ClearIcon sx={{ visibility: 'hidden' }} />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        size='small'
                                        inputProps={{ style: { textAlign: 'right' } }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <Typography variant="subtitle1" component="div">
                                    <b>Tiền thối lại:</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <FormControl variant="filled">
                                    <OutlinedInput
                                        id="add-line-money"
                                        type='text'
                                        value={formatMoney(moneyReturnOutCust())}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    color='error'
                                                    edge="end"
                                                    disabled
                                                >
                                                    <ClearIcon sx={{ visibility: 'hidden' }} />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        inputProps={{ style: { textAlign: 'right', padding: 0 } }}
                                        readOnly
                                        sx={{
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "red",
                                                border: 'none'
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} textAlign={'center'}>
                                {listMoneySuggest.map((val, index) => {
                                    return <Button disabled={isPaymentSuccess} key={index} sx={{ border: '1px solid', padding: 0, mr: 1, mb: 1 }} onClick={() => handleMoneyButton(val)}>{formatMoney(val)}</Button>
                                })}
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button autoFocus variant='outlined' startIcon={isPaymentSuccess ? <DoneIcon /> : <ArrowBackIcon />} onClick={handleCls} size='small'>
                        {isPaymentSuccess ? "Hoàn tất" : "Quay lại"}
                    </Button>
                    {!openDialogPrint && <Button onClick={handlePayment} disabled={!isValidMoney()} autoFocus variant='contained' startIcon={<SaveAltOutlined />} size='small'>
                        Xác nhận thanh toán
                    </Button>}
                    {openDialogPrint && <PrintConfirmation
                        lineMoney={lineMoney}
                        moneyInputCust={moneyInputCust}
                        ten_Outlet={props.outlet?.ten_Outlet + " - " + props.table?.tenBan}
                        dataOrderNew={props.orderNewList}
                        handleClose={handleClosePrint}
                        totalAmount={totalAmount}
                        datePayment={datePayment}
                        chietKhauBill={props.chietKhauBill}

                    />}
                </DialogActions>
            </Dialog>
            <CustomerDialog
                open={openDialogCustomer}
                handleClose={handleCloseCustomer}
            />
        </Box>
    )
}

function mapStateToProps(state) {
    const { isLoggedIn, user } = state.appReducers.auth;

    const { message } = state.appReducers.message;
    const { listOutlet, outlet } = state.appReducers.outlet;
    const { orderNewList, orderedList,chietKhauBill } = state.appReducers.thucdon;
    const { customer } = state.appReducers.customer;
    const { httt, htttDefault } = state.appReducers.mdata;
    const dataHttt = {
        httt, htttDefault
    };
    const { table } = state.appReducers.setupTbl;

    return {
        isLoggedIn,
        message,
        listOutlet,
        table,
        outlet,
        orderNewList,
        customer,
        orderedList,
        dataHttt,
        userInfo: user,
        chietKhauBill
    };
}

export default connect(mapStateToProps)(PaymentDialog);