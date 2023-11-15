import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Container, Typography, TextField, FormControl, MenuItem, Menu, Button } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DialogFilterDonHang from '../post-bill/control/dialog-filter-dh.component';
import { useDispatch, connect } from 'react-redux';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { showLoading, reFetchData, getAllHttt, setListOutlet, setObjectFilterData, setMessage, hideLoading, setBillIdDelete } from "../../actions/index";
import GridDataBill from "../post-bill/control/gird-data-bill.component";
import AlertDialogMessage from '../common/dialog-confirm.component';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import postbillService from '../../services/postbill.service';
import {ExportCSV} from '../post-bill/control/export-bill.component';

const QuanLyDonHang = (props) => {
    const [openFilter, setOpenFilter] = useState(false);
    const dispatch = useDispatch();
    const [openDialogConfirm, setOpenDialogConfirm] = useState(false);

    useEffect(() => {
        getHttt();
        getAllOutletByDV();
    }, [])

    const getAllOutletByDV = () => {
        if (!props.listOutlet || props.listOutlet.length === 0) {
            dispatch(setListOutlet()).then((res) => {
            }).catch((error) => {
            });
        }
    }

    const getHttt = () => {
        if (!props.dataHttt.httt || props.dataHttt.httt.length === 0) {
            dispatch(getAllHttt()).then((res) => {
            }).catch((error) => {
            });
        }
    }
    const openDialogFilter = () => {
        setOpenFilter(true);
    }

    const handleCloseFilter = () => {
        setOpenFilter(false);
    }

    const setDataToFilter = (data, name) => {
        let tempData = props.filterData;
        tempData[name] = data;
        dispatch(setObjectFilterData(tempData));
    }

    const handleChangeMaDH = (event) => {
        setDataToFilter(event.target.value, 'maDonHang');
        dispatch(reFetchData(true));
    }
    
    useEffect(() => {
        dispatch(reFetchData(true));
    }, []);

    const handleSearchMaDH = () => {
        dispatch(reFetchData(true));
    }
    
    const handleDeleteBill = () => {
        if (!props.billIdsDelete || props.billIdsDelete.length === 0) {
            showMessageByType(null, "Vui lòng chọn hóa đơn để xóa", TYPE_ERROR.warning);
            return;
        }
        dispatch(setMessage("Bạn có chắc chắn xóa các hóa đơn đã chọn không?"))
        setOpenDialogConfirm(true);
    }

    const handleCloseDialogConfirm = () => {
        setOpenDialogConfirm(false);
    }

    const confirmDeleteOk = (lyDoHuy) => {
        dispatch(showLoading(true));
        var data = {
            maDonHang: props.billIdsDelete,
            lyDoHuy:lyDoHuy
        }
        postbillService.deletebill(data).then(res => {
            dispatch(hideLoading());
            showMessageByType(null, "Xóa hóa đơn thành công", TYPE_ERROR.success);
            dispatch(setBillIdDelete([]));
            setOpenDialogConfirm(false);
            dispatch(reFetchData(true));
        }).catch(error => {
            setOpenDialogConfirm(false);
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error);
        });
    }

    return (
        <Container component="main" maxWidth="true" >

            <Typography component="h1" variant="h5">
            {props.title ? props.title : "Quản lý hóa đơn"}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={2}>
                    <Button endIcon={<FilterAltIcon />} onClick={openDialogFilter}>Lọc hóa đơn</Button>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <FormControl sx={{ minWidth: 120 }} size="small" fullWidth>
                        <TextField
                            id="maDH"
                            fullWidth
                            value={props.filterData.maDonHang}
                            onChange={handleChangeMaDH}
                            label="Tìm kiếm theo mã đơn hàng"
                            variant="outlined"
                            placeholder='Tìm kiếm theo mã đơn hàng'
                            size="small" />
                    </FormControl>

                </Grid>
                <Grid item xs={12} sm={1} textAlign={'right'}>
                    <Button endIcon={<FilterAltIcon />} onClick={handleSearchMaDH} variant='outlined'>Lọc</Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                            <React.Fragment>
                                <Button variant="outlined" {...bindTrigger(popupState)} size='small' sx={{ mr: 1 }}>
                                    Chọn thao tác
                                </Button>
                                <Menu {...bindMenu(popupState)}>
                                    <MenuItem onClick={ 
                                        () => {
                                            handleDeleteBill();
                                            popupState.close();
                                        }}>Xóa hóa đơn</MenuItem>
                                </Menu>
                            </React.Fragment>
                        )}
                    </PopupState>
                    <Typography variant='caption'>
                        <i>đã chọn {props.billIdsDelete.length} hóa đơn</i>
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={8} textAlign={'right'}>
                    <ExportCSV csvData={props.listBills} fileName='danh-sach-hoa-don' />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <GridDataBill />
                </Grid>
            </Grid>
            <DialogFilterDonHang
                open={openFilter}
                handleClose={handleCloseFilter}
            />


            <AlertDialogMessage
                open={openDialogConfirm}
                handleClose={handleCloseDialogConfirm}
                title="Xóa hóa đơn"
                callbackFunc={confirmDeleteOk}
                isShowReason={true}
            />
        </Container>
    );
}
function mapStateToProps(state) {
    const { isLoggedIn } = state.appReducers.auth;
    const { message, title} = state.appReducers.message;    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { listOutlet, outlet } = state.appReducers.outlet;
    const { listThucDon, orderNewList, filterData, billIdsDelete, listBills } = state.appReducers.thucdon;
    const { httt, htttDefault } = state.appReducers.mdata;
    const dataHttt = {
        httt, htttDefault
    };
    return {
        isLoggedIn,
        message,
        isReFetchData,
        userInfo: user,
        listOutlet,
        outlet: outlet,
        listThucDon,
        orderNewList,
        dataHttt,
        filterData,
        billIdsDelete,
        listBills,
        title
    };
}

export default connect(mapStateToProps)(QuanLyDonHang);