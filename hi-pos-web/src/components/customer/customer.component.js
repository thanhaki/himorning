import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import {
    DialogContent, DialogActions, DialogTitle, Dialog, Grid, Button, Box
} from '@mui/material';
import SearchCustomer from './search-cust.component'
import { setSelectedCustomer, reFetchData } from '../../actions';
import AddKhachHang from '../../components/khach-hang/addKhachHang.component'

const CustomerDialog = (props) => {
    const { open, handleClose } = props;
    const [openAddKH, setOpenAddKH] = useState(false);

    const dispatch = useDispatch();

    const handleAddCustomer = () => {
        setOpenAddKH(true)
        console.log("add customer ")
    }

    const handleCloseModalKH = () => {
        setOpenAddKH(false)
    }

    const handleCls = () => {
        if (handleClose) { handleClose() }
    }

    const handleApplyCustomer = () => {
        handleClose();
    }

    const handleLoadPage = () => {
        dispatch(reFetchData(true));

    }
    return (
        <>
            <Dialog
                open={open}
                onClose={handleCls}
            >
                <DialogTitle align='center' sx={{ pb: 1 }}>
                    {"Khách hàng "}
                </DialogTitle>
                <DialogContent sx={{ pl: 2, pr: 1 }}>
                    <Box sx={{minWidth: 303}}>

                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} sx={{ mt: 1 }}>
                                <SearchCustomer />
                                <Button autoFocus sx={{ mt: 1, fontSize: 10 }} variant='text' onClick={handleAddCustomer} size='small'>
                                    Thêm mới khách hàng
                                </Button>
                            </Grid>

                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={12} textAlign={'center'}>
                            <Button onClick={handleApplyCustomer} autoFocus variant='contained'
                                size='medium'>
                                Áp Dụng
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            {openAddKH && <AddKhachHang open={openAddKH} title={"THÊM MỚI KHÁCH HÀNG"} handleClose={handleCloseModalKH} handleLoadPageParent={handleLoadPage} />}

        </>
    )
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

export default connect(mapStateToProps)(CustomerDialog);