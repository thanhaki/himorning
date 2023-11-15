// Import thư viên mui hoặc component
import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, TextField, FormControl, MenuItem, InputLabel, Box, Button, Grid, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import khachHangService from '../../services/khachHang.service';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon'
import AlertDialogMessage from '../common/dialog-confirm.component';
import AddKhachHang from './addKhachHang.component';
import EditKhachHang from './editKhachHang.component';
import { LOAI_KHACH_HANG } from '../../consts/constsCommon';
import { formatMoney } from '../../helpers/utils';
const theme = createTheme();

const columns = [
	{
		field: 'ten_KH',
		headerName: 'Khách hàng',
		width: 250,
		editable: true,
	},
	{
		field: 'dienThoai_KH',
		headerName: 'Điện thoại',
		width: 140,
		editable: true,
	},
	{
		field: 'tongSoHoaDon_KH',
		headerName: 'Hóa đơn',
		width: 160,
		editable: true,
		align: 'center'
	},
	{
		field: 'maDonHang',
		headerName: 'Hóa đơn gần nhất',
		width: 160,
		editable: true,
		align: 'center'
	}
	,
	{
		field: 'chiTieuTrungBinh_KH',
		headerName: 'Tổng chi tiêu',
		width: 160,
		editable: true,
		valueFormatter: params =>
			formatMoney(params?.value),
		align: 'right'
	}
];

function ListKhachHang(props) {

	const [listDanhSach, setlistDanhSach] = useState([]);
	const [selectionModel, setSelectionModel] = useState([]);
	const [open, setOpen] = useState(false);
	const [isReload, setIsReload] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const dispatch = useDispatch();
	const [nameRow, setNameRow] = useState({});
	const [openDelete, setOpenDelete] = useState(false);
	const [loaiKhachHang, setLoaiKhachHang] = useState([]);
	const [id_LoaiKh, setIdLoaiKh] = useState(0);

	useEffect(() => {
		getLoaiKhachHang();
		dispatch(reFetchData(false));
	}, [isReload])

	const getLoaiKhachHang = () => {
		var params = {
			donvi: props.userInfo?.user?.donVi,
		}
		khachHangService.getLoaiKhachHang(params).then((result) => {
			setLoaiKhachHang(result.data.loaiKhach);
			setIdLoaiKh(result.data.loaiKhach[0]['no']);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
		getKhachHangByLoai();
	}
	const getKhachHangByLoai = () => {
		dispatch(showLoading(true));
		khachHangService.getAllKhachHang(LOAI_KHACH_HANG.KHACH_HANG).then((result) => {
			setlistDanhSach(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}
	const HandleLoaiKh = (event) => {
		setIdLoaiKh(event.target.value);
		dispatch(showLoading(true));
		khachHangService.getAllKhachHang(event.target.value).then((result) => {
			setlistDanhSach(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	};
	const handleRowClick = (params) => {
		setNameRow(params);
		if (params.row.loai_KH === LOAI_KHACH_HANG.KHACH_HANG) {
			setOpen(false);
			setOpenEdit(true)
		} else {
			setOpen(true);
			setOpenEdit(false)
		}
	};

	const handleAdd = () => {
		setNameRow(null);
		setOpen(true);
	}


	const handleClose = () => {
		setOpen(false);
	}

	const handleCloseEdit = () => {
		setOpenEdit(false);
		getKhachHangByLoai();
	}

	const handleDelete = () => {
		if (selectionModel.length === 0) {
			showMessageByType(null, "Chọn khách hàng cần xóa!!", TYPE_ERROR.warning)
			return;
		}
		dispatch(reFetchData("Bạn có muốn xóa các khách hàng <b>đã chọn</b> không?"))
		setOpenDelete(true);
	}

	const handleCloseDel = () => {
		setOpenDelete(false);
	}

	const handleDeleteOk = () => {
		var data = {
			ids: selectionModel
		}
		if (data.ids.length > 0) {
			dispatch(showLoading(true));
			khachHangService.deleteKhachHang(data).then((res) => {
				dispatch(hideLoading());
				getKhachHangByLoai();
				setOpenDelete(false);
				showMessageByType(null, "success", TYPE_ERROR.success)
			}).catch((error) => {
				showMessageByType(error, "error", TYPE_ERROR.error)
				dispatch(hideLoading());
			})
		}
	}
	const handleLoadPage = () => {
		setIsReload(!isReload);
	}
	const handleLoadPageEdit = () => {
		setIsReload(!isReload);
	}
	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="true">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 2,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Typography component="h1" variant="h6">
						KHÁCH HÀNG
					</Typography>
				</Box>
				<Box sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={2}>
							<FormControl size="small" fullWidth >
								<InputLabel id="LoaiKhachHang-select-small">Loại khách hàng</InputLabel>
								<Select
									labelId="danhMuc-select-small"
									id="danhMuc-select-small"
									value={id_LoaiKh}
									label="Loại khách hàng"
									onChange={HandleLoaiKh}
								>
									<MenuItem value={0}>
										<em>Tất cả</em>
									</MenuItem>
									{loaiKhachHang.map(x => {
										return (
											<MenuItem value={x.no}>
												<em>{x.data}</em>
											</MenuItem>
										)
									})}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={12}>
							<Box sx={{ height: 400, width: '100%' }}>
								<DataGrid
									rows={listDanhSach}
									columns={columns}
									pageSize={5}
									rowsPerPageOptions={[ROWS_PER_PAGE_OPTIONS]}
									editingMode="modal"
									checkboxSelection
									onRowClick={handleRowClick}
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
				</Box>
				<Box sx={{ mt: 3, mb: 3 }}>
					<Grid container justifyContent="flex-end">
						<Button variant="outlined" color="error" startIcon={<DeleteIcon />} sx={{ mr: 1 }} onClick={handleDelete} size="small">Xóa</Button>
						<Button variant="outlined" startIcon={<SendIcon />} onClick={handleAdd}>Thêm mới</Button>
					</Grid>
				</Box>

				{open && <AddKhachHang
					open={open}
					title={nameRow == null ? "THÊM MỚI KHÁCH HÀNG" : "CHỈNH SỬA KHÁCH HÀNG"}
					nameRow={nameRow}
					handleClose={handleClose}
					handleLoadPageParent={handleLoadPage}
					id_LoaiKh={id_LoaiKh === 0 ? 1001 : id_LoaiKh}
				/>}
				{openEdit &&
					<EditKhachHang
						open={openEdit}
						title={"CHỈNH SỬA KHÁCH HÀNG"}
						nameRow={nameRow}
						handleClose={handleCloseEdit}
						handleLoadPageParent={handleLoadPageEdit}
						id_LoaiKh={id_LoaiKh === 0 ? 1001 : id_LoaiKh}
					/>}
				<AlertDialogMessage
					open={openDelete}
					handleClose={handleCloseDel}
					title="Bạn muốn xóa khách hàng được chọn?"
					callbackFunc={handleDeleteOk}
				/>
			</Container>
		</ThemeProvider >
	);
	//End view
}

function mapStateToProps(state) {
	const { isReFetchData } = state.appReducers.message;
	const { user } = state.appReducers.auth;

	return {
		userInfo: user,
		isReFetchData: isReFetchData,
	};
}

export default connect(mapStateToProps)(ListKhachHang);