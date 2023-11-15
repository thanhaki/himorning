import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { Table, TableBody, TableHead, TableCell, TableRow, Box, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useDispatch, connect } from 'react-redux';
import postbillService from '../../../services/postbill.service';
import { formatMoney } from '../../../helpers/utils';
import ClearIcon from '@mui/icons-material/Clear';
import { showLoading, hideLoading, setMessage, setBillIdDelete, reFetchData } from "../../../actions/index";
import { showMessageByType } from '../../../helpers/handle-errors';
import { TYPE_ERROR } from '../../../helpers/handle-errors';
import AlertDialogMessage from '../../common/dialog-confirm.component';
import Checkbox from '@mui/material/Checkbox';
import moment from 'moment';
import { FORMAT_DD_MM_YYYY_HH_MM_SS, TINH_TRANG_DON_HANG } from '../../../consts/constsCommon';
import PrintConfirmation from '../../print-templates/print-confirm.component';
import { calculatorChietKhauRow } from '../calculator-money';

function RowBill(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteRow = (maDH) => {
    dispatch(setBillIdDelete([maDH]));
    dispatch(setMessage("Bạn có chắc chắn xóa các hóa đơn đã chọn không?"))
    setOpenDialogConfirm(true);
  };

  const handleCloseDialogConfirm = () => {
    setOpenDialogConfirm(false);
  }

  const confirmDeleteOk = (lyDoHuy) => {
    dispatch(showLoading(true));
    var data = {
      maDonHang: props.billIdsDelete,
      lyDoHuy: lyDoHuy
    }

    postbillService.deletebill(data).then(res => {
      setOpenDialogConfirm(false);
      dispatch(hideLoading());
      showMessageByType(null, "Xóa hóa đơn thành công", TYPE_ERROR.success);
      dispatch(reFetchData(true));
      dispatch(setBillIdDelete([]));
    }).catch(error => {
      setOpenDialogConfirm(false);
      dispatch(hideLoading());
      showMessageByType(error, "error", TYPE_ERROR.error);
    });
  }

  const handleChkDelete = (event, maDH) => {
    if (event.target.checked) {
      const test = [...props.billIdsDelete];
      test.push(maDH);
      dispatch(setBillIdDelete(test));
    } else {
      const test = [...props.billIdsDelete];
      dispatch(setBillIdDelete(test.filter(x => x !== maDH)));
    }
  }

  const returnTinhTrangDH = (row) => {
    if (TINH_TRANG_DON_HANG.TAO_DON_HANG === row.tinhTrangDH) {
      return "Đang mở";
    }

    if (TINH_TRANG_DON_HANG.HOAN_THANH_DON_HANG === row.tinhTrangDH) {
      return "Hoàn tất";
    }

    if (TINH_TRANG_DON_HANG.HUY_DON_HANG === row.tinhTrangDH) {
      return (<Typography component="div" variant="caption" color="red">
        Đã hủy
      </Typography>);
    }
  }
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell className='no-padding'>
          <Checkbox checked={props.billIdsDelete.indexOf(row.maDonHang) > -1 || false} onChange={(event) => handleChkDelete(event, row.maDonHang)} />
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" className='no-padding'>
          {TINH_TRANG_DON_HANG.TAO_DON_HANG !== row.tinhTrangDH && moment(row.thoiGianThanhToan).format(FORMAT_DD_MM_YYYY_HH_MM_SS)}
        </TableCell>
        <TableCell align="right" className='no-padding'>{row.maDonHang}</TableCell>
        <TableCell align="right" className='no-padding'>{row.tongThoiGian === 0 ? '' : row.tongThoiGian}</TableCell>
        <TableCell align="right" className='no-padding'>{row.htThanhToan}</TableCell>
        <TableCell align="right" className='no-padding'>{formatMoney(row.thanhTien_DonHang)}</TableCell>
        <TableCell align="right" className='no-padding'>{row.thuNgan}</TableCell>
        <TableCell align="right" className='no-padding'>{returnTinhTrangDH(row)}
        </TableCell>
        <TableCell align="right" className='no-padding'>
          <PrintConfirmation
            dataOrderNew={row.listBillDetails}
            rePrint={1}
            chietKhauBill={row.chietKhauBill}
            phanTram_Giam={row.phanTram_Giam}
            ten_Outlet={row.ten_Outlet}
            thanhTien_DonHang={row.thanhTien_DonHang}
          />
          {TINH_TRANG_DON_HANG.HUY_DON_HANG !== row.tinhTrangDH && <IconButton
            aria-label="Xóa hóa đơn"
            size="small"
            onClick={() => handleDeleteRow(row.maDonHang)}
            color='error'
          >
            <ClearIcon />
          </IconButton>
          }
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Mặt hàng</TableCell>
                    <TableCell>Danh mục</TableCell>
                    <TableCell align="right">Số lượng</TableCell>
                    <TableCell align="right">Đơn giá</TableCell>
                    <TableCell align="right">Giảm giá</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                    <TableCell align="center">Ghi chú</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.listBillDetails.map((historyRow, index) => (
                    <TableRow key={index} >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {historyRow.ten_MH}
                      </TableCell>
                      <TableCell>
                        {historyRow.ten_DanhMuc}

                      </TableCell>
                      <TableCell align="right">
                        {historyRow.soLuong}

                      </TableCell>
                      <TableCell align="right">
                        {formatMoney(historyRow.gia_Ban)}
                      </TableCell>
                      <TableCell align="right">
                        {calculatorChietKhauRow(historyRow, historyRow.tienGiamGia_DH)}
                      </TableCell>
                      <TableCell align="right">
                        {formatMoney(historyRow.thanhTien_MH)}
                      </TableCell>
                      <TableCell align="center">
                        {historyRow.ghiChu}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <AlertDialogMessage
        open={openDialogConfirm}
        handleClose={handleCloseDialogConfirm}
        title="Xóa hóa đơn"
        callbackFunc={confirmDeleteOk}
        isShowReason={true}
      />
    </React.Fragment>
  );
}

RowBill.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};
function mapStateToProps(state) {
  const { isLoggedIn } = state.appReducers.auth;
  const { message, isReFetchData } = state.appReducers.message;
  const { filterData, billIdsDelete } = state.appReducers.thucdon;
  return {
    isLoggedIn,
    message,
    filterData,
    isReFetchData,
    billIdsDelete
  };
}

export default connect(mapStateToProps)(RowBill);