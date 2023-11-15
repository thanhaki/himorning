import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, connect } from 'react-redux';
import postbillService from '../../../services/postbill.service';
import { showLoading, hideLoading, setListBill, reFetchData } from "../../../actions/index";
import { showMessageByType } from '../../../helpers/handle-errors';
import { TYPE_ERROR } from '../../../helpers/handle-errors';
import RowBill from './row-bill.component';
import moment from 'moment';
import { FORMAT_YYYY_MM_DD } from '../../../consts/constsCommon';
import TablePagination from '@mui/material/TablePagination';

const GridDataBill = (props) => {

  const dispatch = useDispatch();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);

  useEffect(() => {
    // Init data
    var data = {
      filter: props.filterData
    }
    getAllBill(data);
  }, [])

  const getAllBill = (dataFilter) => {
    dispatch(showLoading(true));
    postbillService.getallbill(dataFilter).then(res => {
      dispatch(setListBill(res.data));
      dispatch(hideLoading());
    }).catch(error => {
      dispatch(hideLoading());
      showMessageByType(error, "error", TYPE_ERROR.error);
    });
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(() => {
    if (props.isReFetchData) {
      const dataFilter = props.filterData;
      const thoigian = {
        isFilterTheoNgay: dataFilter?.thoigian?.isFilterTheoNgay,
        tungay: "",
        denngay: ""
      };

      // handle date filter 
      const dataTime = dataFilter.thoigian;
      if (dataTime.isFilterTheoNgay) {
        if (dataTime.tungay) {
          thoigian.tungay = moment(dataTime.tungay.toDate()).format(FORMAT_YYYY_MM_DD)
        }

        if (dataTime.denngay) {
          thoigian.denngay = moment(dataTime.denngay.toDate()).format(FORMAT_YYYY_MM_DD)
        }
      }
      const dataPost = {
        maDonHang: dataFilter.maDonHang,
        thungan: dataFilter.thungan?.map(x => x.userName),
        phucvu: dataFilter.phucvu?.map(x => x.userName),
        khuvuc: dataFilter.khuvuc?.map(x => x.ma_Outlet),
        phuongThucThanhToan: dataFilter.phuongThucThanhToan?.map(x => x.maHinhThucThanhToan),
        tinhTrangDH: dataFilter.tinhTrangDH?.map(x => x.no),
        khachHang: dataFilter.khachHang?.map(x => x.ma_KH),
        thoigian: thoigian
      }

      var data = {
        filter: dataPost
      }
      getAllBill(data);
      dispatch(reFetchData(false));
    }
  }, [props.isReFetchData])

  const visibleRows = React.useMemo(
    () =>
      props.listBills.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [page, rowsPerPage, props.listBills],
  );

  return (
    <>

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Thời gian thanh toán</TableCell>
              <TableCell align="right">Mã hóa đơn</TableCell>
              <TableCell align="right">Thời gian</TableCell>
              <TableCell align="right">Thanh toán</TableCell>
              <TableCell align="right">Số tiền</TableCell>
              <TableCell align="right">Thu ngân</TableCell>
              <TableCell align="right">Tình trạng</TableCell>
              <TableCell align="right">Chức năng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows && visibleRows.map((row) => (
              <RowBill key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer><TablePagination
        rowsPerPageOptions={[10, 20, 50,100]}
        component="div"
        count={props.listBills.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
function mapStateToProps(state) {
  const { isLoggedIn } = state.appReducers.auth;
  const { message, isReFetchData } = state.appReducers.message;
  const { filterData, listBills } = state.appReducers.thucdon;
  return {
    isLoggedIn,
    message,
    filterData,
    isReFetchData,
    listBills
  };
}

export default connect(mapStateToProps)(GridDataBill);