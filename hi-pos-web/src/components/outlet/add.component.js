import React, { useState, useEffect, useRef } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { showLoading, hideLoading } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import { Grid, Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveAltOutlined from '@mui/icons-material/SaveAltOutlined';
import { stylesErrorHelper } from '../../consts/modelStyle';
import OutletService from '../../services/outlet.service';

const AddOutlet = (props) => {
  const dispatch = useDispatch();
  const [outlet, setOutlet] = useState({
    ten_Outlet: '',
    ghiChu: '',
    donVi: 0,
    soLuongBan: 0
  });
  
  const [objError, setObjError] = useState({
    ten_Outlet:'',
    soLuongBan: ''
  });

  const { open, handleClose, getAllOutlet } = props;
  const descriptionElementRef = useRef(null);

  useEffect(() => {
    if (open) {
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
    if (!outlet.ten_Outlet) { 
      setObjError(prev => ({
        ...prev,
        ['ten_Outlet']: "Vui lòng nhập tên khu vực",
      }));
    }
    if (outlet.soLuongBan === 0 || outlet.soLuongBan < 0) { 
      setObjError(prev => ({
        ...prev,
        ['soLuongBan']: "Vui lòng nhập số lượng vị trí",
      }));
    }
    if (outlet.soLuongBan < 0 || outlet.soLuongBan === 0 || outlet.ten_Outlet.length === 0) { return; }

    outlet.donVi = props.userInfo?.user?.donVi;
    dispatch(showLoading(true));
    OutletService.addOutlet(outlet).then((res) => {
      showMessageByType(null, "Thêm outlet thành công", TYPE_ERROR.success)
      if (getAllOutlet) { getAllOutlet(); }
      dispatch(hideLoading());
      handleCancel();
    }).catch((error) => {
      showMessageByType(error, "error", TYPE_ERROR.error)
      dispatch(hideLoading());
    });
  }

  const handleChange = (e) => {
    setOutlet(prev => ({
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
      <DialogTitle id="scroll-dialog-title">TẠO KHU VỰC</DialogTitle>
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
                  Tên khu vực
                </Typography>
                <TextField
                  id="ten_outLet"
                  fullWidth
                  name='ten_Outlet'
                  variant="outlined"
                  value={outlet.ten_Outlet}
                  onChange={handleChange}
                  size="small"
                  error={objError.ten_Outlet}
                  helperText={objError.ten_Outlet}
                  FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography component={'span'} variant="subtitle1">
                  Số lượng vị trí
                </Typography>
                <TextField
                  id="soLuongBan"
                  fullWidth
                  name='soLuongBan'
                  variant="outlined"
                  value={outlet.soLuongBan}
                  onChange={handleChange}
                  size="small"
                  type={'number'}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                  error={objError.soLuongBan}
                  helperText={objError.soLuongBan}
                  FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography component={'span'} variant="subtitle1">
                  Ghi chú
                </Typography>
                <TextField
                  id="ghiChu"
                  fullWidth
                  name='ghiChu'
                  variant="outlined"
                  value={outlet.ghiChu}
                  onChange={handleChange}
                  size="small"
                  FormHelperTextProps={{ style: stylesErrorHelper.helper }}
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
  const { isReFetchData } = state.appReducers.message;
  const { user } = state.appReducers.auth;
  return {
    message,
    isReFetchData,
    userInfo: user
  };
}

export default connect(mapStateToProps)(AddOutlet);