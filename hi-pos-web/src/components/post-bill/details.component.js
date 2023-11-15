import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { DialogContent, DialogActions, DialogContentText, DialogTitle, Dialog, Button, Grid, Box, TextField } from '@mui/material';
import SelectOutlet from './control/outlet-select.component';
import ListTable from './control/list-table.component';
import LoaiDonHang from './control/loai-don-hang.component';
import DataTable from './control/grid-order.component';
import InputChietKhau from './control/input-chiet-khau.component';
import PostbillService from '../../services/postbill.service';
import { showLoading, hideLoading, setOrderNewList, setOrderedList, setChietKhauBill, setLoaiDonHang, reFetchData, setTableCurrent, setSelectedCustomer, reloadDataOrdered } from "../../actions/index";
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import PaymentDialog from '../payment/payment.component';
import { useNavigate } from 'react-router-dom';
import SearchCustComponent from '../customer/search-cust.component';
import PrintConfirmation from '../print-templates/print-confirm.component';
import InputQRCode from './control/input-qr-code.component';
import KhuyenMaiComponent from './control/khuyenmai.component';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import AddKhachHang from '../../components/khach-hang/addKhachHang.component'
import { LOAI_KHACH_HANG } from '../../consts/constsCommon';

const OrderDialog = (props) => {
  const { open, handleClose, thoiGianTamTinh } = props;
  const [openChieckKhau, setOpenChieckKhau] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openKhuyenMai, setOpenKhuyenMai] = useState(false);
  const [contentNote, setContentNote] = useState('');
  const [openAddKH, setOpenAddKH] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleCls = () => {
    if (handleClose) { handleClose() }
  };

  const handleOpenChiecKhau = () => {
    setOpenChieckKhau(true);
  }
  useEffect(() => {
    if (props.orderedList.ghiChu) {
      setContentNote(props.orderedList.ghiChu)
    } else {
      setContentNote("");
    }
  }, [props.orderedList]);

  const handleCloseChiecKhau = () => {
    setOpenChieckKhau(false);
  }
  
  const returnMaKhuyenMai = () => {
    if (props.orderedList.soDonHang > 0){
      return props.orderedList.maKhuyenMai
    } else {
      return props.khuyenMai != null ? props.khuyenMai.maKhuyenMai : 0;
    }
  }

  const handleSaveOrder = () => {
    var data = {
      orderedList: props.orderNewList,
      chietKhau: props.chietKhauBill,
      tableNo: props.table.id,
      loaiDonHang: props.loaiDonHang,
      soDonHang: props.orderedList.soDonHang,
      maDonHang: props.orderedList.maDonHang,
      timestamp: props.orderedList.timestamp,
      maKhachHang: props.customer && props.customer.ma_KH ? props.customer.ma_KH : 0,
      ghiChu: contentNote,
      maKhuyenMai:  returnMaKhuyenMai()
    }
    dispatch(showLoading(true));
    PostbillService.createOrder(data).then((res) => {
      dispatch(hideLoading());

      var msg = "Tạo đơn hàng thành công"
      if (props.orderedList.soDonHang > 0) {
        msg = "Cập nhật đơn hàng thành công";
      }
      dispatch(reloadDataOrdered(true));
      showMessageByType(null, msg, TYPE_ERROR.success)
    }).catch((error) => {
      dispatch(hideLoading());
      if (props.orderedList.soDonHang > 0) {
        dispatch(reloadDataOrdered(true));
      }
      showMessageByType(error, "Tạo đơn hàng không thành công", TYPE_ERROR.error)
    })
  }

  const handleCancelOrdered = () => {
    dispatch(setOrderNewList([]));
    dispatch(setOrderedList([]));
    dispatch(setChietKhauBill(null));
    dispatch(setTableCurrent({}));
    dispatch(setLoaiDonHang(81));
    dispatch(setSelectedCustomer(null));
    handleCls();
    localStorage.removeItem("dataPrint");
    dispatch(reFetchData(true));
    navigate("/map-table");
  }

  const handleOpenPayment = () => {
    handleSaveOrder();
    setOpenPayment(true);
  }

  const handleClsPayment = () => {
    setOpenPayment(false);
  }

  const handleOpenKhuyenMai = () => {
    setOpenKhuyenMai(true);
  }

  const handleClsKhuyenMai = () => {
    setOpenKhuyenMai(false);
  }
  const handleCloseModalKH = () => {
    setOpenAddKH(false)
  }
  const handleLoadPage = () => {
    dispatch(reFetchData(true));
  }
  const handleAddCustomer = () => {
    setOpenAddKH(true)
  }
  return (
    <Box>
      <Dialog
        fullScreen
        open={open}
        onClose={handleCls}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Danh sách mặt hàng"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              {props.userInfo?.user?.nganhHang !== 9 &&
                <Grid item xs={12} sm={2}>
                  <LoaiDonHang />
                </Grid>
              }
              <Grid item xs={12} sm={2}>
                <SelectOutlet />
              </Grid>

              <Grid item xs={12} sm={2}>
                <ListTable />
              </Grid>

              <Grid item xs={12} sm={2}>
                <InputQRCode />
              </Grid>

              <Grid item xs={12} sm={3}>
                <SearchCustComponent />
              </Grid>
              <Grid item xs={12} sm={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton color="primary" onClick={handleAddCustomer} size='small'>
                  <AddIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12} sm={12}>
                <DataTable
                  openOrder={open}
                  datePayment={thoiGianTamTinh}
                />
              </Grid>

              <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
                <TextField
                  id="outlined-multiline-static"
                  label="Nội dung ghi chú"
                  fullWidth
                  multiline
                  rows={4}
                  value={contentNote}
                  onChange={(e) => { setContentNote(e.target.value) }}
                />
              </Grid>

            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ mt: 2, mb: 2 }}>
            <Grid item xs={12} sm={5}>
              <Button autoFocus onClick={handleOpenKhuyenMai}>
                Khuyến mãi
              </Button>
              <Button autoFocus onClick={handleOpenChiecKhau}>
                Chiết khấu
              </Button>
            </Grid>
            <Grid item xs={12} sm={7} textAlign={'right'}>
              <Button onClick={handleCancelOrdered} autoFocus variant="text" color='warning'>
                Đóng
              </Button>
              <Button autoFocus onClick={handleClose} variant="text">
                Thêm
              </Button>
              <Button autoFocus onClick={handleSaveOrder} variant="text">
                Lưu
              </Button>

              <PrintConfirmation
                printTamTinh={1}
                ten_Outlet={props.outlet?.ten_Outlet + " - " + props.table?.tenBan}
                dataOrderNew={props.orderNewList}
                datePayment={thoiGianTamTinh}
                chietKhauBill={props.chietKhauBill}
              />
              <Button onClick={handleOpenPayment} disabled={props.orderedList.soDonHang === 0} variant="text" autoFocus>
                Thanh toán
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
        <InputChietKhau
          open={openChieckKhau}
          handleClose={handleCloseChiecKhau}
          ckBill={true}
        />
        <KhuyenMaiComponent
          open={openKhuyenMai}
          handleClose={handleClsKhuyenMai}
        />
      </Dialog>
      <PaymentDialog
        open={openPayment}
        handleClose={handleClsPayment}
        datePayment={thoiGianTamTinh}
      />
      {openAddKH && <AddKhachHang open={openAddKH} title={"THÊM MỚI KHÁCH HÀNG"} id_LoaiKh={LOAI_KHACH_HANG.KHACH_HANG} handleClose={handleCloseModalKH} handleLoadPageParent={handleLoadPage} />}
    </Box>

  );
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.appReducers.auth;
  const { message } = state.appReducers.message;
  const { isReFetchData } = state.appReducers.message;
  const { user } = state.appReducers.auth;
  const { listThucDon, orderNewList, chietKhauBill, orderedList, loaiDonHang, khuyenMai } = state.appReducers.thucdon;
  const { table } = state.appReducers.setupTbl;
  const { customer } = state.appReducers.customer;
  const { outlet } = state.appReducers.outlet;

  return {
    isLoggedIn,
    message,
    isReFetchData,
    userInfo: user,
    listThucDon,
    orderNewList,
    orderedList,
    chietKhauBill,
    table,
    loaiDonHang,
    customer,
    outlet,
    khuyenMai
  };
}

export default connect(mapStateToProps)(OrderDialog);