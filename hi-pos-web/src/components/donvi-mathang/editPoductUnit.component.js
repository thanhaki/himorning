import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ProductService from '../../services/product.service';
import { connect } from "react-redux";
import {
    Grid,
} from '@mui/material';
import productUnitService from '../../services/productUnit.service';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const columns = [
    {
        field: 'ten_MH',
        headerName: 'Tên mặt hàng',
        width: 150,
        editable: true,
        align: 'left'
    },
];

const EditPoductUnit = (props) => {
    const { open, handleClose, handleLoadPageParent } = props;
    const dispatch = useDispatch()
    const { nameRow } = props;
    let [Product, setProduct] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [donVi, setDonVi] = useState({});
    const [tenDonVi, setTenDonVi] = useState('');
    const [tenDonViOld, setTenDonViOld] = useState('');
    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (open) {
            if (nameRow && Object.keys(nameRow).length > 0) {
                setDonVi(nameRow.row);
                setTenDonVi(nameRow.row.ten_DonVi);
                setTenDonViOld(nameRow.row.ten_DonVi);
                var data = {
                    ma_DonVi: nameRow.row.id,
                    donVi: props.userInfo?.user?.donVi,
                }
                dispatch(showLoading(true));
                ProductService.GetMatHangByIdDonViMatHang(data).then((result) => {
                    setProduct(result.data);
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
    }, [open]);

    const handleUpdate = () => {
        var data = {
            ma_DonVi: donVi.id,
            Ten_DonVi: tenDonVi
        }
        if (tenDonVi !== tenDonViOld) {
            dispatch(showLoading(true));
            productUnitService.updateProductUnit(data).then((res) => {
                dispatch(hideLoading());
                showMessageByType(null, "success", TYPE_ERROR.success)
                setTenDonVi('');
                if (handleLoadPageParent) { handleLoadPageParent(); }
            }).catch((error) => {
                showMessageByType(error, "error", TYPE_ERROR.success)
                setTenDonVi('');
                dispatch(hideLoading());
            })
        }
        if (handleClose) { handleClose(); }
    }

    const handleCancel = () => {
        if (handleClose) { handleClose() }
    }
    const HandleDonVi = (event) => {
        setTenDonVi(event.target.value);
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={"paper"}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Sửa đơn vị</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={12}>
                                    <Typography variant="subtitle1" style={{fontWeight: "bold"}}>
                                        Tên đơn vị
                                    </Typography>
                                    <TextField
                                        id="TenhDonVi"
                                        fullWidth
                                        value={tenDonVi}
                                        onChange={HandleDonVi}
                                        variant="outlined"
                                        size="small" />
                                    {/* {React.useMemo(() => {
                                        return ()

                                    }, [tenDonVi])} */}

                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Typography variant="subtitle1" style={{fontWeight: "bold"}}>
                                        Sử dụng làm đơn vị của:
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Box sx={{ height: 250, width: '100%' }}>
                                        <DataGrid
                                            rows={Product}
                                            columns={columns}
                                            pageSize={5}
                                            rowsPerPageOptions={[5]}
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
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleCancel} size="small">Đóng</Button>
                    <Button variant="outlined" startIcon={<SendIcon />} onClick={handleUpdate} size="small">Lưu</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

function mapStateToProps(state) {
    const { message } = state.appReducers;
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    return {
        message,
        isReFetchData,
        userInfo: user
    };
}

export default connect(mapStateToProps)(EditPoductUnit);

