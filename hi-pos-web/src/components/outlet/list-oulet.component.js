import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import { DataGrid } from '@mui/x-data-grid';
import { showLoading, hideLoading, reFetchData, setMessage, setListOutlet, setOutlet } from "../../actions/index";
import { useDispatch, connect } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddOutlet from './add.component';
import OutletService from '../../services/outlet.service';
import DeleteIcon from '@mui/icons-material/Delete';
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon';
import { useNavigate } from 'react-router-dom';
import AlertDialogMessage from '../common/dialog-confirm.component';

const columns = [
    {
        field: 'ten_Outlet',
        headerName: 'Tên khu vực',
        width: 150,
    },
    {
        field: 'soLuongBan',
        headerName: 'Số lượng vị trí',
        width: 150,
    }
];

function ListOutlet(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isAdd, setIsAdd] = useState(false);
    const [selectionModel, setSelectionModel] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        getAllOutletByDV();
    }, [])

    useEffect(() => {
        if (props.isReFetchData) {
            getAllOutletByDV();
            dispatch(reFetchData(0));
        }
    }, [props.isReFetchData])

    const getAllOutletByDV = () => {
        dispatch(showLoading(true));
        dispatch(setListOutlet()).then((res) => {
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, props.message, TYPE_ERROR.error)
        });
    }

    const confirmDeleteOk = () => {
        let donVi = props.userInfo?.user?.donVi;
        var data = {
            ids: selectionModel,
            donVi: donVi
        };
        dispatch(showLoading(true));
        OutletService.deleteOutlet(data).then(() => {
            showMessageByType(null, "Xoá khu vực thành công", TYPE_ERROR.success)
            dispatch(reFetchData(1));
            dispatch(hideLoading());
            setOpen(false);
        }).catch((error) => {
            showMessageByType(error, "Xoá khu vực không thành công", TYPE_ERROR.success)
            dispatch(hideLoading());
        });
    }

    const handleDelete = () => {
        if (selectionModel.length === 0) {
            showMessageByType(null, "Chọn khu vực cần xóa!!", TYPE_ERROR.warning)
            return;
        }
        dispatch(setMessage("Bạn có muốn xóa các khu vực <b>đã chọn</b> không?"))
        setOpen(true);
    }

    const handleAdd = () => {
        setIsAdd(true);
    }
    const handleClose = () => {
        setIsAdd(false);
        setOpen(false);
    }

    const handleRowClick = (params) => {
        if (props.listOutlet) {
            var outlet = props.listOutlet.find(x=>x.ma_Outlet === params.row.ma_Outlet);
            dispatch(setOutlet(outlet));
        }
        navigate(`/setup-table/${params.row.ma_Outlet}`);
    };

    return (
        <Container component="main" maxWidth="true">
            <CssBaseline />
            <Typography component="h1" variant="h5">
                Danh sách Outlet
            </Typography>
            <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>

                    <Grid item xs={12} sm={12}>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={props.listOutlet.map((item, index) => ({stt: index +1, id: item.ma_Outlet, ...item }))}
                                columns={columns}
                                pageSize={5}
                                checkboxSelection
                                onRowClick={handleRowClick}
                                rowsPerPageOptions={[ROWS_PER_PAGE_OPTIONS]}
                                disableSelectionOnClick
                                onSelectionModelChange={(newSelectionModel) => {
                                    setSelectionModel(newSelectionModel);
                                }} />
                        </Box>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{ mt: 2, mb: 2 }}>
                        <Grid sx={{ pl: 2 }}>
                            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete} size="small">Xóa</Button>
                        </Grid>
                        <Grid sx={{ pl: 2 }}>
                            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleAdd} size="small">Thêm mới</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            {isAdd && <AddOutlet open={isAdd} handleClose={handleClose} getAllOutlet={getAllOutletByDV} />}
            <AlertDialogMessage
                open={open}
                handleClose={handleClose}
                title="Xóa Khu Vực"
                callbackFunc={confirmDeleteOk}
            />
        </Container>
    );

}

function mapStateToProps(state) {
    const { isLoggedIn } = state.appReducers.auth;
    const { message } = state.appReducers.message;
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { listOutlet } = state.appReducers.outlet;

    return {
        isLoggedIn,
        message,
        isReFetchData,
        userInfo: user,
        listOutlet
    };
}

export default connect(mapStateToProps)(ListOutlet);