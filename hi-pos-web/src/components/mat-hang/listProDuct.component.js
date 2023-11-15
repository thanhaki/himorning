import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import { Container, Typography, Select, TextField, FormControl, MenuItem, InputLabel, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { showLoading, hideLoading, setMessage } from "../../actions/index";
import { useDispatch } from 'react-redux';
import ProductService from '../../services/product.service';
import AddProduct from './addProduct.component';
import CategoriesService from '../../services/categories.service';
import SearchIcon from '@mui/icons-material/Search';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon'
import AlertDialogMessage from '../common/dialog-confirm.component';
import EditProduct from './editProduct.component'
import { formatMoney } from '../../helpers/utils';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ExportProducts } from './control/export-product.component';
import ReadExcel from './control/import-product.component';
import { useTheme } from '@mui/material';

const theme = createTheme();

const renderImage = (props) => {
    const { value } = props;
    return value && <img src={value} width="30px" height="30px" />
}

const columns = [
    // { field: 'id', headerName: 'STT', width: 10 },
    {
        field: 'hinhAnh_MH',
        headerName: 'Hình ảnh',
        width: 150,
        renderCell: renderImage
    },
    {
        field: 'ten_MH',
        headerName: 'Tên mặt hàng',
        width: 150,
        editable: true,
    },
    {
        field: 'ten_DonVi',
        headerName: 'Đơn vị',
        width: 150,
        editable: true,
    },
    {
        field: 'ten_DanhMuc',
        headerName: 'Danh mục',
        width: 150,
        editable: true,
        hideable: true,
    },
    {
        field: 'ten_Printer',
        headerName: 'Máy in',
        width: 150,
        editable: true,
    },
    {
        field: 'gia_Ban',
        headerName: 'Giá bán',
        valueFormatter: params =>
            formatMoney(params?.value),
        width: 150,
        editable: true,
        align: 'right'
    },
];

function Product(props) {
    let [Product, setProduct] = useState([]);
    let [ProductFilter, setProductFilter] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const [DanhMuc, setDanhMuc] = useState([]);
    const [txtSearch, setTxtSearch] = useState('');
    const [id_DanhMuc, setIdDanhMuc] = useState(0);
    const [isReload, setIsReload] = useState(false);
    const [loaiMatHang, setLoaiMatHang] = useState([]);
    const [id_LoaiMH, setIdLoaiMH] = useState(0);
    const [openDelete, setOpenDelete] = useState(false);
    const [nameRow, setNameRow] = useState({});
    const [openEdit, setOpenEdit] = useState(false);
    const [openCoppy, setOpenCoppy] = useState(false);
    useEffect(() => {

        let donVi = props.userInfo?.user?.donVi
        handleSearch();

        CategoriesService.getAllCategories(donVi).then((result) => {
            setDanhMuc(result.data);
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error);
        })

        ProductService.getLoaiMatHang(donVi).then((result) => {
            setLoaiMatHang(result.data);
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error);
        })

    }, [open, openEdit])


    const handleSearch = () => {
        var dataSearch = {
            NameProduct: txtSearch,
            donvi: props.userInfo?.user?.donVi,
            DanhMuc: id_DanhMuc,
            Type: id_LoaiMH
        }
        dispatch(showLoading(true));
        ProductService.filterProduct(dataSearch).then((result) => {
            setProduct(result.data);
            setProductFilter(result.data);
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error);
            showMessageByType(error, "Lỗi load dữ liệu sản phẩm", TYPE_ERROR.error)
        })
    }
    const handleCloseDel = () => {
        setOpenDelete(false);
    }
    const handleDeleteOk = () => {
        var data = {
            ids: selectionModel,
            donvi: props.userInfo?.user?.donVi,
        }
        if (data.ids.length > 0) {
            dispatch(showLoading(true));
            ProductService.deleteProduct(data).then((res) => {
                dispatch(hideLoading());
                handleSearch();
                setOpenDelete(false);
                showMessageByType(null, "success", TYPE_ERROR.success)
            }).catch((error) => {
                showMessageByType(error, "error", TYPE_ERROR.error)
                dispatch(hideLoading());
            })
        }
    }
    const handleSaoChep = () => {
        if (selectionModel.length === 0) {
            showMessageByType(null, "Chọn mặt hàng cần sao chép!!", TYPE_ERROR.warning)
            return;
        }
        dispatch(setMessage("Bạn có muốn sao chép các mặt hàng <b>đã chọn</b> không?"))
        setOpenCoppy(true);
    }

    const handleCloseCoppy = () => {
        setOpenCoppy(false);
    }
    const handleCoppy = () => {
        var data = {
            ids: selectionModel,
            donvi: props.userInfo?.user?.donVi,
        }

        if (data.ids.length > 0) {
            dispatch(showLoading(true));
            ProductService.coppyProduct(data).then((res) => {
                dispatch(hideLoading());
                handleSearch();
                setOpenCoppy(false);
                showMessageByType(null, "success", TYPE_ERROR.success)
            }).catch((error) => {
                showMessageByType(error, "error", TYPE_ERROR.error)
                dispatch(hideLoading());
            })
        }
    }
    const handleDelete = () => {
        if (selectionModel.length === 0) {
            showMessageByType(null, "Chọn mặt hàng cần xóa!!", TYPE_ERROR.warning)
            return;
        }
        dispatch(setMessage("Bạn có muốn xóa các mặt hàng <b>đã chọn</b> không?"))
        setOpenDelete(true);
    }

    const handleLoai = (event) => {
        setIdLoaiMH(event.target.value);
    };

    const HandleDanhMuc = (event) => {
        setIdDanhMuc(event.target.value);
    };

    const handleTxtChange = (event) => {
        if (event.target.value === "") {
            setProductFilter(Product);
        }
        setTxtSearch(event.target.value);

    };

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const handleLoadPage = () => {
        handleSearch();
        setIsReload(!isReload);
    }

    const handleRowClick = (params) => {
        setNameRow(params);
        setOpen(false);
        setOpenEdit(true)
    };

    const handleEditClose = () => setOpenEdit(false);

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    }

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
                {/* <Box sx={{ mt: 3, mb: 3 }}>
                    <Grid container justifyContent="flex-end" spacing={3}>
                        <Grid item style={{padding:0}}>
                            <ReadExcel handleLoadPageParent={handleLoadPage} />
                        </Grid>
                        <Grid item style={{padding:0}}>
                            <ExportProducts variant="outlined" sx={{ mr: 1 }} csvData={ProductFilter} fileName='danh-sach-mat-hang' />
                        </Grid>
                    </Grid>
                </Box> */}


                <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        {/* <Grid item xs={12} sm={3} style={{padding:0}}>
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
                                    {DanhMuc.map(x => {
                                        return (
                                            <MenuItem value={x.id}>
                                                <em>{x.ten_DanhMuc}</em>
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3} style={{padding:0}}>
                            <FormControl size="small" fullWidth>
                                <InputLabel id="loaiMatHang-select-small">Loại</InputLabel>
                                <Select
                                    labelId="loaiMatHang-select-small"
                                    id="loaiMatHang-select-small"
                                    label="Loại"
                                    value={id_LoaiMH}
                                    onChange={handleLoai}
                                >
                                    {
                                        loaiMatHang.map(x => {
                                            return (
                                                <MenuItem value={x.no}>
                                                    <em>{x.data}</em>
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4} style={{padding:0}}>
                            <FormControl size="small" fullWidth>
                                <TextField
                                    id="searchTxt"
                                    fullWidth
                                    value={txtSearch}
                                    onChange={handleTxtChange}
                                    label="Tên mặt hàng"
                                    variant="outlined"
                                    placeholder='Tên mặt hàng'
                                    size="small" />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2} style={{padding:0}}>
                            <FormControl size="small" fullWidth>
                                <Button variant="outlined" startIcon={<SearchIcon />} onClick={handleSearch}>
                                    Tìm kiếm
                                </Button>
                            </FormControl>
                        </Grid> */}
                        <Grid item xs={12} sm={12}>
                            <div style={{ height: 300, width: '100%' }}>
                                <DataGrid
                                    // Your existing DataGrid props...
                                    slots={{
                                        toolbar: CustomToolbar,
                                    }}
                                />
                            </div>
                        </Grid>
                        {/* <Grid item xs={12} sm={12}>
                            <Box sx={{ height: 450, width: '100%' }}>
                                <DataGrid
                                    // rows={ProductFilter}
                                    rows={ProductFilter.map((item, index) => ({ stt: index + 1, id: item.id, ...item }))}
                                    columns={columns}
                                    rowsPerPageOptions={[ROWS_PER_PAGE_OPTIONS]}
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
                        </Grid> */}

                    </Grid>
                </Box>

                <Box sx={{ mt: 3, mb: 3 }}>
                    <Grid container justifyContent="flex-end" spacing={2}>
                        <Button variant="outlined" startIcon={<DeleteIcon />} sx={{ mr: 1 }} onClick={handleDelete} color='error' size='small'>Xóa</Button>
                        <Button variant="outlined" startIcon={<SaveIcon />} onClick={handleSaoChep} size='small' sx={{ mr: 1 }}>Coppy</Button>
                        <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={handleOpen} size='small' sx={{ mr: 1 }}>Thêm mới</Button>
                    </Grid>
                </Box>

            </Container>
            {open && <AddProduct open={open} handleClose={handleClose} handleLoadPageParent={handleLoadPage} />}
            {openEdit && <EditProduct open={openEdit} nameRow={nameRow} handleClose={handleEditClose} handleLoadPageParent={handleLoadPage} />}
            <AlertDialogMessage
                open={openDelete}
                handleClose={handleCloseDel}
                title="Xóa Danh Mục"
                callbackFunc={handleDeleteOk}
            />
            <AlertDialogMessage
                open={openCoppy}
                handleClose={handleCloseCoppy}
                title="Sao Chép Mặt Hàng"
                callbackFunc={handleCoppy}
            />
        </ThemeProvider >
    );


}

function mapStateToProps(state) {
    const { message, title } = state.appReducers.message; const { user } = state.appReducers.auth;
    return {
        message,
        userInfo: user,
        title
    };
}

export default connect(mapStateToProps)(Product);