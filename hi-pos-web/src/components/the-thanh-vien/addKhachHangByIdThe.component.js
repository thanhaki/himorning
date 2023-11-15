import React, { useState, useEffect, useRef } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from '@mui/material/TextField';
import { Typography, Box, Grid, Button } from '@mui/material';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { connect } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon';
import RenderIsCheckComponent from '../nhom-khachhang/render-check-kh.component';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import thethanhvienService from '../../services/thethanhvien.service';
import SearchIcon from '@mui/icons-material/Search';
import { setDanhSachKhachHang } from '../../actions/khachhang';

const RenderCheck = (props) => {
    return <RenderIsCheckComponent dataKh={props} />
}


const columns = [
    {
        field: 'isCheck', headerName: '',
        width: 60,
        sortable: false,
        disableColumnMenu: true,
        renderCell: RenderCheck
    },
    {
        field: 'ten_KH',
        headerName: 'Tên khách hàng',
        width: 140,
    },
    {
        field: 'dienThoai_KH',
        headerName: 'Điện thoại',
        width: 120,
    },
    {
        field: 'tongSoHoaDon_KH',
        headerName: 'Tổng hóa đơn',
        width: 180,
    },
    {
        field: 'tongThanhToan_KH',
        headerName: 'Tổng chi tiêu',
        width: 180,
    },
];

const AddKhachHangByIdTheTV = (props) => {
    const { open, handleClose, handleLoadPageParent, nameSearch } = props;
    const dispatch = useDispatch()
    const { nameRow } = props;
    const [selectionModel, setSelectionModel] = useState([]);
    const [tenKhachHang, setTenKhachHang] = useState('');
    const descriptionElementRef = useRef(null);

    useEffect(() => {
        if (open || props.isReFetchData) {
            if (nameRow && Object.keys(nameRow).length > 0) {
                var data = {
                    ma_TD: nameRow.row.ma_TTV,
                    name: nameSearch == undefined ? '' : nameSearch,
                }
                setTenKhachHang(nameSearch);
                dispatch(showLoading(true));
                thethanhvienService.getKhachHangIsCheck(data).then((result) => {
                    dispatch(setDanhSachKhachHang(result.data));
                    dispatch(reFetchData(false));
                    dispatch(hideLoading());
                }).catch((error) => {
                    dispatch(hideLoading());
                    showMessageByType(error, "error", TYPE_ERROR.error);
                })
            }

            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open, props.isReFetchData]);

    const handleCancel = () => {
        if (handleClose) { handleClose() }
    }

    const handleSearch = (event) => {
        var data = {
            ma_TTV: (nameRow && Object.keys(nameRow).length > 0 ? nameRow.row.ma_TTV : ''),
            name: tenKhachHang,
        }
        dispatch(showLoading(true));
        thethanhvienService.getKhachHangIsCheck(data).then((result) => {
            dispatch(setDanhSachKhachHang(result.data));
            dispatch(reFetchData(false));
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error);
        })
    }

    const HandletenKhachHang = (event) => {
        setTenKhachHang(event.target.value);
    };

    const handleSave = () => {
        let lstArr = ([]);
        props.danhSachKH.forEach((item) => {
            if (item.isCheck) {
                lstArr.push(item.ma_KH)
            }
        });

        var data = {
            ma_TTV: props.nameRow.row.ma_TTV,
            donVi: 0,
            ids: lstArr,
        }
        dispatch(showLoading(true));
        thethanhvienService.updateKhachHangByIdThe(data).then((result) => {
            dispatch(hideLoading());
            handleSearch();
            showMessageByType(null, "success", TYPE_ERROR.success)
            if (handleLoadPageParent) { handleLoadPageParent(); }
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error);
        })

    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={"paper"}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">THÊM KHÁCH HÀNG</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={9}>
                                    <TextField
                                        id="searchTxt"
                                        fullWidth
                                        value={tenKhachHang}
                                        label="Tên khách hàng"
                                        variant="outlined"
                                        placeholder='Tên khách hàng'
                                        size="small"
                                        onChange={HandletenKhachHang}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" startIcon={<SearchIcon />} onClick={handleSearch}>
                                        Tìm kiếm
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Box sx={{ height: 300, width: '100%' }}>
                                        <DataGrid
                                            rows={props.danhSachKH.map((item, index) => ({ id: index + 1, ...item }))}
                                            columns={columns}
                                            pageSize={5}
                                            rowsPerPageOptions={[ROWS_PER_PAGE_OPTIONS]}
                                            editingMode="modal"
                                            disableSelectionOnClick
                                            // checkboxSelection
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
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" startIcon={<CloseIcon />} onClick={handleCancel} size="small">Hủy</Button>
                    <Button variant="outlined" startIcon={<SendIcon />} onClick={handleSave} size="small">Chọn</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function mapStateToProps(state) {
    const { message } = state.appReducers;
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { danhSachKH } = state.appReducers.khachhang;
    return {
        message,
        isReFetchData,
        userInfo: user,
        danhSachKH: danhSachKH
    };
}

export default connect(mapStateToProps)(AddKhachHangByIdTheTV);