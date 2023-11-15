import React, { useState, useEffect, useRef } from 'react';
import {
	DialogActions, DialogContentText, DialogTitle, DialogContent, Dialog,
	TextareaAutosize, Typography, TextField, Box, Button, FormControl
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { connect } from "react-redux";
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { stylesErrorHelper } from '../../consts/modelStyle';
import { Grid } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon';
import { DataGrid } from '@mui/x-data-grid';
import nhomKhachHangService from '../../services/nhomKhachHang.service';
import AddKhachHangByIdNhom from './addKhachHangByIdNhom.component'
import khachHangService from '../../services/khachHang.service';
import ListKhachHang from '../khach-hang/listKhachHang.component'
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


function AddNhomKhachHang(props) {

	const st = {
		width: '100%',
	}


	const columns = [
		{
			field: 'ten_KH',
			headerName: 'Khách hàng',
			width: 160,
			editable: true,
		},
		{
			field: 'dienThoai_KH',
			headerName: 'Điện thoại',
			width: 300,
			editable: true,
		},
	];

	const { open, title, handleClose, handleLoadPageParent, nameRow } = props;
	const dispatch = useDispatch()
	const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
	const [selectionModel, setSelectionModel] = useState([]);
	const [listKhachHang, setListKhachHang] = useState([]);
	const [openEditListKhachHang, setOpenEditListKhachHang] = useState(false);
	const [isReload, setIsReload] = useState(false);
	const navigate = useNavigate();
	const [name, setNameSearch] = useState("");

	const initValues = {
		ten_NKH: nameRow && Object.keys(nameRow).length > 0 ? nameRow.row.ten_NKH : ''
		, ghiChu_NKH: nameRow && Object.keys(nameRow).length > 0 ? nameRow.row.ghiChu_NKH : ''
		, donVi: 0
		, ma_NKH: nameRow && Object.keys(nameRow).length > 0 ? nameRow.row.ma_NKH : 0
	}

	useEffect(() => {
		if (nameRow && Object.keys(nameRow).length > 0) {
			getKhachHangById();
		}

		dispatch(reFetchData(false));
	}, [isReload])



	const getKhachHangById = () => {
		var data = {
			donVi: props.userInfo?.user?.donVi,
			ma_NKH: nameRow.row.ma_NKH,
		}
		dispatch(showLoading(data));
		khachHangService.getListKhByIdNhom(data).then((result) => {
			setListKhachHang(result.data);
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
		nhomKhachHangService.addNhomKhachHang(values).then((result) => {
			dispatch(hideLoading());
			showMessageByType(null, "success", TYPE_ERROR.success)
			if (handleLoadPageParent) { handleLoadPageParent(); }
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const update = (values) => {
		dispatch(showLoading(true));
		nhomKhachHangService.updateNhomKhachHang(values).then((result) => {
			dispatch(hideLoading());
			showMessageByType(null, "success", TYPE_ERROR.success)
			if (handleLoadPageParent) { handleLoadPageParent(); }
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const handleSearch = () => {
		if (nameRow && Object.keys(nameRow).length > 0) {
			setOpenEditListKhachHang(true);
		}
	}
	const handleEditClose = () => setOpenEditListKhachHang(false);

	const handleLoadPage = () => {
		setIsReload(!isReload);
	}

	const handleAddKh = () => {
		navigate('/khach-hang');
	}
	return (
		<React.Fragment>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				scroll={"paper"}
				aria-describedby="scroll-dialog-description"
				maxWidth="md"
			>
				{!isSubmitionCompleted && (
					<React.Fragment>
						<DialogContent>
							<Formik
								initialValues={initValues}
								onSubmit={(values, { setSubmitting }) => {
									setSubmitting(true);
									// call api
									if (nameRow && Object.keys(nameRow).length > 0) {
										update(values);
									} else {
										save(values);
									}
									setSubmitting(false);
								}}
								validationSchema={Yup.object().shape({
									ten_NKH: Yup
										.string()
										.required('Tên nhóm khách hàng không được bỏ trống'),
								})}
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
										<form onSubmit={handleSubmit}>
											<Grid item xs={12} sm={12} >
												<DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
											</Grid>
											<Grid container spacing={1}>
												<Grid item xs={12} sm={12} container spacing={1}>
													<Grid item xs={12} sm={4} >
														<TextField
															error={errors.ten_NKH && touched.ten_NKH}
															name="ten_NKH"
															size="small"
															fullWidth
															label='Tên nhóm khách hàng'
															value={values.ten_NKH}
															onChange={handleChange}
															onBlur={handleBlur}
															helperText={
																errors.ten_NKH && touched.ten_NKH && errors.ten_NKH
															}
															margin="nomal"
														/>
													</Grid>
													<Grid item xs={12} sm={4} >
														<FormControl size="small" fullWidth>
															<TextField
																fullWidth
																label='Lựa chọn nhóm khách hàng'
																id="outlined-required"
																value={name}
																size="small"
																onChange={e => setNameSearch(e.target.value)}
																margin="nomal"
															/>
														</FormControl>
													</Grid>
													<Grid item xs={12} sm={4}>
															<Button variant="outlined" fullWidth startIcon={<SendIcon />} size="medium" onClick={handleSearch}>Tìm kiếm</Button>
													</Grid>

													<Grid item xs={12} sm={12} >
														<Button variant="text" fullWidth size="medium" onClick={handleAddKh}>+ Thêm mới khách hàng</Button>
													</Grid>
													<Grid item xs={12} sm={12} >
															<TextareaAutosize
																error={errors.ghiChu_NKH && touched.ghiChu_NKH}
																style={st}
																name="ghiChu_NKH"
																minRows={3}
																size="small"
																fullWidth
																value={values.ghiChu_NKH}
																onChange={handleChange}
																onBlur={handleBlur}
																helperText={
																	errors.ghiChu_NKH && touched.ghiChu_NKH && errors.ghiChu_NKH
																}
																margin="nomal"
															/>
													</Grid>
													<Grid item xs={12} sm={12}>
														<DialogContent dividers={false}>
															<DialogContentText
																id="scroll-dialog-description"
																tabIndex={-1}
															>
																<Box sx={{ flexGrow: 1 }}>
																	<Grid container justifyContent="flex-end" spacing={1}>
																		<Grid item  >
																			<Button
																				variant="contained"
																				startIcon={<ArrowBackIcon />}
																				onClick={handleCancel}
																				size="small"
																				color="error"
																			>
																				Đóng
																			</Button>
																		</Grid>
																		<Grid item >
																			<Button type="submit" variant="contained" size="small"
																				disabled={isSubmitting}
																			>
																				Lưu
																			</Button>
																		</Grid>
																	</Grid>
																</Box>
															</DialogContentText>
														</DialogContent>
													</Grid>
												</Grid>
												<Grid item spacing={1} xs={12} sm={12} container justify="space-between">
													<Grid item xs={12} sm={12}>
														<Box sx={{ height: 350, width: '100%' }}>
															<DataGrid
																rows={listKhachHang}
																columns={columns}
																pageSize={4}
																rowsPerPageOptions={[5]}
																editingMode="modal"
																disableSelectionOnClick
																experimentalFeatures={{ newEditingApi: true }}
																onSelectionModelChange={(newSelectionModel) => {
																	setSelectionModel(newSelectionModel);
																}}
																selectionModel={selectionModel}
															/>
														</Box>
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
				{openEditListKhachHang && <AddKhachHangByIdNhom open={openEditListKhachHang} nameSearch={name} nameRow={nameRow} handleClose={handleEditClose} handleLoadPageParent={handleLoadPage} />}

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
export default connect(mapStateToProps)(AddNhomKhachHang);