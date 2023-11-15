import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid, Typography, Box } from '@mui/material';
import { formatMoney } from '../../helpers/utils';
import moment from 'moment';
import { GIA_TRI_CHIET_KHAU, TINH_TIEN_THEO_THOI_GIAN } from '../../consts/constsCommon';
import { calculatorAmountAfterChietKhau, returnAmountMHTheoGio, returnAmountNotCkBill, returnFormatTimeUsed } from '../post-bill/calculator-money';
import { FORMAT_HH_MM_DD_MM_YYYY } from '../../consts/constsCommon'

const PrintBillDialog = (props) => {
    const [printer, setPrinter] = useState({});
    const data = localStorage.getItem("dataPrint");
    var dataParse = JSON.parse(data);
    const { dataOrderNew, printTamTinh, customerInfo, chietKhauBill,
        userInfo, orderedList, phanTram_Giam, moneyInputCust, lineMoney,
        outlet, datePayment, anhNganHang, language, inQRThanhToan } = dataParse;
    // Tiền mặt
    const HTTT_DEFAULT = 86;

    const moneyReturn = () => {
        const thanhToanTienMat = lineMoney && lineMoney.find(x => x.maHinhThucThanhToan === HTTT_DEFAULT);
        if (thanhToanTienMat) {
            const money = parseFloat((moneyInputCust + "").replace(/\D/g, ''));
            if (money > 0) {
                const refund = money - thanhToanTienMat.soTien;
                if (refund > 0) {
                    return formatMoney(refund);
                }
            }
        }
        return 0;
    }

    const returnChietKhauBill = (isReturnCK) => {
        var totalMHTheoGio = returnAmountMHTheoGio(dataOrderNew);
        const chietKhau = chietKhauBill;
        const amount = returnAmountNotCkBill(dataOrderNew, moment(datePayment));
        let ck = 0;
        if (chietKhau) {
            if (chietKhau.maxValue > 0) {
                ck = chietKhau.maxValue;
            }
            else {
                chietKhau.valueCk = (chietKhau.valueCk + "").replace(/\D/g, '');
                const value = parseFloat(chietKhau.valueCk)
                if (chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.SO_TIEN) {
                    ck = value;
                };
                var totalSubtract = (amount - totalMHTheoGio)
                if (chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.PHAN_TRAM) {
                    ck = (totalSubtract * value) / 100;
                };
            }
        }
        if (isReturnCK) {
            return ck;
        } else {
            return amount - ck;
        }
    }

    const retrunPercentDiscount = () => {
        const chietKhau = chietKhauBill;
        if (chietKhau) {
            chietKhau.valueCk = (chietKhau.valueCk + "").replace(/\D/g, '');
            const value = parseFloat(chietKhau.valueCk)

            if (chietKhau.loaiCk === GIA_TRI_CHIET_KHAU.PHAN_TRAM && value > 0) {
                return "(" + value + "%)"
            } else {
                if (phanTram_Giam) {
                    return "(" + phanTram_Giam + "%)"
                }
            }
        }
        return "(0%)";
    }

    const getGioVao = () => {
        if (orderedList?.gioVao) {
            return moment(orderedList?.gioVao).format(FORMAT_HH_MM_DD_MM_YYYY)
        } else {
            if (dataOrderNew && dataOrderNew.length > 0) {
                return moment(dataOrderNew[0].gioVao).format(FORMAT_HH_MM_DD_MM_YYYY)
            }
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                border: '1px dashed gray',
                marginTop: 2,
                padding: 1,
                maxWidth: 303
            }}
        >
            {language == 'vn' &&
                <Grid>
                    <Grid item xs={12} sm={12} >
                        <Box textAlign={'center'}>
                            <Typography variant="h7" component="div">
                                <b>{userInfo?.tenDonVi}</b>
                            </Typography>
                            {printer && printer.editAddress &&
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    {printer.address}
                                </Typography>
                            }
                            {!printer || !printer.editAddress &&

                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    {userInfo?.diaChiDonVi}
                                </Typography>
                            }
                            <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                Điện thoại: {userInfo?.phone}
                            </Typography>
                            <Typography variant="h7" component="div">
                                {printTamTinh === 1 && <b>HÓA ĐƠN TẠM TÍNH</b>}
                                {printTamTinh !== 1 && <b>HÓA ĐƠN THANH TOÁN</b>}
                            </Typography>
                            <Typography variant='subtitle2'>
                                Số: {
                                    (dataOrderNew && dataOrderNew.length > 0 && dataOrderNew[0].maDonHang) ? dataOrderNew[0].maDonHang : orderedList?.maDonHang}
                            </Typography>
                        </Box>
                        <Grid item xs={12} sm={12} sx={{ borderTop: '1px dashed gray', mr: 1, mt: 2, mb: 1 }}>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6} sm={6}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    <b>Tại vị trí</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} textAlign={'right'}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    {outlet?.ten_Outlet}
                                </Typography>
                            </Grid>

                            <Grid item xs={7} sm={7}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    Giờ vào: {getGioVao()}
                                </Typography>
                            </Grid>
                            <Grid item xs={5} sm={5} textAlign={'right'}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    Giờ in: {dataParse && moment(new Date()).format("HH:mm")}
                                </Typography>
                            </Grid>

                            <Grid item xs={4} sm={6}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    Thu Ngân:
                                </Typography>
                            </Grid>
                            <Grid item xs={8} sm={6} textAlign={'right'}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    {userInfo?.fullName}
                                </Typography>
                            </Grid>
                            {
                                customerInfo && customerInfo.ma_KH > 0 && <>

                                    <Grid item xs={6} sm={6}>
                                        <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                            Khách hàng
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} textAlign={'right'}>
                                        <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                            {customerInfo.ten_KH}
                                        </Typography>
                                    </Grid>
                                </>
                            }

                            <Grid item xs={4} sm={6}>
                                <Typography variant='subtitle2'>
                                    <b>Mặt hàng</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sm={3} textAlign={'right'}>
                                <Typography variant='subtitle2'>
                                    <b>SL/TL</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sm={3} textAlign={'right'}>
                                <Typography variant='subtitle2'>
                                    <b>T.Tiền</b>
                                </Typography>
                            </Grid>

                            {
                                dataOrderNew && dataOrderNew.map((item, index) => {
                                    return <>
                                        <Grid item xs={5} sm={6}>
                                            <Typography variant='caption'>
                                                {item.ten_MH}
                                            </Typography>
                                            {item.id_LoaiMH === TINH_TIEN_THEO_THOI_GIAN &&
                                                <Box sx={{ fontSize: 12, ml: 1 }}>
                                                    <i>{returnFormatTimeUsed(item, datePayment)}</i>
                                                </Box>
                                            }
                                            <Box sx={{ fontSize: 12 }}>
                                                <i>{item.noiDungGiamGia}</i>
                                            </Box>

                                        </Grid>
                                        <Grid item xs={3} sm={3} textAlign={'right'}>
                                            <Typography variant='caption'>
                                                {item.soLuong}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} sm={3} textAlign={'right'}>
                                            <Typography variant='caption'>
                                                {formatMoney(calculatorAmountAfterChietKhau(item, moment(datePayment)))}
                                            </Typography>
                                        </Grid>
                                    </>
                                })
                            }

                            <Grid item xs={12} sm={12} sx={{ borderTop: '1px solid black' }}>
                            </Grid>

                            <Grid item xs={6} sm={9}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    Tổng tiền ({dataOrderNew ? dataOrderNew.length : 0})
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={3} textAlign={'right'}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    {formatMoney(returnAmountNotCkBill(dataOrderNew, moment(datePayment)))}
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={6}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    Tổng giảm giá {retrunPercentDiscount()}
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={6} textAlign={'right'}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    {formatMoney(returnChietKhauBill(true))}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={12} sx={{ borderTop: '1px solid black' }}>
                            </Grid>

                            <Grid item xs={6} sm={6}>
                                <Typography variant='subtitle1'>
                                    <b>THANH TOÁN</b>
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={6} textAlign={'right'}>
                                <Typography variant='subtitle2'>
                                    <b>{formatMoney(returnChietKhauBill())}</b>
                                </Typography>
                            </Grid>
                            {lineMoney > 0 && lineMoney.map((item, index) => {
                                return <>
                                    <Grid item xs={6} sm={6}>
                                        <Typography variant='subtitle2'>
                                            <b>{item.tenHinhThucThanhToan}</b>
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6} sm={6} textAlign={'right'}>
                                        <Typography variant='subtitle2'>
                                            <b>{formatMoney(item.soTien)}</b>
                                        </Typography>
                                    </Grid>
                                </>
                            })}
                            {moneyInputCust > 0 &&
                                <>
                                    <Grid item xs={6} sm={6}>
                                        <Typography variant='subtitle2'>
                                            Tiền khách đưa
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6} sm={6} textAlign={'right'}>
                                        <Typography variant='subtitle2'>
                                            {formatMoney(moneyInputCust)}
                                        </Typography>
                                    </Grid>
                                </>
                            }
                            {moneyReturn() > 0 &&
                                <>
                                    <Grid item xs={6} sm={6}>
                                        <Typography variant='subtitle2'>
                                            Tiền thừa
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6} sm={6} textAlign={'right'}>
                                        <Typography variant='subtitle2'>
                                            {moneyReturn()}
                                        </Typography>
                                    </Grid>
                                </>
                            }
                            {anhNganHang && inQRThanhToan &&
                                <Grid item xs={12} sm={12} justifyContent="center" style={{ marginTop: '10px', textAlign: 'center' }}>
                                    <img src={anhNganHang} width="150" height="150" />
                                </Grid>
                            }
                            <Grid item xs={12} sm={12} textAlign={'center'} sx={{ mb: 1 }}>
                                {printer && printer.showFooter &&
                                    <Typography variant="subtitle1" component="p">
                                        {printer.infoFooter}
                                    </Typography>
                                }
                                <Typography variant="subtitle1" component="p">
                                    <b>---------------*---------------</b>
                                </Typography>
                                <Typography variant="subtitle1" component="b" sx={{ fontSize: 12 }}>
                                    <b>Một sản phẩm của himon.vn</b>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
            {language == 'en' &&
                <Grid>
                    <Grid item xs={12} sm={12} >
                        <Box textAlign={'center'}>
                            <Typography variant="h7" component="div">
                                <b>{userInfo?.tenDonVi}</b>
                            </Typography>
                            {printer && printer.editAddress &&
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    {printer.address}
                                </Typography>
                            }
                            {!printer || !printer.editAddress &&

                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    {userInfo?.diaChiDonVi}
                                </Typography>
                            }
                            <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                Phone number: {userInfo?.phone}
                            </Typography>
                            <Typography variant="h7" component="div">
                                {printTamTinh === 1 && <b>Provisional Invoice</b>}
                                {printTamTinh !== 1 && <b>INVOICE</b>}
                            </Typography>
                            <Typography variant='subtitle2'>
                                No: {
                                    (dataOrderNew && dataOrderNew.length > 0 && dataOrderNew[0].maDonHang) ? dataOrderNew[0].maDonHang : orderedList?.maDonHang}
                            </Typography>
                        </Box>
                        <Grid item xs={12} sm={12} sx={{ borderTop: '1px dashed gray', mr: 1, mt: 2, mb: 1 }}>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6} sm={6}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    <b>Outlets:</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} textAlign={'right'}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    {outlet?.ten_Outlet}
                                </Typography>
                            </Grid>

                            <Grid item xs={7} sm={7}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    A.time: {getGioVao()}
                                </Typography>
                            </Grid>
                            <Grid item xs={5} sm={5} textAlign={'right'}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    Print time: {dataParse && moment(new Date()).format("HH:mm")}
                                </Typography>
                            </Grid>

                            <Grid item xs={4} sm={6}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    Cashier:
                                </Typography>
                            </Grid>
                            <Grid item xs={8} sm={6} textAlign={'right'}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    {userInfo?.fullName}
                                </Typography>
                            </Grid>
                            {
                                customerInfo && customerInfo.ma_KH > 0 && <>

                                    <Grid item xs={6} sm={6}>
                                        <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                            Khách hàng
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} textAlign={'right'}>
                                        <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                            {customerInfo.ten_KH}
                                        </Typography>
                                    </Grid>
                                </>
                            }

                            <Grid item xs={4} sm={6}>
                                <Typography variant='subtitle2'>
                                    <b>Items</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sm={3} textAlign={'right'}>
                                <Typography variant='subtitle2'>
                                    <b>Qty.</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sm={3} textAlign={'right'}>
                                <Typography variant='subtitle2'>
                                    <b>Amt.</b>
                                </Typography>
                            </Grid>

                            {
                                dataOrderNew && dataOrderNew.map((item, index) => {
                                    return <>
                                        <Grid item xs={5} sm={6}>
                                            <Typography variant='caption'>
                                                {item.ten_MH}
                                            </Typography>
                                            {item.id_LoaiMH === TINH_TIEN_THEO_THOI_GIAN &&
                                                <Box sx={{ fontSize: 12, ml: 1 }}>
                                                    <i>{returnFormatTimeUsed(item, datePayment)}</i>
                                                </Box>
                                            }
                                            <Box sx={{ fontSize: 12 }}>
                                                <i>{item.noiDungGiamGia}</i>
                                            </Box>

                                        </Grid>
                                        <Grid item xs={3} sm={3} textAlign={'right'}>
                                            <Typography variant='caption'>
                                                {item.soLuong}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} sm={3} textAlign={'right'}>
                                            <Typography variant='caption'>
                                                {formatMoney(calculatorAmountAfterChietKhau(item, moment(datePayment)))}
                                            </Typography>
                                        </Grid>
                                    </>
                                })
                            }

                            <Grid item xs={12} sm={12} sx={{ borderTop: '1px solid black' }}>
                            </Grid>

                            <Grid item xs={6} sm={9}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    Subtotal: ({dataOrderNew ? dataOrderNew.length : 0})
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={3} textAlign={'right'}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    {formatMoney(returnAmountNotCkBill(dataOrderNew, moment(datePayment)))}
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={6}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    Discount {retrunPercentDiscount()}
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={6} textAlign={'right'}>
                                <Typography variant='subtitle2' sx={{ fontSize: 12 }}>
                                    {formatMoney(returnChietKhauBill(true))}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={12} sx={{ borderTop: '1px solid black' }}>
                            </Grid>

                            <Grid item xs={6} sm={6}>
                                <Typography variant='subtitle1'>
                                    <b>TOTAL:</b>
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={6} textAlign={'right'}>
                                <Typography variant='subtitle2'>
                                    <b>{formatMoney(returnChietKhauBill())}</b>
                                </Typography>
                            </Grid>
                            {lineMoney > 0 && lineMoney.map((item, index) => {
                                return <>
                                    <Grid item xs={6} sm={6}>
                                        <Typography variant='subtitle2'>
                                            <b>{item.tenHinhThucThanhToan}</b>
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6} sm={6} textAlign={'right'}>
                                        <Typography variant='subtitle2'>
                                            <b>{formatMoney(item.soTien)}</b>
                                        </Typography>
                                    </Grid>
                                </>
                            })}
                            {moneyInputCust > 0 &&
                                <>
                                    <Grid item xs={7} sm={7}>
                                        <Typography variant='subtitle2'>
                                            Guest's pay.amount:
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={5} sm={5} textAlign={'right'}>
                                        <Typography variant='subtitle2'>
                                            {formatMoney(moneyInputCust)}
                                        </Typography>
                                    </Grid>
                                </>
                            }
                            {moneyReturn() > 0 &&
                                <>
                                    <Grid item xs={6} sm={6}>
                                        <Typography variant='subtitle2'>
                                           Refunds:
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6} sm={6} textAlign={'right'}>
                                        <Typography variant='subtitle2'>
                                            {moneyReturn()}
                                        </Typography>
                                    </Grid>
                                </>
                            }
                            {anhNganHang && inQRThanhToan &&
                                <Grid item xs={12} sm={12} justifyContent="center" style={{ marginTop: '10px', textAlign: 'center' }}>
                                    <img src={anhNganHang} width="150" height="150" />
                                </Grid>
                            }
                            <Grid item xs={12} sm={12} textAlign={'center'} sx={{ mb: 1 }}>
                                {printer && printer.showFooter &&
                                    <Typography variant="subtitle1" component="p">
                                        {printer.infoFooter}
                                    </Typography>
                                }
                                <Typography variant="subtitle1" component="p">
                                    <b>---------------*---------------</b>
                                </Typography>
                                <Typography variant="subtitle1" component="b" sx={{ fontSize: 12 }}>
                                    <b>Product of www.himon.vn</b>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }

        </Box>
    );
}

function mapStateToProps(state) {

}

export default connect(mapStateToProps)(PrintBillDialog);