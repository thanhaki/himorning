import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import reportService from '../../../services/report.service';
import { showMessageByType, TYPE_ERROR } from '../../../helpers/handle-errors';
import { showLoading, hideLoading, reFetchData } from "../../../actions/index";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter,Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import { FORMAT_YYYY_MM_DD } from '../../../consts/constsCommon'
import { formatMoney, innerBarText } from '../../../helpers/utils';

Chart.register(...registerables);

const MatHangBanChay = (props) => {
  const dispatch = useDispatch();
  const [dataDetail, setDataDetail] = useState([]);
  const [dataDoanhSo, setDataDoanhSo] = useState({ tenMH: [], soTien: [] });
  const [dataHD, setDataHd] = useState({ tenMH: [], hoadon: [] });

  useEffect(() => {
    if (props.isReFetchData && props.loaiBaoCao === 2) {
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
      reportService.getDataReportMHBanChay(data).then(res => {
        if (res.data) {
          const { doanhSos, hoaDons, details } = res.data;
          setDataDetail(details);
          if (doanhSos) {
            var dm = doanhSos.map((x) => {
              return x.ten_MH
            });

            var soTien = doanhSos.map((x) => {
              return Math.round(x.thanhTien_MH)
            });
            setDataDoanhSo({
              tenMH: dm,
              soTien: soTien
            });
          }

          if (hoaDons) {
            var dm = hoaDons.map((x) => {
              return x.ten_MH
            });

            var hd = hoaDons.map((x) => {
              return x.soDonHang
            });
            setDataHd({
              tenMH: dm,
              hoadon: hd
            });
          }
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

  const totalValueByFieldName = (name) => {
    const initialValue = 0;
    const sumWithInitial = dataDetail.reduce((accumulator, currentValue) => {
      return accumulator + currentValue[name]
    }, initialValue);
    return sumWithInitial;
  }

  return (
    <>
      <Bar
        data={{
          labels: dataDoanhSo.tenMH,
          datasets: [
            {
              label: "THEO DOANH SỐ",
              backgroundColor: ["#3e95cd"],
              data: dataDoanhSo.soTien
            }
          ]
        }}
        plugins={[innerBarText]}
        options={{
          legend: { display: true },
          indexAxis: 'y',
          responsive: true,
          title: {
            display: true,
            text: "THEO DOANH SỐ"
          },
        }}
        height="50px"
      />
      <Bar
        data={{
          labels: dataHD.tenMH,
          datasets: [
            {
              label: "THEO DOANH SỐ HÓA ĐƠN",
              backgroundColor: ["#3e95cd"],
              data: dataHD.hoadon
            }
          ]
        }}
        plugins={[innerBarText]}
        options={{
          legend: { display: true },
          indexAxis: 'y',
          responsive: true,
          title: {
            display: true,
            text: "THEO DOANH SỐ HÓA ĐƠN"
          },
        }}
        height="50px"
      />
      <Box textAlign={'center'}>
        <h3>BÁO CÁO CHI TIẾT</h3>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell align="right">Tên mặt hàng</TableCell>
              <TableCell align="right">Danh mục</TableCell>
              <TableCell align="right">Số lượng</TableCell>
              <TableCell align="right">Tỷ lệ số lượng</TableCell>
              <TableCell align="right">Tiền hàng</TableCell>
              <TableCell align="right">Tỷ lệ tiền hàng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataDetail && dataDetail.map((item, index) => {
              return (<TableRow key={index}>
                <TableCell align="right">{index + 1}</TableCell>
                <TableCell align="right">{item.ten_MH}</TableCell>
                <TableCell align="right">{item.ten_DanhMuc}</TableCell>
                <TableCell align="right">{item.soLuongMatHang}</TableCell>
                <TableCell align="right">{Math.round((item.soLuongMatHang / totalValueByFieldName("soLuongMatHang")) * 100) + " %"}</TableCell>
                <TableCell align="right">{formatMoney(item.thanhTien_MH)}</TableCell>
                <TableCell align="right">{Math.round((item.thanhTien_MH / totalValueByFieldName("thanhTien_MH")) * 100) + " %"}</TableCell>
              </TableRow>)
            })}
          </TableBody>
          <TableFooter>
            <TableCell align="center" colSpan={3} className='txt-footer'><b>Tổng cộng</b></TableCell>
            <TableCell align="right" className='txt-footer'><b>{totalValueByFieldName("soLuongMatHang")}</b></TableCell>
            <TableCell align="right" colSpan={2} className='txt-footer'><b>{formatMoney(totalValueByFieldName("thanhTien_MH"))}</b></TableCell>
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

export default connect(mapStateToProps)(MatHangBanChay);