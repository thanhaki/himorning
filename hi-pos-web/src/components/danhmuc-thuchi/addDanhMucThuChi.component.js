import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Select, TextField, FormControl, MenuItem, InputLabel, Box, Button, Grid, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveAltOutlined from '@mui/icons-material/SaveAltOutlined';
import { stylesErrorHelper } from '../../consts/modelStyle';
import DanhMucThuChiService from '../../services/danhMucThuChi.service';

const AddDanhMucThuChi = (props) => {
    const dispatch = useDispatch();
    const [danhMucThuChi, setDanhMucThuChi] = useState({loai_DanhMucThuChi: 105});
    const { nameRow } = props;
    const { open, handleClose, getAllDataDanhMucThuChi } = props;
    const descriptionElementRef = useRef(null);
    const [objError, setObjError] = useState({
        ten_DanhMucThuChi: ''
    });
    useEffect(() => {
        if (open) {

            if (nameRow && Object.keys(nameRow).length > 0) {
                setDanhMucThuChi(nameRow.row);
              }

            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const handleCancel = () => {
        if (handleClose) { handleClose(); }
    }

    const handleSave = () => {
        if (!danhMucThuChi.ten_DanhMucThuChi) {
            setObjError(prev => ({
                ...prev,
                ['ten_DanhMucThuChi']: "Vui lòng nhập tên danh mục thu chi",
            }));
        }

        danhMucThuChi.donVi = props.userInfo?.user?.donVi;
        dispatch(showLoading(true));

        //Case add
        if(danhMucThuChi.maDanhMucThuChi == undefined){
            DanhMucThuChiService.addDanhMucThuChi(danhMucThuChi).then((res) => {
                showMessageByType(null, "Thêm danh mục thành công", TYPE_ERROR.success)
                if (getAllDataDanhMucThuChi) { getAllDataDanhMucThuChi(); }
                dispatch(hideLoading());
                handleCancel();
                // set reload data = true
                dispatch(reFetchData(true));
            }).catch((error) => {
                showMessageByType(error, "Lỗi thêm danh mục thu chi", TYPE_ERROR.error)
                dispatch(hideLoading());
            });
        }
        //Case update
        else{
            DanhMucThuChiService.updateDanhMucThuChi(danhMucThuChi).then((res) => {
                showMessageByType(null, "Cập nhật danh mục thành công", TYPE_ERROR.success)
                if (getAllDataDanhMucThuChi) { getAllDataDanhMucThuChi(); }
                dispatch(hideLoading());
                handleCancel();
                // set reload data = true
                dispatch(reFetchData(true));
            }).catch((error) => {
                showMessageByType(error, "Lỗi cập nhật danh mục thu chi", TYPE_ERROR.error)
                dispatch(hideLoading());
            });
        }
    }

    const handleChange = (e) => {
        setDanhMucThuChi(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={"paper"}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">TẠO DANH MỤC THU CHI</DialogTitle>
            <DialogContent dividers={true}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <Typography component={'span'} variant="subtitle1">
                                    Loại danh mục
                                </Typography>
                                <FormControl size="small" fullWidth>
                                    {danhMucThuChi.loai_DanhMucThuChi && <Select
                                        labelId="loai-DanhMucThuChi-select-small"
                                        id="loai-DanhMucThuChi-select-small"
                                        name='loai_DanhMucThuChi'
                                        value={danhMucThuChi.loai_DanhMucThuChi}
                                        onChange={handleChange}
                                    >
                                        {props.loaiDanhMucThuChi.map((x) => {
                                            return (<MenuItem value={x.no}><em>{x.data}</em></MenuItem>)
                                        })}
                                    </Select>
                                    }
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Typography component={'span'} variant="subtitle1">
                                    Tên danh mục
                                </Typography>
                                <TextField
                                    id="ten_DanhMucThuChi"
                                    fullWidth
                                    name='ten_DanhMucThuChi'
                                    variant="outlined"
                                    value={danhMucThuChi.ten_DanhMucThuChi}
                                    onChange={handleChange}
                                    size="small"
                                    error={objError.ten_DanhMucThuChi}
                                    helperText={objError.ten_DanhMucThuChi}
                                    FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Typography component={'span'} variant="subtitle1">
                                    Miêu tả
                                </Typography>
                                <TextField
                                    id="ghiChu_DanhMucThuChi"
                                    fullWidth
                                    name='ghiChu_DanhMucThuChi'
                                    variant="outlined"
                                    value={danhMucThuChi.ghiChu_DanhMucThuChi}
                                    onChange={handleChange}
                                    size="small"
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleCancel} size="small">Đóng</Button>
                <Button variant="contained" startIcon={<SaveAltOutlined />} onClick={handleSave} size="small">Lưu</Button>
            </DialogActions>
        </Dialog>
    );
}

function mapStateToProps(state) {
    const { message } = state.appReducers;
    const { user } = state.appReducers.auth;
    const { loaiDanhMucThuChi } = state.appReducers.mdata;
    return {
        message,
        userInfo: user,
        loaiDanhMucThuChi: loaiDanhMucThuChi ? loaiDanhMucThuChi : [],
    };
}

export default connect(mapStateToProps)(AddDanhMucThuChi);