import React, { useState, useEffect } from 'react';
import { DialogActions, Dialog, Button, TextField, Typography, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveAltOutlined from '@mui/icons-material/SaveAltOutlined';
export default function UpdateDialog(props) {
    const { open, handleClose, callbackFunc, table } = props
    const [tblConfig, setTblConfig] = useState({});
    useEffect(() => {
        if (table) {
            setTblConfig(table);
        }
    }, [table])

    const handleCls = (event, reason) => {
        if (!reason) {
            if (handleClose) { handleClose();}
        }
    };

    const handleCallBack = () => {
        if (callbackFunc) { callbackFunc(tblConfig); }
    }
    const handleChange = (e) => {
        setTblConfig(prev => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      }
    return (
        <Dialog
            open={open}
            onClose={handleCls}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Thông vị trí"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <Typography component={'span'} variant="subtitle1">
                                Vị trí
                            </Typography>
                            <TextField
                                id="tableName"
                                fullWidth
                                name='tableName'
                                variant="outlined"
                                value={tblConfig.tenBan}
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography component={'span'} variant="subtitle1">
                                Miêu tả
                            </Typography>
                            <TextField
                                id="mieuTaBan"
                                fullWidth
                                name='mieuTaBan'
                                variant="outlined"
                                value={tblConfig.mieuTaBan}
                                onChange={handleChange}
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleCls} size="small">Quay lại</Button>
                <Button variant="contained" startIcon={<SaveAltOutlined />} onClick={handleCallBack} size="small">Lưu </Button>
            </DialogActions>
        </Dialog>
    );
}