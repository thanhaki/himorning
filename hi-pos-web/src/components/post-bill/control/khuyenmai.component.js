import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { updateMenuOrder, reFetchData, showLoading, hideLoading, setKhuyenMai } from '../../../actions';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { showMessageByType, TYPE_ERROR } from '../../../helpers/handle-errors';
import khuyenMaiService from '../../../services/khuyenMai.service';
import moment from 'moment';
import { FORMAT_DD_MM_YYYY } from '../../../consts/constsCommon';
import Checkbox from '@mui/material/Checkbox';
import postbillService from '../../../services/postbill.service';

const KhuyenMaiComponent = (props) => {
    const { open, handleClose } = props;

    const [listKM, setListKM] = useState([]);

    const theme = useTheme();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(showLoading(true));
        khuyenMaiService.getAllListKhuyenMai(0).then(res => {
            if (res.data && res.data.length > 0) {
                const updatedList = res.data.map(item => {
                    var checked = false;
        
                    if (item.id == props.orderedList.maKhuyenMai || item.id === props.khuyenMai?.maKhuyenMai) {
                        checked = true;
                    }
        
                    return { ...item, isCheck: checked };
                });
                setListKM(updatedList);
            }
            dispatch(hideLoading());
        }).catch(error => {
            dispatch(hideLoading());
            showMessageByType(error, 'Không có thông tin khuyến mãi', TYPE_ERROR.warning);
        })
    }, [open]);

    const handleCls = (event, reason) => {
        if (reason !== 'backdropClick') {
            if (handleClose) {
                handleClose();
            }
        }
    };

    const handleApplyKM = () => {
        let khuyenMai = listKM.find(x=>x.isCheck);
        if (props.orderedList.soDonHang > 0) {
            let maKhuyenMai = khuyenMai ? khuyenMai.maKhuyenMai : 0;
            var data = {
                orderedList: props.orderNewList,
                chietKhau: props.chietKhauBill,
                tableNo: props.table.id,
                loaiDonHang: props.loaiDonHang,
                soDonHang: props.orderedList.soDonHang,
                maDonHang: props.orderedList.maDonHang,
                timestamp: props.orderedList.timestamp,
                maKhachHang: props.customer && props.customer.ma_KH ? props.customer.ma_KH : 0,
                ghiChu: props.orderedList.ghiChu,
                maKhuyenMai: maKhuyenMai,
                actionFrom: "KHUYENMAI"
            }
            dispatch(showLoading(true));
            postbillService.createOrder(data).then((res) => {
                if (res && res.data) {
                    if (res.data.status === "2") {
                        showMessageByType(null, res.data.message, TYPE_ERROR.success)
                    }
                }
                dispatch(hideLoading());
                dispatch(reFetchData(true));
            }).catch((error) => {
                dispatch(hideLoading());
                showMessageByType(error, "Áp dụng khuyến mãi không thành công", TYPE_ERROR.error)
            })
        } else {
            dispatch(setKhuyenMai(khuyenMai));
            handleCls();
        }
    }
    const handleCheckKM = (e, row) => {
        let updatedList = listKM.map(item => {
            var checked = false;

            if (item.id == row.id) {
                checked = e.target.checked;
            }

            return { ...item, isCheck: checked };
        });

        setListKM(updatedList);
    }
    return (
        <Dialog
            open={open}
            onClose={handleCls}
            fullWidth={true}
            maxWidth={'md'}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Chương trình khuyến mãi"}
            </DialogTitle>
            <DialogContent>

                <TableContainer component={Paper}>
                    <Table aria-label="Khuyến mãi">
                        <TableHead>
                            <TableRow>
                                <TableCell width={1}></TableCell>
                                <TableCell align="center">Tên chương trình</TableCell>
                                <TableCell align="center">Loại khuyến mãi</TableCell>
                                <TableCell align="center">Bắt đầu</TableCell>
                                <TableCell align="center">Kết thúc</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listKM.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, color:'red'}}
                                    className={!row.isValidDate ? 'invalid-km': ''}
                                >
                                    <TableCell width={1} lign="center" className='no-padding'>
                                        <Checkbox checked={row.isCheck ? true : false} onChange={(e) => handleCheckKM(e, row)} disabled={!row.isValidDate} />
                                    </TableCell>
                                    <TableCell align="left" className='no-padding'>{row.tenKhuyenMai}</TableCell>
                                    <TableCell align="center" className='no-padding'>{row.loai}</TableCell>
                                    <TableCell align="center" className='no-padding'>{moment(row.khuyenMaiTuNgay).format(FORMAT_DD_MM_YYYY)}</TableCell>
                                    <TableCell align="center" className='no-padding'>{moment(row.khuyenMaiDenNgay).format(FORMAT_DD_MM_YYYY)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>


                <Button autoFocus onClick={handleCls} variant='outlined' size='small' color='error'>
                    Đóng
                </Button>
                <Button onClick={handleApplyKM} autoFocus variant='outlined' size='small'>
                    Áp dụng
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
    const { listThucDon, orderNewList, chietKhauBill, orderedList, loaiDonHang, khuyenMai } = state.appReducers.thucdon;
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
        outlet,
        khuyenMai
    };
}

export default connect(mapStateToProps)(KhuyenMaiComponent);