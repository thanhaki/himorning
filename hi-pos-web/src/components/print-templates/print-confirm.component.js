import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { hideLoading, showLoading } from '../../actions';
import { Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import IconButton from '@mui/material/IconButton';
import userService from '../../services/user.service';
import printerService from '../../services/printer.service';
function PrintConfirmation(props) {
  const dispatch = useDispatch();
  const [printer, setPrinter] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const [printerQr, setPrinterQr] = useState({});

  useEffect(() => {
    getUserInfo();
    getAllDataPrinters();
  }, []);

const getUserInfo = () => {
    const data = {
        no_User: props.userInfo?.user?.no_User
    };
    dispatch(showLoading(true));
    userService.getUserById(data).then((res) => {
        setUserInfo(res.data);
        dispatch(hideLoading());
    }).catch(error => {
        dispatch(hideLoading());
    });
  }
  const getAllDataPrinters = () => {
    let data = props.userInfo?.user?.donVi
    dispatch(showLoading(data));
    printerService.getAllDataPrinter(data).then((result) => {
      setPrinter(result.data.filter(x=>x.loai_Printer == 1)[0]['language']);
      setPrinterQr(result.data.filter(x=>x.loai_Printer == 1)[0]['inQRThanhToan']);
      dispatch(hideLoading());
    }).catch((error) => {
      dispatch(hideLoading());
    })
  }
  const handleAfterPrint = () => {
    localStorage.removeItem("dataPrint");
    window.location.href = '/map-table';
  };
  const printIframe = (id) => {
    dispatch(showLoading(true));
    var dataPrint = {
      templateType: props.userInfo?.user?.nganhHang,
      lineMoney: props.lineMoney ? props.lineMoney : [],
      dataOrderNew: props.dataOrderNew,
      moneyInputCust: props.moneyInputCust ? props.moneyInputCust : 0,
      printTamTinh: props.printTamTinh,
      customerInfo: props.customer,
      userInfo: props.userInfo?.user,
      orderedList: props.orderedList,
      outlet: {
        ten_Outlet: props.ten_Outlet
      },
      phanTram_Giam: props.phanTram_Giam,
      chietKhauBill: props.chietKhauBill,
      totalAmount: props.rePrint > 0 ? props.thanhTien_DonHang : props.totalAmount,
      datePayment: props.datePayment,
      anhNganHang: userInfo?.anhNganHang,
      language: printer,
      inQRThanhToan: printerQr,
    }
    localStorage.setItem("dataPrint", JSON.stringify(dataPrint));

    const iframe = document.frames
      ? document.frames[id]
      : document.getElementById(id);
    iframe.src = "/print-template";

    setTimeout(() => {
      dispatch(hideLoading());
      const iframeWindow = iframe.contentWindow || iframe;
      iframe.focus();
      iframeWindow.print();
      if (!props.printTamTinh && !props.rePrint) {
        handleAfterPrint();
      }
    }, 2000);

    return false;
  };

  return (
    <>
      <iframe
        id="receipt"
        src='/print-template'
        style={{ display: 'none' }}
        title="Receipt"
      />
      {props.rePrint &&
        <IconButton onClick={() => printIframe('receipt')} color='primary'>
          <PrintIcon />
        </IconButton>}
      {!props.rePrint && <Button startIcon={!props.printTamTinh ? <PrintIcon /> : ""} autoFocus
        onClick={() => printIframe('receipt')}
        size={!props.printTamTinh ? "small" : "medium"}
        disabled={props.orderedList.soDonHang === 0}
        variant={!props.printTamTinh ? "outlined" : "text"}>
        {!props.printTamTinh ? 'In hóa đơn' : "In tạm tính"}
      </Button>
      }
    </>
  );
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.appReducers.auth;
  const { message } = state.appReducers.message;
  const { isReFetchData } = state.appReducers.message;
  const { user } = state.appReducers.auth;
  const { listThucDon, orderedList, loaiDonHang } = state.appReducers.thucdon;
  const { table } = state.appReducers.setupTbl;
  const { customer } = state.appReducers.customer;
  const { outlet } = state.appReducers.outlet;

  return {
    isLoggedIn,
    message,
    isReFetchData,
    userInfo: user,
    listThucDon,
    orderedList,
    table,
    loaiDonHang,
    customer,
    outlet
  };
}

export default connect(mapStateToProps)(PrintConfirmation);