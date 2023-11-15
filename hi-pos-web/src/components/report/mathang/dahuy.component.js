import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import reportService from '../../../services/report.service';
import { showMessageByType } from '../../../helpers/handle-errors';
import { TYPE_ERROR } from '../../../helpers/handle-errors';
import { showLoading, hideLoading, reFetchData } from "../../../actions/index";
import Box from '@mui/material/Box';
import moment from 'moment';
import {FORMAT_YYYY_MM_DD } from '../../../consts/constsCommon'
import CollapsibleTable from './row-detail.component';

Chart.register(...registerables);

const MatHangDaHuy = (props) => {
  const dispatch = useDispatch();
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
      reportService.getDataReportMHDaHuy(data).then(res => {
        if (res.data) {
          console.log("Da huy", res);
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

  return (
    <>
      <Box textAlign={'center'}>
        <h3>BÁO CÁO MẶT HÀNG ĐÃ HỦY</h3>
      </Box>
      <CollapsibleTable dataDetail={dataDetail}/>
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

export default connect(mapStateToProps)(MatHangDaHuy);