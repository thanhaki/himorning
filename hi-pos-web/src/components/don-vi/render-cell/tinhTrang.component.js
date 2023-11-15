import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import { useDispatch, connect } from 'react-redux';
import DonviService from '../../../services/donvi.service';
import { reFetchData, hideLoading, showLoading} from '../../../actions'
import { showMessageByType } from '../../../helpers/handle-errors';
import { TYPE_ERROR } from '../../../helpers/handle-errors';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const DialogSelect = (props) => {
    const [open, setOpen] = useState(false);
    const [tinhTrang, setTinhTrang] = useState(0);
    const dispatch = useDispatch();

    const propsChild = props.props;
    const handleChange = (event) => {
        setTinhTrang(Number(event.target.value) || 0)
    };

    useEffect(() => {
        setTinhTrang(propsChild.row.maTinhTrang)
    },[]);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleUpdateTT = () => {
        var data = {
            id: propsChild.row.maDonVi,
            tinhTrang: tinhTrang
        }
        dispatch(showLoading(true));
        DonviService.updateTinhTrangDonVi(data).then(() => {
            showMessageByType(null, "Cập nhật tình trạng đơn vị thành công", TYPE_ERROR.success)
            dispatch(hideLoading());
            dispatch(reFetchData(!props.isReFetchData));
            setOpen(false);
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "Cập nhật tình trạng đơn vị không thành công", TYPE_ERROR.error)
        });
    };

    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
        }
    };

    return (
        <div>
            <Button onClick={handleClickOpen}>{propsChild.row.tenTinhTrang} <ArrowDropDownIcon fontSize="small"/></Button>
            <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>Tình Trạng</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={3} sm={3}>
                                <FormControl sx={{ m: 1, minWidth: 220 }} size="small" fullWidth>
                                    <InputLabel id="tinhTrang-select-small">Tình trạng</InputLabel>
                                    <Select
                                        labelId="tinhTrang-select-small"
                                        id="tinhTrang-select-small"
                                        value={tinhTrang}
                                        label="Tình trạng"
                                        autoWidth
                                        onChange={handleChange}
                                    >
                                        {props.listTTDonVi.map((tt) => {
                                            return (<MenuItem key={tt.no} value={tt.no}>{tt.data}</MenuItem>)
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Quay lại</Button>
                    <Button onClick={handleUpdateTT}>Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
function mapStateToProps(state) {
    const { isLoggedIn } = state.appReducers.auth;
    const { listTTDonVi } = state.appReducers.mdata;
    const { isReFetchData } = state.appReducers.message;
    return {
        isLoggedIn,
        isReFetchData,
        listTTDonVi: listTTDonVi ? listTTDonVi : [],
    };
}

export default connect(mapStateToProps)(DialogSelect);