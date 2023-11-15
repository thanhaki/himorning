import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import moment from 'moment';
import { FORMAT_DD_MM_YYYY } from '../../../consts/constsCommon';
import { formatMoney } from '../../../helpers/utils';
import { TableFooter } from '@mui/material';

const DoanhThuTheoNgay = (props) => {
  
  const calculatorSumTien  = (name) => {
    if (props.data) {
      const initialValue = 0;
      const sumWithInitial = props.data.reduce((accumulator, currentValue) => {
          return accumulator + currentValue[name]
      }, initialValue);
      return Math.round(sumWithInitial);
    }
  }
  const calculatorSumDoanhThuAfterVat  = () => {
    if (props.data) {
      const initialValue = 0;
      const sumWithInitial = props.data.reduce((accumulator, currentValue) => {
          return accumulator + (currentValue.thanhTien_DonHang - currentValue.tien_Thue)
      }, initialValue);
      return Math.round(sumWithInitial);
    }
  }
  return (
    <>
      <Typography component="h2" variant="h5">
        Doanh thu theo ngày
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align='center'>STT</TableCell>
              <TableCell align="center">Thứ</TableCell>
              <TableCell align="center">Ngày</TableCell>
              <TableCell align="center">Tiền đơn hàng</TableCell>
              <TableCell align="center">Tiền hủy</TableCell>
              <TableCell align="center">Tiền giảm giá</TableCell>
              <TableCell align="center">Thuế</TableCell>
              <TableCell align="center">Doanh thu</TableCell>
              <TableCell align="center">Doanh thu (- TAX)</TableCell>
              <TableCell align="center">Tổng tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data && props.data.map((item, index) => {
              return <>

                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="left">{item.thu}</TableCell>

                  <TableCell align='center'>{moment(item.thoiGianThanhToan).format(FORMAT_DD_MM_YYYY)}</TableCell>
                  <TableCell align="right">{formatMoney(item.tien_DonHang)}</TableCell>
                  <TableCell align="right">{formatMoney(item.tienHuy)}</TableCell>
                  <TableCell align="right">{formatMoney(Math.round(item.tien_Giam))}</TableCell>
                  <TableCell align="right">{formatMoney(item.tien_Thue)}</TableCell>
                  <TableCell align="right">{formatMoney(Math.round(item.thanhTien_DonHang))}</TableCell>
                  <TableCell align="right">{formatMoney(Math.round(item.thanhTien_DonHang - item.tien_Thue))}</TableCell>
                  <TableCell align="right">{formatMoney(Math.round(item.thanhTien_DonHang - item.tien_Thue))}</TableCell>
                </TableRow>
              </>
            })}
          </TableBody>

          <TableFooter>
            <TableCell align="right" colSpan={3} sx={{fontSize: 16, color: 'black'}}><b>Tổng cộng</b></TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: 'black'}}><b>{formatMoney(calculatorSumTien("tien_DonHang"))}</b></TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: 'black'}}><b>{formatMoney(calculatorSumTien("tienHuy"))}</b></TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: 'black'}}><b>{formatMoney(calculatorSumTien("tien_Giam"))}</b></TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: 'black'}}><b>{formatMoney(calculatorSumTien("tien_Thue"))}</b></TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: 'black'}}><b>{formatMoney(calculatorSumTien("thanhTien_DonHang"))}</b></TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: 'black'}}><b>{formatMoney(calculatorSumDoanhThuAfterVat())}</b></TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: 'black'}}><b>{formatMoney(calculatorSumDoanhThuAfterVat())}</b></TableCell>
          </TableFooter>
        </Table>
      </TableContainer></>
  );
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.appReducers.auth;
  const { message } = state.appReducers.message;
  const { isReFetchData } = state.appReducers.message;
  const { user } = state.appReducers.auth;

  return {
    isLoggedIn,
    message,
    isReFetchData,
    userInfo: user,
  };
}

export default connect(mapStateToProps)(DoanhThuTheoNgay);