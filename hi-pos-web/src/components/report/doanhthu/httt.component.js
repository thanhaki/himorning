import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { showMessageByType } from '../../../helpers/handle-errors';
import { TYPE_ERROR } from '../../../helpers/handle-errors';
import { showLoading, hideLoading, reFetchData } from "../../../actions/index";
import moment from 'moment';
import { FORMAT_YYYY_MM_DD } from '../../../consts/constsCommon'
import reportService from '../../../services/report.service';
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter} from '@mui/material';
import { formatMoney, innerBarText } from '../../../helpers/utils';

Chart.register(...registerables);

const DoanhThuHttt = (props) => {
  const dispatch = useDispatch();
  const [dataReportDS, setDataReportDS] = useState({
    httt: [],
    soTien: []
  });

  const [dataReportHD, setDataReportHD] = useState({
    httt: [],
    hoaDon: []
  });
  const [dataDetail, setDataDetail] = useState([]);

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
      reportService.getDataReportDTHTTT(data).then(res => {
        if (res.data) {
          setDataDetail(res.data.htttDetails);
          const ds = res.data.doanhSo;
          if (ds) {
            var st = ds.map((x) => {
              return Math.round(x.thanhTien_DonHang)
            });

            var httt = ds.map((x) => {
              return x.tenHinhThucThanhToan
            });

            setDataReportDS({
              httt: httt,
              soTien: st
            });
          }
          const hd = res.data.hoaDon;
          if (hd) {
            var ma_hd = hd.map((x) => {
              return x.soDonHang
            });

            var httt = hd.map((x) => {
              return x.tenHinhThucThanhToan
            });

            setDataReportHD({
              httt: httt,
              hoaDon: ma_hd
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
  
  const calculatorSum  = (name) => {
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
      {/* THEO DOANH SỐ */}
      <Bar
        data={{
          labels: dataReportDS.httt,
          datasets: [
            {
              label: "Doanh thu hình thức thanh toán theo danh số",
              backgroundColor: ["#3e95cd"],
              data: dataReportDS.soTien
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
            label: "Doanh thu hình thức thanh toán theo danh số",
          },
        }}
        height="50px"
      />
      {/* THEO DOANH SỐ HÓA ĐƠN */}
      <Bar
        data={{
          labels: dataReportHD.httt,
          datasets: [
            {
              label: "Doanh thu hình thức thanh toán theo hóa đơn",
              backgroundColor: ["#3e95cd"],
              data: dataReportHD.hoaDon
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
            label: "Doanh thu hình thức thanh toán theo hóa đơn",
          },
        }}
        height="50px"
      />
      {/* Hình thức thanh toán */}
      <TableContainer component={Paper}>
        <Table sx={{ maxWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#1976d2' }}>Hình thức thanh toán</TableCell>
              <TableCell align="right" sx={{ color: '#1976d2' }}>Số hóa đơn</TableCell>
              <TableCell align="right" sx={{ color: '#1976d2' }}>Tỷ lệ</TableCell>
              <TableCell align="right" sx={{ color: '#1976d2' }}>Số tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataDetail && dataDetail.map((x) => {
              return <>

                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{x.tenHinhThucThanhToan}</TableCell>
                  <TableCell align="right">{x.soDonHang}</TableCell>
                  <TableCell align="right">{Math.round((x.soDonHang / calculatorSum("soDonHang")) * 100)}</TableCell>
                  <TableCell align="right">{formatMoney(x.thanhTien_DonHang)}</TableCell>
                </TableRow>
              </>
            })}
          </TableBody>
          <TableFooter>
            <TableCell sx={{fontSize: 16, color: 'black'}}><b>Tổng cộng</b></TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: 'black'}}><b>{calculatorSum("soDonHang")}</b></TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: 'black'}}><b>100 %</b></TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: 'black'}}><b>{formatMoney(calculatorSum("thanhTien_DonHang"))}</b></TableCell>
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

export default connect(mapStateToProps)(DoanhThuHttt);