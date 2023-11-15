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
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import AlertDialogMessage from '../common/dialog-confirm.component';
import nhanVienService from '../../services/nhanVien.service';
import AddNhanVien from './addNhanVien.component';

const theme = createTheme();
const columns = [
    {
        field: 'fullName',
        headerName: 'Nhân viên',
        width: 300,
        editable: true,
    },
    {
        field: 'tenNhomQuyen',
        headerName: 'Vai trò',
        width: 300,
        editable: true,
    }
];

function ListNhanVien(props) {

    const [selectionModel, setSelectionModel] = useState([]);
    const [isReload, setIsReload] = useState(false);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [listNhanVien, setListNhanVien] = useState([]);
    const [nameRow, setNameRow] = useState({});

    useEffect(() => {
        let data = props.userInfo?.user?.donVi
        dispatch(showLoading(true));
        nhanVienService.GetAllNhanVien(data).then((result) => {
            setListNhanVien(result.data);
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error);
        })
    }, [isReload])


    const handleDelete = () => {
        if (selectionModel.length === 0) {
            showMessageByType(null, "Chọn nhân viên cần xóa!", TYPE_ERROR.warning)
            return;
        }
        dispatch(setMessage("Bạn có muốn xóa các nhân viên <b>đã chọn</b> không?"))
        setOpenDelete(true);
    }

    const handleDeleteOk = () => {
        var data = {
            ids: selectionModel,
        }
        if (selectionModel.length > 0) {
            dispatch(showLoading(true));
            nhanVienService.deleteNhanVien(data).then((res) => {
                dispatch(hideLoading());
                handleLoadPage();
                setOpenDelete(false);
                showMessageByType(null, "success", TYPE_ERROR.success)
            }).catch((error) => {
                showMessageByType(error, "error", TYPE_ERROR.error)
                dispatch(hideLoading());
            })
        }
    }

    const handleCloseDel = () => {
        setOpenDelete(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }
    const handleCloseEdit =()=>{
        setOpenEdit(false);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const handleLoadPage = () => {
        setIsReload(!isReload);
    }
    const handleLoadPageEdit = () => {
        setIsReload(!isReload);
    }
    const handleRowClick = (params) => {
        console.log("params", params);
        setOpenEdit(true)
        setNameRow(params);
        setOpen(false);
    };

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
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <Box sx={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={listNhanVien}
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
            {open && <AddNhanVien open={open} title={"THÊM MỚI NHÂN VIÊN"} handleClose={handleClose} handleLoadPageParent={handleLoadPage} />}
            {openEdit && <AddNhanVien open={openEdit} nameRow={nameRow.row} title={"CHỈNH SỬA NHÂN VIÊN"} handleClose={handleCloseEdit} handleLoadPageParent={handleLoadPageEdit}/>}
            <AlertDialogMessage
                open={openDelete}
                handleClose={handleCloseDel}
                title="Xóa Nhân Viên"
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

export default connect(mapStateToProps)(ListNhanVien);