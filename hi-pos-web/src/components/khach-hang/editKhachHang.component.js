import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import {
	DialogActions, DialogContentText, DialogTitle, DialogContent, Dialog,
	Typography, TextField, Box, Button, Container
} from "@mui/material";
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';
import { connect } from "react-redux";
import { ROWS_PER_PAGE_OPTIONS, FORMAT_DD_MM_YYYY } from '../../consts/constsCommon'
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import khachHangService from '../../services/khachHang.service';
import { Formik } from "formik";
import AddKhachHang from './addKhachHang.component';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import moment from 'moment';
import { formatMoney } from '../../helpers/utils';
const theme = createTheme();
const columnHD = [
	{
		field: 'maDonHang',
		headerName: 'Số hóa đơn',
		width: 180,
		editable: true,
		align:'center'
	},
	{
		field: 'ngay_DonHang',
		headerName: 'Ngày',
		valueFormatter: params =>
			moment(params?.value).format(FORMAT_DD_MM_YYYY),
		width: 150,
		editable: true,
		align:'center'
	},
	{
		field: 'thanhTien_DonHang',
		headerName: 'Số tiền',
		valueFormatter: params =>
			formatMoney(params?.value),
		width: 150,
		editable: true,
		align:'right'
	},
	{
		field: 'thoiGianThanhToan',
		headerName: 'Thanh toán lúc',
		valueFormatter: params =>
			moment(params?.value).format(FORMAT_DD_MM_YYYY),
		width: 150,
		editable: true,
		align:'center'
	},
	{
		field: 'thuNgan',
		headerName: 'Thu ngân',
		width: 200,
		editable: true,
		align:'center'
	},
	{
		field: 'tinhTrangDon',
		headerName: 'Tinh trạng',
		width: 150,
		editable: true,
		align:'center'
	},
];

const columnLs = [
	{
		field: 'maDonHang',
		headerName: 'Hóa đơn',
		width: 150,
		editable: true,
		align: 'center'
	},
	{
		field: 'createDate',
		headerName: 'Ngày',
		valueFormatter: params =>
			moment(params?.value).format(FORMAT_DD_MM_YYYY),
		width: 150,
		editable: true,
		align:'center'
	},
	{
		field: 'tien_DonHang',
		headerName: 'Số tiền',
		width: 150,
		editable: true,
		valueFormatter: params =>
			formatMoney(params?.value),
		align:'right'
	},
	{
		field: 'diemTichLuyCu',
		headerName: 'Điểm cũ',
		width: 150,
		editable: true,
		align:'center'
	},
	{
		field: 'diemTichLuyThem',
		headerName: 'Cộng thêm',
		width: 150,
		editable: true,
		align:'center'
	},
	{
		field: 'diemTichLuyMoi',
		headerName: 'Điểm mới',
		width: 150,
		editable: true,
		align: 'center'
	},
];

function EditKhachHang(props) {
	const { open, handleClose, handleLoadPageParent, nameRow } = props;
	const [isReload, setIsReload] = useState(false);
	const [selectionModel, setSelectionModel] = useState([]);
	const dispatch = useDispatch()
	const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [selectedValue, setSelected] = useState('0');
	const [listDataChange, setlistDataChange] = useState([]);
	const [DataLichSu, setDataLichSuChange] = useState([]);
	
	const initValues = {
		ma_KH: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ma_KH : 0
		, ten_KH: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ten_KH : ''
		, dienThoai_KH: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.dienThoai_KH : ''
		, ghiChu_KH: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ghiChu_KH : ''
		, donVi: 0
		, tongSoHoaDon_KH: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.tongSoHoaDon_KH : ''
		, tongThanhToan_KH: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.tongThanhToan_KH : ''
		, chiTieuTrungBinh_KH: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.chiTieuTrungBinh_KH : ''
		, diemTichLuy: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.diemTichLuy : ''
	}

	useEffect(() => {
		getAllKhachHang();
		dispatch(reFetchData(false));
	}, [isReload])


	const getAllKhachHang = () => {

		let params = props.nameRow.row.ma_KH
		khachHangService.getListHDByKh(params).then((result) => {
			setlistDataChange(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const handleCancel = (event, reason) => {
		if (reason && reason === "backdropClick")
			return;
		if (handleClose) { handleClose() }
	}

	const save = (values) => {
		dispatch(showLoading(true));
		khachHangService.updateKhachHang(values).then((result) => {
			dispatch(hideLoading());
			showMessageByType(null, "success", TYPE_ERROR.success)
			if (handleLoadPageParent) { handleLoadPageParent(); }
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}
	const handleLoadPageEdit = () => {
		setIsReload(!isReload);
	}

	const handleCloseEdit = () => {
		setOpenEdit(false);
		if (handleClose) { handleClose() }
	}

	const handleAdd = () => {
		setOpenEdit(true);
	}
	const handleChangeButton = (event) => {
		setSelected(event.target.value);
		let data = props.nameRow.row.ma_KH
		dispatch(showLoading(data));
		if (event.target.value === '0') {
			khachHangService.getListHDByKh(data).then((result) => {
				setlistDataChange(result.data);
				dispatch(hideLoading());
			}).catch((error) => {
				dispatch(hideLoading());
				showMessageByType(error, "error", TYPE_ERROR.error);
			})
		} else {
			khachHangService.getListTichDiemByKh(data).then((result) => {
				setDataLichSuChange(result.data);
				dispatch(hideLoading());
			}).catch((error) => {
				dispatch(hideLoading());
				showMessageByType(error, "error", TYPE_ERROR.error);
			})
		}
	};

	return (
		<React.Fragment>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				scroll={"paper"}
				aria-describedby="scroll-dialog-description"
				maxWidth="lg"
			>
				{!isSubmitionCompleted && (
					<React.Fragment>
						<DialogContent>
							<Formik
								initialValues={initValues}
								onSubmit={(values) => {
									save(values);
								}}
							>
								{props => {
									const {
										values,
										touched,
										errors,
										dirty,
										isSubmitting,
										handleChange,
										handleBlur,
										handleSubmit,
									} = props;
									return (
										<form>
											<Grid item xs={12} sm={12} container spacing={2}>
												<Grid item xs={12} sm={12} sx={{ textAlign: 'center', fontWeight: "bold" }}>
													<Typography variant="subtitle1" sx={{ textAlign: 'center' ,fontWeight: "bold", textTransform: "uppercase"}}>
														{values.ten_KH}
													</Typography>
												</Grid>
												<Grid item xs={12} sm={12} style={{ textAlign: 'center', fontWeight: "bold", padding:0}}>
													<Typography variant="subtitle1">
														{values.dienThoai_KH}
													</Typography>
												</Grid>
												<Grid item xs={12} sm={12} style={{padding:0}}>
													<Button variant="text" fullWidth size="medium" onClick={handleAdd}>Sửa thông tin khách hàng</Button>
												</Grid>
												<Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
													<Typography variant="subtitle1">
														{values.tongSoHoaDon_KH}
													</Typography>
													<Typography variant="subtitle1" sx={{ textAlign: 'center' ,fontWeight: "bold"}}>
														Số hóa đơn
													</Typography>
												</Grid>

												<Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
													<Typography variant="subtitle1">
														{formatMoney(values.tongThanhToan_KH)}
													</Typography>
													<Typography variant="subtitle1" sx={{ textAlign: 'center' ,fontWeight: "bold"}}>
														T.Thanh toán
													</Typography>
												</Grid>

												<Grid item xs={6} sm={3} sx={{ textAlign: 'center'}}>
													<Typography variant="subtitle1">
														{formatMoney(values.chiTieuTrungBinh_KH)}
													</Typography>
													<Typography variant="subtitle1" sx={{ textAlign: 'center' ,fontWeight: "bold"}}>
														CT.Trung bình
													</Typography>
												</Grid>

												<Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
													<Typography variant="subtitle1">
														{values.diemTichLuy}
													</Typography>
													<Typography variant="subtitle1" sx={{ textAlign: 'center' ,fontWeight: "bold"}}>
														Điểm tích lũy
													</Typography>
												</Grid>

												<Grid item xs={12} sm={12}>
													<Typography>
														Ghi chú
													</Typography>
													<TextField
														error={errors.ghiChu_KH && touched.ghiChu_KH}
														name="ghiChu_KH"
														size="small"
														fullWidth
														value={values.ghiChu_KH}
														onChange={handleChange}
														onBlur={handleBlur}
														helperText={
															errors.ghiChu_KH && touched.ghiChu_KH && errors.ghiChu_KH
														}
														margin="nomal"
													/>
												</Grid>
												<Grid  item xs={12} sm={3} spacing={2}>
													<Button
														variant="outlined"
														fullWidth
														size="medium"
														value="0"
														onClick={handleChangeButton}
													>
														Hóa đơn gần nhất
													</Button>
												</Grid>
												<Grid item xs={12} sm={3} spacing={2}>
													<Button
														variant="outlined"
														fullWidth
														size="medium"
														value="1"
														onClick={handleChangeButton}
													>
														Lịch sử điểm tích lũy
													</Button>
												</Grid>
												<Grid item xs={12} sm={12}>
													<Box sx={{ height: 300, width: '100%' }}>
														{selectedValue === '0' && (
															<DataGrid
																rows={listDataChange}
																columns={columnHD}
																pageSize={5}
																rowsPerPageOptions={[ROWS_PER_PAGE_OPTIONS]}
																editingMode="modal"
																disableSelectionOnClick
																experimentalFeatures={{ newEditingApi: true }}
																onSelectionModelChange={(newSelectionModel) => {
																	setSelectionModel(newSelectionModel);
																}}
																selectionModel={selectionModel}
															/>
														)}
														{selectedValue === '1' && (
															<DataGrid
																rows={DataLichSu}
																columns={columnLs}
																pageSize={5}
																rowsPerPageOptions={[ROWS_PER_PAGE_OPTIONS]}
																editingMode="modal"
																disableSelectionOnClick
																experimentalFeatures={{ newEditingApi: true }}
																onSelectionModelChange={(newSelectionModel) => {
																	setSelectionModel(newSelectionModel);
																}}
																selectionModel={selectionModel}
															/>
														)}
													</Box>
												</Grid>

												<Grid item xs={12} sm={12}>
													<Grid container justifyContent="flex-end" style={{ padding: 5 }}>
														<Grid item paddingLeft={2} align="right" spacing={2}>
															<Button
																type="button"
																startIcon={<ArrowBackIcon />}
																variant="contained"
																onClick={handleCancel}
																size="small"
																color="error"
															>
																Đóng
															</Button>
														</Grid>
														<Grid item paddingLeft={2} align="right" spacing={2}>
															<Button type="button" variant="contained" size="small" name='saveGhiChu'
																onClick={(event) => handleSubmit(values)}>
																Lưu
															</Button>
														</Grid>
														{openEdit && <AddKhachHang open={openEdit} nameRow={nameRow} title={"CHỈNH SỬA KHÁCH HÀNG"} handleClose={handleCloseEdit} handleLoadPageParent={handleLoadPageEdit} />}
													</Grid>
												</Grid>
											</Grid>
										</form>
									);
								}}
							</Formik>
						</DialogContent>
					</React.Fragment>
				)}
				{isSubmitionCompleted && (
					<React.Fragment>
						<DialogTitle id="form-dialog-title">Thanks!</DialogTitle>
						<DialogContent>
							<DialogContentText>Thanks</DialogContentText>
							<DialogActions>
								<Button type="button" className="outline" onClick={handleClose}>
									Back to app
								</Button>
							</DialogActions>
						</DialogContent>
					</React.Fragment>
				)}
			</Dialog>
		</React.Fragment>
	);
}

function mapStateToProps(state) {
	const { message } = state.appReducers;
	const { user } = state.appReducers.auth;
	return {
		message,
		userInfo: user
	};
}

export default connect(mapStateToProps)(EditKhachHang);