import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import reportService from '../../../services/report.service';
import { showMessageByType } from '../../../helpers/handle-errors';
import { TYPE_ERROR } from '../../../helpers/handle-errors';
import { showLoading, hideLoading, reFetchData } from "../../../actions/index";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Box, TableFooter } from '@mui/material';
import moment from 'moment';
import { FORMAT_YYYY_MM_DD } from '../../../consts/constsCommon'
import { formatMoney, innerBarText } from '../../../helpers/utils';

Chart.register(...registerables);

const DanhMucMatHang = (props) => {
  const dispatch = useDispatch();
  const [dataDetail, setDataDetail] = useState([]);
  const [dataGroupDM, setDataGroupDM] = useState([]);
  const [dataDoanhSo, setDataDoanhSo] = useState({ dm: [], soTien: [] });
  const [dataHD, setDataHd] = useState({ dm: [], hoadon: [] });
  useEffect(() => {
    if (props.isReFetchData && props.loaiBaoCao === 1) {
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
      reportService.getDataReportDanhMucMH(data).then(res => {
        if (res.data) {
          const { doanhSos, hoaDons, details } = res.data;
          setDataDetail(details.map((item, index) => ({ stt: index + 1, ...item })));
          const unique = details.filter(
            (value, index, self) => self.findIndex((m) => m.ma_DanhMuc === value.ma_DanhMuc) === index,
          );
          setDataGroupDM(unique)
          if (doanhSos) {
            var dm = doanhSos.map((x) => {
              return x.ten_DanhMuc
            });

            var soTien = doanhSos.map((x) => {
              return Math.round(x.thanhTien_DonHang)
            });
            setDataDoanhSo({
              dm: dm,
              soTien: soTien
            });
          }
          
          if (hoaDons) {
            var dm = hoaDons.map((x) => {
              return x.ten_DanhMuc
            });

            var hd = hoaDons.map((x) => {
              return x.soDonHang
            });
            setDataHd({
              dm: dm,
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
  const renderMh = (item) => {
    var a = (
      <TableRow>
      <TableCell align="right" >{item.stt}</TableCell>
      <TableCell align="right" >{item.ten_MH}</TableCell>
      <TableCell align="right" >{formatMoney(item.donGia_MH)}</TableCell>
      <TableCell align="right" >{item.soLuongMatHang}</TableCell>
      <TableCell align="right" >{formatMoney(item.tienGiamGia)}</TableCell>
      <TableCell align="right" ></TableCell>
      <TableCell align="right" >{formatMoney(item.thanhTien_MH)}</TableCell>
      <TableCell align="right" ></TableCell>
    </TableRow>)
    return a
  }
  const totalValueByFieldName = (name, ma_DanhMuc) => {
    const initialValue = 0;
    const sumWithInitial = dataDetail && dataDetail.reduce((accumulator, currentValue) => {
      if (ma_DanhMuc) {
        if (currentValue.ma_DanhMuc === ma_DanhMuc) {
          return accumulator + currentValue[name]
        } 
        return accumulator;
      } else {
        return accumulator + currentValue[name]
      }
    }, initialValue);

    return sumWithInitial;
  }
  console.log("dataGroupDM", dataGroupDM);
  return (
    <>
      <Bar
        data={{
          labels: dataDoanhSo.dm,
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
          labels: dataHD.dm,
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
        <h3>BÁO CÁO CHI TIẾT MẶT HÀNG</h3>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell align="right">Mặt hàng</TableCell>
              <TableCell align="right">Giá khi bán</TableCell>
              <TableCell align="right">Số lượng</TableCell>
              <TableCell align="right">Giảm giá</TableCell>
              <TableCell align="right">Tỷ lệ số lượng</TableCell>
              <TableCell align="right">Tiền hàng</TableCell>
              <TableCell align="right">Tỷ lệ tiền hàng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {dataGroupDM && dataGroupDM.map((item, index) => {
              return (<>
              <TableRow key={index}>
                <TableCell align="left" colSpan={2}><b>{item.ten_DanhMuc}</b></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"><b>{totalValueByFieldName("soLuongMatHang", item.ma_DanhMuc)}</b></TableCell>
                <TableCell align="right"><b>{formatMoney(totalValueByFieldName("tienGiamGia", item.ma_DanhMuc))}</b></TableCell>
                <TableCell align="right"><b>{Math.round((totalValueByFieldName("soLuongMatHang", item.ma_DanhMuc) / totalValueByFieldName("soLuongMatHang")) * 100) + " %"}</b></TableCell>
                <TableCell align="right"><b>{formatMoney(totalValueByFieldName("thanhTien_MH", item.ma_DanhMuc))}</b></TableCell>
                <TableCell align="right"><b>{Math.round((totalValueByFieldName("thanhTien_MH", item.ma_DanhMuc) / totalValueByFieldName("thanhTien_MH")) * 100) + " %"}</b></TableCell>
              </TableRow>
                {dataDetail && dataDetail.map((a, index) => {
                  return a.ma_DanhMuc === item.ma_DanhMuc && renderMh(a);
                })}
              </>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableCell align="center" colSpan={3} className='txt-footer'><b>Tổng cộng</b></TableCell>
            <TableCell align="right" className='txt-footer'><b>{totalValueByFieldName("soLuongMatHang")}</b></TableCell>
            <TableCell align="right" className='txt-footer'><b>{formatMoney(totalValueByFieldName("tienGiamGia"))}</b></TableCell>
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

export default connect(mapStateToProps)(DanhMucMatHang);