import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import reportService from '../../../services/report.service';
import { showMessageByType } from '../../../helpers/handle-errors';
import { TYPE_ERROR } from '../../../helpers/handle-errors';
import { showLoading, hideLoading, reFetchData } from "../../../actions/index";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import {FORMAT_YYYY_MM_DD } from '../../../consts/constsCommon'
import DoanhThuTheoNgay from './dttheongay.component';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { formatMoney } from '../../../helpers/utils';

Chart.register(...registerables);

const DoanhThuTongQuan = (props) => {
  const dispatch = useDispatch();
  const [dataResponse, setDataResponse] = useState({});
  const [dataReport, setDataReport] = useState({
    hh: [],
    soTien: []
  });
  

  useEffect(() => {
    if (props.isReFetchData && props.loaiBaoCao === 1) {
      var test = props.filterData;
      const data = {
        thoiGian: test.thoigian.id,
        tungay:'',
        denngay: ''
      };
      if (test.tungay) {
        data.tungay = moment(test.tungay.toDate()).format(FORMAT_YYYY_MM_DD)
      }

      if (test.denngay) {
        data.denngay = moment(test.denngay.toDate()).format(FORMAT_YYYY_MM_DD)
      }
      dispatch(showLoading(true));
      reportService.getDataReportDTTongQuan(data).then(res => {
        if (res.data) {
          const data = res.data.dtTheoGio;
          setDataResponse(res.data);
          var hh = data.map((x) => {
            return x.hh
          });
  
          var st = data.map((x) => {
            return Math.round(x.soTien)
          });
          setDataReport({
            hh: hh,
            soTien: st
          });
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

  const calculatorSumDoanhThuAfterVat  = () => {
    if (dataResponse.dtTheoNgay) {
      const initialValue = 0;
      const sumWithInitial = dataResponse.dtTheoNgay.reduce((accumulator, currentValue) => {
          return accumulator + (currentValue.thanhTien_DonHang - currentValue.tien_Thue)
      }, initialValue);
      return sumWithInitial;
    }
  }
  return (
    <>
      <Grid item xs={12} sm={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{color: '#1976d2'}}>Tổng số hóa đơn</TableCell>
                <TableCell align="right" sx={{color: '#1976d2'}}>Số hóa đơn hủy</TableCell>
                <TableCell align="right" sx={{color: '#1976d2'}}>Số lượng mặt hàng</TableCell>
                <TableCell align="right" sx={{color: '#1976d2'}}>TB mặt hàng/HĐ</TableCell>
                <TableCell align="right" sx={{color: '#1976d2'}}>TB doanh thu/ HĐ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <b>{dataResponse.soDonHang}</b>
                </TableCell>
                <TableCell align="right">
                <b>{dataResponse.soHDHuy}</b>
                </TableCell>
                <TableCell align="right">
                <b>{dataResponse.soLuongMH}</b>
                </TableCell>
                <TableCell align="right"><b>{dataResponse.soDonHang > 0 ? parseInt(dataResponse.soLuongMH/dataResponse.soDonHang) : 0}</b></TableCell>
                <TableCell align="right"><b>{dataResponse.soDonHang > 0 ? formatMoney(parseInt(calculatorSumDoanhThuAfterVat()/dataResponse.soDonHang)) : 0}</b></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Bar
        data={{
          labels: dataReport.hh,
          datasets: [
            {
              label: "Doanh thu bán hàng trung bình theo giờ",
              backgroundColor: ["#3e95cd"],
              data: dataReport.soTien
            }
          ]
        }}
        plugins={[ChartDataLabels]}
        options={{
          plugins: {
            datalabels: {
              anchor: 'start',
              align: 'end',
              rotation: 270,
              color: 'black',
              formatter: function(value, context) {
                return value > 0 ? formatMoney(value) : "";
              }
            }
          },
          legend: { display: true },
          responsive: true,
          title: {
            display: true,
            text: "Doanh thu bán hàng trung bình theo giờ"
          },
        }}
        height="50px"
      />
      <DoanhThuTheoNgay data={dataResponse.dtTheoNgay}/>
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

export default connect(mapStateToProps)(DoanhThuTongQuan);