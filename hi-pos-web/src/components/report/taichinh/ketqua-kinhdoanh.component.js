import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, Box, Button } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, connect } from 'react-redux';
import { FORMAT_YYYY_MM_DD } from '../../../consts/constsCommon';
import reportService from '../../../services/report.service';
import { showMessageByType, TYPE_ERROR } from '../../../helpers/handle-errors';
import { showLoading, hideLoading, reFetchData } from "../../../actions/index";
import moment from 'moment';
import { formatMoney } from '../../../helpers/utils';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
const BaoCaoKetQuaKinhDoanh = (props) => {
    const dispatch = useDispatch();
    const [dataHienTai, setDataHienTai] = useState();
    const [dataSoSanh, setDataSoSanh] = useState();
    const [dataThuNhap, setDataThuNhap] = useState([]);
    const [dataChiPhi, setDataChiPhi] = useState([]);
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
            reportService.getBaoCaoKetQuaKD(data).then(res => {
                if (res.data) {
                    setDataHienTai(res.data.kyHienTai);
                    setDataSoSanh(res.data.kySoSanh);
                    setDataThuNhap(res.data.thuNhap);
                    setDataChiPhi(res.data.chiPhi);
                }
                dispatch(hideLoading());
                dispatch(reFetchData(false));
            }).catch(error => {
                showMessageByType(error, "Load dữ liệukhông thành công", TYPE_ERROR.error)
                dispatch(hideLoading());
                dispatch(reFetchData(false));
            });
        }
    }, [props.isReFetchData]);

    const percentChange = (valHienTai, valSoSanh) => {
        if (valHienTai === 0 && valSoSanh === 0) {
            return "--";
        }
        var perCurrent = Math.round((valHienTai / valSoSanh) * 100);
        var perSS = 100 - perCurrent;
        var diff = valSoSanh === 0 ? 100 : perCurrent - perSS;
        if (diff > 0) {
            return <Button disabled={true} sx={{ color: 'black !important' }} startIcon={<ArrowUpwardIcon />}>{diff + "%"}</Button>
        }
        return <Button disabled={true} sx={{ color: 'black !important' }} startIcon={<ArrowDownwardIcon />}>{diff === 0 ? 0 : Math.abs(diff - 100) + "%"}</Button>
    }
    return (
        <>
            <Box textAlign={'center'}>
                <h3>BÁO CÁO KẾT QUẢ KINH DOANH</h3>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell size='small' width={1}>STT</TableCell>
                            <TableCell size='small' align="left">Tài chính tổng hợp</TableCell>
                            <TableCell size='small' align="right">Kỳ hiện tại</TableCell>
                            <TableCell size='small' align="right">Đầu năm tới hôm nay</TableCell>
                            <TableCell size='small' align="right">Thay đổi</TableCell>
                        </TableRow>
                    </TableHead>
                    {dataHienTai && dataSoSanh && <TableBody>
                        <TableRow>
                            <TableCell size='small' width={1} ><b>A</b></TableCell>
                            <TableCell size='small' align="left"><b>DANH THU BÁN HÀNG (A1-A3)</b></TableCell>
                            <TableCell size='small' align="right"><b>{formatMoney(dataHienTai?.tongDoanhThuBanHang)}<u>đ</u></b></TableCell>
                            <TableCell size='small' align="right"><b>{formatMoney(dataSoSanh?.tongDoanhThuBanHang)}<u>đ</u></b></TableCell>
                            <TableCell size='small' align="right" sx={{ color: 'black' }}>{percentChange(dataHienTai?.tongDoanhThuBanHang, dataSoSanh?.tongDoanhThuBanHang)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell size='small' width={1}><b>A1</b></TableCell>
                            <TableCell size='small' align="left">Tiền hàng</TableCell>
                            <TableCell size='small' align="right">{formatMoney(dataHienTai?.doanhThuBanHang?.tienHang)}<u>đ</u></TableCell>
                            <TableCell size='small' align="right">{formatMoney(dataSoSanh?.doanhThuBanHang?.tienHang)}<u>đ</u></TableCell>
                            <TableCell size='small' align="right" sx={{ color: 'black' }}>{percentChange(dataHienTai?.doanhThuBanHang?.tienHang, dataSoSanh?.doanhThuBanHang?.tienHang)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell size='small' width={1}><b>A3</b></TableCell>
                            <TableCell size='small' align="left">Thuế</TableCell>
                            <TableCell size='small' align="right">{formatMoney(dataHienTai?.doanhThuBanHang?.tienThue)}<u>đ</u></TableCell>
                            <TableCell size='small' align="right">{formatMoney(dataSoSanh?.doanhThuBanHang?.tienThue)}<u>đ</u></TableCell>
                            <TableCell size='small' align="right" sx={{ color: 'black' }}>{percentChange(dataHienTai?.doanhThuBanHang?.tienThue, dataSoSanh?.doanhThuBanHang?.tienThue)}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell size='small' width={1}><b>B</b></TableCell>
                            <TableCell size='small' align="left"><b>GIẢM TRỪ DOANH THU (B1+B4)</b></TableCell>
                            <TableCell size='small' align="right"><b>{formatMoney(dataHienTai?.tongDoanhThuGiamTru)}<u>đ</u></b></TableCell>
                            <TableCell size='small' align="right"><b>{formatMoney(dataSoSanh?.tongDoanhThuGiamTru)}<u>đ</u></b></TableCell>
                            <TableCell size='small' align="right" sx={{ color: 'black' }}>{percentChange(dataHienTai?.tongDoanhThuGiamTru, dataSoSanh?.tongDoanhThuGiamTru)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell size='small' width={1}><b>B1</b></TableCell>
                            <TableCell size='small' align="left">Giảm giá</TableCell>
                            <TableCell size='small' align="right">{formatMoney(dataHienTai?.doanhThuGiamTru?.giamGia)}<u>đ</u></TableCell>
                            <TableCell size='small' align="right">{formatMoney(dataSoSanh?.doanhThuGiamTru?.giamGia)}<u>đ</u></TableCell>
                            <TableCell size='small' align="right" sx={{ color: 'black' }}>{percentChange(dataHienTai?.doanhThuGiamTru?.giamGia, dataSoSanh?.doanhThuGiamTru?.giamGia)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell size='small' width={1}><b>B4</b></TableCell>
                            <TableCell size='small' align="left">Doanh thu hủy/hoàn</TableCell>
                            <TableCell size='small' align="right">{formatMoney(dataHienTai?.doanhThuGiamTru?.huyHoan)}<u>đ</u></TableCell>
                            <TableCell size='small' align="right">{formatMoney(dataSoSanh?.doanhThuGiamTru?.huyHoan)}<u>đ</u></TableCell>
                            <TableCell size='small' align="right" sx={{ color: 'black' }}>{percentChange(dataHienTai?.doanhThuGiamTru?.huyHoan, dataSoSanh?.doanhThuGiamTru?.huyHoan)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell size='small' width={1}><b>C</b></TableCell>
                            <TableCell size='small' align="left"><b>DOANH THU THUẦN (C=A-B)</b></TableCell>
                            <TableCell size='small' align="right"><b>{formatMoney(dataHienTai?.doanhThuThuan)}<u>đ</u></b></TableCell>
                            <TableCell size='small' align="right"><b>{formatMoney(dataSoSanh?.doanhThuThuan)}<u>đ</u></b></TableCell>
                            <TableCell size='small' align="right" sx={{ color: 'black' }}>{percentChange(dataHienTai?.doanhThuThuan, dataSoSanh?.doanhThuThuan)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell size='small' width={1}><b>D</b></TableCell>
                            <TableCell size='small' align="left"><b>GIÁ VỐN HÀNG BÁN</b></TableCell>
                            <TableCell size='small' align="right"></TableCell>
                            <TableCell size='small' align="right"></TableCell>
                            <TableCell size='small' align="right"></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell size='small' width={1}><b>E</b></TableCell>
                            <TableCell size='small' align="left"><b>DOANH THU GỘP VỀ BÁN HÀNG (E=C-D)</b></TableCell>
                            <TableCell size='small' align="right"><b>{formatMoney(dataHienTai?.doanhThuGop)}<u>đ</u></b></TableCell>
                            <TableCell size='small' align="right"><b>{formatMoney(dataSoSanh?.doanhThuGop)}<u>đ</u></b></TableCell>
                            <TableCell size='small' align="right" sx={{ color: 'black' }}>{percentChange(dataHienTai?.doanhThuGop, dataSoSanh?.doanhThuGop)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell size='small' width={1}><b>F</b></TableCell>
                            <TableCell size='small' align="left"><b>CHI PHÍ</b></TableCell>
                            <TableCell size='small' align="right"><b>{formatMoney(dataHienTai?.tongChiPhi)}<u>đ</u></b></TableCell>
                            <TableCell size='small' align="right"><b>{formatMoney(dataSoSanh?.tongChiPhi)}<u>đ</u></b></TableCell>
                            <TableCell size='small' align="right" sx={{ color: 'black' }}>{percentChange(dataHienTai?.tongChiPhi, dataSoSanh?.tongChiPhi)}</TableCell>
                        </TableRow>
                        {dataChiPhi && dataChiPhi.map((item, index) => {
                            return <TableRow>
                                <TableCell size='small' width={1}>{"G" + (index + 1)}</TableCell>
                                <TableCell size='small' align="left">{item.ten_DanhMucThuChi}</TableCell>
                                <TableCell size='small' align="right">{formatMoney(item.giaTriKyHienTai)}<u>đ</u></TableCell>
                                <TableCell size='small' align="right">{formatMoney(item.giaTriKySoSanh)}<u>đ</u></TableCell>
                                <TableCell size='small' align="right" sx={{ color: 'black' }}>{percentChange(item.giaTriKyHienTai, item.giaTriKySoSanh)}</TableCell>
                            </TableRow>
                        })}
                        <TableRow>
                            <TableCell size='small' width={1}><b>G</b></TableCell>
                            <TableCell size='small' align="left"><b>THU NHẬP</b></TableCell>
                            <TableCell size='small' align="right"><b>{formatMoney(dataHienTai?.tongThuNhap)}<u>đ</u></b></TableCell>
                            <TableCell size='small' align="right"><b>{formatMoney(dataSoSanh?.tongThuNhap)}<u>đ</u></b></TableCell>
                            <TableCell size='small' align="right" sx={{ color: 'black' }}>{percentChange(dataHienTai?.tongThuNhap, dataSoSanh?.tongThuNhap)}</TableCell>
                        </TableRow>
                        {dataThuNhap && dataThuNhap.map((item, index) => {
                            return <TableRow>
                                <TableCell size='small' width={1}>{"G" + (index + 1)}</TableCell>
                                <TableCell size='small' align="left">{item.ten_DanhMucThuChi}</TableCell>
                                <TableCell size='small' align="right">{formatMoney(item.giaTriKyHienTai)}<u>đ</u></TableCell>
                                <TableCell size='small' align="right">{formatMoney(item.giaTriKySoSanh)}<u>đ</u></TableCell>
                                <TableCell size='small' align="right" sx={{ color: 'black' }}>{percentChange(item.giaTriKyHienTai, item.giaTriKySoSanh)}</TableCell>
                            </TableRow>
                        })}
                        <TableRow>
                            <TableCell size='small' width={1}><b>H</b></TableCell>
                            <TableCell size='small' align="left"><b>LỢI NHUẬN TRƯỚC THUẾ (H = E - F + G)</b></TableCell>
                            <TableCell size='small' align="right"><b>{formatMoney(dataHienTai?.loiNhuanTruocThue)}<u>đ</u></b></TableCell>
                            <TableCell size='small' align="right"><b>{formatMoney(dataSoSanh?.loiNhuanTruocThue)}<u>đ</u></b></TableCell>
                            <TableCell size='small' align="right" sx={{ color: 'black' }}>{percentChange(dataHienTai?.loiNhuanTruocThue, dataSoSanh?.loiNhuanTruocThue)}</TableCell>
                        </TableRow>
                    </TableBody>}

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

export default connect(mapStateToProps)(BaoCaoKetQuaKinhDoanh);