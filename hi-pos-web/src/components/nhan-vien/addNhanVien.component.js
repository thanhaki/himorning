import React, { useState, useEffect, useRef } from 'react';
import { DialogContentText, DialogTitle, DialogContent, Dialog, MenuItem, Select, InputLabel, FormControl, Typography, TextField, Box, Button } from "@mui/material";
import { connect } from "react-redux";
import { showLoading, hideLoading } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import PinInput from "react-pin-input";
import { Grid } from '@mui/material';
import nhanVienService from '../../services/nhanVien.service';
import { Formik, } from "formik";
import * as Yup from "yup";
import nhomQuyenService from '../../services/nhomQuyen.service';

function Contact(props) {
	const { open, title, handleClose, handleLoadPageParent, nameRow, isHiddenOptionRightMenu } = props;
	const dispatch = useDispatch();
	const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
	const [listNhomQuyen, setListNhomQuyen] = useState([]);
	const [pinElement, setPinEle] = useState(null);


	const initValues = {
		email: nameRow  ? nameRow.email : ''
		, fullName: nameRow  ? nameRow.fullName : ''
		, password: nameRow  ? nameRow.password : ''
		, phone: nameRow  ? nameRow.phone : ''
		, pin: nameRow  ? nameRow.pin : ''
		, userName: nameRow  ? nameRow.userName : ''
		, confirmPassWord: nameRow  ? nameRow.password : ''
		, ma_NhomQuyen: nameRow  ? nameRow.ma_NhomQuyen : 0
		, no_User: nameRow  ? nameRow.no_User : ''
		, donVi: 0
	}

	useEffect(() => {
		setSubmitionCompleted(false);
		let data = props.userInfo?.user?.donVi
		dispatch(showLoading(true));
		nhomQuyenService.getAllNhomQuyen(data).then((result) => {
			setListNhomQuyen(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}, [])

	const handleCancel = (event, reason) => {
		if (reason && reason === "backdropClick")
			return;
		if (handleClose) { handleClose() }
	}
	const handleResetPassWord = () => {
		var data = {
			email: nameRow  ? nameRow.email : '',
			fullName: nameRow  ? nameRow.fullName : '',
			password: '',
			phone: nameRow  ? nameRow.phone : '',
			pin: pinElement.values.join(''),
			userName: nameRow  ? nameRow.userName : '',
			ma_NhomQuyen: nameRow  ? nameRow.ma_NhomQuyen : 0,
			no_User: nameRow  ? nameRow.no_User : '',
			donVi: props.userInfo?.user?.donVi,
			isResetPw: true
		}
		update(data);
	}


	const handleGenPin = (funcCallback) => {
		var val = Math.floor(1000 + Math.random() * 9000) + "";
		if (funcCallback) {
			funcCallback('pin', val, true);
			if (pinElement) {
				pinElement.values = [1, 2, 3, 4];
				if (pinElement.onPaste) {
					pinElement.onPaste(val);
				}
			}
		}
	}
	const save = (values) => {
		dispatch(showLoading(true));
		nhanVienService.addNhanVien(values).then((result) => {
			dispatch(hideLoading());
			showMessageByType(null, "success", TYPE_ERROR.success)
			if (handleLoadPageParent) {
				handleLoadPageParent();
				handleClose();
			}
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const update = (values) => {
		dispatch(showLoading(true));
		nhanVienService.updateNhanVien(values).then((result) => {
			dispatch(hideLoading());
			showMessageByType(null, "Cập nhật thông tin thành công", TYPE_ERROR.success)
			if (handleLoadPageParent) { handleLoadPageParent(); }
			handleClose();
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
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
									if (nameRow) {
										update(values);
									} else {
										save(values);
									}
									setSubmitting(false);
								}}
								validationSchema={Yup.object().shape({
									email: Yup
										.string()
										.email('Email không hợp lệ')
										.required('Email không được bỏ trống'),
									fullName: Yup
										.string()
										.max(255, "Tối đa 255 ký tự")
										.required('Tên nhân viên không được bỏ trống'),
									password: Yup
										.string()
										.test("is-right-password", "Mật khẩu tối thiểu 4 ký tự", function (pwd) {
											const { no_User } = this.parent;
											return no_User > 0 || (!no_User && (pwd && pwd.length > 3));
										}),
									phone: Yup
										.string()
										.matches(/^[0-9]+$/, "Chỉ nhập số")
										.min(10, 'Số điện thoại không hợp lệ')
										.max(10, 'Số điện thoại không hợp lệ'),
									pin: Yup
										.string()
										.required('Mã pin không được bỏ trống'),
									userName: Yup
										.string()
										.required('Tên đăng nhập không được bỏ trống'),
									confirmPassWord: Yup
										.string()
										.test("is-right-password", "Mật khẩu tối thiểu 4 ký tự", function (pwd) {
											const { no_User } = this.parent;
											return no_User > 0 || (!no_User && (pwd && pwd.length > 3));
										})
										.oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
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
										handleReset,
										setFieldValue
									} = props;
									return (
										<form onSubmit={handleSubmit}>
											<Grid item xl={12} xs={12} >
												<DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
											</Grid>
											<Grid container>

												<Grid item xl={12} xs={12} container>
													<Grid container spacing={2}>
														<Grid item xs={12} sm={7}>
															<TextField
																error={errors.fullName && touched.fullName}
																label="Họ tên nhân viên(*)"
																name="fullName"
																size="small"
																fullWidth
																value={values.fullName}
																onChange={handleChange}
																onBlur={handleBlur}
																helperText={
																	errors.fullName && touched.fullName && errors.fullName
																}
																margin="nomal"
															/>
														</Grid>

														<Grid item xs={12} sm={5} >
															<TextField
																error={errors.userName && touched.userName}
																label="Tên đăng nhập(*)"
																name="userName"
																size="small"
																disabled ={values.no_User > 0}
																fullWidth
																value={values.userName}
																onChange={handleChange}
																onBlur={handleBlur}
																helperText={
																	errors.userName && touched.userName && errors.userName
																}
																margin="nomal"
															/>
														</Grid>

														<Grid item xs={12} sm={7}>
															<TextField
																error={errors.email && touched.email}
																label="Email"
																name="email"
																size="small"
																fullWidth
																value={values.email}
																onChange={handleChange}
																onBlur={handleBlur}
																helperText={
																	errors.email && touched.email && errors.email
																}
																margin="nomal"
															/>
														</Grid>

														<Grid item xs={12} sm={5} >
															<TextField
																error={errors.phone && touched.phone}
																label="Số điện thoại"
																name="phone"
																size="small"
																fullWidth
																value={values.phone}
																onChange={handleChange}
																onBlur={handleBlur}
																helperText={
																	errors.phone && touched.phone && errors.phone
																}
																margin="nomal"
															/>
														</Grid>
														{
															values.no_User === "" &&
															<>
																<Grid item xs={12} sm={7}>
																	<TextField
																		error={errors.password && touched.password}
																		label="Mật khẩu đăng nhập(*)"
																		name="password"
																		type="password"
																		size="small"
																		fullWidth
																		value={values.password}
																		onChange={handleChange}
																		onBlur={handleBlur}
																		helperText={
																			errors.password && touched.password && errors.password
																		}
																		margin="nomal"
																	/>
																</Grid>

																<Grid item xs={12} sm={5} >
																	<TextField
																		error={errors.confirmPassWord && touched.confirmPassWord}
																		label="Xác nhận mật khẩu(*)"
																		name="confirmPassWord"
																		type="password"
																		size="small"
																		fullWidth
																		value={values.confirmPassWord}
																		onChange={handleChange}
																		onBlur={handleBlur}
																		helperText={
																			errors.confirmPassWord && touched.confirmPassWord && errors.confirmPassWord
																		}
																		margin="nomal"
																	/>
																</Grid>
															</>
														}

														<Grid item xs={12} sm={7}>
															<Typography variant="subtitle1"
																style={{ fontWeight: "bold" }}>
																Mã pin đăng nhập thiết bị bán hàng(*)
															</Typography>
															<Grid>
																<PinInput
																	id='pin'
																	length={4}
																	initialValue={values.pin}
																	onChange={(newValue) => {
																		handleChange(newValue)
																	}}
																	focus type="text"
																	inputMode="text"
																	disabled={isHiddenOptionRightMenu}
																	ref={(n) => {
																		setPinEle(n);
																	}}
																/>
																{!isHiddenOptionRightMenu && <Button variant="text" onClick={() => {
																	handleGenPin(setFieldValue);
																}}>Tạo mã Pin ngẫu nhiên</Button>
															}
															</Grid>
														</Grid>

														<Grid item xs={12} sm={5} >
															<FormControl size="small" fullWidth>
																<InputLabel id="danhMuc-select-small">Vai trò</InputLabel>
																<Select
																	name="ma_NhomQuyen"
																	value={values.ma_NhomQuyen}
																	label="Vai trò"
																	onChange={handleChange}
																	disabled={isHiddenOptionRightMenu}
																>
																	{listNhomQuyen.map(x => {
																		return (
																			<MenuItem value={x.ma_NhomQuyen}>
																				<em>{x.tenNhomQuyen}</em>
																			</MenuItem>
																		)
																	})}
																</Select>
															</FormControl>
														</Grid>
														<DialogContent dividers={false}>
															<DialogContentText
																id="scroll-dialog-description"
																tabIndex={-1}
															>
																<Box sx={{ flexGrow: 1 }}>
																	<Grid container justifyContent="flex-end">
																		{!isHiddenOptionRightMenu && <Grid xs={4} sm={1} float="right">
																			<Button
																				type="button"
																				variant="contained"
																				onClick={handleResetPassWord}
																			>
																				Reset
																			</Button>
																		</Grid>
																		}

																		<Grid item paddingLeft={2} float="right" spacing={2} xs={4} sm={1}>
																			<Button type="submit" variant="contained"
																				disabled={isSubmitting}
																			>
																				Lưu
																			</Button>

																		</Grid>
																		<Grid item paddingLeft={2} float="right" spacing={2} xs={4} sm={1}>
																			<Button
																				type="button"
																				variant="contained"
																				onClick={handleCancel}
																			>
																				Đóng
																			</Button>

																		</Grid>
																	</Grid>

																</Box>

															</DialogContentText>
														</DialogContent>
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
export default connect(mapStateToProps)(Contact);
// export default Contact;
