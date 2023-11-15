import React, { useState, useEffect, useRef } from 'react';
import {
	DialogTitle,  Dialog,
	TextareaAutosize, Typography, TextField, Box, Button,  FormControl,
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { connect } from "react-redux";
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { stylesErrorHelper } from '../../consts/modelStyle';
import { Grid } from '@mui/material';
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { set, useForm } from "react-hook-form";
import { DataGrid } from '@mui/x-data-grid';
import theThanhVienService from '../../services/thethanhvien.service';
import AddKhachHangByIdThe from './addKhachHangByIdThe.component'


const st = {
	width: '100%',
}
const columns = [
	{
		field: 'ten_KH',
		headerName: 'Tên khách hàng',
		width: 180,
		editable: true,
		align: 'center'
	},
	{
		field: 'diemTichLuy',
		headerName: 'Điểm tích lũy',
		width: 250,
		editable: true,
		align: 'center'
	},
	{
		field: 'dienThoai_KH',
		headerName: 'Điện thoại',
		width: 250,
		editable: true,
		align: 'center'
	},
];

function AddTheThanhVien(props) {

	const { open, title, handleClose, handleLoadPageParent, nameRow,nameSearch } = props;
	const dispatch = useDispatch()
	const [openEditListKhachHang, setOpenEditListKhachHang] = useState(false);
	const [isReload, setIsReload] = useState(false);
	const [listDanhSachKH, setListDanhSachKH] = useState([]);
	const [selectionModel, setSelectionModel] = useState([]);
	const [name, setNameSearch] = useState("");

	useEffect(() => {
		if (nameRow && Object.keys(nameRow).length > 0) {
			getKhachHangById();
		}
		dispatch(reFetchData(false));
	}, [isReload])

	const getKhachHangById = () => {
		var data = {
			donVi: props.userInfo?.user?.donVi,
			ma_TTV: nameRow.row.ma_TTV,
		}
		dispatch(showLoading(data));
		theThanhVienService.getKHByIdThe(data).then((result) => {
			setListDanhSachKH(result.data);
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
			ten_TTV: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ten_TTV : '',
			diemToiThieu: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.diemToiThieu : '',
			diemToiDa: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.diemToiDa : '',
			tyLeQuyDoi: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.tyLeQuyDoi : '',
			mieuTa: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.mieuTa : '',
			ghiChu_TTV: nameRow && Object.keys(nameRow).length > 0 ? props.nameRow.row.ghiChu_TTV : '',
		}
	});

	const handleSearch = () => {
		setOpenEditListKhachHang(true);
	}

	const handleEditClose = () => setOpenEditListKhachHang(false);

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

	const save = (values) => {
		values.donVi = props.userInfo?.user?.donVi;
		dispatch(showLoading(true));
		theThanhVienService.addTheThanhTV(values).then((result) => {
			dispatch(hideLoading());
			showMessageByType(null, "success", TYPE_ERROR.success)
			if (handleLoadPageParent) { handleLoadPageParent(); }
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const update = (values) => {
		values.ma_TTV = props.nameRow.row.ma_TTV;
		values.donVi = props.userInfo?.user?.donVi;
		dispatch(showLoading(true));
		theThanhVienService.updateTheTV(values).then((result) => {
			dispatch(hideLoading());
			showMessageByType(null, "success", TYPE_ERROR.success)
			if (handleLoadPageParent) { handleLoadPageParent(); }
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
				maxWidth="sm"
			>

				<form
					onSubmit={handleSubmit(onSubmit)}>
					<Box sx={{ mt: 2 }}>
						<Grid item xl={12} xs={12} >
							<DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
						</Grid>
						<Grid container spacing={2} style={{ padding: 10 }}>
							<Grid item xs={12} sm={12} >
								<Typography variant="subtitle1">
									Tên thẻ thành viên
								</Typography>
								<TextField
									name="ten_TTV"
									size="small"
									fullWidth
									defaultValue
									{...register("ten_TTV", { required: true })}
									margin="nomal"
								/>

							</Grid>

							<Grid item xs={8} sm={4} >
								<Typography variant="subtitle1">
									Điểm tích lũy tối thiểu
								</Typography>
								<TextField
									name="diemToiThieu"
									size="small"
									fullWidth
									defaultValue
									type={'number'}
									inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
									FormHelperTextProps={{ style: stylesErrorHelper.helper }}
									{...register("diemToiThieu", { required: true })}
									margin="nomal"
								/>
							</Grid>
							<Grid item xs={8} sm={4} >
								<Typography variant="subtitle1">
									Điểm tích lũy tối đa
								</Typography>
								<TextField
									name="diemToiDa"
									size="small"
									fullWidth
									defaultValue
									type={'number'}
									inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
									FormHelperTextProps={{ style: stylesErrorHelper.helper }}
									{...register("diemToiDa", { required: true })}
									margin="nomal"
								/>
							</Grid>
							<Grid item xs={8} sm={4} >
								<Typography variant="subtitle1">
									Tỷ lệ (=1 điểm)
								</Typography>
								<TextField
									name="tyLeQuyDoi"
									size="small"
									fullWidth
									defaultValue
									type={'number'}
									inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
									FormHelperTextProps={{ style: stylesErrorHelper.helper }}
									{...register("tyLeQuyDoi", { required: true })}
									margin="nomal"
								/>
							</Grid>
							<Grid item xs={12} sm={12} >
								<TextareaAutosize
									placeholder="Miêu tả"
									style={st}
									name="mieuTa"
									defaultValue
									minRows={4}
									size="small"
									fullWidth
									{...register("mieuTa", { required: true })}
									margin="nomal"
								/>
							</Grid>
							<Grid item xs={12} sm={12} >
								<TextareaAutosize
									placeholder="Ghi chú"
									style={st}
									name="ghiChu_TTV"
									defaultValue
									minRows={4}
									size="small"
									fullWidth
									{...register("ghiChu_TTV", { required: true })}
									margin="nomal"
								/>
							</Grid>
							{
								 nameRow !== undefined &&
								<>
									<Grid item xs={12} sm={12} container>
										<Grid item xs={12} sm={12} >
											<Typography variant="subtitle1">
												Tìm kiếm tên khách hàng
											</Typography>
										</Grid>
										<Grid item xs={12} sm={8} >
											<FormControl size="small" fullWidth>
												<TextField
													fullWidth
													// required
													id="outlined-required"
													value={name}
													size="small"
													onChange={e => setNameSearch(e.target.value)}
													margin="nomal"
												/>
											</FormControl>
										</Grid>
										<Grid item xs={12} sm={3} style={{ padding: 2 }}>
											<FormControl size="small" fullWidth>
												<Button variant="outlined" fullWidth startIcon={<SendIcon />} size="medium" onClick={handleSearch}>Tìm kiếm</Button>
											</FormControl>
										</Grid>
										<Grid item xs={12} sm={12}>
											<Box sx={{ height: 250, width: '100%' }}>
												<DataGrid
													rows={listDanhSachKH}
													columns={columns}
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
											</Box>
										</Grid>
									</Grid>
								</>
							}

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
				{openEditListKhachHang && <AddKhachHangByIdThe open={openEditListKhachHang} nameSearch={name} nameRow={nameRow} handleClose={handleEditClose} handleLoadPageParent={handleLoadPage} />}
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
export default connect(mapStateToProps)(AddTheThanhVien);