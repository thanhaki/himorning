import React, { useState, useEffect, useRef } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { Typography, TextField, Box, Button } from '@mui/material';
import { connect } from "react-redux";
import menuService from '../../services/menu.service';
import { showLoading, hideLoading, setThucDon, reFetchData } from "../../actions/index";
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import RenderDeleteCell from './renderdel.component';
import EditListProduct from './listProductMenu.component'
import { Grid } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon';
import { formatMoney } from '../../helpers/utils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const RenderDeleteCellBtn = (props) => {
    return <RenderDeleteCell props={props} />
}

const renderImage = (props) => {
    const { value } = props;
    return <img src={value} width="30px" height="30px" />
}

const columns = [
    // { field: 'id', headerName: '', width: 20 },
    {
        field: 'checked', headerName: '', width: 100,
        sortable: false,
        disableColumnMenu: true,
        // renderHeader: (params) => (
        //     <Checkbox checked={true} value={params.selectedAll} onChange />
        // ),
        renderCell: (params) => (
            <Checkbox checked={params.isChecked} value={params.isChecked} />
        )
    },
    {
        field: 'hinhAnh_MH',
        headerName: 'Hình ảnh',
        width: 150,
        renderCell: renderImage
    },
    {
        field: 'ten_MH',
        headerName: 'Tên mặt hàng',
        width: 250,
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
    {
        field: '',
        headerName: 'Chức năng',
        width: 150,
        renderCell: RenderDeleteCellBtn,
        align: 'center'
    },
];

const EditMenuItem = (props) => {
    const { open, handleClose, handleLoadPageParent } = props;
    const [selectedValueIcon, setSelectedValueIcon] = React.useState('color');
    const { nameRow } = props;
    const dispatch = useDispatch()
    const descriptionElementRef = useRef(null);
    const [selectionModel, setSelectionModel] = useState([]);
    let [Product, setProduct] = useState([]);
    let [ProductFilter, setProductFilter] = useState([]);
    const [tenThucDon, setTenThucDon] = useState('');
    const [tenThucDonOld, setTenThucDonOld] = useState('');
    const [txtSearch, setTxtSearch] = useState('');
    const [openEditListProduct, setOpenEditListProduct] = useState(false);
    const [isReload, setIsReload] = useState(false);

    useEffect(() => {
        if (open || props.isReFetchData) {
            if (nameRow && Object.keys(nameRow).length > 0) {
                setTenThucDon(nameRow.ten_TD);
                setTenThucDonOld(nameRow.ten_TD);
                dispatch(setThucDon(nameRow));
                loadData();
            }
    
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
            dispatch(reFetchData(false));
        }

    }, [open,props.isReFetchData])

    const loadData = () => {
        var data = {
            id: nameRow.id,
            donVi: props.userInfo?.user?.donVi,
        }
        dispatch(showLoading(true));
        menuService.GetAllThucDonMatHangById(data).then((result) => {
            setProductFilter(result.data);
            dispatch(reFetchData(false));
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error);
        })
    }
    const handleSearch = () => {

        setOpenEditListProduct(true);
    }

    const HandleTenThucDon = (event) => {
        setTenThucDon(event.target.value);
    };

    const handleCancel = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        if (handleClose) { handleClose() }
    }
    const handleChangeIcon = (event) => {
        setSelectedValueIcon(event.target.value);
    };

    const handleUpdate = () => {
        var data = {
            ma_TD: props.thucdon.id,
            Ten_TD: tenThucDon,
            hinhAnh_TD: '',
            ids: selectionModel,
            sort: 0,
        }
        if (tenThucDon !== tenThucDonOld || selectionModel.length > 0) {
            dispatch(showLoading(true));
            //add mat hang + thuc don 
            menuService.updateThucDon(data).then((res) => {
                dispatch(hideLoading());
                showMessageByType(null, "success", TYPE_ERROR.success)
                if (handleLoadPageParent) { handleLoadPageParent(); }
                if (handleClose) { handleClose() }
            }).catch((error) => {
                showMessageByType(error, "error", TYPE_ERROR.error)
                dispatch(hideLoading());
            })
        }
    }
    const handleTxtChange = (event) => {
        if (event.target.value === "") {
            setProductFilter(Product);
        }
        setTxtSearch(event.target.value);

    };

    const handleEditClose = () => {
        setOpenEditListProduct(false);
        loadData();
    }
    const handleLoadPage = () => {
        setIsReload(!isReload);
    }
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleCancel}
                scroll={"paper"}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                maxWidth="md"
            >
                <DialogTitle id="scroll-dialog-title">Sửa thực đơn</DialogTitle>
                <Grid container>

                    <Grid item xl={12} xs={12}>
                        <DialogContent dividers={true}>
                            <DialogContentText
                                id="scroll-dialog-description"
                                ref={descriptionElementRef}
                                tabIndex={-1}
                            >
                                <Box sx={{ flexGrow: 1 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                id="tenThucDon"
                                                label="Tên thực đơn"
                                                fullWidth
                                                value={tenThucDon}
                                                onChange={HandleTenThucDon}
                                                variant="outlined"
                                                size="small" />
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <TextField
                                                id="searchTxt"
                                                fullWidth
                                                label="Tìm kiếm mặt hàng, combo, khuyến mại"
                                                value={txtSearch}
                                                onChange={handleTxtChange}
                                                variant="outlined"
                                                placeholder='Tên mặt hàng'
                                                size="small" />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Button variant="outlined" fullWidth startIcon={<SendIcon />} onClick={handleSearch} size="medium">Tìm kiếm</Button>
                                        </Grid>


                                        <Grid item xs={12} sm={12}>
                                            <Box sx={{ height: 400, width: '100%' }}>
                                                <DataGrid
                                                    rows={ProductFilter}
                                                    columns={columns}
                                                    // columns={[{ filterOperators}]}
                                                    pageSize={5}
                                                    rowsPerPageOptions={[ROWS_PER_PAGE_OPTIONS]}
                                                    editingMode="modal"
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
                                <Grid item xs={12} sm={12} >
                                    <DialogActions>
                                        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleCancel} size="small">Đóng</Button>
                                        <Button variant="outlined" startIcon={<SendIcon />} onClick={handleUpdate} size="small">Lưu</Button>
                                    </DialogActions>
                                </Grid>
                            </DialogContentText>
                        </DialogContent>
                    </Grid>
                </Grid>
                {openEditListProduct && <EditListProduct open={openEditListProduct} nameSearch ={txtSearch} nameRow={nameRow} handleClose={handleEditClose} handleLoadPageParent={handleLoadPage} />}
            </Dialog>

        </div>

    );
};

function mapStateToProps(state) {
    const { message } = state.appReducers;
    const { user } = state.appReducers.auth;
    const { thucdon } = state.appReducers.thucdon;
    const { isReFetchData } = state.appReducers.message;
    return {
        message,
        userInfo: user,
        thucdon,
        isReFetchData
    };
}

export default connect(mapStateToProps)(EditMenuItem);