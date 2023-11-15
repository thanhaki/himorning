import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import Paper from '@mui/material/Paper';
import { formatMoney } from '../../../helpers/utils';
import PlusMinusQuantity from './action-plus-minus.component';
import ChiecKhauMatHangDialog from '../chiet-khau-mat-hang.component';
import { TableBody, Table, TableHead, TableRow, Box, TableContainer, TableCell, Button } from '@mui/material';
import { FORMAT_DD_MM_YYYY, FORMAT_HH_MM_DD_MM_YYYY, GIA_TRI_CHIET_KHAU, TINH_TIEN_THEO_THOI_GIAN } from '../../../consts/constsCommon';
import { calculatorAmountAfterChietKhau, calculatorChietKhauRow, returnAmountMHTheoGio, returnFormatTimeUsed, thoiGianTamTinh } from '../calculator-money';
import Typography from '@mui/material/Typography';
import PostbillService from '../../../services/postbill.service';
import { showMessageByType } from '../../../helpers/handle-errors';
import { TYPE_ERROR } from '../../../helpers/handle-errors';
import { setOrderNewList, setTotalAmount, setOrderedList, setChietKhauBill, setLoaiDonHang, reFetchData, showLoading, hideLoading, reloadDataOrdered } from '../../../actions';
import moment from 'moment';
import { string } from 'yup';

const renderPlusAction = (props) => {
  return <PlusMinusQuantity rowData={props} />
}

const DataTableOrder = (props) => {
  const [qty, setQty] = useState(0);
  const [amount, setAmount] = useState(0);
  const [sotienChietKhau, setSoTienChietKhau] = useState(0);
  const [open, setOpen] = useState(false);
  const [matHangSelected, setMHSelected] = useState({});
  const dispatch = useDispatch();
  const { openOrder, datePayment } = props;

  const returnQuantity = () => {
    if (props.orderNewList) {
      const initialValue = 0;
      const sumWithInitial = props.orderNewList.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.soLuong
      },
        initialValue);
      return sumWithInitial;
    }
    return 0;
  }

  const getOrderedList = (fromStopTime) => {
    if (props.table) {
      const data = {
        tableNo: props.table.id,
        maDonHang: ''
      };
      dispatch(showLoading(true));
      PostbillService.getOrderedByTableNo(data).then((res) => {
        if (res.data) {
          mergedOrdered(res.data, fromStopTime);
          dispatch(setOrderedList(res.data));
          dispatch(hideLoading());
        }
      }).catch((error) => {
        showMessageByType(error, "Lấy thông tin order thất bại", TYPE_ERROR.error);
        dispatch(hideLoading());
      });
    }
  }

  useEffect(() => {
    if (props.isLoadDataOrdered) {
      getOrderedList();
      dispatch(reloadDataOrdered(false));
    }
  }, [props.isLoadDataOrdered]);

  useEffect(() => {
    if (openOrder) {
      getOrderedList();
    }
  }, [openOrder, props.table]);


  const mergedOrdered = (ordered, fromStopTime) => {
    if (ordered && ordered.matHangList && ordered.matHangList.length > 0) {
      if (props && props.orderNewList?.length === 0 || fromStopTime || ordered.maKhuyenMai > 0 || props.isLoadDataOrdered) {
        dispatch(setOrderNewList(ordered.matHangList));
        const ckBill = ordered.chietKhauBill;
        if (ckBill && ckBill.valueCk > 0) {
          dispatch(setChietKhauBill(ckBill));
        }

        dispatch(setLoaiDonHang(ordered.loaiDonHang));
      }
    }
  }

  useEffect(() => {
    setQty(returnQuantity());
    setAmount(returnAmount());
  }, [props.orderNewList, props.chietKhauBill]);


  const returnAmount = () => {
    if (props.orderNewList) {
      const initialValue = 0;
      const sumWithInitial = props.orderNewList.reduce((accumulator, currentValue) => {
        return accumulator + calculatorAmountAfterChietKhau(currentValue);
      }, initialValue);
      dispatch(setTotalAmount(sumWithInitial));
      return sumWithInitial;
    }
    return 0;
  }

  useEffect(() => {
    setSoTienChietKhau(returnChietKhauBill());
  }, [amount, props.chietKhauBill]);

  const returnChietKhauBill = () => {
    var totalMHTheoGio = returnAmountMHTheoGio(props.orderNewList);
    const chietKhau = props.chietKhauBill;
    let ck = 0;
    if (chietKhau) {
      chietKhau.valueCk = (chietKhau.valueCk + "").replace(/\D/g, '');
      if (chietKhau.maxValue > 0) {
        ck = chietKhau.maxValue;
      } else {
        const value = parseFloat(chietKhau.valueCk)
        if (chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.SO_TIEN) {
          ck = value;
        };
        var totalSubtract = (amount - totalMHTheoGio)
        if (chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.PHAN_TRAM) {
          ck = (totalSubtract * value) / 100;
        };
        if (ck > 0) {
          dispatch(setTotalAmount(totalSubtract - ck));
        }
      }

    }
    return ck;
  }

  const handleCellClick = (data) => {
    setMHSelected(data);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const renderPhanTramCk = () => {
    const ckBill = props.chietKhauBill;
    if (ckBill.loaiCk === GIA_TRI_CHIET_KHAU.PHAN_TRAM && parseInt(ckBill.valueCk) > 0) {
      return "(" + ckBill.valueCk + "%)"
    }
    return "";
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="spanning table" size='small'>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>STT</TableCell>
              <TableCell align="center">Tên SP</TableCell>
              <TableCell align="right">Số lượng</TableCell>
              <TableCell align="right">Thành tiền</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.orderNewList?.map((row, index) => {
              return row.soLuong > 0 && (
                <TableRow key={row.index}>
                  <TableCell padding='checkbox'>{index + 1}</TableCell>
                  <TableCell align="left" sx={{ paddingLeft: 0 }}>
                    <Button sx={{ padding: 0 }} variant="text" onClick={() => handleCellClick(row)}>{row.ten_MH}</Button>
                    <Box sx={{ fontStyle: 'italic', fontSize: 11 }}>
                      {props.orderedList?.soDonHang > 0 && row.id_LoaiMH === TINH_TIEN_THEO_THOI_GIAN && <>
                        <Typography variant="caption" component="h2">
                          {"Giờ vào: " + moment(row?.gioVao).format(FORMAT_HH_MM_DD_MM_YYYY)}
                        </Typography>
                        <Typography variant="caption" component="h2">
                          Tạm tính đến: {thoiGianTamTinh(row)}
                        </Typography>
                        <Typography variant="caption" component="h2">
                          {"Đã sử dụng: " + returnFormatTimeUsed(row, datePayment)}
                        </Typography>
                      </>}
                      <Typography variant="caption" component="h2">
                        {row.ghiChu}
                      </Typography>

                      <Typography variant="caption" component="h2">
                        {row.chietKhau && row.chietKhau.valueCk > 0 && row.chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.SO_TIEN ? "Giảm giá " + calculatorChietKhauRow(row) : ''}
                        {row.chietKhau && row.chietKhau.valueCk > 0 && row.chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.PHAN_TRAM ? "Giảm giá " + calculatorChietKhauRow(row) : ''}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{row.soLuong}</TableCell>
                  <TableCell align="right">{formatMoney(calculatorAmountAfterChietKhau(row))}</TableCell>
                  <TableCell align="right">{row.id_LoaiMH !== TINH_TIEN_THEO_THOI_GIAN && renderPlusAction(row)}
                  </TableCell>
                </TableRow>
              )
            })}

            <TableRow>
              <TableCell></TableCell>
              <TableCell align='center' colSpan={2}><b>Tổng tiền hàng</b></TableCell>
              <TableCell align="right">{formatMoney(amount)}</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align='center' colSpan={2}><b>Chiết khấu {renderPhanTramCk()}</b></TableCell>
              <TableCell align="right">({formatMoney(sotienChietKhau)})</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell><b>SL</b>: {qty}</TableCell>
              <TableCell align='center' colSpan={2}><b>TỔNG</b></TableCell>
              <TableCell align="right">{formatMoney(amount - sotienChietKhau)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <ChiecKhauMatHangDialog
        open={open}
        handleClose={handleClose}
        mathang={matHangSelected}
        reloadAfterStopTime={getOrderedList}
        datePayment={datePayment}
      />
    </Box>
  );
}
function mapStateToProps(state) {
  const { isLoggedIn } = state.appReducers.auth;
  const { message, isReFetchData, isLoadDataOrdered} = state.appReducers.message;
  const { user } = state.appReducers.auth;
  const { listOutlet, outlet } = state.appReducers.outlet;
  const { listThucDon, orderNewList, chietKhauBill, orderedList } = state.appReducers.thucdon;
  const { table } = state.appReducers.setupTbl;
  console.log("state.appReducers.message", state.appReducers.message);
  return {
    isLoggedIn,
    isLoadDataOrdered,
    message,
    isReFetchData,
    userInfo: user,
    listOutlet,
    outlet,
    listThucDon,
    orderNewList,
    chietKhauBill,
    table,
    orderedList
  };
}

export default connect(mapStateToProps)(DataTableOrder);
