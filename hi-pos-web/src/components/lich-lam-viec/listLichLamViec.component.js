import {
	Button, Grid, FormControl, Box, Container, Typography, InputLabel,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { showLoading, hideLoading, reFetchData, getAllHttt } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { connect } from "react-redux";
import lichLamViec from '../../services/lichLamViecNhanVien.service';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { showMessageByType } from '../../helpers/handle-errors';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import workShift from '../../services/workShift.service';
import { Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import './tableEdit.css'

const theme = createTheme();

const columnsWorkShift = [
	{ field: 'id', headerName: 'STT', width: 50, sortable: false },
	{
		field: 'ma_CaLamViec',
		headerName: 'Mã ca làm việc',
		width: 150,
		editable: true,
		align: 'center'
	},
	{
		field: 'moTa_CaLamViec',
		headerName: 'Miêu tả ca làm việc',
		width: 350,
		editable: true,
		align: 'left'
	},
	{
		field: 'heSo_CaLamViec',
		headerName: 'Hệ số công ngày',
		width: 150,
		editable: true,
		align: 'right',
	},
];


function LichLamViecNhanVien(props) {
	const dispatch = useDispatch();
	const [isReload, setIsReload] = useState(false);
	const [listLichLamViec, setListLichLamViec] = useState([])
	const [listWorkShift, setListWorkShift] = useState([]);
	const [id_Month, setIdMonth] = useState(0);
	const [id_Year, setIdYear] = useState(0);

	const months = Array.from({ length: 12 }, (_, index) => index + 1);

	const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
	const yearsPast = Array.from({ length: 1 }, (v, i) => currentYear - i - 1); // Mảng năm quá khứ (1 năm)
	const yearsFuture = Array.from({ length: 1 }, (v, i) => currentYear + i + 1); // Mảng năm tương lai (1 năm)
	const allYears = [...yearsPast, currentYear, ...yearsFuture]; // Mảng chứa tất cả các năm

	const currentMonth = new Date().getMonth();// lấy tháng hiện tại
	const currentDay = new Date().getDate();// lấy ngày hiện tại
	let id_MonthNew = 0;
	let id_YearNew = 0;
	useEffect(() => {
		setIdYear(new Date().getFullYear());
		setIdMonth(new Date().getMonth() + 1);
		getAll();
		var dataSearch = {
			donVi: props.userInfo?.user?.donVi,
			month: new Date().getMonth() + 1,
			year: new Date().getFullYear()
		}
		dispatch(showLoading(true));
		lichLamViec.getAllLichLamViec(dataSearch).then((result) => {
			setListLichLamViec(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}, [isReload])

	const getAll = () => {
		dispatch(showLoading(true));
		let data = props.userInfo?.user?.donVi
		workShift.getAllCaLamViec(data).then((result) => {
			setListWorkShift(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}


	const handleSearch = () => {
		var dataSearch = {
			donVi: props.userInfo?.user?.donVi,
			month: id_MonthNew == 0 ? id_Month : id_MonthNew,
			year: id_YearNew == 0 ? id_Year : id_YearNew,
		}
		dispatch(showLoading(true));
		lichLamViec.getAllLichLamViec(dataSearch).then((result) => {
			setListLichLamViec(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})

	}

	var daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	var totalDays = new Date(id_Year, id_Month, 0).getDate();
	const today = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại

	const formatNumber = (value) => {
		if (isNaN(value) || value === '') {
		  return value;
		}
		return parseFloat(value).toFixed(1);
	  };

	const columns = [
		{ field: 'ten_NV', headerName: 'Tên nhân viên', width: 180 },
		...Array.from({ length: totalDays }).map((_, index) => {
			const day = (index + 1).toString().padStart(2, '0');
			const dayOfWeek = daysOfWeek[new Date(id_Year, id_Month - 1, index + 1).getDay()];
			const headerName = `${day} - ${dayOfWeek}`;

			let disabled = false;
			if (props.userInfo?.user?.isAdministrator === "1") {
				disabled = false;
			} else {
				if (id_Year < currentYear || (id_Year === currentYear && id_Month < currentMonth) || (id_Year === currentYear && id_Month === currentMonth && index + 1 < currentDay)) {
					disabled = true;
				}
			}
			const cellStyle = {
				color: dayOfWeek === 'Sa' || dayOfWeek === 'Su' ? 'red' : 'inherit',
			  };
		  
		  
			const headerStyle = {
			backgroundColor: dayOfWeek === 'Sa' || dayOfWeek === 'Su' ? 'red' : 'inherit',
			color: 'white',
			};
			const headerClassName = dayOfWeek === 'Sa' || dayOfWeek === 'Su' ? 'sa-su-header' : '';
			return {
				field: `d${day}`,
				headerName,
				width: 120,
				editable: false,
				renderCell: (params) => (
					<Select
						value={params.value}
						onChange={(event) => handleDropdownChange(event, params)}
						fullWidth
						size="small"
						variant="outlined"
						disabled={disabled}
						inputProps={{
							min: today, // Giá trị nhỏ nhất là ngày hiện tại
						}}
						style={cellStyle}
					>
						{listWorkShift.map((x) => (
							<MenuItem key={x.so_CaLamViec} value={x.so_CaLamViec}>
								<em>{x.ma_CaLamViec}</em>
							</MenuItem>
						))}
					</Select>
				),
				headerStyle,
				headerClassName
			};
		}),
		{ field: 'total',
		 headerName: 'Tổng',
		 width: 100,
		 align: 'center', 
		 valueFormatter: (params) => formatNumber(params.value), // Sử dụng hàm formatNumber để định dạng giá trị

		},
	];



	function handleDropdownChange(event, params) {
		const { id } = params.row;
		// Cập nhật giá trị dropdown tương ứng trong dữ liệu rows
		let newArr = [...listLichLamViec];
		if(newArr.length == 1){
			newArr[0][params.field] = event.target.value;
		}
		else{
			newArr[id - 1][params.field] = event.target.value;
		}
		
		setListLichLamViec(newArr);
		var paramsEidtCell = {
			donVi: props.userInfo?.user?.donVi,
			month: id_Month,
			year: id_Year,
			listLichLamViecNew: newArr.length == 1 ? [newArr[0]] : [newArr[id - 1]]
		}
		lichLamViec.addLichLamViec(paramsEidtCell).then((result) => {
			dispatch(hideLoading());
			handleSearch();
			showMessageByType(null, "success", TYPE_ERROR.success)
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const handleChangeMonth = (event) => {
		setIdMonth(event.target.value);
		id_MonthNew = event.target.value;
		handleSearch();
	};

	const handleChangeYear = (event) => {
		setIdYear(event.target.value);
		id_YearNew = event.target.value;
		handleSearch();
	};
	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="true">
				<Box
					sx={{
						marginTop: 2,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Typography component="h1" variant="h5">
						LỊCH LÀM VIỆC
					</Typography>
				</Box>


				<Box sx={{ mt: 3 }}>
					<Grid container spacing={1}>
						<Grid item xs={12} sm={2}>
							<FormControl size="small" fullWidth >
								<InputLabel id="year-label">Năm</InputLabel>
								<Select
									labelId="year-select-small"
									id="year-select-small"
									value={id_Year}
									label="Năm"
									onChange={handleChangeYear}
								>

									{allYears.map(year => {
										return (
											<MenuItem value={year}>
												<em>{year}</em>
											</MenuItem>
										)
									})}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={2}>
							<FormControl size="small" fullWidth >
								<InputLabel id="month-label">Tháng</InputLabel>
								<Select
									labelId="month-select-small"
									id="month-select-small"
									value={id_Month}
									label="Tháng"
									onChange={handleChangeMonth}
								>

									{months.map(month => {
										return (
											<MenuItem value={month}>
												<em>{month}</em>
											</MenuItem>
										)
									})}
								</Select>
							</FormControl>
						</Grid>
						{/* <Grid item xs={12} sm={3}>
							<FormControl size="small" fullWidth>
								<Button variant="outlined" startIcon={<SearchIcon />} onClick={handleSearch}>
									Tìm kiếm
								</Button>
							</FormControl>
						</Grid> */}

						<Grid item xs={12} sm={12}>
							<div style={{ height: 400, width: '100%' }}>
								{listLichLamViec &&
									<DataGrid
										rows={listLichLamViec.map((item, index) => ({ id: index + 1, ...item }))}
										columns={columns} 
										hideFooter={true}
									/>
								}
							</div>
						</Grid>

						<Grid item xs={12} sm={12}>
							<div style={{ height: 300, width: '100%' }}>
								{listWorkShift &&
									<DataGrid
										rows={listWorkShift.map((item, index) => ({ id: index + 1, ...item }))}
										columns={columnsWorkShift} 
										hideFooter={true}
									/>
								}
							</div>
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

export default connect(mapStateToProps)(LichLamViecNhanVien);