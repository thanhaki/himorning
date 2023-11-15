import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { showMessageByType } from '../../../helpers/handle-errors';
import { TYPE_ERROR } from '../../../helpers/handle-errors';
import { showLoading, hideLoading, reFetchData } from "../../../actions/index";
import moment from 'moment';
import { FORMAT_DD_MM_YYYY, FORMAT_YYYY_MM_DD } from '../../../consts/constsCommon'
import reportService from '../../../services/report.service';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter } from '@mui/material';
import { formatMoney } from '../../../helpers/utils';

const DoanhThuDonHuy = (props) => {
  const dispatch = useDispatch();
  const [dataDetail, setDataDetail] = useState([]);
  useEffect(() => {
    if (props.isReFetchData && props.loaiBaoCao === 6) {
      var test = props.filterData;
      const data = {
        thoiGian: test.thoigian.id,
        tungay: '',
        denngay: ''
      };
      if (test.tungay) {
        data.tungay = moment(test.tungay.toDate()).format(FORMAT_YYYY_MM_DD)
      }

      if (test.denngay) {
        data.denngay = moment(test.denngay.toDate()).format(FORMAT_YYYY_MM_DD)
      }
      dispatch(showLoading(true));
      reportService.getDataReportDTHuyDH(data).then(res => {
        if (res.data) {
          setDataDetail(res.data);
        }
        dispatch(hideLoading());
        dispatch(reFetchData(false));
      }).catch(error => {
        showMessageByType(error, "Load dữ liệu doanh thu tổng quan không thành công", TYPE_ERROR.error)
        dispatch(hideLoading());
        dispatch(reFetchData(false));
      });
    }
  }, [props.isReFetchData]);

  const calculatorSum = (name) => {
    if (dataDetail) {
      const initialValue = 0;
      const sumWithInitial = dataDetail.reduce((accumulator, currentValue) => {
        return accumulator + currentValue[name]
      }, initialValue);
      return sumWithInitial;
    }
  }
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ color: '#1976d2' }}>STT</TableCell>
              <TableCell align="center" sx={{ color: '#1976d2' }}>Thời gian</TableCell>
              <TableCell align="center" sx={{ color: '#1976d2' }}>Mã hóa đơn</TableCell>
              <TableCell align="center" sx={{ color: '#1976d2' }}>Người hủy</TableCell>
              <TableCell align="center" sx={{ color: '#1976d2' }}>Lý do hủy</TableCell>
              <TableCell align="center" sx={{ color: '#1976d2' }}>Số tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataDetail && dataDetail.map((x, index) => {
              return <>

                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{moment(x.DeleteDate).format(FORMAT_DD_MM_YYYY)}</TableCell>
                  <TableCell align="center">{x.maDonHang}</TableCell>
                  <TableCell align="center">{x.fullName}</TableCell>
                  <TableCell align="center">{x.lyDoHuy}</TableCell>
                  <TableCell align="right">{formatMoney(x.thanhTien_DonHang)}</TableCell>
                </TableRow>
              </>
            })}
          </TableBody>
          <TableFooter>
            <TableCell className='txt-footer' align='center' colSpan={3}><b>Tổng cộng</b></TableCell>
            <TableCell align="right" className='txt-footer'></TableCell>
            <TableCell align="right" className='txt-footer'></TableCell>
            <TableCell align="right" className='txt-footer'><b>{formatMoney(calculatorSum("thanhTien_DonHang"))}</b></TableCell>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.appReducers.auth;
  const { message } = state.appReducers.message;
  const { isReFetchData } = state.appReducers.message;
  const { user } = state.appReducers.auth;
  const { filterData } = state.appReducers.thucdon;

  return {
    isLoggedIn,
    message,
    isReFetchData,
    userInfo: user,
    filterData
  };
}

export default connect(mapStateToProps)(DoanhThuDonHuy);