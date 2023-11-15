import React, { useState, useEffect, useRef } from 'react';
import {
	DialogTitle, Dialog,
	TextareaAutosize, Typography, TextField, Box, Button, FormControl,
} from "@mui/material";
import { connect } from "react-redux";
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { stylesErrorHelper } from '../../consts/modelStyle';
import { Grid } from '@mui/material';
import { FORMAT_HH_MM_DD_MM_YYYY,FORMAT_YYYY_MM_DD } from '../../consts/constsCommon'
import { FORMAT_HH_MM } from '../../consts/constsCommon';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm } from "react-hook-form";
import { DataGrid } from '@mui/x-data-grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from 'moment';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Checkbox from '@mui/material/Checkbox';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import khuyenMaiService from '../../services/khuyenMai.service';
import AddDanhSachById from './addDanhSachById.component'
import AddDanhSachByIdDT from './addDanhSachKmByIdDt.component'

const st = { width: '100%' }

const columns = [
	{ field: 'id', headerName: 'ID', width: 100 },
	{ field: 'thoiGianBatDau', headerName: 'Thời gian bắt đầu', width: 150 },
	{ field: 'thoiGianKetThuc', headerName: 'Thời gian kết thúc', width: 150 },
];


const rowsDay = [
	{ id: 2, lastName: 'Thứ 2' },
	{ id: 3, lastName: 'Thứ 3' },
	{ id: 4, lastName: 'Thứ 4' },
	{ id: 5, lastName: 'Thứ 5' },
	{ id: 6, lastName: 'Thứ 6' },
	{ id: 7, lastName: 'Thứ 7' },
	{ id: 8, lastName: 'CN' },
];

let idCounter = 0;

function AddKhuyenMai(props) {

	const { open, title, handleClose, handleLoadPageParent, nameRow} = props;
	const dispatch = useDispatch()
	const [isReload, setIsReload] = useState(false);
	const [selectionModel, setSelectionModel] = useState([]);
	const [dateCurrent, setDateCurrent] = useState(moment(new Date()).format(FORMAT_YYYY_MM_DD));
	const [dateCurrentTime, setDateCurrentTime] = useState(moment(new Date()).format(FORMAT_HH_MM));
	const [tuNgay, setTuNgay] = useState(moment(new Date()).format(FORMAT_YYYY_MM_DD));
	const [denNgay, setDenNgay] = useState(moment(new Date()).format(FORMAT_YYYY_MM_DD));
	const [selectedValue, setSelectedValue] = useState('0');
	const [start, setValuestart] = useState({ start: dayjs(dateCurrentTime) });
	const [End, setValueEnd] = useState({ End: dayjs(dateCurrentTime) });
	const [selectedValueAD, setSelectedValueAD] = useState('0');
	const [selectedValueDT, setSelectedValueDT] = useState('0');
	const [selectedIds, setSelectedIds] = useState([]);
	const [checkBoxAll, setCheckBox] = useState([]);
	const [checkBoxDay, setCheckBoxDay] = useState({});
	const [openEditAD, setOpenEditAD] = useState(false);
	const [openEditDT, setOpenEditDT] = useState(false);
	const [selectListDsKmAD, setSelectListDsKmAD] = useState([]);
	const [selectListDsKmDT, setSelectListDsKmDT] = useState([]);
	const [listNameDsKmAD, setListNameDsKmAD] = useState([]);
	const [listNameDsKmDT, setListNameDsKmDT] = useState([]);


	useEffect(() => {
		if (nameRow && Object.keys(nameRow).length > 0) {
			checkBoxDay.thuHai = props.nameRow.row.thuHai;
			checkBoxDay.thuBa = props.nameRow.row.thuBa;
			checkBoxDay.thuTu = props.nameRow.row.thuTu;
			checkBoxDay.thuNam = props.nameRow.row.thuNam;
			checkBoxDay.thuSau = props.nameRow.row.thuSau;
			checkBoxDay.thuBay = props.nameRow.row.thuBay;
			checkBoxDay.chuNhat = props.nameRow.row.chuNhat;
			checkBoxAll.apDungThuTrongTuan = props.nameRow.row.apDungThuTrongTuan;
			checkBoxAll.apDungTheoKhungGio = props.nameRow.row.apDungTheoKhungGio;
			let valCheckLkm = props.nameRow.row.loaiKhuyenMai === 1 ? '1' : '2';
			setSelectedValue(valCheckLkm);
			let valCheckAD = props.nameRow.row.apDungDanhMuc === 1 ? '1' : (props.nameRow.row.apDungMatHang === 1 ? '2' : '0');
			setSelectedValueAD(valCheckAD);
			let valCheckDT = props.nameRow.row.doiTuongNhomKhachHang === 1 ? '1' : (props.nameRow.row.doiTuongTheThanhVien === 1 ? '2' : '0');
			setSelectedValueDT(valCheckDT);
			getListTimeKm();
			const bd = moment(props.nameRow.row.khuyenMaiTuNgay).format(FORMAT_YYYY_MM_DD)
			setTuNgay(dayjs(bd));
			const kt = moment(props.nameRow.row.khuyenMaiDenNgay).format(FORMAT_YYYY_MM_DD)
			setDenNgay(dayjs(kt));
		}
		else {
			setTuNgay(dayjs(dateCurrent));
			setDenNgay(dayjs(dateCurrent));
			setListNameDsKmAD(['']);
			setListNameDsKmDT(['']);
		}
		dispatch(reFetchData(false));
	}, [isReload])

	const getListTimeKm = () => {
		var data = {
			donVi: props.userInfo?.user?.donVi,
			soKhuyenMai: nameRow.row.soKhuyenMai,
		}
		dispatch(showLoading(data));
		khuyenMaiService.getListTime(data).then((result) => {
			setRows(result.data);
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

	const { register, setValue, formState: { errors }, handleSubmit } = useForm({
		defaultValues: {
			tenKhuyenMai: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.tenKhuyenMai : '',
			giaTriKhuyenMai: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.giaTriKhuyenMai : 0,
			minHoaDon: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.minHoaDon : 0,
			maxKhuyenMai: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.maxKhuyenMai : 0,
			mieuTaKhuyenMai: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.mieuTaKhuyenMai : '',
		}
	});


	const handleEditClose = () => {
		setOpenEditAD(false);
		setOpenEditDT(false);
	}

	const handleLoadPage = () => {
		setIsReload(!isReload);
	}

	const handleDateTuNgay = (newValue) => {
		setTuNgay(newValue);
	}

	const handleDateDenNgay = (newValue) => {
		setDenNgay(newValue);
	}

	const handleChange = (event) => {
		setSelectedValue(event.target.value);
	};

	const handleChangeAD = (event) => {
		setSelectedValueAD(event.target.value);
		if (event.target.value !== "0") {
			setOpenEditAD(true)
		}
	};

	const handleChangeDT = (event) => {
		setSelectedValueDT(event.target.value);
		if (event.target.value !== "0") {
			setOpenEditDT(true)
		}
	};



	const handleChangeKhungGio = (e) => {
		setCheckBox(prev => ({
			...prev,
			[e.target.name]: e.target.checked,
		}));
		if (!e.target.checked) {
			setRows([]);
			setValuestart(dayjs(dateCurrentTime));
			setValueEnd(dayjs(dateCurrentTime));
		}
	}
	const handleChangeThu = (e) => {
		setCheckBox(prev => ({
			...prev,
			[e.target.name]: e.target.checked,
		}));
	}
	const handleChekThu = (e) => {
		setCheckBoxDay(prev => ({
			...prev,
			[e.target.name]: e.target.checked,
		}));
	};

	const createRandomRow = () => {
		idCounter = listTimeRows.length + 1;
		let timeS1tart = moment(start.toDate()).format(FORMAT_HH_MM_DD_MM_YYYY);

		let timeStart = moment(start.toDate()).format(FORMAT_HH_MM);
		let timeEnd = moment(End.toDate()).format(FORMAT_HH_MM);
		return { id: idCounter, thoiGianBatDau: timeStart, thoiGianKetThuc: timeEnd };
	};

	const [listTimeRows, setRows] = React.useState(() => [

	]);

	const handleAddRow = () => {
		if (start.$d == 'Invalid Date' || End.$d == 'Invalid Date') {
			showMessageByType(null, "Chưa nhập Ngày giờ bắt đầu ", TYPE_ERROR.error)
		} else {
			setRows((prevRows) => [...prevRows, createRandomRow()]);
			setValuestart(dayjs(dateCurrentTime));
			setValueEnd(dayjs(dateCurrentTime));
		}
	};

	const handleDelete = () => {
		var ids = selectionModel;
		setRows(listTimeRows.filter(l => !ids.includes(l.id)));
	}

	const onSubmit = (data) => {
		if (nameRow && Object.keys(nameRow).length > 0) {
			update(data);
		} else {
			save(data);
		}
	};

	const save = (values) => {
		values.donVi = props.userInfo?.user?.donVi;
		values.SoKhuyenMai = 0;
		values.khuyenMaiTuNgay = moment(tuNgay.toDate()).format(FORMAT_YYYY_MM_DD);
		values.khuyenMaiDenNgay = moment(denNgay.toDate()).format(FORMAT_YYYY_MM_DD);
		values.apDungHoaDon = selectedValueAD;
		values.loaiKhuyenMai = selectedValue;
		values.doiTuongTatCa = selectedValueDT;
		values.apDungThuTrongTuan = checkBoxAll.apDungThuTrongTuan === true ? 1 : 0;
		values.apDungTheoKhungGio = checkBoxAll.apDungTheoKhungGio === true ? 1 : 0;
		values.thuHai = checkBoxDay.thuHai === true || checkBoxDay.thuHai === 1 ? 1 : 0;
		values.thuBa = checkBoxDay.thuBa === true || checkBoxDay.thuBa === 1 ? 1 : 0;
		values.thuTu = checkBoxDay.thuTu === true || checkBoxDay.thuTu === 1 ? 1 : 0;
		values.thuNam = checkBoxDay.thuNam === true || checkBoxDay.thuNam === 1 ? 1 : 0;
		values.thuSau = checkBoxDay.thuSau === true || checkBoxDay.thuSau === 1 ? 1 : 0;
		values.thuBay = checkBoxDay.thuBay === true || checkBoxDay.thuBay === 1 ? 1 : 0;
		values.chuNhat = checkBoxDay.chuNhat === true || checkBoxDay.chuNhat === 1 ? 1 : 0;
		values.listTime = listTimeRows;
		values.idListApDung = selectListDsKmAD;
		values.idListDT = selectListDsKmDT;
		dispatch(showLoading(true));
		khuyenMaiService.addKhuyenMai(values).then((result) => {
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
		values.soKhuyenMai = props.nameRow.row.soKhuyenMai;
		values.donVi = props.userInfo?.user?.donVi;
		values.khuyenMaiTuNgay = moment(tuNgay.toDate()).format(FORMAT_YYYY_MM_DD);
		values.khuyenMaiDenNgay = moment(denNgay.toDate()).format(FORMAT_YYYY_MM_DD);
		values.apDungHoaDon = selectedValueAD;
		values.loaiKhuyenMai = selectedValue;
		values.doiTuongTatCa = selectedValueDT;
		values.apDungThuTrongTuan = checkBoxAll.apDungThuTrongTuan === true || checkBoxAll.apDungThuTrongTuan == 1 ? 1 : 0;
		values.apDungTheoKhungGio = checkBoxAll.apDungTheoKhungGio === true || checkBoxAll.apDungTheoKhungGio == 1 ? 1 : 0;
		values.thuHai = checkBoxDay.thuHai === true || checkBoxDay.thuHai === 1 ? 1 : 0;
		values.thuBa = checkBoxDay.thuBa === true || checkBoxDay.thuBa === 1 ? 1 : 0;
		values.thuTu = checkBoxDay.thuTu === true || checkBoxDay.thuTu === 1 ? 1 : 0;
		values.thuNam = checkBoxDay.thuNam === true || checkBoxDay.thuNam === 1 ? 1 : 0;
		values.thuSau = checkBoxDay.thuSau === true || checkBoxDay.thuSau === 1 ? 1 : 0;
		values.thuBay = checkBoxDay.thuBay === true || checkBoxDay.thuBay === 1 ? 1 : 0;
		values.chuNhat = checkBoxDay.chuNhat === true || checkBoxDay.chuNhat === 1 ? 1 : 0;
		values.listTime = listTimeRows;
		values.idListApDung = selectListDsKmAD;
		values.idListDT = selectListDsKmDT;
		dispatch(showLoading(true));
		khuyenMaiService.updateKhuyenMai(values).then((result) => {
			dispatch(hideLoading());
			showMessageByType(null, "success", TYPE_ERROR.success)
			if (handleLoadPageParent) { handleLoadPageParent(); }
			handleClose();
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const handleRowClick = (params) => {
		// setNameRow(params);
	};

	const handleChangeKmAd = (data, name) => {
		setSelectListDsKmAD(data);
		setListNameDsKmAD(name);
	}

	const handleChangeKmDt = (data, name) => {
		setSelectListDsKmDT(data);
		setListNameDsKmDT(name);
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

				<form
					onSubmit={handleSubmit(onSubmit)}>
					<Box sx={{ mt: 1 }}>
						<Grid item sx={12} xs={12} style={{ textAlign: 'center' }}>
							<DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
						</Grid>
						<Grid container spacing={2} style={{ padding: 10 }}>
							<Grid item xs={12} sm={12} >
								<Typography variant="subtitle1">
									<b>Tên chương trình khuyến mãi</b>
								</Typography>
								<TextField
									name="tenKhuyenMai"
									size="small"
									fullWidth
									defaultValue
									{...register("tenKhuyenMai", { required: true })}
									margin="nomal"
								/>
							</Grid>

							<Grid item xs={12} sm={12}>
								<Typography variant="subtitle1">
									<b>Tùy chọn khuyến mãi</b>
								</Typography>
								<FormControl>
									<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
										<FormControlLabel
											control={
												<Radio
													checked={selectedValue === '1'}
													onChange={handleChange}
													value="1"
												/>
											}
											label="Khuyến mãi %"
										/>
										<FormControlLabel
											control={
												<Radio
													checked={selectedValue === '2'}
													onChange={handleChange}
													value="2"
												/>
											}
											label="Khuyến mãi theo số tiền"
										/>
									</div>
								</FormControl>
							</Grid>


							<Grid item xs={12} sm={3} >
								<TextField
									name="giaTriKhuyenMai"
									size="small"
									fullWidth
									label="Giá trị khuyến mãi"
									type={'number'}
									inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'right' }, min: 0 }}
									FormHelperTextProps={{ style: stylesErrorHelper.helper }}
									{...register("giaTriKhuyenMai", { required: true })}
									margin="nomal"
								/>
							</Grid>

							<Grid item xs={12} sm={3} >
								<TextField
									size="small"
									fullWidth
									label="Giá trị hóa đơn tối thiểu"
									type={'number'}
									inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'right' }, min: 0 }}
									FormHelperTextProps={{ style: stylesErrorHelper.helper }}
									{...register("minHoaDon", { required: true })}
									margin="nomal"
								/>
							</Grid>

							<Grid item xs={12} sm={3} >
								<TextField
									name="maxKhuyenMai"
									size="small"
									fullWidth
									label="Giá trị khuyến mãi tối đa"
									type={'number'}
									inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'right' }, min: 0 }}
									FormHelperTextProps={{ style: stylesErrorHelper.helper }}
									{...register("maxKhuyenMai", { required: true })}
									margin="nomal"
								/>
							</Grid>

							<Grid item xs={12} sm={12}>
								<TextareaAutosize
									placeholder="Ghi chú"
									style={st}
									name="mieuTaKhuyenMai"
									defaultValue
									minRows={2}
									size="small"
									fullWidth
									{...register("mieuTaKhuyenMai")}
									margin="nomal"
								/>
							</Grid>

							<Grid item xs={12} sm={12} >
								<Typography variant="subtitle1">
									<b>Thời gian áp dụng khuyến mãi</b>
								</Typography>
							</Grid>

							<Grid item xs={12} sm={4} >
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										className='customsize-datepicker'
										id="khuyenMaiTuNgay"
										fullWidth
										label="Thời gian bắt đầu"
										name='khuyenMaiTuNgay'
										variant="outlined"
										defaultValue={dayjs(dateCurrent)}
										value={dayjs(tuNgay)}
										onChange={handleDateTuNgay}
										size="small"
									/>
								</LocalizationProvider>
							</Grid>

							<Grid item xs={12} sm={4} >
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										className='customsize-datepicker'
										id="khuyenMaiDenNgay"
										fullWidth
										label="Thời gian kết thúc"
										name='khuyenMaiDenNgay'
										variant="outlined"
										defaultValue={dayjs(dateCurrent)}
										value={dayjs(denNgay)}
										onChange={handleDateDenNgay}
										size="small"
									/>
								</LocalizationProvider>
							</Grid>

							<Grid item xs={12} sm={12}>
								<FormControlLabel
									control={<Checkbox
										id="apDungThuTrongTuan"
										name='apDungThuTrongTuan'
										fullWidth
										variant="outlined"
										size="small"
										value={checkBoxAll.apDungThuTrongTuan}
										defaultChecked={checkBoxAll.apDungThuTrongTuan === 1 ? true : false}
										onChange={handleChangeThu}
										FormHelperTextProps={{ style: stylesErrorHelper.helper }}
										inputProps={{ 'aria-label': 'controlled' }}
									/>}
									label="Áp dụng thứ trong tuần"
									labelPlacement="end"
								/>
							</Grid>

							<Grid item xs={12} sm={1}>
								<FormControlLabel
									control={<Checkbox
										id="thuHai"
										name='thuHai'
										fullWidth
										variant="outlined"
										size="small"
										value={checkBoxDay.thuHai}
										defaultChecked={checkBoxDay.thuHai === 1 ? true : false}
										onChange={handleChekThu}
										disabled={!checkBoxAll.apDungThuTrongTuan}
										FormHelperTextProps={{ style: stylesErrorHelper.helper }}
										inputProps={{ 'aria-label': 'controlled' }}
									/>}
									label="Thứ 2"
									labelPlacement="bottom"
									style={{ margin: 0 }}
								/>
							</Grid>
							<Grid item xs={12} sm={1}>
								<FormControlLabel
									control={<Checkbox
										id="thuBa"
										name='thuBa'
										fullWidth
										variant="outlined"
										size="small"
										value={checkBoxDay.thuBa}
										defaultChecked={checkBoxDay.thuBa === 1 ? true : false}
										onChange={handleChekThu}
										disabled={!checkBoxAll.apDungThuTrongTuan}
										FormHelperTextProps={{ style: stylesErrorHelper.helper }}
										inputProps={{ 'aria-label': 'controlled' }}
									/>}
									label="Thứ 3"
									labelPlacement="bottom"
									style={{ margin: 0 }}
								/>
							</Grid>
							<Grid item xs={12} sm={1}>
								<FormControlLabel
									control={<Checkbox
										id="thuTu"
										name='thuTu'
										fullWidth
										variant="outlined"
										size="small"
										value={checkBoxDay.thuTu}
										defaultChecked={checkBoxDay.thuTu === 1 ? true : false}
										onChange={handleChekThu}
										disabled={!checkBoxAll.apDungThuTrongTuan}
										FormHelperTextProps={{ style: stylesErrorHelper.helper }}
										inputProps={{ 'aria-label': 'controlled' }}
									/>}
									label="Thứ 4"
									labelPlacement="bottom"
									style={{ margin: 0 }}
								/>
							</Grid>
							<Grid item xs={12} sm={1}>
								<FormControlLabel
									control={<Checkbox
										id="thuNam"
										name='thuNam'
										fullWidth
										variant="outlined"
										size="small"
										value={checkBoxDay.thuNam}
										defaultChecked={checkBoxDay.thuNam === 1 ? true : false}
										onChange={handleChekThu}
										disabled={!checkBoxAll.apDungThuTrongTuan}
										FormHelperTextProps={{ style: stylesErrorHelper.helper }}
										inputProps={{ 'aria-label': 'controlled' }}
									/>}
									label="Thứ 5"
									labelPlacement="bottom"
									style={{ margin: 0 }}
								/>
							</Grid>
							<Grid item xs={12} sm={1}>
								<FormControlLabel
									control={<Checkbox
										id="thuSau"
										name='thuSau'
										fullWidth
										variant="outlined"
										size="small"
										value={checkBoxDay.thuSau}
										defaultChecked={checkBoxDay.thuSau === 1 ? true : false}
										onChange={handleChekThu}
										disabled={!checkBoxAll.apDungThuTrongTuan}
										FormHelperTextProps={{ style: stylesErrorHelper.helper }}
										inputProps={{ 'aria-label': 'controlled' }}
									/>}
									label="Thứ 6"
									labelPlacement="bottom"
									style={{ margin: 0 }}
								/>
							</Grid>
							<Grid item xs={12} sm={1} >
								<FormControlLabel
									control={<Checkbox
										id="thuBay"
										name='thuBay'
										fullWidth
										variant="outlined"
										size="small"
										value={checkBoxDay.thuBay}
										defaultChecked={checkBoxDay.thuBay == 1 ? true : false}
										onChange={handleChekThu}
										disabled={!checkBoxAll.apDungThuTrongTuan}
										FormHelperTextProps={{ style: stylesErrorHelper.helper }}
										inputProps={{ 'aria-label': 'controlled' }}
									/>}
									label="Thứ 7"
									labelPlacement="bottom"
									style={{ margin: 0 }}
								/>
							</Grid>
							<Grid item xs={12} sm={2}>
								<FormControlLabel
									control={<Checkbox
										id="chuNhat"
										name='chuNhat'
										fullWidth
										variant="outlined"
										size="small"
										value={checkBoxDay.chuNhat}
										defaultChecked={checkBoxDay.chuNhat == 1 ? true : false}
										onChange={handleChekThu}
										disabled={!checkBoxAll.apDungThuTrongTuan}
										FormHelperTextProps={{ style: stylesErrorHelper.helper }}
										inputProps={{ 'aria-label': 'controlled' }}
									/>}
									label="Chủ nhật"
									labelPlacement="bottom"
									style={{ margin: 0 }}
								/>
							</Grid>

							<Grid item xs={12} sm={12}>
								<FormControlLabel
									control={<Checkbox
										id="apDungTheoKhungGio"
										name='apDungTheoKhungGio'
										fullWidth
										variant="outlined"
										size="small"
										value={checkBoxAll.apDungTheoKhungGio}
										defaultChecked={checkBoxAll.apDungTheoKhungGio == 1 ? true : false}
										onChange={handleChangeKhungGio}
										FormHelperTextProps={{ style: stylesErrorHelper.helper }}
										inputProps={{ 'aria-label': 'controlled' }}
									/>}
									label="Áp dụng theo khung giờ"
									labelPlacement="end"
								/>
							</Grid>
							<Grid item xs={12} sm={3}>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<TimeField
										label="Thời gian bắt đầu"
										value={dayjs(start)}
										onChange={(newValue) => setValuestart(newValue)}
										format="HH:mm"
										disabled={!checkBoxAll.apDungTheoKhungGio}
									/>
								</LocalizationProvider>
							</Grid>

							<Grid item xs={12} sm={3}>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<TimeField
										label="Thời gian kết thúc"
										value={dayjs(End)}
										onChange={(newValue) => {
											setValueEnd(newValue)
										}}
										format="HH:mm"
										disabled={!checkBoxAll.apDungTheoKhungGio}
									/>
								</LocalizationProvider>
							</Grid>

							<Grid item xs={12} sm={3} style={{ paddingTop: 25 }}>
								<Button
									onClick={handleAddRow}
									disabled={!checkBoxAll.apDungTheoKhungGio}
								>
									(+) Thêm
								</Button>
								<Button
									onClick={handleDelete}
									disabled={!checkBoxAll.apDungTheoKhungGio}
								>
									(-) Xóa
								</Button>
							</Grid>
							{listTimeRows.length > 0 &&
								<Grid item xs={12} sm={12}>
									<Box sx={{ height: 300, mt: 1 }}>
										<DataGrid
											rows={listTimeRows}
											columns={columns}
											checkboxSelection
											onSelectionModelChange={(newSelectionModel) => {
												setSelectionModel(newSelectionModel);
											}}
											selectionModel={selectionModel}
											onRowClick={handleRowClick}
										/>

									</Box>
								</Grid>
							}

							<Grid item xs={12} sm={12} >
								<Typography variant="subtitle1">
									<b>Áp dụng với</b>
								</Typography>
								<FormControl>
									<RadioGroup
										row
										aria-labelledby="row-radio-buttons-group-label"
										name="row-radio-buttons-group"
										defaultValue="0"
									>
										<FormControlLabel
											control={
												<Radio
													checked={selectedValueAD === '0'}
													onChange={handleChangeAD}
													value="0"
													overlay defaultChecked />}
											label="Hóa đơn" />

										<FormControlLabel
											control={
												<Radio
													checked={selectedValueAD === '1'}
													onChange={handleChangeAD}
													value="1"
													overlay defaultChecked />}
											label="Danh mục" />
										<FormControlLabel
											control={
												<Radio
													checked={selectedValueAD === '2'}
													onChange={handleChangeAD}
													value="2"
													overlay defaultChecked />}
											label="Mặt hàng" />
									</RadioGroup>
								</FormControl>
								{selectedValueAD !== '0' &&
									<Grid item xs={12} sm={12} style={{ paddingLeft: 5 }}>
										<TextField
											size="small"
											fullWidth
											label={selectedValueAD === '1' ? 'Danh mục' : 'Mặt hàng'}
											value={listNameDsKmAD.length > 0 ? listNameDsKmAD : (props.nameDsKm.length > 0 ? props.nameDsKm : listNameDsKmAD)}
											//value={listNameDsKmAD.length > 0 ? listNameDsKmAD : (props.nameDsKm.length > 0 && ? props.nameDsKm : listNameDsKmAD)}
											margin="nomal"
											inputProps={
												{ readOnly: true, }
											}
										/>
									</Grid>
								}
							</Grid>

							<Grid item xs={12} sm={12} >
								<Typography variant="subtitle1">
									<b>Đối tượng áp dụng</b>
								</Typography>
								<FormControl>
									<RadioGroup
										row
										aria-labelledby="row-radio-buttons-group-label"
										defaultValue="0"
										name="row-radio-buttons-group"
									>
										<FormControlLabel
											control={
												<Radio
													checked={selectedValueDT === '0'}
													onChange={handleChangeDT}
													value="0"
													overlay defaultChecked />}
											label="Tất cả khách hàng"
										/>
										<FormControlLabel
											control={
												<Radio
													checked={selectedValueDT === '1'}
													onChange={handleChangeDT}
													value="1"
													overlay defaultChecked />}
											label="Nhóm khách hàng"
										/>
										<FormControlLabel
											control={
												<Radio
													checked={selectedValueDT === '2'}
													onChange={handleChangeDT}
													value="2"
													overlay defaultChecked />}
											label="Thẻ thành viên"
										/>
									</RadioGroup>
								</FormControl>
								{selectedValueDT !== '0' &&
									<Grid item xs={12} sm={12} style={{ paddingLeft: 5 }}>
										<TextField
											size="small"
											fullWidth
											label={selectedValueDT === '1' ? 'Nhóm khách hàng' : 'Thẻ thành viên'}
											value={listNameDsKmDT.length > 0 ? listNameDsKmDT : (props.nameDsDT.length > 0 ? props.nameDsDT : listNameDsKmDT)}
											margin="nomal"
											inputProps={
												{ readOnly: true, }
											}
										/>
									</Grid>
								}
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
				{openEditAD && <AddDanhSachById
					open={openEditAD}
					title={selectedValueAD === "1" ? "DANH MỤC MẶT HÀNG" : "DANH SÁCH MẶT HÀNG"}
					nameModel={selectedValueAD === "1" ? "Tên danh mục" : "Tên mặt hàng"}
					selectedValueAD={selectedValueAD}
					nameRow={nameRow}
					handleClose={handleEditClose}
					handleChangeKmAd={handleChangeKmAd}
					handleLoadPageParent={handleLoadPage}
				/>}

				{openEditDT && <AddDanhSachByIdDT
					open={openEditDT}
					title={selectedValueDT == "1" ? "DANH SÁCH NHÓM KHÁCH HÀNG" : "DANH SÁCH THẺ THÀNH VIÊN"}
					nameModel={selectedValueDT === "1" ? "Tên nhóm khách hàng" : "Tên thẻ thành viên"}
					selectedValueDT={selectedValueDT}
					nameRow={nameRow}
					handleClose={handleEditClose}
					handleChangeKmDt={handleChangeKmDt}
					handleLoadPageParent={handleLoadPage}
				/>}
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
export default connect(mapStateToProps)(AddKhuyenMai);