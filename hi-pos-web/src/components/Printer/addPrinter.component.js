import React, { useState, useEffect, useRef } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import { Grid, Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveAltOutlined from '@mui/icons-material/SaveAltOutlined';
import { stylesErrorHelper } from '../../consts/modelStyle';
import PrinterService from '../../services/printer.service';
import Checkbox from '@mui/material/Checkbox'

const AddPrinter = (props) => {
  const dispatch = useDispatch();
  const [checked, setChecked] = React.useState(true);
  const [printer, setPrinter] = useState({
    ten_Printer: '',
    ghiChu: '',
    donVi: 0,
    iP1: '',
    iP2: '',
    iP3: '',
    iP4: '',
    ip: ''
  });

  const [objError, setObjError] = useState({
    ten_Printer: ''
  });

  const { open, handleClose, getAllPrinters } = props;
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
    if (!printer.ten_Printer) {
      setObjError(prev => ({
        ...prev,
        ['ten_Printer']: "Vui lòng nhập tên máy in",
      }));
      return;
    }

    printer.ip = printer.iP1 + "." + printer.iP2 + "." + printer.iP3 + "." + printer.iP4;
    if (!printer.iP1 || !printer.iP2 || !printer.iP3 || !printer.iP4 || !printer.ip || printer.ip.length > 15) {
      setObjError(prev => ({
        ...prev,
        ['ip']: "Ip không hợp lệ vui lòng kiểm tra lại",
      }));
      return;
    }

    printer.donVi = props.userInfo?.user?.donVi;
    dispatch(showLoading(true));
    PrinterService.addPrinter(printer).then((res) => {
      showMessageByType(null, "Thêm máy in thành công", TYPE_ERROR.success)
      if (getAllPrinters) { getAllPrinters(); }
      dispatch(hideLoading());
      handleCancel();
      // set reload data = true
      dispatch(reFetchData(true));
    }).catch((error) => {
      showMessageByType(error, "Lỗi thêm máy In", TYPE_ERROR.error)
      dispatch(hideLoading());
    });
  }

  const handleChange = (e) => {
    setPrinter(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  const handleCheckBoxChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={"paper"}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">TẠO MÁY IN</DialogTitle>
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
                  Tên máy in
                </Typography>
                <TextField
                  id="ten_Printer"
                  fullWidth
                  name='ten_Printer'
                  variant="outlined"
                  value={printer.ten_Printer}
                  onChange={handleChange}
                  size="small"
                  error={objError.ten_Printer}
                  helperText={objError.ten_Printer}
                  FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                />
              </Grid>

              <Grid item xs={12} sm={12} sx={{ pb: 0 }}>
                <Typography component={'span'} variant="subtitle1">
                  IP
                </Typography>
                <Box>
                  <TextField
                    id="iP1"
                    name='iP1'
                    sx={{ width: '70px' }}
                    variant="outlined"
                    value={printer.iP1}
                    onChange={handleChange}
                    size="small"
                    mask='[0-2][0-9][0-9].[0-2][0-9][0-9].[0-2][0-9][0-9].[0-2][0-9][0-9]'
                    inputProps={{ maxLength: 3 }}
                    tabIndex={0}
                  />
                  <TextField
                    id="iP2"
                    name='iP2'
                    sx={{ width: '70px' }}
                    variant="outlined"
                    value={printer.iP2}
                    onChange={handleChange}
                    size="small"
                    mask='[0-2][0-9][0-9].[0-2][0-9][0-9].[0-2][0-9][0-9].[0-2][0-9][0-9]'
                    inputProps={{ maxLength: 3 }}
                    tabIndex={1}
                  />
                  <TextField
                    id="iP3"
                    name='iP3'
                    sx={{ width: '70px' }}
                    variant="outlined"
                    value={printer.iP3}
                    onChange={handleChange}
                    size="small"
                    mask='[0-2][0-9][0-9].[0-2][0-9][0-9].[0-2][0-9][0-9].[0-2][0-9][0-9]'
                    inputProps={{ maxLength: 3 }}
                    tabIndex={2}
                  />
                  <TextField
                    id="iP4"
                    name='iP4'
                    sx={{ width: '70px' }}
                    variant="outlined"
                    value={printer.iP4}
                    onChange={handleChange}
                    size="small"
                    mask='[0-2][0-9][0-9].[0-2][0-9][0-9].[0-2][0-9][0-9].[0-2][0-9][0-9]'
                    inputProps={{ maxLength: 3 }}
                    tabIndex={3}
                  />

                </Box>
                {objError.ip && <Box>
                  <Typography component={'span'} variant="subtitle1" color={'red'}>
                    {objError.ip}
                  </Typography>
                </Box>}
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography component={'span'} variant="subtitle1">
                  Port
                </Typography>
                <TextField
                  id="port"
                  fullWidth
                  name='port'
                  variant="outlined"
                  value={printer.port}
                  onChange={handleChange}
                  size="small"
                  type={'number'}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  error={objError.port}
                  helperText={objError.port}
                  FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography component={'span'} variant="subtitle1">
                  Mở két tiền
                </Typography>
                <Checkbox
                  id="moKetTien"
                  name='moKetTien'
                  fullWidth
                  variant="outlined"
                  size="small"
                  value="true"
                  onChange={handleCheckBoxChange}
                  error={objError.moKetTien}
                  helperText={objError.moKetTien}
                  FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                  inputProps={{ 'aria-label': 'controlled' }}
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
                  value={printer.ghiChu}
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
  return {
    message,
    userInfo: user
  };
}

export default connect(mapStateToProps)(AddPrinter);