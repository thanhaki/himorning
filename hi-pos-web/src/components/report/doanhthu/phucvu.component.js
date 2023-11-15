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
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter } from '@mui/material';
import { formatMoney, innerBarText } from '../../../helpers/utils';

Chart.register(...registerables);

const DoanhThuPhucVu = (props) => {
  const dispatch = useDispatch();
  const [dataReport, setDataReport] = useState({
    phucVu: [],
    soTien: []
  });
  const [dataDetail, setDataDetail] = useState([]);
  useEffect(() => {
    if (props.isReFetchData && props.loaiBaoCao === 3) {
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
      reportService.getDataReportDTPhucVu(data).then(res => {
        if (res.data) {

          setDataDetail(res.data.dtPhuVuDetails);

          const dtPhuVu = res.data.dtPhuVu;
          if (dtPhuVu) {
            var pv = dtPhuVu.map((x) => {
              return x.fullName
            });

            var soTien = dtPhuVu.map((x) => {
              return Math.round(x.thanhTien_DonHang)
            });

            setDataReport({
              phucVu: pv,
              soTien: soTien
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
      return Math.round(sumWithInitial);
    }
  }

  return (
    <>
      <Bar
        data={{
          labels: dataReport.phucVu,
          datasets: [
            {
              label: "Doanh thu theo phục vụ",
              backgroundColor: ["#3e95cd"],
              data: dataReport.soTien
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
            label: "Doanh thu theo phục vụ",
          },
        }}
        height="50px"
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#1976d2' }}>Nhân viên</TableCell>
              <TableCell align="right" sx={{ color: '#1976d2' }}>Số hóa đơn</TableCell>
              <TableCell align="right" sx={{ color: '#1976d2' }}>Số lượng mặt hàng</TableCell>
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
                  <TableCell component="th" scope="row">{x.fullName}</TableCell>
                  <TableCell align="right">{x.soDonHang}</TableCell>
                  <TableCell align="right">{x.soLuong_MH}</TableCell>
                  <TableCell align="right">{Math.round((x.soDonHang / calculatorSum("soDonHang")) * 100)}</TableCell>
                  <TableCell align="right">{formatMoney(Math.round(x.thanhTien_DonHang))}</TableCell>
                </TableRow>
              </>
            })}
          </TableBody>
          <TableFooter>
            <TableCell className='txt-footer'><b>Tổng cộng</b></TableCell>
            <TableCell align="right" className='txt-footer'><b>{calculatorSum("soDonHang")}</b></TableCell>
            <TableCell align="right" className='txt-footer'><b>{calculatorSum("soLuong_MH")}</b></TableCell>
            <TableCell align="right" className='txt-footer'><b>100 %</b></TableCell>
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

export default connect(mapStateToProps)(DoanhThuPhucVu);