import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { Grid, Typography, Box } from '@mui/material';
import { formatMoney, DocTienBangChu } from '../../helpers/utils';
import moment from 'moment';
import { GIA_TRI_CHIET_KHAU } from '../../consts/constsCommon';
import { calculatorAmountAfterChietKhau, calculatorChietKhauRow, returnAmountNotCkBill } from '../post-bill/calculator-money';
import { FORMAT_DD_MM_YYYY } from '../../consts/constsCommon';

const PrintPhongKhamPhamacity = () => {
    console.log("PrintPhongKhamPhamacity");
    const data = localStorage.getItem("dataPrint");
    var dataParse = JSON.parse(data);
    const { dataOrderNew, printTamTinh, customerInfo, userInfo } = dataParse;
    const totalCkMH = () => {
        var totalCK = 0;
        if (dataOrderNew) {
            for (let index = 0; index < dataOrderNew.length; index++) {
                var row = dataOrderNew[index];
                const ck = row.chietKhau;
                if (ck) {
    
                    ck.valueCk = (ck.valueCk + "").replace(/\D/g, '');
                    const value = parseFloat(ck.valueCk)
    
                    if (ck.loaiCk === GIA_TRI_CHIET_KHAU.SO_TIEN) {
                        totalCK += value;
                    }
    
                    if (ck.loaiCk === GIA_TRI_CHIET_KHAU.PHAN_TRAM) {
                        var total = (row.gia_Ban * row.soLuong);
                        totalCK += ((total * value) / 100);
                    }
                }
            }
        }
        return totalCK;
    }
    return (

        <Grid container>
            <Grid item xs={3} sm={3}>
                {userInfo?.logoDonVi && <img src={userInfo.logoDonVi} width="96px" height="96px" style={{ borderRadius: 0.25 + 'em', cursor: "pointer" }} />}
            </Grid>
            <Grid item xs={9} sm={9} sx={{ fontSize: 12 }}>
                <Typography component="p" variant="p">
                    <b>{userInfo ? (userInfo.tenDonVi + "").toUpperCase() : ""} </b>
                </Typography>
                <Typography component="p" variant="p">
                    <b>Địa chỉ:</b> {userInfo ? userInfo.diaChiDonVi : ""}
                </Typography>
                <Typography component="p" variant="p">
                    <b>Điện thoại:</b> {userInfo ? userInfo.phone : ""}
                </Typography>
                <Typography component="p" variant="p">
                    <b>Website:</b> {userInfo ? userInfo.website : ""}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} sx={{ fontSize: 10 }}>
                <Box textAlign={'center'}>
                    <Typography component="h5" variant="h5">
                        {printTamTinh === 1 && <b>HÓA ĐƠN TẠM TÍNH</b>}
                        {printTamTinh !== 1 && <b>HÓA ĐƠN THANH TOÁN</b>}
                    </Typography>
                    <Typography component="p" variant="p">
                        {`Ngày ${moment().get('date')} tháng ${moment().get('month') + 1} năm ${moment().get('year')}`}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={6} sm={6} sx={{ fontSize: 10 }}>
                <Typography component="p" variant="p">
                    <b>Họ Tên:</b> {customerInfo && customerInfo.ma_KH > 0 ? (customerInfo.ten_KH ? customerInfo.ten_KH : "Khách lẻ") : "Khách lẻ"}
                </Typography>
                <Typography component="p" variant="p">
                    <b>Địa chỉ:</b> {customerInfo && customerInfo.ma_KH > 0 ? (customerInfo.diaChi_KH ? customerInfo.diaChi_KH : "") : ""}
                </Typography>
            </Grid>
            <Grid item xs={4} sm={4} sx={{ fontSize: 10 }}>
                <Typography component="p" variant="p">
                    <b>Giới tính:</b> {customerInfo && customerInfo.ma_KH > 0 ? (customerInfo.gioiTinh_KH ? "Nữ" : "Nam") : "#"}
                </Typography>
                <Typography component="p" variant="p">
                    <b>Tuổi:</b> {customerInfo && customerInfo.ma_KH > 0 ? (customerInfo.ngaySinh_KH && customerInfo.ngaySinh_KH !== "0001-01-01T00:00:00" ? moment().get('year') - moment(customerInfo.ngaySinh_KH).get('year') : "#") : "#"}
                </Typography>
            </Grid>
            <Grid item xs={2} sm={2} sx={{ fontSize: 10 }}>
                <Box>
                    <Typography component="p" variant="p">
                       <b> Mã BN: </b>{customerInfo && customerInfo.ma_KH > 0 ? customerInfo.maHienThi_KH : 'Khách lẻ'}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12}>
                <table className='data-print '>
                    <tr>
                        <th><b>Ngày</b></th>
                        <th><b>Dịch vụ</b></th>
                        <th><b>SL</b></th>
                        <th><b>Đơn giá</b></th>
                        <th align='center'><b>Giảm giá</b></th>
                        <th align='center'><b>Thành tiền</b></th>
                    </tr>
                    <tbody>
                        {dataOrderNew && dataOrderNew.map((item, key) => {
                            return (
                                <tr key={key}>
                                    <td>{moment(new Date()).format(FORMAT_DD_MM_YYYY)}</td>
                                    <td>{item.ten_MH}</td>
                                    <td align='center'>{item.soLuong}</td>
                                    <td align='right'>{formatMoney(item.gia_Ban)}</td>
                                    <td align='right'>{calculatorChietKhauRow(item)}</td>
                                    <td align='right'>{formatMoney(calculatorAmountAfterChietKhau(item))}</td>
                                </tr>
                            )
                        })}
                    </tbody>

                    <tr>
                        <td colSpan={5} align='right'><b>TỔNG TIỀN</b></td>
                        <td align='right'>{formatMoney(returnAmountNotCkBill(dataOrderNew))}</td>
                    </tr>
                    <tr>
                        <td colSpan={5} align='right'><b>GIẢM GIÁ</b></td>
                        <td align='right'>{formatMoney(totalCkMH())}</td>
                    </tr>
                </table>
            </Grid>

            <Grid item xs={12} sm={12} sx={{ fontSize: 10 }}>
                <Typography component="p" variant="p">
                    <b>Tổng tiền:</b> <b>{formatMoney(returnAmountNotCkBill(dataOrderNew) - totalCkMH())}</b>{" (" + DocTienBangChu(returnAmountNotCkBill(dataOrderNew) - totalCkMH()) + ")"}
                </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
                <Typography component="p" variant="p">
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>

                <table className='data-sign'>
                    <tr>
                        <td colSpan={3} align='right'>
                            <b>HẸN TÁI KHÁM:   </b> {"../../...."}
                        </td>
                    </tr>
                    <tr>
                        <th>Khách hàng</th>
                        <th>Nhân viên thu ngân</th>
                        <th>Bác sĩ điều trị</th>
                    </tr>
                    <tbody>
                        <tr>
                            <td align='center'>(Ký, họ tên)</td>
                            <td align='center'>(Ký, họ tên)</td>
                            <td align='center'>(Ký, họ tên)</td>
                        </tr>
                    </tbody>
                </table>
            </Grid>
        </Grid>
    );
}

function mapStateToProps(state) {
    const { isLoggedIn, user } = state.appReducers.auth;
    const { message } = state.appReducers.message;
    const { isReFetchData } = state.appReducers.message;
    const { listOutlet, outlet } = state.appReducers.outlet;
    const { listThucDon, orderNewList, totalAmount, orderedList, chietKhauBill } = state.appReducers.thucdon;
    const { table } = state.appReducers.setupTbl;
    const { customer } = state.appReducers.customer;

    return {
        isLoggedIn,
        message,
        isReFetchData,
        userInfo: user,
        listOutlet,
        outlet: outlet,
        listThucDon,
        orderNewList: orderNewList ? orderNewList : [],
        totalAmount,
        table,
        customer,
        orderedList,
        chietKhauBill
    };
}

export default connect(mapStateToProps)(PrintPhongKhamPhamacity);