// Import thư viên mui hoặc component
import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, TextField, FormControl, MenuItem, InputLabel, Box, Button, Grid, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon'
import AlertDialogMessage from '../common/dialog-confirm.component';  
import SearchIcon from '@mui/icons-material/Search';
import hoSoNhanVienService from '../../services/hoSoNhanVien.service';
import AddHoSoNhanVien from './addHoSoNhanVien.component'

const theme = createTheme();

const columns = [
	{
		field: 'ten_NV',
		headerName: 'Tên nhân viên',
		width: 250,
		editable: true,
	},
	{
		field: 'dienThoai_NV',
		headerName: 'Điện thoại',
		width: 140,
		editable: true,
	},
	{
		field: 'ten_PhongBan',
		headerName: 'Bộ phận',
		width: 160,
		editable: true,
		align: 'center'
	},
	{
		field: 'trangThai',
		headerName: 'Tình trạng',
		width: 160,
		editable: true,
		align: 'center'
	},
];

function ListHoSoNhanVien(props) {

	const [listDanhSach, setlistDanhSach] = useState([]);
	const [selectionModel, setSelectionModel] = useState([]);
	const [open, setOpen] = useState(false);
	const [isReload, setIsReload] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const dispatch = useDispatch();
	const [nameRow, setNameRow] = useState({});
	const [openDelete, setOpenDelete] = useState(false);
	const [phongBan, setLoaiPhongBan] = useState([]);
	const [tinhTrang, setLoaiTinhTrang] = useState([]);
	const [id_LoaiTT, setIdLoaiTT] = useState(0);
	const [id_LoaiPb, setIdLoaiPb] = useState(0);

	useEffect(() => {
		getLoaiTinhTrang();
		getLoaiPb();
		getAllHoSoNhanVien();
		dispatch(reFetchData(false));
	}, [isReload])

	const getAllHoSoNhanVien = () => {
		var params = {
			donvi: props.userInfo?.user?.donVi,
			phongBan: id_LoaiPb,
			tinhTrang: id_LoaiTT
		}
		hoSoNhanVienService.getAllHoSoNv(params).then((result) => {
			setlistDanhSach(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}
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
	const HandleLoaiPb = (event) => {
		setIdLoaiPb(event.target.value);
	}
	const HandleLoaiTT = (event) => {
		setIdLoaiTT(event.target.value);
	}
	const handleRowClick = (params) => {
		setNameRow(params);
		setOpen(false);
		setOpenEdit(true);
	};

	const handleAdd = () => {
		setOpen(true);
	}


	const handleClose = () => {
		getAllHoSoNhanVien();
		setOpen(false);
	}

	const handleCloseEdit = () => {
		setOpenEdit(false);
		getAllHoSoNhanVien();
	}

	const handleDelete = () => {
		if (selectionModel.length === 0) {
			showMessageByType(null, "Chọn hồ sơ cần xóa!!", TYPE_ERROR.warning)
			return;
		}
		dispatch(reFetchData("Bạn có muốn xóa hồ sơ nhân viên <b>đã chọn</b> không?"))
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
			hoSoNhanVienService.deleteHoSoNV(data).then((res) => {
				dispatch(hideLoading());
				getAllHoSoNhanVien();
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
	const handleSearch = () => {
		getAllHoSoNhanVien();
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
					HỒ SƠ NHÂN VIÊN
				</Typography>
				</Box>
				<Box sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={5}>
							<FormControl size="small" fullWidth >
								<InputLabel id="loaiPhongBan-select-small">Chọn phòng ban</InputLabel>
								<Select
									labelId="loaiPhongBan-select-small"
									id="phongBan-select-small"
									value={id_LoaiPb}
									onChange={HandleLoaiPb}
									label="Chọn phòng ban"
								>
									 <MenuItem value={0}>
                                        <em>Tất cả</em>
                                    </MenuItem>
									{phongBan.map(x => {
										return (
											<MenuItem value={x.no}>
												<em>{x.data}</em>
											</MenuItem>
										)
									})}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={5}>
							<FormControl size="small" fullWidth >
								<InputLabel id="tinhTrang-select-small">Chọn tình trạng</InputLabel>
								<Select
									labelId="tinhTrang-select-small"
									id="tinhTrang-select-small"
									value={id_LoaiTT}
									label="Chọn tình trạng"
									onChange={HandleLoaiTT}
								>
									 <MenuItem value={0}>
                                        <em>Tất cả</em>
                                    </MenuItem>
									{tinhTrang && tinhTrang.map(x => {
										return (
											<MenuItem value={x.no}>
												<em>{x.data}</em>
											</MenuItem>
										)
									})}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={2}>
							<FormControl size="small" fullWidth>
								<Button variant="outlined" startIcon={<SearchIcon />} onClick={handleSearch}>
									Tìm kiếm
								</Button>
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

				{open && <AddHoSoNhanVien open={open} title={"THÊM MỚI HỒ SƠ NHÂN VIÊN"}handleClose={handleClose} handleLoadPageParent={handleLoadPage} />}
				{openEdit && <AddHoSoNhanVien open={openEdit} title={"CHỈNH SỬA HỒ SƠ NHÂN VIÊN"} nameRow={nameRow} handleClose={handleCloseEdit} handleLoadPageParent={handleLoadPageEdit} />}
				<AlertDialogMessage
					open={openDelete}
					handleClose={handleCloseDel}
					title="Bạn muốn xóa hồ sơ nhân viên được chọn?"
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

export default connect(mapStateToProps)(ListHoSoNhanVien);