import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box, Button, Grid, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { connect } from "react-redux";
import postbillService from '../../services/postbill.service';
import { TYPE_ERROR, showMessageByType } from '../../helpers/handle-errors';
import moment from 'moment';
import { hideLoading, showLoading } from '../../actions';
import htttService from '../../services/httt.service';
import { useNavigate } from 'react-router-dom';
import PrintConfirmation from '../print-templates/print-confirm.component';
import PrintIcon from '@mui/icons-material/Print';
import userService from '../../services/user.service';
import printerService from '../../services/printer.service';

const theme = createTheme();

function VnPay(props) {

    const dispatch = useDispatch();
    const [lineMoney, setLineMoney] = useState([]);
    const [tenDonHang, setTenDonHang] = useState('');
    const [datePayment, setDatePayment] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [orderNewList, setOrderNewList] = useState([]);
    const [chietKhauBill, setChietKhauBill] = useState([]);
    const [ten_Outlet, setTen_Outlet] = useState('');
    const [openPrint, setOpenPrint] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [printerQr, setPrinterQr] = useState({});
    const [printer, setPrinter] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        getUserInfo();
        getAllDataPrinters();
        // Lấy giá trị từ URL
        const data = {
            vnp_Amount: new URLSearchParams(window.location.search).get('vnp_Amount'),
            vnp_BankCode: new URLSearchParams(window.location.search).get('vnp_BankCode'),
            vnp_BankTranNo: new URLSearchParams(window.location.search).get('vnp_BankTranNo'),
            vnp_CardType: new URLSearchParams(window.location.search).get('vnp_CardType'),
            vnp_OrderInfo: new URLSearchParams(window.location.search).get('vnp_OrderInfo'),
            vnp_PayDate: new URLSearchParams(window.location.search).get('vnp_PayDate'),
            vnp_ResponseCode: new URLSearchParams(window.location.search).get('vnp_ResponseCode'),
            vnp_TmnCode: new URLSearchParams(window.location.search).get('vnp_TmnCode'),
            vnp_TransactionNo: new URLSearchParams(window.location.search).get('vnp_TransactionNo'),
            vnp_TransactionStatus: new URLSearchParams(window.location.search).get('vnp_TransactionStatus'),
            vnp_TxnRef: new URLSearchParams(window.location.search).get('vnp_TxnRef'),
            vnp_SecureHash: new URLSearchParams(window.location.search).get('vnp_SecureHash'),
        };
        setTenDonHang(data.vnp_TxnRef);
        if (data.vnp_Amount !== null) {
            postbillService.paymentCallback(data).then((res) => {
                if (res.data.success) {
                    //lấy thông tin donhang của table
                    const table = {
                        tableNo: 0,
                        maDonHang: res.data.orderId
                    };
                    postbillService.getOrderedByTableNo(table).then((res) => {
                        if (res.data) {
                            let amount = Math.round(res.data['matHangList'][0]['amount']);
                            let soDh = res.data.soDonHang;
                            let maDh = res.data.maDonHang;
                            let maKh = res.data.maKhachHang;
                            let gioVao = res.data.gioVao;
                            let timestamp = res.data.timestamp;
                            let ghiChu = 'VNPAY Paymentid: ' + data.vnp_TransactionNo + ', Transaction: ' + data.vnp_TransactionNo + ' DonVi = ' + props.userInfo?.user?.donVi;
                            setTen_Outlet(res.data.khuVuc);
                            setOrderNewList(res.data.matHangList);
                            setChietKhauBill(res.data.chietKhauBill);
                            setDatePayment(moment().format());
                            setTotalAmount(amount);
                            navigate('/vn-pay');
                            handleAddMoney(amount, soDh, maDh, maKh, gioVao, timestamp, ghiChu);
                        }
                    }).catch((error) => {
                        showMessageByType(error, "Lấy thông tin order thất bại", TYPE_ERROR.error);
                    });
                }else{
                    showMessageByType(null, res.data.orderDescription, TYPE_ERROR.warning)
                    navigate('/map-table');
                }
            }).catch((error) => {
            })
        }

    }, []);

    const handleAddMoney = (amount, soDh, maDh, maKh, gioVao, timestamp, ghiChu) => {
        let money = 0;
        if (typeof amount === 'number') {
            money = amount;
        } else {
            money = parseFloat((amount + "").replace(/\D/g, ''));
        }
        var httt = [];
        htttService.getAllHttt().then((result) => {
            httt.push(result.data);
            var htttCurrent = httt[0].find(x => x.maHinhThucThanhToan === 92);
            htttCurrent.soTien = money;
            let tempList = [...lineMoney];
            tempList.push(htttCurrent);
            const lt = tempList.map((item, index) => ({ id: index + 1, ...item }));
            if (lt.length > 0) {
                const data = {
                    soDonHang: soDh,
                    maDonHang: maDh,
                    maKhachHang: maKh,
                    paymentInfo: lt,
                    timestamp: timestamp,
                    gioRa: moment().format(),
                    gioVao:moment(gioVao).format(),
                    ghiChu: ghiChu, 
                };
                if (data.soDonHang && data.soDonHang > 0) {
                    dispatch(showLoading(true));
                    postbillService.payment(data).then((res) => {
                        showMessageByType(null, 'Thanh toán thành công', TYPE_ERROR.success);
                        if (res.statusText === "OK" && res.data.length > 2) {
                            showMessageByType(null, res.data, TYPE_ERROR.success);
                        }
                        dispatch(hideLoading());
                    }).catch((error) => {
                        showMessageByType(error, null, TYPE_ERROR.error);
                    })
                } else {
                    showMessageByType(null, 'Đơn hàng đã thanh toán, vui lòng kiểm tra lại.', TYPE_ERROR.error);
                }
            }
        }).catch((error) => { })
    }
	const handleHoanTat = () => {
        navigate('/map-table');
    }

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
            setPrinter(result.data.filter(x => x.loai_Printer == 1)[0]['language']);
            setPrinterQr(result.data.filter(x => x.loai_Printer == 1)[0]['inQRThanhToan']);
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
        })
    }

    const printIframe = (id) => {
        // dispatch(showLoading(true));
        var dataPrint = {
            templateType: props.userInfo?.user?.nganhHang,
            lineMoney: lineMoney,
            dataOrderNew: orderNewList,
            moneyInputCust: props.moneyInputCust ? props.moneyInputCust : 0,
            printTamTinh: props.printTamTinh,
            customerInfo: props.customer,
            userInfo: props.userInfo?.user,
            orderedList: [],
            outlet: {
                ten_Outlet: ten_Outlet
            },
            phanTram_Giam: props.phanTram_Giam,
            chietKhauBill: chietKhauBill,
            totalAmount: totalAmount,
            datePayment: datePayment,
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

    const handleAfterPrint = () => {
        localStorage.removeItem("dataPrint");
        window.location.href = '/map-table';
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="true">
                <CssBaseline />
                <iframe
                    id="receipt"
                    src='/print-template'
                    style={{ display: 'none' }}
                    title="Receipt"
                />
                <Box
                    sx={{
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h6">
                        ĐƠN HÀNG {tenDonHang}
                    </Typography>
                </Box>
                <Grid item xs={12} sm={12}
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center">
                    <Button sx={{ mr: 2 }} variant='contained' onClick={handleHoanTat}>Hoàn tất</Button>
                    <Button variant='contained' onClick={() => printIframe('receipt')} color='primary'>In hóa đơn</Button>
                </Grid>

            </Container>
        </ThemeProvider >
    );
}

function mapStateToProps(state) {
    const { message, title } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { customer } = state.appReducers.customer;

    return {
        message,
        userInfo: user,
        customer,
        title
    };
}

export default connect(mapStateToProps)(VnPay);