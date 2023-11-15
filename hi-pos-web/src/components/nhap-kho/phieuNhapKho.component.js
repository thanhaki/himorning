import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, TextField, FormControl, MenuItem, InputLabel, Box, Button, Grid, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import phieuNhapXuat from '../../services/phieuNhapXuat.service';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import { ROWS_PER_PAGE_OPTIONS, FORMAT_DD_MM_YYYY } from '../../consts/constsCommon'
import SearchIcon from '@mui/icons-material/Search';
import AlertDialogMessage from '../common/dialog-confirm.component';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FORMAT_YYYY_MM_DD } from '../../consts/constsCommon';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AddPhieuNhap from './addPhieuNhapKho.component';
const theme = createTheme();

const columns = [
	{
		field: 'ten_Phieu',
		headerName: 'Tên phiếu',
		width: 300,
		editable: false,
		align: 'center'
	},
	{
		field: 'ma_Phieu',
		headerName: 'Mã phiếu',
		width: 200,
		editable: false,
		align: 'center'
	},
	{
		field: 'loaiPhieu',
		headerName: 'Loại phiếu',
		width: 250,
		editable: false,
		align: 'center'
	},
	{
		field: 'ngayLap_Phieu',
		headerName: 'Ngày',
		width: 150,
		valueFormatter: params =>
			dayjs(params?.value).format(FORMAT_DD_MM_YYYY),
		editable: false,
		align: 'center'
	},
	{
		field: 'soLuong',
		headerName: 'Số lượng',
		width: 100,
		editable: false,
		align: 'center'
	},
	{
		field: 'nguoiDeXuat',
		headerName: 'Người tạo',
		width: 200,
		editable: false,
		align: 'center'
	},
	{
		field: 'trangThai',
		headerName: 'Trạng thái',
		width: 200,
		editable: false,
		align: 'center'
	}
];



function PhieuNhapKho(props) {

	const [listDanhSach, setlistDanhSach] = useState([]);
	const [selectionModel, setSelectionModel] = useState([]);
	const [open, setOpen] = useState(false);
	const [isReload, setIsReload] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const dispatch = useDispatch();
	const [nameRow, setNameRow] = useState({});
	const [nameTitle, setNameTitle] = useState('');
	const [openDelete, setOpenDelete] = useState(false);
	const [tuNgay, setTuNgay] = useState(dayjs());
	const [denNgay, setDenNgay] = useState(dayjs());
	const [txtMaPhieu, setTxtSearch] = useState('');

	useEffect(() => {
		setTuNgay(dayjs() - 1);
		setDenNgay(dayjs());
		getAllDanhSach();
		dispatch(reFetchData(false));
	}, [isReload])

	const handleSearch = () => {
		getAllDanhSach();
	}

	const getAllDanhSach = () => {
		const tuN = dayjs(tuNgay).format(FORMAT_YYYY_MM_DD);
		const denN = dayjs(denNgay).format(FORMAT_YYYY_MM_DD);
		var data = {
			maPhieu: txtMaPhieu,
			type: "NHAP",
			tuNgay: tuN,
			denNgay: denN,
			donVi: props.userInfo?.user?.donVi
		}
		dispatch(showLoading(data));
		phieuNhapXuat.getListPhieuNhapXSearch(data).then((result) => {
			setlistDanhSach(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const handleRowClick = (params) => {
		setNameRow(params);
		setNameTitle(params.row.loaiPhieu + ' - ' + params.row.ma_Phieu);
		setOpen(false);
		setOpenEdit(true)
	};

	const handleAdd = () => {
		setOpen(true);
	}

	const handleClose = () => {
		setOpen(false);
	}

	const handleCloseEdit = () => {
		setOpenEdit(false);
		getAllDanhSach();
	}

	const handleDateTuNgay = (newValue) => {
		setTuNgay(newValue);
	}

	const handleDateDenNgay = (newValue) => {
		setDenNgay(newValue);
	}


	const handleDelete = () => {
		var ids = selectionModel;
		var listCheck = listDanhSach.filter(l => ids.includes(l.id) && (l.tinhTrang_Phieu === 2 || l.tinhTrang_Phieu === 3));
		if (selectionModel.length === 0) {
			showMessageByType(null, "Chọn phiếu cần xóa!!", TYPE_ERROR.warning)
			return;
		}
		if (listCheck.length > 0) {
			showMessageByType(null, "Phiếu đã nhập/hủy kho không thể xóa", TYPE_ERROR.warning)
		}
		else {
			dispatch(reFetchData("Bạn có muốn xóa các phiếu <b>đã chọn</b> không?"))
			setOpenDelete(true);
		}
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
			phieuNhapXuat.updatePhieuNhapX(data).then((res) => {
				dispatch(hideLoading());
				getAllDanhSach();
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

	const handleTxtChange = (event) => {
		setTxtSearch(event.target.value);
	};

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
					DANH SÁCH PHIẾU NHẬP KHO
				</Typography>
				</Box>
				<Box sx={{ mt: 3 }}>
					<Grid container spacing={2}>

						<Grid item xs={12} sm={6}>
							<FormControl sx={{ minWidth: 120 }} size="small" fullWidth>
								<TextField
									id="searchTxt"
									fullWidth
									value={txtMaPhieu}
									onChange={handleTxtChange}
									label="Tìm kiếm theo mã phiếu"
									variant="outlined"
									placeholder='Tìm kiếm theo mã phiếu'
									size="small" />
							</FormControl>
						</Grid>

						<Grid item xs={6} sm={2} >
							<LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
								<DatePicker
									className='customsize-datepicker'
									id="tuNgay"
									fullWidth
									name='tuNgay'
									label='Từ ngày'
									variant="outlined"
									slotProps={{ textField: { fullWidth: true } }}
									defaultValue={dayjs()}
									value={dayjs(tuNgay)}
									onChange={handleDateTuNgay}
									size="small"
								/>
							</LocalizationProvider>
						</Grid>
						<Grid item xs={6} sm={2} >
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									className='customsize-datepicker'
									id="denNgay"
									label='Đến ngày'
									fullWidth
									name='denNgay'
									variant="outlined"
									slotProps={{ textField: { fullWidth: true } }}
									defaultValue={dayjs()}
									value={dayjs(denNgay)}
									onChange={handleDateDenNgay}
									size="small"
								/>
							</LocalizationProvider>
						</Grid>

						<Grid item xs={12} sm={2}>
							<FormControl size="small" fullWidth>
								<Button variant="outlined" startIcon={<SearchIcon />} onClick={handleSearch}>
									Tìm kiếm
								</Button>
							</FormControl>
						</Grid>

						<Grid item xs={12} sm={12}>
							<Box sx={{
								height: 400, width: '100%',
								"& .MuiDataGrid-row.negative": {
									color: "#b2102f"
								},
								"& .MuiDataGrid-row.positive": {
									color: "#212121"
								}
							}}>
								<DataGrid
									getRowClassName={(params) => {
										return params.row.tinhTrang_Phieu !== 3 ? 'positive' : 'negative';
									}}
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

				{open && <AddPhieuNhap open={open} title={"THÊM MỚI PHIẾU NHẬP KHO"} handleClose={handleClose} handleLoadPageParent={handleLoadPage} />}
				{openEdit && <AddPhieuNhap open={openEdit} title={nameTitle} nameRow={nameRow} handleClose={handleCloseEdit} handleLoadPageParent={handleLoadPageEdit} />}
				<AlertDialogMessage
					open={openDelete}
					handleClose={handleCloseDel}
					title="Bạn muốn xóa phiếu được chọn?"
					callbackFunc={handleDeleteOk}
				/>
			</Container>
		</ThemeProvider >
	);

}

function mapStateToProps(state) {
	const { isReFetchData } = state.appReducers.message;
	const { user } = state.appReducers.auth;

	return {
		userInfo: user,
		isReFetchData: isReFetchData,
	};
}
export default connect(mapStateToProps)(PhieuNhapKho);