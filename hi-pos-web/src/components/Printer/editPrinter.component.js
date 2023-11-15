import React, { useState, useEffect, useRef } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { showLoading, hideLoading, reFetchData, showFooter } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import { Grid, Button, Box, InputLabel, MenuItem, Select } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveAltOutlined from '@mui/icons-material/SaveAltOutlined';
import { stylesErrorHelper } from '../../consts/modelStyle';
import PrinterService from '../../services/printer.service';
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel';
import FormPrint from './formPrint.component';
import FormControl from '@mui/material/FormControl';

const EditPrinter = (props) => {

  const dispatch = useDispatch()
  const { nameRow } = props;
  const descriptionElementRef = useRef(null);
  const { open, handleClose, getAllPrinters } = props;
  const [printer, setPrinter] = useState({});
  const [language, setLg] = React.useState('vn');
  useEffect(() => {

    if (open) {
      if (nameRow && Object.keys(nameRow).length > 0) {
        setPrinter(nameRow.row);
        setLg(nameRow.row.language);
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

  const handleChange = (event) => {
    setPrinter(printer => ({
      ...printer,
      [event.target.name]: event.target.value,
    }));
  }


  const handleChangeChk = (event) => {
    setPrinter(printer => ({
      ...printer,
      [event.target.name]: event.target.checked,
    }));

    if (event.target.name === 'showFooter') {
      dispatch(showFooter(event.target.checked));
    }
  }
  const handleChangeLangue = (event) => {
    setLg(event.target.value);
  };
  const handleSave = () => {
    dispatch(showLoading(true));
    printer.ip = printer.iP1 + "." + printer.iP2 + "." + printer.iP3 + "." + printer.iP4;

    if (!printer.iP1 || !printer.iP2 || !printer.iP3 || !printer.iP4 || !printer.ip || printer.ip.length > 15) {
      showMessageByType(null, "Ip không hợp lệ vui lòng kiểm tra lại", TYPE_ERROR.error);
      return;
    }

    printer.language = language;
    PrinterService.updatePrinter(printer).then((res) => {
      showMessageByType(null, "Cập nhật máy in thành công", TYPE_ERROR.success)
      if (getAllPrinters) { getAllPrinters(); }
      dispatch(hideLoading());
      handleCancel();
      dispatch(reFetchData(true));
    }).catch((error) => {
      showMessageByType(error, "error", TYPE_ERROR.error)
      dispatch(hideLoading());
    });
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={"paper"}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      component="main" maxWidth="true"
    >
      <DialogTitle id="scroll-dialog-title">CẤU HÌNH MÁY IN</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          {Object.keys(printer).length > 0 &&
            <Box sx={{ flexGrow: 1 }}>
              <Grid xs={12} sm={12} container>
                <Grid xs={12} sm={6} container spacing={0}>
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
                      FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
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
                    {/* <TextField
                      id="iP"
                      fullWidth
                      name='iP'
                      variant="outlined"
                      value={printer.ip}
                      onChange={handleChange}
                      size="small"
                      // type={'number'}
                      FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                    // mask='[0-2][0-9][0-9].[0-2][0-9][0-9].[0-2][0-9][0-9].[0-2][0-9][0-9]'
                    /> */}
                  </Grid>
                  <Grid item xs={6} sm={3}>
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
                      FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                    />
                  </Grid>

                  <Grid xs={12} sm={12} container>
                    <Grid item xs={6} sm={3}>
                      <Typography component={'span'} variant="subtitle1">
                        Số lần in tối đa
                      </Typography>
                      <TextField
                        id="maxNumPrinter"
                        fullWidth
                        name='maxNumPrint'
                        variant="outlined"
                        value={printer.maxNumPrint}
                        onChange={handleChange}
                        size="small"
                        type={'number'}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                      />
                    </Grid>

                    <Grid item xs={0} sm={1}>

                    </Grid>

                    <Grid item xs={6} sm={3}>
                      <Typography component={'span'} variant="subtitle1">
                        Số phiếu 1 lần in
                      </Typography>
                      <TextField
                        id="numPrinters"
                        fullWidth
                        name='numPrints'
                        variant="outlined"
                        value={printer.numPrints}
                        onChange={handleChange}
                        size="small"
                        type={'number'}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                      />
                    </Grid>
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
                      FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                      multiline
                      rows={1}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      value="top"
                      control={<Checkbox
                        id="moKetTien"
                        name='moKetTien'
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={printer.moKetTien ? 1 : 0}
                        // defaultChecked={printer.moKetTien}
                        onChange={handleChangeChk}
                        checked={printer.moKetTien}
                        FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />}
                      label="Mở két tiền"
                      labelPlacement="end"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      value="top"
                      control={<Checkbox
                        id="preview"
                        name='preview'
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={printer.preview}
                        defaultChecked={printer.preview}
                        onChange={handleChangeChk}
                        FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />}
                      label="Xem trước khi in"
                      labelPlacement="end"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      value="top"
                      control={<Checkbox
                        id="inTamTinh"
                        name='inTamTinh'
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={printer.inTamTinh}
                        defaultChecked={printer.inTamTinh}
                        onChange={handleChangeChk}
                        FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />}
                      label="In tạm tính bill"
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      value="top"
                      control={<Checkbox
                        id="inQRThanhToan"
                        name='inQRThanhToan'
                        fullWidth
                        variant="outlined"
                        size="small"
                        checked={printer.inQRThanhToan}
                        onChange={handleChangeChk}
                        value={printer.inQRThanhToan}
                        FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />}
                      label="In mã QR thanh toán"
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography component={'span'} variant="subtitle1">
                      Ngôn ngữ:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={5} style={{ paddingBottom: 2 }}>
                    <FormControl size="small" >
                      <InputLabel id="demo-select-small"></InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={language}
                        onChange={handleChangeLangue}
                      >
                        <MenuItem value={'vn'}>
                          <em>Tiếng Việt</em>
                        </MenuItem>
                        <MenuItem value={'en'}>Tiếng Anh</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <FormControlLabel
                      value="top"
                      control={<Checkbox
                        id="editAddress"
                        name='editAddress'
                        fullWidth
                        variant="outlined"
                        size="small"
                        checked={printer.editAddress}
                        onChange={handleChangeChk}
                        value={printer.editAddress}
                        FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />}
                      label="Thay đổi địa chỉ khi in"
                      labelPlacement="end"
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      id="address"
                      fullWidth
                      name='address'
                      variant="outlined"
                      value={printer.address}
                      disabled={!printer.editAddress}
                      placeholder='địa chỉ thay đổi'
                      onChange={handleChange}
                      size="small"
                      FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                      multiline
                      rows={1}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControlLabel
                      value="top"
                      control={<Checkbox
                        id="showFooter"
                        name='showFooter'
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={printer.showFooter}
                        checked={printer.showFooter}
                        onChange={handleChangeChk}
                        FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />}
                      label="Hiển thị thông tin chân trang hóa đơn"
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      id="infoFooter"
                      fullWidth
                      name='infoFooter'
                      variant="outlined"
                      disabled={!printer.showFooter}
                      value={printer.infoFooter}
                      placeholder='thông tin chân hóa đơn'
                      size="small"
                      onChange={handleChange}
                      FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                      multiline
                      rows={1}
                    />
                  </Grid>
                </Grid>
                <Grid xs={12} sm={6} container spacing={0}>
                  <FormPrint infoFooterParent={printer.infoFooter} addressNew={printer.address} editAddress={printer.editAddress} />
                </Grid>
              </Grid>

            </Box>}
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

export default connect(mapStateToProps)(EditPrinter);