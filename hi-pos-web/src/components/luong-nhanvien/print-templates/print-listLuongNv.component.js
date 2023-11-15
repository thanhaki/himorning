import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, TableCell, TableBody, TableRow, Table } from '@mui/material';
import { connect } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { formatMoney } from '../../../helpers/utils';

const PrintListLuongNhanVien = () => {

    const data = localStorage.getItem("printListLuongNV");
	var dataParse = JSON.parse(data);
	let { nameRow } = dataParse;
	console.log("printListLuongNV", data)

    return (
        <Box
            sx={{
                marginTop: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Grid spacing={1} style={{ padding: 10 }}>
                <Grid item xs={12} sm={12} >
                    <Box textAlign="right">
                        <Box display="inline-block" textAlign="center">
                            <Typography variant="h7" component="div" style={{ ontFamily: 'inherit' }}>
                                <b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b>
                            </Typography>
                            <Typography variant="subtitle2" component="div" style={{ ontFamily: 'inherit' }}>
                                <b>Độc lập - Tư do - Hạnh phúc</b>
                            </Typography>
                        </Box>
                    </Box>
                    <Box textAlign={'center'}>
                        <Typography variant="h7" component="div" style={{ ontFamily: 'inherit' }}>
                            <b>ĐỀ XUẤT LƯƠNG CÁN BỘ NHÂN VIÊN</b>
                        </Typography>
                        <Typography variant='subtitle2' style={{ ontFamily: 'inherit' }}>
                            THÁNG: {nameRow && Object.keys(nameRow).length > 0 ? (nameRow[0]['monthView']) : ''}/{nameRow && Object.keys(nameRow).length > 0 ? nameRow[0]['year'] : ''}
                        </Typography>
                    </Box>
                    <Grid item xs={12} sm={12} sx={{ borderTop: '1px dashed gray', mr: 1, mt: 2, mb: 1 }}>
                    </Grid>

                    <Grid container>
                        <Grid item xs={12} sm={12} >
                            <Table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                <TableRow>
                                    <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit'}}>Nhân viên</TableCell>
                                    <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit' }}>HSL</TableCell>
                                    <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit' }}>HSTN</TableCell>
                                    <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>Số Công</TableCell>
                                    <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>Lương CB</TableCell>
                                    <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>Lương TN</TableCell>
                                    <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>Tăng ca</TableCell>
                                    <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>Đơn giá TC</TableCell>
                                    <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>Lương tăng ca</TableCell>
                                    <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>Phụ cấp</TableCell>
                                    <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>Khen thưởng</TableCell>
                                    <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>Kỷ luật</TableCell>
                                    <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>BHXH</TableCell>
                                    <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>Thực nhận</TableCell>
                                    <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>Ghi chú</TableCell>
                                </TableRow>
                                <TableBody>
                                    {nameRow.map((data) => (
                                        <TableRow key={data.id}>
                                            <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>{data.ten_NV}</TableCell>
                                            <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>{data.heSoCapBac}</TableCell>
                                            <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>{data.heSoTrachNhiem}</TableCell>
                                            <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>{data.soCong}</TableCell>
                                            <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>{data.luongCapBac.toLocaleString()}</TableCell>
                                            <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>{data.luongTrachNhiem.toLocaleString()}</TableCell>
                                            <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>{data.gioTangCa}</TableCell>
                                            <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>{data.luongCoBanTangCa.toLocaleString()}</TableCell>
                                            <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>{data.luongTangCa.toLocaleString()}</TableCell>
                                            <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>{data.phuCap.toLocaleString()}</TableCell>
                                            <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>{data.khenThuong.toLocaleString()}</TableCell>
                                            <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>{data.kyLuat.toLocaleString()}</TableCell>
                                            <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>{data.baoHiemXaHoi.toLocaleString()}</TableCell>
                                            <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>{data.luongThucNhan.toLocaleString()}</TableCell>
                                            <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', textAlign:'right' }}>{data.ghiChu}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={3} sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', fontWeight: 'bold',color: 'red',textAlign: 'center' }}>
                                            Tổng
                                        </TableCell>
                                        {/* <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit'}} />
                                        <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit'}} /> */}
                                        <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', fontWeight: 'bold',color: 'red', textAlign:'right' }}>
                                            {nameRow.reduce((total, data) => total + data.soCong, 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', fontWeight: 'bold',color: 'red', textAlign:'right' }}>
                                            {nameRow.reduce((total, data) => total + data.luongCapBac, 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', fontWeight: 'bold',color: 'red', textAlign:'right' }}>
                                            {nameRow.reduce((total, data) => total + data.luongTrachNhiem, 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', fontWeight: 'bold',color: 'red', textAlign:'right' }}>
                                            {nameRow.reduce((total, data) => total + data.gioTangCa, 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', fontWeight: 'bold',color: 'red', textAlign:'right' }}>
                                            {nameRow.reduce((total, data) => total + data.luongCoBanTangCa, 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', fontWeight: 'bold',color: 'red', textAlign:'right' }}>
                                            {nameRow.reduce((total, data) => total + data.luongTangCa, 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', fontWeight: 'bold',color: 'red', textAlign:'right' }}>
                                            {nameRow.reduce((total, data) => total + data.phuCap, 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', fontWeight: 'bold',color: 'red', textAlign:'right' }}>
                                            {nameRow.reduce((total, data) => total + data.khenThuong, 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', fontWeight: 'bold',color: 'red', textAlign:'right' }}>
                                            {nameRow.reduce((total, data) => total + data.kyLuat, 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', fontWeight: 'bold',color: 'red', textAlign:'right' }}>
                                            {nameRow.reduce((total, data) => total + data.baoHiemXaHoi, 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit', fontWeight: 'bold',color: 'red', textAlign:'right' }}>
                                            {nameRow.reduce((total, data) => total + data.luongThucNhan, 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px', border: '1px solid black', fontFamily: 'inherit'}} />
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ textAlign: 'left' }}>
                                            <Typography variant="h7" component="div" style={{ textAlign: 'center', fontFamily: 'inherit' }}>
                                                <b>Quản lý:</b>
                                            </Typography>
                                            <Typography variant="subtitle2" style={{ textAlign: 'center', fontFamily: 'inherit' }}>
                                                (ký ghi rõ họ tên)
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ padding: '8px', textAlign: 'center', margin: '0 2px', fontFamily: 'inherit' }}>
                                            <Typography variant="h7" component="div">
                                                <b>Kế toàn:</b>
                                            </Typography>
                                            <Typography variant="subtitle2" style={{ textAlign: 'center', fontFamily: 'inherit' }}>
                                                (ký ghi rõ họ tên)
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'right' }}>
                                            <Typography variant="h7" component="div" style={{ textAlign: 'center', fontFamily: 'inherit' }}>
                                                <b>Giám đốc:</b>
                                            </Typography>
                                            <Typography variant="subtitle2" style={{ textAlign: 'center', fontFamily: 'inherit' }}>
                                                (ký ghi rõ họ tên)
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )

}

function mapStateToProps(state) {
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    return {
        userInfo: user,
        isReFetchData: isReFetchData,
    };
}
export default connect(mapStateToProps)(PrintListLuongNhanVien);