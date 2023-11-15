import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Divider, Grid } from '@mui/material';
import { formatMoney } from '../../helpers/utils';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveAltOutlined from '@mui/icons-material/SaveAltOutlined';
import PlusMinusQuantity from './control/action-plus-minus.component';
import { hideLoading, showLoading, updateMenuOrder } from '../../actions';
import InputChietKhau from './control/input-chiet-khau.component';
import { Box } from '@mui/system';
import { FORMAT_HH_MM_DD_MM_YYYY, GIA_TRI_CHIET_KHAU, TINH_TIEN_THEO_THOI_GIAN } from '../../consts/constsCommon';
import { calculatorAmountAfterChietKhau, returnFormatTimeUsed, thoiGianTamTinh } from './calculator-money';
import moment from 'moment';
import EditTimeMatHang from './control/edit-time.component';
import LockClockIcon from '@mui/icons-material/LockClock';
import postbillService from '../../services/postbill.service';
import { showMessageByType, TYPE_ERROR } from '../../helpers/handle-errors';

const ChiecKhauMatHangDialog = (props) => {
  const { open, handleClose, mathang,reloadAfterStopTime, datePayment } = props;
  const [matHang, setMatHang] = useState({});
  const [chietKhau, setChietKhau] = useState({});
  const [openChangeTimer, setOpenChangeTimer] = useState(false);
  const [openInputCK, setOpenInputCK] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const defaultData = {
    loaiCk: 1,
    valueCk: '0'
  }

  useEffect(() => {
    setMatHang(mathang);
    if (mathang.chietKhau) {
      setChietKhau(mathang.chietKhau);
    } else {
      setChietKhau(defaultData);
    }
  }, [open, mathang]);

  useEffect(() => {
    const item = props.orderNewList?.find(x => x.id === matHang.id);
    if (item) {
      setMatHang(item);
      if (item.chietKhau) {
        setChietKhau(item.chietKhau);
      } else {
        setChietKhau(defaultData);
      }
    } else {
      setMatHang({});
      setChietKhau(defaultData);
    }
  }, [props.orderNewList]);

  const handleCls = () => {
    setChietKhau(defaultData);
    if (handleClose) { handleClose() };
  };

  const renderPlusAction = (props) => {
    return <PlusMinusQuantity rowData={props} soLuong={props.soLuong} />
  }

  const handleChangeGhiChu = (e) => {
    setMatHang(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  const handleUpdateChiecKhau = () => {
    dispatch(updateMenuOrder({ id: matHang.id, soLuong: 0, gia_Ban: 0, ghiChu: matHang.ghiChu }));
    handleCls();
  }

  const handleShowPopupChietKhau = () => {
    setOpenInputCK(true)
  }

  const handleHidePopupChietKhau = () => {
    setOpenInputCK(false);
  }

  const handleHidePopupChangeTimer = () => {
    setOpenChangeTimer(false);
  }

  const showCkMatHang = () => {
    if (!chietKhau || Object.keys(chietKhau).length === 0) {
      if (chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.PHAN_TRAM) {
        return '0%';
      }

      if (chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.SO_TIEN) {
        return '0đ';
      }
    } else {
      const value = parseFloat(chietKhau.valueCk);

      if (chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.PHAN_TRAM) {
        return value + '%'
      }

      if (chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.SO_TIEN) {
        return formatMoney(value) + ' đ';
      }
    }
    return '0%'
  }

  const handleChangeTimer = (event) => {
    setOpenChangeTimer(true);
  }

  const handleStopTimer = (event) => {
    var data = {
      orderedList: props.orderNewList,
      chietKhau: props.chietKhauBill,
      tableNo: props.table.id,
      loaiDonHang: props.loaiDonHang,
      soDonHang: props.orderedList.soDonHang,
      maDonHang: props.orderedList.maDonHang,
      timestamp: props.orderedList.timestamp,
      maKhachHang: props.customer && props.customer.ma_KH ? props.customer.ma_KH : 0,
      ghiChu: props.orderedList.ghiChu,
      tamNgungTinhGio: true
    }
    dispatch(showLoading(true));
    postbillService.createOrder(data).then((res) => {
      if (reloadAfterStopTime) {
        reloadAfterStopTime(true);
      }
      dispatch(hideLoading());
      showMessageByType(null, "Tạm ngưng tính giờ thành công", TYPE_ERROR.success);
    }).catch((error) => {
      dispatch(hideLoading());
      showMessageByType(error, "Cập nhật đơn hàng không thành công", TYPE_ERROR.error)
    })
  }

  return (
    <Box>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleCls}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" align='center'>
          {"Mặt hàng "} <i>{matHang.ten_MH}</i>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={1}>
              {matHang && matHang.id_LoaiMH !== TINH_TIEN_THEO_THOI_GIAN && <>
                <Grid item xs={6} sm={6}>
                  <Typography variant="subtitle2" component="div">
                    Giá bán:
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} textAlign='right'>{formatMoney(calculatorAmountAfterChietKhau(matHang))}</Grid>
              </>}

              <Grid item xs={12} sm={12}>
                <TextField
                  id="outlined-textarea"
                  label="Ghi chú"
                  placeholder="Ghi chú"
                  multiline
                  name='ghiChu'
                  value={matHang.ghiChu}
                  onChange={handleChangeGhiChu}
                  rows={2}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <Typography variant="subtitle2" component="div">
                  Chiết khấu
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6} textAlign='right'>
                <Button variant='text' sx={{ textTransform: 'none' }} onClick={handleShowPopupChietKhau}>
                  {showCkMatHang()}
                </Button>
              </Grid>
              {matHang && matHang.id_LoaiMH !== TINH_TIEN_THEO_THOI_GIAN && <Grid item xs={12} sm={12} textAlign='center'>
                {renderPlusAction(matHang)}
              </Grid>
              }
              {matHang && matHang.id_LoaiMH === TINH_TIEN_THEO_THOI_GIAN && <>
                <Grid item xs={6} sm={6}>
                  <Typography variant="subtitle2" component="div">
                    <b>Thông tin tính tiền: </b>
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} textAlign='right'>
                  {formatMoney(calculatorAmountAfterChietKhau(matHang))}
                </Grid>
              </>}
              {matHang && matHang.id_LoaiMH === TINH_TIEN_THEO_THOI_GIAN && <Grid item xs={12} sm={12} textAlign='left'>
                <Divider />
                <Typography variant="caption" component="h2">
                  <b>Giờ vào: </b>{moment(matHang?.gioVao).format(FORMAT_HH_MM_DD_MM_YYYY)}
                </Typography>
                <Typography variant="caption" component="h2">
                  <b>Tạm tính đến: </b>{thoiGianTamTinh(matHang)}
                </Typography>
                <Typography variant="caption" component="h2">
                  <b>Đã sử dụng: </b>{returnFormatTimeUsed(matHang, datePayment)}
                </Typography>
                <Divider />
                <Button fullWidth={false} size='small' sx={{ p: 0 }} onClick={handleChangeTimer}>Điều chỉnh thời gian</Button>
              </Grid>}
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant='outlined' startIcon={<ArrowBackIcon />} onClick={handleCls} size='small'>
            Quay lại
          </Button>
          {matHang && matHang.id_LoaiMH === TINH_TIEN_THEO_THOI_GIAN &&
            <Button autoFocus variant='outlined' startIcon={<LockClockIcon />} color='warning' onClick={handleStopTimer} size='small'>
              Tạm ngưng tính giờ
            </Button>}
          <Button onClick={handleUpdateChiecKhau} autoFocus variant='contained' startIcon={<SaveAltOutlined />} size='small'>
            Hoàn tất
          </Button>
        </DialogActions>
      </Dialog>
      <InputChietKhau
        open={openInputCK}
        matHang={matHang}
        handleClose={handleHidePopupChietKhau}
      />
      <EditTimeMatHang
        open={openChangeTimer}
        matHang={matHang}
        handleClose={handleHidePopupChangeTimer}
        reloadOrdred={reloadAfterStopTime}
      />
    </Box >
  );
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.appReducers.auth;
  const { user } = state.appReducers.auth;
  const { orderNewList, chietKhauBill, orderedList, loaiDonHang } = state.appReducers.thucdon;
  const { table } = state.appReducers.setupTbl;
  const { customer } = state.appReducers.customer;

  return {
    isLoggedIn,
    userInfo: user,
    orderNewList,
    orderedList,
    chietKhauBill,
    table,
    loaiDonHang,
    customer
  };
}

export default connect(mapStateToProps)(ChiecKhauMatHangDialog);