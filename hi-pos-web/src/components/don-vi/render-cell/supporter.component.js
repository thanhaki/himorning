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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { showMessageByType } from '../../../helpers/handle-errors';
import { TYPE_ERROR } from '../../../helpers/handle-errors';
const DialogSelectSupporter = (props) => {
    const [open, setOpen] = useState(false);
    const [supporter, setSupporter] = useState(0);
    const dispatch = useDispatch();

    const propsChild = props.props;
    const supporterCurrent = propsChild.row.supporter;
    const handleChange = (event) => {
        setSupporter(Number(event.target.value) || 0)
    };

    useEffect(() => {
        if (supporterCurrent) {
            setSupporter(supporterCurrent.ma_Saler);
        }
    },[]);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleUpdateSupport = () => {
        var data = {
            id: propsChild.row.maDonVi,
            supporter: supporter
        }
        dispatch(showLoading(true));
        DonviService.updateSupporterDonVi(data).then(() => {
            showMessageByType(null, "Cập nhật tình trạng đơn vị thành công", TYPE_ERROR.success)
            dispatch(hideLoading());
            dispatch(reFetchData(!props.isReFetchData));
            setOpen(false);
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "Cập nhật tình trạng không thành công", TYPE_ERROR.error)
        });
    };

    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
        }
    };

    return (
        <div>
            
            {supporterCurrent !== null && <Button onClick={handleClickOpen}>{supporterCurrent.ten_Saler} <ArrowDropDownIcon fontSize="small"/></Button>}
            {supporterCurrent === null && <Button onClick={handleClickOpen}><ArrowDropDownIcon fontSize="small"/></Button>}
            <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>Supporter</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={3} sm={3}>
                                <FormControl sx={{ m: 1, minWidth: 220 }} size="small" fullWidth>
                                    <InputLabel id="supporter-select-small">Supporter</InputLabel>
                                    <Select
                                        labelId="supporter-select-small"
                                        id="supporter-select-small"
                                        value={supporter}
                                        label="Supporter"
                                        autoWidth
                                        onChange={handleChange}
                                    >
                                        {props.listSalers.map((tt) => {
                                            return (<MenuItem key={tt.ma_Saler} value={tt.ma_Saler}>{tt.ten_Saler}</MenuItem>)
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Quay lại</Button>
                    <Button onClick={handleUpdateSupport}>Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
function mapStateToProps(state) {
    const { isLoggedIn } = state.appReducers.auth;
    const { listSalers } = state.appReducers.mdata;
    const { isReFetchData } = state.appReducers.message;
    return {
        isLoggedIn,
        isReFetchData,
        listSalers: listSalers ? listSalers : [],
    };
}

export default connect(mapStateToProps)(DialogSelectSupporter);