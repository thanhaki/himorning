import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, TableCell, TableBody, TableRow, Table } from '@mui/material';
import { connect } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { formatMoney } from '../../../helpers/utils';

const columns = [
	{ field: 'ngay', headerName: 'Ngày', width: 80 },
	{ field: 'trangThai', headerName: 'Lịch', width: 50 },
	{ field: 'checkIn', headerName: 'Check in', width: 100 },
	{ field: 'checkOut', headerName: 'Check Out', width: 100 },
	{ field: 'thoiGian', headerName: 'Thời gian', width: 100 },
];

const PrintLuongCaNhan = (props) => {
	const data = localStorage.getItem("printLuongNV");
	var dataParse = JSON.parse(data);
	let { nameRow } = dataParse;
	console.log("nameRow[0]", nameRow[0])

	let filteredColumns = [];
	if (nameRow && nameRow.length > 0) {
		filteredColumns = (Object.keys(nameRow[0]).map((key) => ({
			id: key,
			ngay: key.substr(1),
			trangThai: nameRow[0][key],

		}))).filter(x => x.id.startsWith('d'));
	}
	var dataChan = [];
	dataChan = filteredColumns.map((item, index) => (
		index % 2 !== 0 ? { id: index, ...item } : null
	)).filter(Boolean);

	const numColumns = 3;
	const columnData = Array.from({ length: numColumns }, (_, columnIndex) => {
		return filteredColumns.filter((_, index) => index % numColumns === columnIndex);
	});

	var dataLe = [];
	dataLe = filteredColumns.map((item, index) => (
		index % 2 === 0 ? { id: index, ...item } : null
	)).filter(Boolean);

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
						<Typography variant="h7" component="div" sx={{ fontFamily: 'inherit' }}>
							<b>PHIẾU LƯƠNG CÁN BỘ NHÂN VIÊN</b>
						</Typography>
						<Typography variant='subtitle2' sx={{ fontFamily: 'inherit' }}>
							THÁNG: {nameRow && Object.keys(nameRow).length > 0 ? (nameRow[0]['monthView']) : ''}/{nameRow && Object.keys(nameRow).length > 0 ? nameRow[0]['year'] : ''}
						</Typography>
					</Box>
					<Grid item xs={12} sm={12} sx={{ borderTop: '1px dashed gray', mr: 1, mt: 2, mb: 1 }}>
					</Grid>

					<Grid container>
						<Grid item xs={12} sm={12} >
							<Grid item xs={12} sm={12}>
								<Typography variant='subtitle2' sx={{ fontFamily: 'inherit' }}>
									<b>Nhân viên: {nameRow && Object.keys(nameRow).length > 0 ? nameRow[0]['ten_NV'] : ''}</b>
								</Typography>
							</Grid>
							<Grid container item xs={12} sm={12} >
								<Grid item xs={4} sm={4}>
									<Table>
										<TableRow>
											<TableCell style={{ width: '10px', fontFamily: 'inherit' }}>Ngày</TableCell>
											<TableCell style={{ width: '60px', fontFamily: 'inherit' }}>Lịch</TableCell>
										</TableRow>
										<TableBody>
											{columnData[0].map((data) => (
												<TableRow key={data.id}>
													<TableCell >{data.ngay}</TableCell>
													<TableCell >{data.trangThai}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</Grid>
								<Grid item xs={4} sm={4}>
									<Table>
										<TableRow>
											<TableCell style={{ width: '10px', fontFamily: 'inherit' }}>Ngày</TableCell>
											<TableCell style={{ width: '60px', fontFamily: 'inherit' }}>Lịch</TableCell>
										</TableRow>
										<TableBody>
											{columnData[1].map((data) => (
												<TableRow key={data.id}>
													<TableCell >{data.ngay}</TableCell>
													<TableCell >{data.trangThai}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</Grid>
								<Grid item xs={4} sm={4}>
									<Table>
										<TableRow>
											<TableCell style={{ width: '10px', fontFamily: 'inherit' }}>Ngày</TableCell>
											<TableCell style={{ width: '60px', fontFamily: 'inherit' }}>Lịch</TableCell>
										</TableRow>
										<TableBody>
											{columnData[2].map((data) => (
												<TableRow key={data.id}>
													<TableCell >{data.ngay}</TableCell>
													<TableCell >{data.trangThai}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} sm={12} container spacing={1} style={{ padding: 2 }}>
							<Grid item xs={6} sm={6} >
								<Typography variant='subtitle2' sx={{ fontFamily: 'inherit' }}>
									Tổng số công: {nameRow && Object.keys(nameRow).length > 0 ? formatMoney(nameRow[0]['soCong']) : ''}
								</Typography>
								<Typography variant='subtitle2' sx={{ fontFamily: 'inherit' }}>
									Lương cơ bản(1.4): {nameRow && Object.keys(nameRow).length > 0 ? formatMoney(nameRow[0]['luongCapBac']) : ''}
								</Typography>
								<Typography variant='subtitle2' sx={{ fontFamily: 'inherit' }}>
									Lương trách nhiệm(0.7): {nameRow && Object.keys(nameRow).length > 0 ? formatMoney(nameRow[0]['luongTrachNhiem']) : ''}
								</Typography>
								<Typography variant='subtitle2' sx={{ fontFamily: 'inherit' }}>
									Lương tăng ca: {nameRow && Object.keys(nameRow).length > 0 ? formatMoney(nameRow[0]['luongTangCa']) : ''}
								</Typography>
								<Typography variant='subtitle2' sx={{ fontFamily: 'inherit' }}>
									Ghi chú: {nameRow && Object.keys(nameRow).length > 0 ? nameRow[0]['ghiChu'] : ''}
								</Typography>
							</Grid>

							<Grid item xs={6} sm={6} >
								<Typography variant='subtitle2' sx={{ fontFamily: 'inherit' }}>
									Phụ cấp: {nameRow && Object.keys(nameRow).length > 0 ? formatMoney(nameRow[0]['phuCap']) : ''}
								</Typography>
								<Typography variant='subtitle2' sx={{ fontFamily: 'inherit' }}>
									Giảm trừ BHXH: {nameRow && Object.keys(nameRow).length > 0 ? formatMoney(nameRow[0]['baoHiemXaHoi']) : ''}
								</Typography>
								<Typography variant='subtitle2' sx={{ fontFamily: 'inherit' }}>
									Khen thưởng: {nameRow && Object.keys(nameRow).length > 0 ? formatMoney(nameRow[0]['khenThuong']) : ''}
								</Typography>
								<Typography variant='subtitle2' sx={{ fontFamily: 'inherit' }}>
									Kỷ luật: {nameRow && Object.keys(nameRow).length > 0 ? formatMoney(nameRow[0]['kyLuat']) : ''}
								</Typography>
								<Typography variant='subtitle2' sx={{ fontFamily: 'inherit' }}>
									<b>Lương thực nhận: {nameRow && Object.keys(nameRow).length > 0 ? formatMoney(nameRow[0]['luongThucNhan']) : ''}</b>
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell sx={{ textAlign: 'left' }}>
									<Typography variant="h7" component="div" style={{ textAlign: 'center', fontFamily: 'inherit' }}>
										<b>Thủ trưởng:</b>
									</Typography>
									<Typography variant="subtitle2" style={{ textAlign: 'center', fontFamily: 'inherit' }}>
										(ký ghi rõ họ tên)
									</Typography>
								</TableCell>
								<TableCell sx={{ padding: '8px', textAlign: 'center', margin: '0 2px', fontFamily: 'inherit' }}>
									<Typography variant="h7" component="div">
										<b>Cán bộ nhân viên:</b>
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
export default connect(mapStateToProps)(PrintLuongCaNhan);