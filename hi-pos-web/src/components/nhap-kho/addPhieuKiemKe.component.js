import React, { useState, useEffect, useRef } from 'react';
import {
	DialogTitle, Dialog, DialogContent, DialogContentText,
	TextareaAutosize, Typography, TextField, Box, Button, FormControl, MenuItem, InputLabel
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { connect } from "react-redux";
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { stylesErrorHelper } from '../../consts/modelStyle';
import { Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { set, useForm, Controller } from "react-hook-form";
import { DataGrid } from '@mui/x-data-grid';
import phieuNhapXuatService from '../../services/phieuNhapXuat.service';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ImageUpload } from '../common/upload-image.component';
import moment from 'moment';
import dayjs from 'dayjs';
import { FORMAT_YYYY_MM_DD } from '../../consts/constsCommon';
import ProductService from '../../services/product.service';
import { ROWS_PER_PAGE_OPTIONS, FORMAT_DD_MM_YYYY } from '../../consts/constsCommon'
import PrintIcon from '@mui/icons-material/Print';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import AddDanhSachMatHang from './addDanhSachMathang.component'
import { setDanhSachMatHang } from '../../actions/product';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import cloneDeep from 'lodash/cloneDeep';

const st = {
	width: '100%',
}




function AddPhieuKiemKe(props) {

	const { open, title, handleClose, handleLoadPageParent, nameRow, nameSearch } = props;
	const dispatch = useDispatch()
	const [openEdit, setOpenEdit] = useState(false);
	const [isReload, setIsReload] = useState(false);
	const [selectionModel, setSelectionModel] = useState([]);
	const [name, setNameSearch] = useState("");
	const [ma_LoaiP, setIdLoaiPh] = useState(0);
	const [loaiPhieu, setLoaiPhieu] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);
	const [dateCurrent, setDateCurrent] = useState(moment(new Date()).format(FORMAT_YYYY_MM_DD));
	const [thoiGianDat, setThoiGianDat] = useState(moment(new Date()).format(FORMAT_YYYY_MM_DD));
	const [isCheck, setIsCheck] = useState(1);
	const [product, setProduct] = useState([]);
	const [productInBuild, setProductInBuild] = useState([]);

	const RenderNumeric = (props) => {
		return (
			<div className="d-flex justify-content-between align-items-center">
				<TextField
					fullWidth
					onChange={
						event => handleChangeSoLuong(event, props)
					}
					variant="outlined"
					defaultValue={props.row.soLuong}
					size="small"
					type={'number'}
					inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'right' } }}

				/>
			</div>
		);
	}
	const RenderNumberKiemke = (props) => {
		return (
			<div className="d-flex justify-content-between align-items-center">
				<TextField
					fullWidth
					onChange={
						event => handleChangeSLKiemK(event, props)
					}
					variant="outlined"
					defaultValue={props.row.soLuongKiemKe}
					size="small"
					type={'number'}
					inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'right' } }}

				/>
			</div>
		);
	}

	const RenderText = (props) => {
		return (
			<div className="d-flex justify-content-between align-items-center">
				<TextField
					fullWidth
					onChange={
						event => handleChangeLyDo(event, props)
					}
					onKeyDown={(event) => {
						event.stopPropagation();
					}}
					variant="outlined"
					defaultValue={props.row.lyDoDieuChinh}
					size="small"
					margin="nomal"
				/>
			</div>
		);
	}
	const handleDelete = (id) => {
		var productTmp = productInBuild;
		var index = productTmp.filter(x => x.id !== id)
		setProductInBuild(index);
	}
	const RenderBtnDel = (props) => {
		const { id } = props;
		return (
			<IconButton
				aria-label="delete"
				size="small"
				onClick={() => handleDelete(id)} >
				<DeleteIcon fontSize="small" />
			</IconButton>
		);
	}

	const handleChangeSoLuong = (event, props) => {
		var productTmp = productInBuild;
		let index = productTmp.findIndex(x => x.id === props.id)
		productTmp[index].soLuong = Number(event.target.value);
		setProductInBuild(productTmp);
	}

	const handleChangeSLKiemK = (event, props) => {
		var productTmp = productInBuild;
		var index = productTmp.findIndex(x => x.id === props.id)
		productTmp[index].soLuongKiemKe = Number(event.target.value);
		productTmp[index].soLuongChenhLech = Number(event.target.value - productTmp[index].soLuong);
		setProduct(productTmp);
	}

	const handleChangeLyDo = (event, props) => {
		var productTmp = product;
		var index = productTmp.findIndex(x => x.id === props.id)
		productTmp[index].lyDoDieuChinh = event.target.value;
		setProduct(productTmp);
	}

	const columns = [
		{
			field: 'ten_MH',
			headerName: 'Tên mặt hàng / nguyên liệu',
			width: 200,
			editable: false,
			align: 'left'
		},
		{
			field: 'ten_DonVi',
			headerName: 'Đơn vị',
			width: 100,
			editable: false,
			align: 'center'
		},
		{
			field: 'soLuong',
			headerName: 'SL hệ thống',
			width: 100,
			editable: false,
			align: 'right',
			// renderCell: RenderNumeric,
		},
		{
			field: 'soLuongKiemKe',
			headerName: 'Kiểm kê',
			width: 100,
			editable: false,
			align: 'right',
			renderCell: RenderNumberKiemke,
		},
		{
			field: 'soLuongChenhLech',
			headerName: 'Chênh lệch',
			width: 100,
			editable: false,
			align: 'right',
		},
		{
			field: 'lyDoDieuChinh',
			headerName: 'Nhập lý do',
			width: 200,
			editable: false,
			renderCell: RenderText,
		},
		{
			field: '',
			headerName: '',
			width: 100,
			renderCell: RenderBtnDel,
			align: 'center'
		},
	];
	useEffect(() => {
		getLoaiPhieu();
		getListProduct();
		if (nameRow && Object.keys(nameRow).length > 0) {
			getListChiTiet();
		} else {
			setThoiGianDat(dayjs(dateCurrent))
		}
		dispatch(reFetchData(false));
	}, [isReload])

	const getLoaiPhieu = () => {
		var data = {
			type: "KIEMKE",
			donvi: props.userInfo.user?.donVi,
		}
		dispatch(showLoading(data));
		phieuNhapXuatService.getAllLoaiPhieu(data).then((result) => {
			setLoaiPhieu(result.data.loaiPhieu);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const handleChangeImg = (img) => {
		setSelectedImage(img);
	}


	const handleCancel = (event, reason) => {
		if (reason && reason === "backdropClick")
			return;
		if (handleClose) { handleClose() }
	}

	const handleHuyPhieu = () => {
		var data = {
			ma_PNX: nameRow.row.ma_PNX,
			ma_Phieu: nameRow.row.ma_Phieu,
			nhom_Phieu : 'KIEMKE',
			donvi: props.userInfo?.user?.donVi,
			listUpdateMatHang: productInBuild,
		}
		dispatch(showLoading(true));
		phieuNhapXuatService.updateTrangThaiHuy(data).then((result) => {
			dispatch(hideLoading());
			showMessageByType(null, "success", TYPE_ERROR.success)
			if (handleLoadPageParent) { handleLoadPageParent(); }
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
		handleClose();
	}
	const { register, setValue, getValues, formState: { errors }, handleSubmit , control } = useForm({
		defaultValues: {
			ma_PNX: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ma_PNX : 0,
			loai_Phieu: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.loai_Phieu : '',
			ma_Phieu: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ma_Phieu : 0,
			ten_Phieu: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ten_Phieu : '',
			ngayLap_Phieu: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ngayLap_Phieu : dateCurrent,
			ngayDeXuat: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ngayDeXuat : dateCurrent,
			nguoiDeXuat: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.nguoiDeXuat : props.userInfo.user.userName,
			ghiChu: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ghiChu : '',
			mieuTaFile: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.mieuTaFile : '',
			tenLoaiPhieu: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.loaiPhieu : '',
			lyDoDieuChinh: '0',
		}
	});

	const handleSearch = () => {
		setOpenEdit(true);
	}

	const handleEditClose = () => {
		setOpenEdit(false);
	}
	const handleChangeProduct = (data) => {
		let products = productInBuild;
		products = products.concat(cloneDeep(data).filter(i => i.isCheck && products.findIndex(e => e.id == i.id) < 0));
		setProductInBuild(products);
	}

	const handleLoadPage = () => {
		setIsReload(!isReload);
	}

	const onSubmit = (data) => {
		if (nameRow && Object.keys(nameRow).length > 0) {
			update(data);
		} else {
			save(data);
		}
	};



	const handleNhapKho = () => {
		setIsCheck(2);
	}
	const handleLuu = () =>{
		setIsCheck(1);
	}
	const save = (values) => {
		if(values.loai_Phieu == 0){
			showMessageByType(null, "Chưa chọn loại phiếu", TYPE_ERROR.error)
			return;
		}
		if(values.ten_Phieu.trim().length == 0){
			showMessageByType(null, "Chưa nhâp tên phiếu", TYPE_ERROR.error)
			return;
		}
		values.listMatHang = productInBuild;
		values.tinhTrang_Phieu = isCheck;
		values.isDathangNk = isCheck;
		values.donVi = props.userInfo.user?.donVi;
		const formData = new FormData();
		formData.append("file", selectedImage);
		formData.append("data", JSON.stringify(values));

		dispatch(showLoading(true));
		phieuNhapXuatService.addPhieuNhapX(formData).then((result) => {
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
		if(values.loai_Phieu == 0){
			showMessageByType(null, "Chưa chọn loại phiếu", TYPE_ERROR.error)
			return;
		}
		if(values.ten_Phieu.trim().length == 0){
			showMessageByType(null, "Tên phiếu không thể để trống", TYPE_ERROR.error)
			return;
		}
		values.isDathangNk = isCheck;
		values.tinhTrang_Phieu = values.ma_Phieu === 0 ? 1 : isCheck;
		values.donVi = props.userInfo.user?.donVi;
		values.listMatHang = productInBuild;
		values.nhom_Phieu = "KIEMKE";
		const formData = new FormData();
		formData.append("file", selectedImage);
		formData.append("data", JSON.stringify(values));

		dispatch(showLoading(true));
		phieuNhapXuatService.addPhieuNhapX(formData).then((result) => {
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

	const HandleLoaiPh = (event) => {
		var list = loaiPhieu.find(x => x.no === event.target.value);
		setIdLoaiPh(event.target.value);
		setValue('tenLoaiPhieu', list.data);
		setValue('ten_Phieu', list.data);
		setValue('nhom_Phieu', list.type);
	};
	const getListProduct = () => {
		var dataSearch = {
			donvi: props.userInfo.user?.donVi,
		}
		phieuNhapXuatService.getKiemKeSLMatHang(dataSearch).then((result) => {
			dispatch(setDanhSachMatHang(result.data));
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
			showMessageByType(error, "Lỗi load dữ liệu sản phẩm", TYPE_ERROR.error)
		})
	}
	const getListChiTiet = () => {
		var dataSearch = {
			ma_PNX: nameRow.row.ma_PNX,
			donvi: props.userInfo.user?.donVi,
		}
		phieuNhapXuatService.getChiTietPhieuKiemKe(dataSearch).then((result) => {
			setProductInBuild(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
			showMessageByType(error, "Lỗi load dữ liệu sản phẩm", TYPE_ERROR.error)
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

				<form
					onSubmit={handleSubmit(onSubmit)}>
					<Box sx={{ mt: 2 }}>
						<Grid item xl={12} xs={12} >
							<DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
						</Grid>
						<Grid container spacing={1} style={{ padding: 10 }}>
							<Grid item xs={12} sm={4} >
								<FormControl size="small" fullWidth>
									<InputLabel id="LoaiPhieu-select-small"></InputLabel>
									<TextField
										select
										fullWidth
										label="Loại phiếu"
										size="small"
										defaultValue={nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.loai_Phieu : 0}
										inputProps={register('loai_Phieu', {
											onChange: (event) => {
												HandleLoaiPh(event)
											}
										})}
										error={errors.currency}
										helperText={errors.currency?.message}
									>
										{loaiPhieu.map(x => {
											return (
												<MenuItem value={x.no}>
													<em>{x.data}</em>
												</MenuItem>
											)
										})}
									</TextField>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={4} >
								<InputLabel id="TenPhieu-select-small"></InputLabel>
								<Controller
										control={control}
										margin="nomal"
										name="ten_Phieu"
										fullWidth
										render={({field: {onChange, value}}) => (
											<TextField
											   onChange={onChange}
											   value={value || ''}
											   label="Tên phiếu"
											   size="small"
											   fullWidth
											/>
										)}
									/>
							</Grid>
							<Grid item xs={12} sm={4} >
								<FormControl size="small" fullWidth>
									<InputLabel id="MaPhieu-select-small"></InputLabel>
									<TextField
										id="ma_Phieu"
										fullWidth
										label="Mã phiếu"
										name='ma_Phieu'
										{...register("ma_Phieu")}
										size="small"
										inputProps={
											{ readOnly: true, }
										}
										disabled
										style={{ textAlign: "center" }}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={8} >
								<ImageUpload
									title="File chứng từ"
									selectedFile={selectedImage}
									setSelectedFile={handleChangeImg}
									isShowNameFile={true}
									icon={<AttachFileIcon />}
									downloadComponent={nameRow && Object.keys(nameRow).length && nameRow.row.mieuTaFile.length > 0 &&
										<Link href={props.nameRow.row.mieuTaFile}
											color="inherit" target='_blank'>
											Tải file chứng từ gốc
										</Link>
									}
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Button variant="outlined" fullWidth startIcon={<SendIcon />} size="medium" onClick={handleSearch}>
									Thêm mặt hàng
								</Button>
							</Grid>
							<Grid container spacing={2} item xs={12} sm={12}>

								<Grid item xs={12} sm={12}>
									<Box sx={{ height: 300, width: '100%' }}>
										<div style={{ height: 'calc(100% - 48px)', overflow: 'auto' }}> 
										<DataGrid
											rows={productInBuild}
											columns={columns}
											// pageSize={5}
											// rowsPerPageOptions={[ROWS_PER_PAGE_OPTIONS]}
											hideFooter={true} 
											editingMode="modal"
											disableSelectionOnClick
											experimentalFeatures={{ newEditingApi: false }}
											onSelectionModelChange={(newSelectionModel) => {
												setSelectionModel(newSelectionModel);
											}}
											selectionModel={selectionModel}
										/>
										</div>
									</Box>
								</Grid>
								<Grid item xs={12} sm={12}>
									<TextareaAutosize
										placeholder="Ghi chú"
										style={st}
										name="ghiChu"
										defaultValue
										minRows={4}
										size="small"
										fullWidth
										{...register("ghiChu")}
										margin="nomal"
									/>
								</Grid>

							</Grid>
							<DialogContent dividers={false}>
								<DialogContentText
									id="scroll-dialog-description"
									tabIndex={-1}
								>
									<Box sx={{ flexGrow: 1 }}>
										<Grid sx={{ display: { xs: 'none', sm: 'block' } }}>
											{(nameRow !== undefined && nameRow.row.tinhTrang_Phieu === 3) &&
												<>
													<Grid container spacing={2} item xs={12} sm={12}>
														<Grid item sm={12} justifyContent="flex-end">
															<Grid item textAlign={'right'}>
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
														</Grid>
													</Grid>
												</>
											}
											{(nameRow !== undefined && nameRow.row.tinhTrang_Phieu === 1) &&
												<>
													<Grid container spacing={2} item xs={12} sm={12}>
														<Grid item xs={12} sm={3} justifyContent="flex-start">
															<Grid item>
																<Button
																	type="button"
																	variant="contained"
																	onClick={handleHuyPhieu}
																	size="small"
																	color="error"
																>
																	HỦY PHIẾU
																</Button>
															</Grid>
														</Grid>
														<Grid container spacing={2} item xs={12} sm={9} justifyContent="flex-end">
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
																	onClick={handleLuu}
																	disabled={nameRow === undefined ? false : (nameRow.row.tinhTrang_Phieu === 2 || nameRow.row.tinhTrang_Phieu === 3)}
																>
																	LƯU
																</Button>
															</Grid>
															<Grid item >
																<Button type="submit"
																	startIcon={<MapsHomeWorkIcon />}
																	variant="contained"
																	size="small"
																	onClick={handleNhapKho}
																	disabled={nameRow === undefined ? false : (nameRow.row.tinhTrang_Phieu === 2 || nameRow.row.tinhTrang_Phieu === 3)}
																>
																	LƯU & CÂN BẰNG KHO
																</Button>
															</Grid>
														</Grid>
													</Grid>
												</>
											}
											{(nameRow !== undefined && nameRow.row.tinhTrang_Phieu === 2) &&
												<>
													<Grid container spacing={2} item xs={12} sm={12}>
														<Grid item xs={12} sm={3} justifyContent="flex-start">
															<Grid item>
																<Button
																	type="button"
																	variant="contained"
																	onClick={handleHuyPhieu}
																	size="small"
																	color="error"
																>
																	HỦY PHIẾU
																</Button>
															</Grid>
														</Grid>
														<Grid item xs={12} sm={9} justifyContent="flex-end">
															<Grid item textAlign={'right'}>
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
														</Grid>
													</Grid>
												</>
											}
											{(nameRow === undefined) &&
												<>
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
																onClick={handleLuu}
																disabled={nameRow === undefined ? false : (nameRow.row.tinhTrang_Phieu === 2 || nameRow.row.tinhTrang_Phieu === 3)}
															>
																LƯU
															</Button>
														</Grid>
														<Grid item >
															<Button type="submit"
																startIcon={<MapsHomeWorkIcon />}
																variant="contained"
																size="small"
																onClick={handleNhapKho}
																disabled={nameRow === undefined ? false : (nameRow.row.tinhTrang_Phieu === 2 || nameRow.row.tinhTrang_Phieu === 3)}
															>
																LƯU & CÂN BẰNG KHO
															</Button>
														</Grid>
													</Grid>
												</>
											}

										</Grid>

										<Grid sx={{ display: { xs: 'block', sm: 'none' } }}>
											{(nameRow !== undefined && nameRow.row.tinhTrang_Phieu === 3) &&
												<>
													<Grid container spacing={2} item xs={12} sm={12} justifyContent="flex-end">
														<Grid item>
															<Button
																type="button"
																startIcon={<ArrowBackIcon />}
																variant="contained"
																onClick={handleCancel}
																size="small"
																color="error"
																fullWidth
															>
																ĐÓNG
															</Button>
														</Grid>
													</Grid>
												</>
											}
											{(nameRow !== undefined && nameRow.row.tinhTrang_Phieu === 1) &&
												<>
													<Grid item xs={12} sm={12}>
														<Grid container item xs={12} sm={12} spacing={2} justifyContent="flex-end">
															<Grid item xs={5} sm={12}>
																<Button
																	type="button"
																	variant="contained"
																	onClick={handleHuyPhieu}
																	size="small"
																	color="error"
																	fullWidth
																>
																	HỦY PHIẾU
																</Button>
															</Grid>
															<Grid item xs={4} sm={12} >
																<Button
																	type="button"
																	startIcon={<ArrowBackIcon />}
																	variant="contained"
																	onClick={handleCancel}
																	size="small"
																	fullWidth
																	color="error"
																>
																	ĐÓNG
																</Button>
															</Grid>
															<Grid item xs={3} sm={12} >
																<Button
																	type="submit"
																	startIcon={<SaveAsIcon />}
																	variant="contained"
																	fullWidth
																	size="small"
																	onClick={handleLuu}
																	disabled={nameRow === undefined ? false : (nameRow.row.tinhTrang_Phieu === 2 || nameRow.row.tinhTrang_Phieu === 3)}
																>
																	LƯU
																</Button>
															</Grid>
															<Grid item xs={12} sm={12} >
																<Button type="submit"
																	startIcon={<MapsHomeWorkIcon />}
																	variant="contained"
																	size="small"
																	fullWidth
																	onClick={handleNhapKho}
																	disabled={nameRow === undefined ? false : (nameRow.row.tinhTrang_Phieu === 2 || nameRow.row.tinhTrang_Phieu === 3)}
																>
																	LƯU & CÂN BẰNG KHO
																</Button>
															</Grid>
														</Grid>
													</Grid>
												</>
											}
											{(nameRow !== undefined && nameRow.row.tinhTrang_Phieu === 2) &&
												<>
													<Grid container spacing={2} item xs={12} sm={12} justifyContent="flex-end">
														<Grid item xs={6} sm={12}>
															<Button
																type="button"
																variant="contained"
																onClick={handleHuyPhieu}
																size="small"
																color="error"
																fullWidth
															>
																HỦY PHIẾU
															</Button>
														</Grid>

														<Grid item xs={6} sm={12}>
															<Button
																type="button"
																startIcon={<ArrowBackIcon />}
																variant="contained"
																onClick={handleCancel}
																size="small"
																color="error"
																fullWidth
															>
																ĐÓNG
															</Button>
														</Grid>
													</Grid>
												</>
											}
											{(nameRow === undefined) &&
												<>
													<Grid container spacing={1} item xs={12} sm={12} justifyContent="flex-end">
														<Grid item xs={6} sm={12} >
															<Button
																type="button"
																startIcon={<ArrowBackIcon />}
																variant="contained"
																onClick={handleCancel}
																size="small"
																fullWidth
																color="error"
															>
																ĐÓNG
															</Button>
														</Grid>
														<Grid item xs={6} sm={12} >
															<Button
																type="submit"
																startIcon={<SaveAsIcon />}
																variant="contained"
																size="small"
																fullWidth
																onClick={handleLuu}
																disabled={nameRow === undefined ? false : (nameRow.row.tinhTrang_Phieu === 2 || nameRow.row.tinhTrang_Phieu === 3)}
															>
																LƯU
															</Button>
														</Grid>
														<Grid item xs={12} sm={12} >
															<Button type="submit"
																startIcon={<MapsHomeWorkIcon />}
																variant="contained"
																fullWidth
																size="small"
																onClick={handleNhapKho}
																disabled={nameRow === undefined ? false : (nameRow.row.tinhTrang_Phieu === 2 || nameRow.row.tinhTrang_Phieu === 3)}
															>
																LƯU & CÂN BẰNG KHO
															</Button>
														</Grid>
													</Grid>
												</>
											}

										</Grid>
									</Box>
								</DialogContentText>
							</DialogContent>

						</Grid>


					</Box>
				</form>
				{openEdit && <AddDanhSachMatHang
					open={openEdit}
					nameSearch={name}
					listProduct={product}
					nameRow={nameRow}
					handleChangeProduct={handleChangeProduct}
					handleClose={handleEditClose}
					handleLoadPageParent={handleLoadPage}
				/>}
			</Dialog>
		</React.Fragment>
	);
}

function mapStateToProps(state) {
	const { message } = state.appReducers;
	const { user } = state.appReducers.auth;
	const { danhSachMH } = state.appReducers.product;
	return {
		message,
		userInfo: user
	};
}
export default connect(mapStateToProps)(AddPhieuKiemKe);