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
import { ROWS_PER_PAGE_OPTIONS, FORMAT_DD_MM_YYYY } from '../../consts/constsCommon'
import moment from 'moment';
import SearchIcon from '@mui/icons-material/Search';
import AlertDialogMessage from '../common/dialog-confirm.component';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FORMAT_YYYY_MM_DD } from '../../consts/constsCommon';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import lichSuKho from '../../services/lichSuKho.service';
import { ExportCSV } from '../post-bill/control/export-bill.component';
import clsx from "clsx";


const theme = createTheme();

const columns = [
	{
		field: 'ngayLichSu',
		headerName: 'Thời gian',
		width: 150,
		valueFormatter: params =>
			moment(params?.value).format(FORMAT_DD_MM_YYYY),
		editable: false,
		align: 'center'
	},
	{
		field: 'ten_MH',
		headerName: 'Mặt hàng',
		width: 200,
		editable: false,
		align: 'center'
	},
	{
		field: 'noiDung_LichSu',
		headerName: 'Ghi chú',
		width: 250,
		editable: false,
		align: 'center'
	},
	{
		field: 'ma_ThamChieu',
		headerName: 'Tham chiếu',
		width: 200,
		editable: false,
		align: 'center'
	},
	{
		field: 'soLuongThayDoi',
		headerName: 'Thay đổi',
		width: 200,
		editable: false,
		align: 'right'
	},
	{
		field: 'soLuongConLai',
		headerName: 'Còn lại',
		width: 200,
		editable: false,
		align: 'right',
		cellClassName: (params) => {
		  if (params.value == null) {
			return "";
		  }
	
		  return clsx("MuiDataGrid-row", {
			negative: params.value < 0,
			positive: params.value > 0
		  });
		}
	},
	{
		field: 'nguoiTao',
		headerName: 'Người tạo',
		width: 200,
		editable: false,
		align: 'center'
	}
];



function LichSuKho(props) {

	const [listDanhSach, setlistDanhSach] = useState([]);
	const [selectionModel, setSelectionModel] = useState([]);
	const [isReload, setIsReload] = useState(false);
	const dispatch = useDispatch();
	const [tuNgay, setTuNgay] = useState(dayjs());
	const [denNgay, setDenNgay] = useState(dayjs());
	const [txtTenMh, setTxtSearch] = useState('');

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
		const  tuN = dayjs(tuNgay).format(FORMAT_YYYY_MM_DD);
		const  denN = dayjs(denNgay).format(FORMAT_YYYY_MM_DD);
		var data = {
			tenMH: txtTenMh,
			tuNgay: tuN,
			denNgay: denN,
			donVi: props.userInfo.user?.donVi
		}
		dispatch(showLoading(data));
		lichSuKho.getAllLichSuKho(data).then((result) => {
			setlistDanhSach(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const handleDateTuNgay = (newValue) => {
		setTuNgay(newValue);
	}

	const handleDateDenNgay = (newValue) => {
		setDenNgay(newValue);
	}
	const handleTxtChange = (event) => {
		setTxtSearch(event.target.value);
	};
	const postRowStyle = (record, index) => ({
		backgroundColor: record.soLuongConLai >= 0 ? "#d47483" : 'white',
	});
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
					LỊCH SỬ KHO
				</Typography>
				</Box>
				<Box sx={{ mt: 1 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<FormControl size="small" fullWidth>
								<TextField
									id="searchTxt"
									fullWidth
									value={txtTenMh}
									onChange={handleTxtChange}
									label="Tìm kiếm theo tên mặt hàng"
									variant="outlined"
									placeholder='Tìm kiếm theo tên mặt hàng'
									size="small" />
							</FormControl>
						</Grid>
					
						<Grid item xs={12} sm={2} >
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									className='customsize-datepicker'
									id="tuNgay"
									fullWidth
									name='tuNgay'
									label='Từ ngày'
									variant="outlined"
									defaultValue={dayjs()}
									value={dayjs(tuNgay)}
									onChange={handleDateTuNgay}
									size="small"
								/>
							</LocalizationProvider>
						</Grid>

						<Grid item xs={12} sm={2} >
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									className='customsize-datepicker'
									id="denNgay"
									fullWidth
									name='denNgay'
									label='Đến ngày'
									variant="outlined"
									defaultValue={dayjs()}
									value={dayjs(denNgay)}
									onChange={handleDateDenNgay}
									size="small"
								/>
							</LocalizationProvider>
						</Grid>

						<Grid item xs={12} sm={1}>
							<FormControl size="small" fullWidth>
								<Button variant="outlined" onClick={handleSearch}>
									Tìm kiếm
								</Button>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={1} textAlign={'right'}>
							<ExportCSV csvData={listDanhSach} fileName='danh-sach-lich-su-kho' />
						</Grid>

						<Grid item xs={12} sm={12}>
							<Box sx={{ height: 400, width: '100%' ,
								"& .MuiDataGrid-row.negative": {
									color: "#b2102f"
								},
								"& .MuiDataGrid-row.positive": {
									color: "#212121"
								}}}>
								<DataGrid
									getRowClassName={(params) => {
										return params.row.soLuongConLai >= 0 ? 'positive' : 'negative';
									}}
									rows={listDanhSach}
									columns={columns}
									pageSize={5}
									rowsPerPageOptions={[ROWS_PER_PAGE_OPTIONS]}
									editingMode="modal"
									checkboxSelection
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
export default connect(mapStateToProps)(LichSuKho);