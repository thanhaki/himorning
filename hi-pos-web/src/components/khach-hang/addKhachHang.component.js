import React, { useState, useEffect } from 'react';
import {
	DialogTitle, Dialog,
	TextareaAutosize, Typography, TextField, Box, Button, MenuItem, FormControl, InputLabel
} from "@mui/material";
import { connect } from "react-redux";
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { Grid } from '@mui/material';
import { FORMAT_YYYY_MM_DD } from '../../consts/constsCommon';
import nhomKhachHangService from '../../services/nhomKhachHang.service';
import khachHangService from '../../services/khachHang.service';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import QuanHuyen from '../../assets/provinces/quan_huyen.json';
import Tinh from '../../assets/provinces/tinh_tp.json';
import moment from 'moment';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm } from "react-hook-form";

function AddKhachHang(props) {
	const st = {
		width: '100%',
	}

	const { open, title, handleClose, handleLoadPageParent, nameRow, id_LoaiKh } = props;
	const dispatch = useDispatch()
	const [listQuanHuyen, setQuanHuyen] = useState(Object.values(QuanHuyen));
	const [listTinh, setTinhTP] = useState(Object.values(Tinh));
	const [isReload, setIsReload] = useState(false);
	const [gioiTinh_KH, setIdGender] = useState(0);
	const [nhomKhachHang, setNhomKhachHang] = useState([]);
	const [ma_NKH, setIdNhomKh] = useState(0);
	const [dateCurrent, setDateCurrent] = useState(moment(new Date()).format(FORMAT_YYYY_MM_DD));
	const [ngaySinh, setNgaySinhKh] = useState(moment(new Date()).format(FORMAT_YYYY_MM_DD));

	const [id_tinh, setIdTinh] = useState(0);
	const [id_quan, setIdQuan] = useState(0);
	const [filteredItems, setFilteredItems] = useState([]);
	const [loaiKhachHang, setLoaiKhachHang] = useState([]);
	useEffect(() => {
		getAllNhomKhachHang();
		dispatch(reFetchData(false));
		if (nameRow && Object.keys(nameRow).length > 0 && props.nameRow.row.tinhThanhPho_KH !== null) {
			const idTinh = props.nameRow.row.tinhThanhPho_KH;
			const filtered = listQuanHuyen.filter(item => item.parent_code === idTinh);
			const ns = moment(props.nameRow.row.ngaySinh_KH).format(FORMAT_YYYY_MM_DD)
			setNgaySinhKh(dayjs(ns));
			setFilteredItems(filtered);
		} else {
			setNgaySinhKh(dayjs(dateCurrent));
		}
	}, [isReload])

	const getAllNhomKhachHang = () => {
		let data = props.userInfo?.user?.donVi
		dispatch(showLoading(data));
		nhomKhachHangService.getAllNhomKhachHang(data).then((result) => {
			setNhomKhachHang(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
		var params = {
			donvi: props.userInfo?.user?.donVi,
		}
		khachHangService.getLoaiKhachHang(params).then((result) => {
			setLoaiKhachHang(result.data.loaiKhach);
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
		values.ma_KH = 0;
		values.gioiTinh_KH = values.gioiTinh_KH == 0 ? false : true;
		values.tongSoHoaDon_KH = 0;
		values.tongThanhToan_KH = 0;
		values.chiTieuTrungBinh_KH = 0;
		values.diemTichLuy = 0;
		values.ma_TTV = 0;
		values.donVi = props.userInfo?.user?.donVi;
		values.ngaySinh_KH = moment(ngaySinh.toDate()).format(FORMAT_YYYY_MM_DD);
		dispatch(showLoading(true));
		khachHangService.addKhachHang(values).then((result) => {
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
		values.ma_KH = props.nameRow.row.ma_KH;
		values.gioiTinh_KH = values.gioiTinh_KH == 0 ? false : true;
		values.tongSoHoaDon_KH = 0;
		values.tongThanhToan_KH = 0;
		values.chiTieuTrungBinh_KH = 0;
		values.diemTichLuy = 0;
		values.ma_TTV = 0;
		values.donVi = props.userInfo?.user?.donVi;
		values.ngaySinh_KH = moment(ngaySinh).format(FORMAT_YYYY_MM_DD) === moment().format(FORMAT_YYYY_MM_DD) ? moment(ngaySinh.toDate()).format(FORMAT_YYYY_MM_DD) : moment(ngaySinh).format(FORMAT_YYYY_MM_DD);
		dispatch(showLoading(true));
		khachHangService.addKhachHang(values).then((result) => {
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


	const HandleTinhTp = (event) => {
		setIdTinh(event.target.value);
		const filtered = listQuanHuyen.filter(item => item.parent_code === event.target.value);
		setFilteredItems(filtered);
	};
	const HandleHuyenTp = (event) => {
		setIdQuan(event.target.value);
	};

	const HandleNhomKh = (event) => {
		setIdNhomKh(event.target.value);
	};
	const HandleGenId = (event) => {
		setIdGender(event.target.value);
	};


	const { register, setValue, formState: { errors }, handleSubmit } = useForm({
		defaultValues: {
			ten_KH: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ten_KH : '',
			ghiChu_KH: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ghiChu_KH : '',
			diaChi_KH: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.diaChi_KH : '',
			email_KH: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.email_KH : '',
			dienThoai_KH: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.dienThoai_KH : '',
			// ngaySinh_KH : nameRow && Object.keys(nameRow).length > 0 ? moment(props.nameRow.row.ngaySinh_KH.toDate()).format(FORMAT_YYYY_MM_DD) : '',
		}
	});

	const handleDatePickerChange = (newValue) => {
		setNgaySinhKh(newValue);
	}

	const onSubmit = (data) => {
		if (nameRow && Object.keys(nameRow).length > 0) {
			update(data);
		} else {
			save(data);
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
				maxWidth="md"
			>

				<form
					onSubmit={handleSubmit(onSubmit)}>
					<Box sx={{ mt: 3 }}>
						<Grid item xl={12} xs={12} >
							<DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
						</Grid>
						<Grid container spacing={2} style={{ padding: 10 }}>
							<Grid item xs={12} sm={6} >
								<Typography variant="subtitle1">
									Họ Tên(*)
								</Typography>
								<TextField
									name="ten_KH"
									size="small"
									fullWidth
									defaultValue
									{...register("ten_KH", { required: true })}
									margin="nomal"
								/>

							</Grid>
							<Grid item xs={12} sm={6} >
								<Typography variant="subtitle1">
									Nhóm khách hàng
								</Typography>
								<FormControl size="small" fullWidth>
									<InputLabel id="KhachHang-select-small"></InputLabel>
									<TextField
										select
										fullWidth
										size="small"
										defaultValue={nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ma_NKH : 0}
										inputProps={register('ma_NKH', {
											onChange: (event) => {
												HandleNhomKh(event)
											}
										})}
										error={errors.currency}
										helperText={errors.currency?.message}
									>
										{nhomKhachHang.map(x => {
											return (
												<MenuItem value={x.ma_NKH}>
													<em>{x.ten_NKH}</em>
												</MenuItem>
											)
										})}
									</TextField>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={3} >
								<Typography variant="subtitle1">
									Số điện thoại(*)
								</Typography>
								<TextField
									name="dienThoai_KH"
									size="small"
									fullWidth
									type={'number'}
									{...register("dienThoai_KH", {
										required: true,
										maxLength: {
											value: 10,
											message: 'Số điện thoại không hợp lệ'
										},
										minLength: {
											value: 10,
											message: 'Số điện thoại không hợp lệ'
										}
									})}
									margin="nomal"
								/>
							</Grid>
							<Grid item xs={12} sm={3} >
								<Typography variant="subtitle1">
									Email
								</Typography>
								<TextField
									name="email_KH"
									size="small"
									fullWidth
									defaultValue
									{...register("email_KH", { required: true })}
									margin="nomal"
								/>
							</Grid>
							<Grid item xs={12} sm={6} >
								<Typography variant="subtitle1">
									Loại khách hàng
								</Typography>
								<FormControl size="small" fullWidth>
									<InputLabel id="LoaiKhachHang-select-small"></InputLabel>
									<TextField
										select
										fullWidth
										size="small"
										disabled={true}
										inputProps={register('loai_KH')}
										value={nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.loai_KH : id_LoaiKh}
									>
										{loaiKhachHang.map(x => {
											return (
												<MenuItem value={x.no}>
													<em>{x.data}</em>
												</MenuItem>
											)
										})}
									</TextField>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={3} >
								<FormControl size="small" fullWidth>
									<Typography variant="subtitle1">
										Giới tính
									</Typography>
									<TextField
										select
										fullWidth
										size="small"
										defaultValue={nameRow && Object.keys(nameRow).length > 0 ? (props.nameRow.row.gioiTinh_KH == true ? 1 : 0) : 0}
										inputProps={register('gioiTinh_KH', {
											onChange: (event) => {
												HandleGenId(event)
											}
										})}
										error={errors.currency}
										helperText={errors.currency?.message}
									>
										<MenuItem value={0}>
											<em>Nam</em>
										</MenuItem>
										<MenuItem value={1}>
											<em>Nữ</em>
										</MenuItem>
									</TextField>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={3} >
								<LocalizationProvider dateAdapter={AdapterDayjs} >
									<Typography variant="subtitle1">
										Ngày sinh
									</Typography>
									<DatePicker
										className='customsize-datepicker'
										id="ngaySinh_KH"
										fullWidth
										name='ngaySinh_KH'
										variant="outlined"
										defaultValue={dayjs(dateCurrent)}
										value={dayjs(ngaySinh)}
										onChange={handleDatePickerChange}
										size="small"
									/>
								</LocalizationProvider>
							</Grid>
							<Grid item xs={12} sm={3} >
								<Typography variant="subtitle1">
									Tỉnh thành phố
								</Typography>
								<FormControl size="small" fullWidth>
									<TextField
										select
										fullWidth
										defaultValue={nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.tinhThanhPho_KH : ''}
										size="small"
										inputProps={register('tinhThanhPho_KH', {
											onChange: (event) => {
												HandleTinhTp(event)
											}
										})}
									>
										{listTinh.map(x => {
											return (
												<MenuItem value={x.code}>
													<em>{x.name}</em>
												</MenuItem>
											)
										})}
									</TextField>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={3} >
								<Typography variant="subtitle1">
									Quận huyện
								</Typography>
								<FormControl size="small" fullWidth>
									<TextField
										select
										fullWidth
										defaultValue={nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.quanHuyen_KH : ''}
										size="small"
										inputProps={register('QuanHuyen_KH', {
											onChange: (event) => {
												HandleHuyenTp(event)
											}
										})}
									>
										{filteredItems.map(x => {
											return (
												<MenuItem value={x.code}>
													<em>{x.name_with_type}</em>
												</MenuItem>
											)
										})}
									</TextField>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={12} >
								<TextareaAutosize
									placeholder="Địa chỉ cụ thể"
									style={st}
									name="diaChi_KH"
									defaultValue
									minRows={2}
									size="small"
									fullWidth
									{...register("diaChi_KH")}
									margin="nomal"
								/>
							</Grid>
							<Grid item xs={12} sm={12}>
								<TextareaAutosize
									placeholder="Ghi chú"
									style={st}
									name="ghiChu_KH"
									defaultValue
									minRows={6}
									size="small"
									fullWidth
									{...register("ghiChu_KH",)}
									margin="nomal"
								/>
							</Grid>
							<Grid item xs={12} sm={12}>
								<Grid container justifyContent="flex-end">
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
										<Button type="submit" variant="contained" size="small"
										>
											Lưu
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Box>
				</form>
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
export default connect(mapStateToProps)(AddKhachHang);