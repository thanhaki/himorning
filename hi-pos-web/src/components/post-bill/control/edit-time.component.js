import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { updateMenuOrder, setChietKhauBill, showLoading, hideLoading } from '../../../actions';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FORMAT_MM_DD_YYYY_HH_MM_SS } from '../../../consts/constsCommon';
import moment from 'moment';
import postbillService from '../../../services/postbill.service';
import { showMessageByType, TYPE_ERROR } from '../../../helpers/handle-errors';

const EditTimeMatHang = (props) => {
    const { open, handleClose, matHang, reloadOrdred } = props;
    
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [thoiGianRa, setThoiGianRa] = useState(dayjs(matHang.gioRa ? matHang.gioRa : moment(new Date()).format(FORMAT_MM_DD_YYYY_HH_MM_SS)));
    const [thoiGianVao, setThoiGianVao] = useState(dayjs(matHang.gioVao));
    const dispatch = useDispatch();

    useEffect(() => {
        setThoiGianRa(dayjs(matHang.gioRa ? matHang.gioRa : moment(new Date()).format(FORMAT_MM_DD_YYYY_HH_MM_SS)));
        setThoiGianVao(dayjs(matHang.gioVao));
    }, [open]);

    const handleCls = (event, reason) => {
        if (reason !== 'backdropClick') {
            if (handleClose) {
                handleClose();
            }
        }
    };

    const handleUpdateTime = () => {
        var gioRa = moment(thoiGianRa.toDate()).format();
        var gioVao = moment(thoiGianVao.toDate()).format();

        matHang.gioRa = gioRa;
        matHang.gioVao = gioVao;
        dispatch(updateMenuOrder(matHang));
        var data = {
            orderedList: props.orderNewList,
            chietKhau: props.chietKhauBill,
            tableNo: props.table.id,
            loaiDonHang: props.loaiDonHang,
            soDonHang: props.orderedList.soDonHang,
            maDonHang: props.orderedList.maDonHang,
            timestamp: props.orderedList.timestamp,
            maKhachHang: props.customer && props.customer.ma_KH ? props.customer.ma_KH : 0,
            ghiChu: props.orderedList.ghiChu
        }
        dispatch(showLoading(true));
        postbillService.createOrder(data).then((res) => {
            if (reloadOrdred) {
                reloadOrdred(true);
            }
            dispatch(hideLoading());
            showMessageByType(null, "Cập nhật thời gian thành công", TYPE_ERROR.success);
            handleClose();
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "Tạo đơn hàng không thành công", TYPE_ERROR.error);
        })
    }
    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleCls}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                {"Điều chỉnh thời gian"}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={6} sm={6}>
                        <Typography variant="subtitle2" component="div">
                            Thời gian bắt đầu:
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    className='customsize-datepicker'
                                    value={thoiGianVao}
                                    onChange={(val) => setThoiGianVao(val)}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['TimeField', 'TimeField']}>
                                <TimeField
                                    label="Giờ"
                                    value={thoiGianVao}
                                    onChange={(val) => setThoiGianVao(val)}
                                    size='small'
                                    fullWidth
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Typography variant="subtitle2" component="div">
                            Thời gian kết thúc
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    className='customsize-datepicker'
                                    value={thoiGianRa}
                                    onChange={(val) => setThoiGianRa(val)}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['TimeField', 'TimeField']}>
                                <TimeField
                                    label="Giờ"
                                    value={thoiGianRa}
                                    fullWidth
                                    onChange={(val) => setThoiGianRa(val)}
                                    size='small'
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCls} variant='outlined' size='small' color='error'>
                    Hủy
                </Button>
                <Button onClick={handleUpdateTime} autoFocus variant='outlined' size='small'>
                    Xác nhận
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

export default connect(mapStateToProps)(EditTimeMatHang);