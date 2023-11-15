import React, { useState, useEffect, useRef } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from '@mui/material/TextField';
import {Typography, Box, Grid, Button} from '@mui/material';
import { showLoading, hideLoading, reFetchData, setDanhSachMatHang } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { connect } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon'
import { FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import CategoriesService from '../../services/categories.service';
import thucDonMatHangService from '../../services/thucDonMatHang.service';
import RenderCheckMhComponent from './render-check-mh.component';
import menuService from '../../services/menu.service';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import SearchIcon from '@mui/icons-material/Search';

const RenderCheck = (props) => {
   return <RenderCheckMhComponent dataMh={props} />
}


const columns = [
    {
        field: 'isCheck', headerName: '', width: 100,
        sortable: false,
        disableColumnMenu: true,
        renderCell: RenderCheck
    },
    {
        field: 'ten_MH',
        headerName: 'Mặt hàng',
        width: 350,
    },
];

const EditListProduct = (props) => {
    const { open, handleClose, handleLoadPageParent,nameSearch } = props;
    const dispatch = useDispatch()
    const { nameRow } = props;
    const [selectionModel, setSelectionModel] = useState([]);
    const [danhMuc, setDanhMuc] = useState([]);
    const [id_DanhMuc, setIdDanhMuc] = useState(0);
    const [tenMatHang, setTenMatHang] = useState('');
    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (open || props.isReFetchData) {
            if (nameRow && Object.keys(nameRow).length > 0) {
                setTenMatHang(props.nameSearch);
                var data = {
                    ma_TD: nameRow.id,
                    danhMuc: id_DanhMuc,
                    nameProduct: props.nameSearch
                }
                dispatch(showLoading(true));
                thucDonMatHangService.getMatHangToCheckThucDon(data).then((result) => {
                    dispatch(setDanhSachMatHang(result.data));
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
    }, [open,props.isReFetchData]);

    const handleCancel = () => {
        if (handleClose) { handleClose() }
    }


    useEffect(() => {
        let donVi = props.userInfo?.user?.donVi
        CategoriesService.getAllCategories(donVi).then((result) => {
            setDanhMuc(result.data);
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error);
        })

    }, [danhMuc.id, props.isReFetchData])


    const HandleDanhMuc = (event) => {
        setIdDanhMuc(event.target.value);
    };

    const handleSearch = (event) => {
        var data = {
            ma_TD: nameRow.id,
            danhMuc: id_DanhMuc,
            nameProduct: tenMatHang
        }
        dispatch(showLoading(true));
        thucDonMatHangService.getMatHangToCheckThucDon(data).then((result) => {
            dispatch(setDanhSachMatHang(result.data));
            dispatch(reFetchData(false));
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error);
        })
    }

    const HandleTenMathang = (event) => {
        setTenMatHang(event.target.value);
    };

    const handleSave = () =>{

        let lstArr = ([]);
        props.danhSachMH.forEach((item) => {
            if(item.isCheck)
            {
                lstArr.push(item.ma_MH)
            }
        });
        

        var data = {
            ma_TD: props.nameRow.id,
            ten_TD: nameRow.ten_TD,
            hinhAnh_TD :"",
            sort: 0,
            ids: lstArr,
        }
        
        dispatch(showLoading(true));
        menuService.updateThucDon(data).then((res) => {
            dispatch(hideLoading());
            showMessageByType(null, "success", TYPE_ERROR.success)
            if (handleLoadPageParent) { handleLoadPageParent(); }
        }).catch((error) => {
            showMessageByType(error, "error", TYPE_ERROR.error)
            dispatch(hideLoading());
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
                <DialogTitle id="scroll-dialog-title">DANH SÁCH MẶT HÀNG</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        id="searchTxt"
                                        fullWidth
                                        value={tenMatHang}
                                        label="Tên mặt hàng"
                                        variant="outlined"
                                        placeholder='Tên mặt hàng'
                                        size="small" 
                                        onChange={HandleTenMathang}
                                        />
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="danhMuc-select-small">Danh mục</InputLabel>
                                        <Select
                                            labelId="danhMuc-select-small"
                                            id="danhMuc-select-small"
                                            value={id_DanhMuc}
                                            label="Danh mục"
                                            onChange={HandleDanhMuc}
                                        >
                                            <MenuItem value={0}>
                                                <em>Tất cả</em>
                                            </MenuItem>
                                            {danhMuc.map(x => {
                                                return (
                                                    <MenuItem value={x.id}>
                                                        <em>{x.ten_DanhMuc}</em>
                                                    </MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Button variant="outlined" fullWidth startIcon={<SearchIcon />} onClick={handleSearch} size="medium">
                                        Tìm kiếm
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Typography variant="subtitle1">
                                       <b>Mặt hàng</b> 
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Box sx={{ height: 300, width: '100%' }}>
                                        {props.danhSachMH.length > 0 &&
                                            <DataGrid
                                                rows={props.danhSachMH.map((item, index) => ({ id: index + 1, ...item }))}
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
                                        }
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
    const { danhSachMH } = state.appReducers.product;
    return {
        message,
        isReFetchData,
        userInfo: user,
        danhSachMH: danhSachMH
    };
}

export default connect(mapStateToProps)(EditListProduct);