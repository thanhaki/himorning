import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Container from '@mui/material/Container';
import { showLoading, hideLoading, setMessage } from "../../actions/index";
import { useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';
import productUnitService from '../../services/productUnit.service';
import AddProductUnit from './addProductUnit.component';
import EditPoductUnit from './editPoductUnit.component';
import { connect } from "react-redux";
import AlertDialogMessage from '../common/dialog-confirm.component';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
const theme = createTheme();
const columns = [
    {
        field: 'ten_DonVi',
        headerName: 'Đơn vị',
        width: 100,
    },
    {
        field: 'soluong_MH',
        headerName: 'Số lượng mặt hàng',
        width: 150,
    },
];



function ProductUnit(props) {
    const [listDonVi, setListDonVi] = useState([]);
    const [isReload, setIsReload] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectionModel, setSelectionModel] = useState([]);
    const dispatch = useDispatch()
    const [openEdit, setOpenEdit] = useState(false);
    const [nameRow, setNameRow] = useState({});
    const [openDelete, setOpenDelete] = useState(false);
    useEffect(() => {
        let data = props.userInfo?.user?.donVi
        dispatch(showLoading(true));
        productUnitService.getAllProductUnit(data).then((result) => {
            setListDonVi(result.data);
            setNameRow('');
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error);
        })
    }, [isReload])

    const handleDeleteOk = () => {
        var data = {
            ids: selectionModel
        }
        if (data.ids.length > 0) {
            dispatch(showLoading(true));
            productUnitService.deleteProductUnit(data).then((res) => {
                dispatch(hideLoading());
                setOpenDelete(false);
                handleLoadPage();
                showMessageByType(null, "success", TYPE_ERROR.success)
            }).catch((error) => {
                showMessageByType(error, "error", TYPE_ERROR.error)
                dispatch(hideLoading());
            })
        }
    }
    const handleDelete = () => {
        if (selectionModel.length === 0) {
            showMessageByType(null, "Chọn đơn vị mặt hàng cần xóa!!", TYPE_ERROR.warning)

            return;
        }
        dispatch(setMessage("Bạn có muốn xóa các đơn vị mặt hàng <b>đã chọn</b> không?"))
        setOpenDelete(true);
    }

    const handleRowClick = (params) => {
        setNameRow(params);
        setOpenEdit(true)
    };

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleCloseDel = () => {
        setOpenDelete(false);
    }
    const handleLoadPage = () => {
        setIsReload(!isReload);
    }

    const handleEditClose = () => {
        setOpenEdit(false);
    }
    const editCategory = React.useMemo(() => {
        return (<EditPoductUnit open={openEdit} nameRow={nameRow} handleClose={handleEditClose} handleLoadPageParent={handleLoadPage} />);
    }, [openEdit]);



    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="true">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                <Typography component="h1" variant="h6">
                {props.title}
                </Typography>
                </Box>
                <Box sx={{ mt: 3 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={12}>
                            <Box sx={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={listDonVi}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    editingMode="modal"
                                    checkboxSelection
                                    onRowClick={handleRowClick}
                                    disableSelectionOnClick
                                    experimentalFeatures={{ newEditingApi: true }}
                                    onSelectionModelChange={(newSelectionModel) => {
                                        setSelectionModel(newSelectionModel);
                                    }}
                                    selectionModel={selectionModel}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ mt: 3, mb: 3 }}>
                    <Grid container justifyContent="flex-end">
                        <Button variant="outlined" startIcon={<DeleteIcon />} sx={{ mr: 2 }} onClick={handleDelete}>Xóa</Button>
                        <Button variant="outlined" startIcon={<SendIcon />} onClick={handleOpen}>Thêm mới</Button>
                    </Grid>
                </Box>
            </Container>
            {open && <AddProductUnit open={open} handleClose={handleClose} handleLoadPageParent={handleLoadPage} />}
            {editCategory}
            <AlertDialogMessage
                open={openDelete}
                handleClose={handleCloseDel}
                title="Xóa Danh Mục"
                callbackFunc={handleDeleteOk}
            />
        </ThemeProvider >
    );
}


function mapStateToProps(state) {
    const { message, title} = state.appReducers.message;
    const { user } = state.appReducers.auth;
    return {
        message,
        userInfo: user,
        title
    };
}

export default connect(mapStateToProps)(ProductUnit);