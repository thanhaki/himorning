import React, { useState, useEffect } from 'react';
import {
	DialogTitle, Dialog, DialogContent, DialogContentText,
	TextareaAutosize, Typography, TextField, Box, Button, FormControl, MenuItem, InputLabel
} from "@mui/material";
import { connect } from "react-redux";
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm, Controller } from "react-hook-form";
import { DataGrid } from '@mui/x-data-grid';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ImageUpload } from '../common/upload-image.component';
import {cloneDeep} from 'lodash'
import moment from 'moment';
import dayjs from 'dayjs';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import hoSoNhanVienService from '../../services/hoSoNhanVien.service';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FORMAT_DD_MM_YYYY, FORMAT_YYYY_MM_DD } from '../../consts/constsCommon'
import { ToFormData } from '../../helpers/utils'

const st = {
	width: '100%',
}


function AddHoSoNhanVien(props) {

	const { open, title, handleClose, handleLoadPageParent, nameRow } = props;
	const dispatch = useDispatch()
	const [isReload, setIsReload] = useState(false);
	const [selectionModel, setSelectionModel] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);
	const [tinhTrang, setLoaiTinhTrang] = useState([]);
	const [id_LoaiTinhTrang, setIdLoaiinhTrang] = useState(0);
	const [loaiHoSo, setLoaiHoSo] = useState([]);
	const [id_LoaiHoSo, setIdLoaiHoSo] = useState(0);
	const [trinhDo, setLoaiTrinhDo] = useState([]);
	const [id_LoaiTrinhDo, setIdLoaiTrinhDo] = useState(0);
	const [gioiTinh_NV, setIdGender] = useState(0);
	const [phongBan, setLoaiPhongBan] = useState([]);
	const [id_LoaiPb, setIdLoaiPb] = useState(0);
	const [dateCurrent, setDateCurrent] = useState(dayjs().format(FORMAT_YYYY_MM_DD));
	const [ngaySinh, setNgaySinhNv] = useState(dayjs().format(FORMAT_YYYY_MM_DD));
	const [ngayCapCMND, setNgayCapCMND] = useState(dayjs().format(FORMAT_YYYY_MM_DD));
	const [listFileUrl, setListFileUrl] = useState([]);
	const [ngayBd, setNgayBd] = useState(dayjs().format(FORMAT_YYYY_MM_DD));
	const [ngayKt, setNgayKt] = useState(dayjs().format(FORMAT_YYYY_MM_DD));
	const [ngayWr, setNgayWr] = useState(dayjs().format(FORMAT_YYYY_MM_DD));
	const [tenFile, setTenFile] = useState('');
	const [preview, setPreview] = useState();

	let idCounter = 0;
	const RenderBtnDel = (props) => {
		const { id } = props;
		let file_No = props.row.file_No;
		return (
			<IconButton aria-label="delete" size="small" onClick={() => handleDelete(id, file_No)} >
				<DeleteIcon fontSize="small" />
			</IconButton>
		);
	}
	const handleDelete = (id, file_No) => {
		var listDat = listTimeRows;
		var index = listDat.filter(x => x.id !== id)
		setRows(index);
		if(file_No){
			dispatch(showLoading(true));
			var data = {
				donVi: props.userInfo?.user?.donVi,
				file_No: file_No
			}
			hoSoNhanVienService.deleteFileHoSoNV(data).then((result) => {
				dispatch(hideLoading());
				showMessageByType(null, "success", TYPE_ERROR.success)
			}).catch((error) => {
				dispatch(hideLoading());
				showMessageByType(error, "error", TYPE_ERROR.error);
			})
		}
	}
	const RenderTexField = (props) => {
		return (
			<div className="d-flex justify-content-between align-items-center">
				<TextField
					fullWidth
					onKeyDown={(event) => {
						event.stopPropagation();
					}}
					onChange={
						event => handleChangeText(event, props)
					}
					variant="outlined"
					size="small"
					defaultValue={props.row.file_Name}
				/>
			</div>
		);
	}
	const handleChangeText = (event, props) => {
		var tmp = listTimeRows;
		let index = tmp.findIndex(x => x.id === props.row.id)
		tmp[index].file_Name = event.target.value;
		setRows(tmp);
	}


	const renderImage = (props) => {
		const { value } = props;
		console.log("test", nameRow)
		const objectUrl = typeof value  == "string" ? value : URL.createObjectURL(value)
  		return <img src={objectUrl} alt="Image" style={{ width: '100%', height: 'auto' }} />;
	}
	const columns = [
		{
			field: 'file_Name',
			headerName: 'Tên file',
			width: 150,
			editable: false,
			// renderCell: RenderTexField,
			align: 'left'
		},
		{
			field: 'file_URL',
			headerName: 'File',
			width: 150,
			editable: false,
			align: 'center',
			renderCell: renderImage
		},
		{
			field: 'file_Start',
			headerName: 'Ngày bắt đầu',
			width: 150,
			valueFormatter: params =>
				dayjs(params?.value).format(FORMAT_DD_MM_YYYY),
			editable: false,
			align: 'center',
		},
		{
			field: 'file_End',
			headerName: 'Ngày kết thúc',
			valueFormatter: params =>
				dayjs(params?.value).format(FORMAT_DD_MM_YYYY),
			width: 150,
			editable: false,
			align: 'right',
		},
		{
			field: 'file_Warning',
			headerName: 'Ngày nhắc nhờ',
			width: 150,
			valueFormatter: params =>
				dayjs(params?.value).format(FORMAT_DD_MM_YYYY),
			editable: false,
			align: 'center',
		},
		{
			field: '',
			headerName: '',
			width: 50,
			editable: false,
			renderCell: RenderBtnDel,
			align: 'center'
		},
	];


	useEffect(() => {
		getLoaiTrinhDo();
		getLoaiPb();
		getLoaiHoSo();
		getLoaiTinhTrang();
		if (nameRow && Object.keys(nameRow).length > 0) {
			getListChiTiet();
			const namSinhNv = moment(props.nameRow.row.ngaySinh_NV).format(FORMAT_YYYY_MM_DD)
			const ngayCmnd = moment(props.nameRow.row.ngayCapCMND_NV).format(FORMAT_YYYY_MM_DD)
			setNgaySinhNv(dayjs(namSinhNv));
			setNgayCapCMND(dayjs(ngayCmnd));
		}
		else {
			setNgaySinhNv(dayjs(dateCurrent));
			setNgayCapCMND(dayjs(dateCurrent));
		}
		dispatch(reFetchData(false));
	}, [isReload])


	const handleChangeImg = (img) => {
		setSelectedImage(img);
		// const objectUrl = URL.createObjectURL(img)
		// setPreview(objectUrl)
	}


	const handleCancel = (event, reason) => {
		if (reason && reason === "backdropClick")
			return;
		if (handleClose) { handleClose() }
	}


	const { register, setValue, getValues, formState: { errors }, handleSubmit, control } = useForm({
		defaultValues: {
			so_NV: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.so_NV : 0,
			ma_NV: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ma_NV : 0,
			phongBan: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.phongBan : 0,
			ten_NV: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ten_NV : '',
			ngaySinh_NV: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ngaySinh_NV : dateCurrent,
			dienThoai_NV: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.dienThoai_NV : '',
			diaChi_NV: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.diaChi_NV : '',
			trinhDo_NV: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.trinhDo_NV : 0,
			cMND_NV: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.cmnD_NV : '',
			noiCapCMND_NV: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.noiCapCMND_NV : '',
			ngayCapCMND_NV: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ngayCapCMND_NV : dateCurrent,
			type_NV: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.type_NV : 0,
			email_NV: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.email_NV : '',
			ghiChu: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ghiChu : '',
			tinhTrang: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.tinhTrang : 0,
		}
	});


	const onSubmit = (data) => {
		if (nameRow && Object.keys(nameRow).length > 0) {
			update(data);
		} else {
			save(data);
		}
	};

	const save = (values) => {
		values.listFile = listTimeRows;
		values.gioiTinh = gioiTinh_NV;
		values.ngayCapCMND_NV = dayjs(ngayCapCMND).format(FORMAT_YYYY_MM_DD);
		values.ngaySinh_NV = dayjs(ngaySinh).format(FORMAT_YYYY_MM_DD);
		const formData = new FormData();
		listFileUrl.forEach(element => {
			formData.append("file", element, element.name);
		});

		ToFormData({ data: values }, formData);
		dispatch(showLoading(true));
		hoSoNhanVienService.addHoSoNhanVien(formData).then((result) => {
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
		values.listFile = listTimeRows.filter(x => x.file_No == 0);
		values.gioiTinh = gioiTinh_NV;
		values.ngayCapCMND_NV = dayjs(ngayCapCMND).format(FORMAT_YYYY_MM_DD);
		values.ngaySinh_NV = dayjs(ngaySinh).format(FORMAT_YYYY_MM_DD);
		const formData = new FormData();
		listFileUrl.forEach(element => {
			formData.append("file", element, element.name);
		});

		ToFormData({ data: values }, formData);
		dispatch(showLoading(true));
		hoSoNhanVienService.addHoSoNhanVien(formData).then((result) => {
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
	const getLoaiTrinhDo = () => {
		dispatch(showLoading(true));
		var data = {
			donVi: props.userInfo?.user?.donVi,
		}
		hoSoNhanVienService.GetMDataPbTinhTr(data).then((result) => {
			setLoaiTrinhDo(result.data.trinhDo);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const getLoaiPb = () => {
		dispatch(showLoading(true));
		var data = {
			donVi: props.userInfo?.user?.donVi,
		}
		hoSoNhanVienService.GetMDataPbTinhTr(data).then((result) => {
			setLoaiPhongBan(result.data.phongBan);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	};
	const getLoaiTinhTrang = () => {
		dispatch(showLoading(true));
		var data = {
			donVi: props.userInfo?.user?.donVi,
		}
		hoSoNhanVienService.GetMDataPbTinhTr(data).then((result) => {
			setLoaiTinhTrang(result.data.tinhTrangHoSoNhanVien);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const getLoaiHoSo = () => {
		dispatch(showLoading(true));
		var data = {
			donVi: props.userInfo?.user?.donVi,
		}
		hoSoNhanVienService.GetMDataPbTinhTr(data).then((result) => {
			setLoaiHoSo(result.data.loaiHoSoNhanVien);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const getListChiTiet = () => {
		var params = {
			so_NV: nameRow.row.so_NV,
			donvi: props.userInfo?.user?.donVi,
		}
		hoSoNhanVienService.getChiTietHoSoNv(params).then((result) => {
			setRows(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
			showMessageByType(error, "Lỗi load dữ liệu file", TYPE_ERROR.error)
		})
	}
	const HandleGenId = (event) => {
		setIdGender(event.target.value);
	};
	const HandleLoaiPb = (event) => {
		setIdLoaiPb(event.target.value);
	}
	const handleTrinhDo = (event) => {
		setIdLoaiTrinhDo(event.target.value);
	}
	const handleTinhTrang = (event) => {
		setIdLoaiinhTrang(event.target.value);
	}
	const handLoaiHoSo = (event) => {
		setIdLoaiHoSo(event.target.value);
	}
	const handleNgaySinhNv = (newValue) => {
		setNgaySinhNv(newValue);
	}
	const handleNgayBd = (newValue) => {
		setNgayBd(newValue);
	}
	const handleNgayKt = (newValue) => {
		setNgayKt(newValue);
	}
	const handleNgayWr = (newValue) => {
		setNgayWr(newValue);
	}
	const HandleTenFile = (event) => {
    setTenFile(event.target.value);
  };
	const handleNgayCapCMDD = (newValue) => {
		setNgayCapCMND(newValue);
	}
	const handleAddRow = () => {
		setRows((prevRows) => [...prevRows, createRow()]);
		if(selectedImage){
			setListFileUrl(e => e.concat(selectedImage));
		}
			setSelectedImage(null);
			setTenFile('');
	};
	const [listTimeRows, setRows] = React.useState(() => []);

	const createRow = () => {
		idCounter = listTimeRows.length + 1;
		return {file_No : 0, id: idCounter, file_Name: tenFile, file_URL: selectedImage == null ? '' : selectedImage, file_Start: dayjs(ngayBd).format(FORMAT_YYYY_MM_DD), file_End: dayjs(ngayKt).format(FORMAT_YYYY_MM_DD), file_Warning: dayjs(ngayWr).format(FORMAT_YYYY_MM_DD) };
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
					<Box sx={{ mt: 2 }}>
						<Grid item xl={12} xs={12} >
							<DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
						</Grid>
						<Grid container spacing={1} style={{ padding: 10 }}>
							<Grid container spacing={1} item xs={12} sm={6}>
								<Grid item xs={12} sm={12} >
									<FormControl size="small" fullWidth>
										<InputLabel id="MaPhieu-select-small"></InputLabel>
										<TextField
											id="ma_NV"
											fullWidth
											label="Mã hồ sơ"
											name='ma_NV'
											{...register("ma_NV")}
											size="small"
											inputProps={
												{ readOnly: true, }
											}
											disabled
											style={{ textAlign: "center" }}
										/>
									</FormControl>
								</Grid>

								<Grid item xs={12} sm={12} >
									<InputLabel id="TenPhieu-select-small"></InputLabel>
									<Controller
										control={control}
										margin="nomal"
										name="ten_NV"
										fullWidth
										render={({ field: { onChange, value } }) => (
											<TextField
												onChange={onChange}
												{...register("ten_NV", { required: true })}
												label="Họ và tên"
												size="small"
												fullWidth
											/>
										)}
									/>
								</Grid>
								<Grid item xs={12} sm={12} >
									<FormControl size="small" fullWidth>
										<TextField
											select
											fullWidth
											size="small"
											label="Giới tính"
											defaultValue={nameRow && Object.keys(nameRow).length > 0 ? (props.nameRow.row.gioiTinh == true ? 1 : 0) : 0}
											inputProps={register('gioiTinh', {
												onChange: (event) => {
													HandleGenId(event)
												}
											})}
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
							</Grid>

							<Grid container spacing={1} item xs={12} sm={6}>
								<Grid item xs={12} sm={12}>
									<FormControl size="small" fullWidth >
										<FormControl size="small" fullWidth>
											<TextField
												select
												fullWidth
												label="Phòng ban"
												size="small"
												defaultValue={nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.phongBan : 0}
												inputProps={register('phongBan', {
													onChange: (event) => {
														HandleLoaiPb(event)
													}
												})}
											>
												{phongBan.map(x => {
													return (
														<MenuItem value={x.no}>
															<em>{x.data}</em>
														</MenuItem>
													)
												})}
											</TextField>
										</FormControl>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={12} >
									<LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
										<DatePicker
											className='customsize-datepicker'
											id="ngaySinh_NV"
											fullWidth
											name='ngaySinh_NV'
											label="Ngày sinh"
											variant="outlined"
											defaultValue={dayjs(dateCurrent)}
											slotProps={{ textField: { fullWidth: true } }}
											value={dayjs(ngaySinh)}
											onChange={handleNgaySinhNv}
											size="small"
										/>
									</LocalizationProvider>
								</Grid>
								<Grid item xs={12} sm={12} >
									<TextField
										name="dienThoai_NV"
										size="small"
										label="Điện thoại"
										fullWidth
										defaultValue
										{...register("dienThoai_NV", { required: true })}
										margin="nomal"
										error={errors.currency}
										helperText={errors.currency?.message}
									/>
								</Grid>
							</Grid>

							<Grid container spacing={1} item xs={12} sm={12}>
								<Grid item xs={12} sm={12}>
									<TextareaAutosize
										placeholder="Địa chỉ"
										style={st}
										name="diaChi_NV"
										defaultValue
										minRows={3}
										size="small"
										fullWidth
										{...register("diaChi_NV")}
										margin="nomal"
									/>
								</Grid>
							</Grid>

							<Grid container spacing={1} item xs={12} sm={6}>
								<Grid item xs={12} sm={12} >
									<FormControl size="small" fullWidth>
										<TextField
											select
											fullWidth
											size="small"
											label="Trình độ"
											defaultValue={nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.trinhDo_NV : 0}
											inputProps={register('trinhDo_NV', {
												onChange: (event) => {
													handleTrinhDo(event)
												}
											})}
										>
											{trinhDo.map(x => {
												return (
													<MenuItem value={x.no}>
														<em>{x.data}</em>
													</MenuItem>
												)
											})}
										</TextField>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6} >
									<InputLabel id="CCCD-select-small"></InputLabel>
									<Controller
										control={control}
										margin="nomal"
										name="cMND_NV"
										fullWidth
										render={({ field: { onChange, value } }) => (
											<TextField
												onChange={onChange}
												{...register("cMND_NV")}
												label="CCCD"
												size="small"
												fullWidth
											/>
										)}
									/>
								</Grid>
								<Grid item xs={12} sm={6} >
									<LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
										<DatePicker
											className='customsize-datepicker'
											id="ngayCapCMND_NV"
											fullWidth
											name='ngayCapCMND_NV'
											label="Ngày cấp"
											variant="outlined"
											defaultValue={dayjs(dateCurrent)}
											slotProps={{ textField: { fullWidth: true } }}
											value={dayjs(ngayCapCMND)}
											onChange={handleNgayCapCMDD}
											size="small"
										/>
									</LocalizationProvider>
								</Grid>
								<Grid item xs={12} sm={12} >
									<FormControl size="small" fullWidth>
										<TextField
											select
											fullWidth
											size="small"
											label="Tình trạng"
											defaultValue={nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.tinhTrang : 0}
											inputProps={register('tinhTrang', {
												onChange: (event) => {
													handleTinhTrang(event)
												}
											})}
											error={errors.currency}
											helperText={errors.currency?.message}
										>
											{tinhTrang.map(x => {
												return (
													<MenuItem value={x.no}>
														<em>{x.data}</em>
													</MenuItem>
												)
											})}
										</TextField>
									</FormControl>
								</Grid>
							</Grid>

							<Grid container spacing={1} item xs={12} sm={6}>
								<Grid item xs={12} sm={12} >
									<TextField
										name="email_NV"
										size="small"
										fullWidth
										label="Email"
										defaultValue
										{...register("email_NV")}
										margin="nomal"
									/>
								</Grid>
								<Grid item xs={12} sm={12} >
									<InputLabel id="noiCapCMND-select-small"></InputLabel>
									<Controller
										control={control}
										margin="nomal"
										name="noiCapCMND_NV"
										fullWidth
										render={({ field: { onChange, value } }) => (
											<TextField
												onChange={onChange}
												{...register("noiCapCMND_NV")}
												label="Nơi cấp CMND"
												size="small"
												fullWidth
											/>
										)}
									/>
								</Grid>
								<Grid item xs={12} sm={12} >
									<FormControl size="small" fullWidth>
										<TextField
											select
											fullWidth
											size="small"
											label="Loại hồ sơ"
											defaultValue={nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.type_NV : 0}
											inputProps={register('type_NV', {
												onChange: (event) => {
													handLoaiHoSo(event)
												}
											})}
										>
											{loaiHoSo.map(x => {
												return (
													<MenuItem value={x.no}>
														<em>{x.data}</em>
													</MenuItem>
												)
											})}
										</TextField>
									</FormControl>
								</Grid>
							</Grid>

							<Grid container spacing={1} item xs={12} sm={12}>
								<Grid item xs={12} sm={12}>
									<TextareaAutosize
										placeholder="Ghi chú"
										style={st}
										name="ghiChu"
										defaultValue
										minRows={3}
										size="small"
										fullWidth
										{...register("ghiChu")}
										margin="nomal"
									/>
								</Grid>
							</Grid>
							<Grid item xs={12} sm={3} >
									<TextField
										name="file_Name"
										size="small"
										label="Tên file"
										fullWidth
										value={tenFile}
                   						 onChange={HandleTenFile}
										margin="nomal"
									/>
								</Grid>
							<Grid item xs={12} sm={2} >
								<LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
									<DatePicker
										className='customsize-datepicker'
										id="file_Start"
										fullWidth
										name='file_Start'
										label="Ngày bắt đầu"
										variant="outlined"
										defaultValue={dayjs(dateCurrent)}
										slotProps={{ textField: { fullWidth: true } }}
										value={dayjs(ngayBd)}
										onChange={handleNgayBd}
										size="small"
									/>
								</LocalizationProvider>
							</Grid>
							<Grid item xs={12} sm={2} >
								<LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
									<DatePicker
										className='customsize-datepicker'
										id="file_End"
										fullWidth
										name='file_End'
										label="Ngày kết thúc"
										variant="outlined"
										defaultValue={dayjs(dateCurrent)}
										slotProps={{ textField: { fullWidth: true } }}
										value={dayjs(ngayKt)}
										onChange={handleNgayKt}
										size="small"
									/>
								</LocalizationProvider>
							</Grid>
							<Grid item xs={12} sm={2} >
								<LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
									<DatePicker
										className='customsize-datepicker'
										id="file_Warning"
										fullWidth
										name='file_Warning'
										label="Ngày nhắc nhở"
										variant="outlined"
										defaultValue={dayjs(dateCurrent)}
										slotProps={{ textField: { fullWidth: true } }}
										value={dayjs(ngayWr)}
										onChange={handleNgayWr}
										size="small"
									/>
								</LocalizationProvider>
							</Grid>

							<Grid item xs={12} sm={2}>
								<ImageUpload
									selectedFile={selectedImage}
									setSelectedFile={handleChangeImg}
									isShowNameFile={true}
									icon={<AttachFileIcon />}
								/>
							</Grid>
							<Grid item xs={12} sm={1}>
								<Button
									onClick={handleAddRow}
								>
									(+)
								</Button>
							</Grid>

							<Grid item xs={12} sm={12}>
								<Box sx={{ height: 300, mt: 1 }}>
									<DataGrid
										rows={listTimeRows}
										columns={columns}
										onSelectionModelChange={(newSelectionModel) => {
											setSelectionModel(newSelectionModel);
										}}
										selectionModel={selectionModel}
									/>
								</Box>
							</Grid>
							<DialogContent dividers={false}>
								<DialogContentText
									id="scroll-dialog-description"
									tabIndex={-1}
								>
									<Box sx={{ flexGrow: 1 }}>
										<Grid >
											<Grid container spacing={2} item xs={12} sm={12} justifyContent="flex-end">
												<Grid item >
													<Button
														type="button"
														startIcon={<ArrowBackIcon />}
														variant="contained"
														onClick={handleCancel}
														size="small"
														color="error"
													>
														ĐÓNG
													</Button>
												</Grid>
												<Grid item >
													<Button
														type="submit"
														startIcon={<SaveAsIcon />}
														variant="contained"
														size="small"
													>
														LƯU
													</Button>
												</Grid>
											</Grid>
										</Grid>
									</Box>

								</DialogContentText>
							</DialogContent>
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
export default connect(mapStateToProps)(AddHoSoNhanVien);