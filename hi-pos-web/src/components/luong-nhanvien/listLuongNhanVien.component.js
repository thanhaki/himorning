import React, { useState, useEffect, useRef } from 'react';
import {
	Container, Typography, CssBaseline, Box, Button, Grid, FormControl, InputLabel
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import '../lich-lam-viec/tableEdit.css'
import SearchIcon from '@mui/icons-material/Search';
import { Select, MenuItem, } from '@mui/material';
import luongNhanVienSerVice from '../../services/luongNhanVien.service';
import PrintIcon from '@mui/icons-material/Print';
import IconButton from '@mui/material/IconButton';

const theme = createTheme();




function ListLuongNhanVien(props) {
	const dispatch = useDispatch();
	const [data, setData] = useState([]);
	const [isReload, setIsReload] = useState(false);
	const [id_Month, setIdMonth] = useState(0);
	const [id_Year, setIdYear] = useState(0);
	const [open, setOpen] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [nameRow, setNameRow] = useState({});
	const iframeRef = useRef(null); // Tạo một ref

	const months = Array.from({ length: 12 }, (_, index) => index + 1);
	const currentYear = new Date().getFullYear();
	const yearsPast = Array.from({ length: 1 }, (v, i) => currentYear - i - 1);
	const yearsFuture = Array.from({ length: 1 }, (v, i) => currentYear + i + 1);
	const allYears = [...yearsPast, currentYear, ...yearsFuture];
	let id_MonthNew = 0;
	let id_YearNew = 0;
	let [rowNew, setRowNew] = useState([]);

	const RenderPrintCell = (props) => {
		const { id } = props;
		const printIframe = (idIframe) => {
			dispatch(showLoading(true));
			var params = {
				donVi: props.userInfo?.user?.donVi,
				month: id_MonthNew == 0 ? id_Month : id_MonthNew,
				year: id_YearNew == 0 ? id_Year : id_YearNew,
				so_NV: props.row.so_NV,
				status: 0
			}
			dispatch(showLoading(true));
			luongNhanVienSerVice.getLuongNhanVienById(params).then((result) => {
				dispatch(hideLoading());
				var dataPrint = {
					nameRow: result.data
				}
				console.log("dataPrint", dataPrint)
				localStorage.setItem("printLuongNV", JSON.stringify(dataPrint));

				const iframe = document.frames
					? document.frames[idIframe]
					: document.getElementById(idIframe);
				iframe.src = "/print-luongnv";

				setTimeout(() => {
					dispatch(hideLoading());
					const iframeWindow = iframe.contentWindow || iframe;
					iframe.focus();
					iframeWindow.print();

				}, 2000);
			}).catch((error) => {
				dispatch(hideLoading());
				showMessageByType(error, "error", TYPE_ERROR.error);
			})

			return false;
		};

		return (
			<>
				<iframe
					id="receipt"
					src='/print-luongnv'
					style={{ display: 'none' }}
					title="Receipt"
				/>

				<div style={{ cursor: "pointer" }}>
					<IconButton onClick={() => printIframe('receipt')} color='primary'>
						<PrintIcon fontSize="small" />
					</IconButton>
				</div>
			</>
		);
	}

	const columns = [
		{ field: 'id', headerName: 'STT', width: 50, sortable: false },
		{
			field: 'ten_NV',
			headerName: 'Họ tên nhân viên',
			width: 200,
			editable: false,
			align: 'left'
		},
		{
			field: 'heSoCapBac',
			headerName: (
				<>
					<div style={{ textAlign: 'center' }}>
						Hệ số cấp bậc <br />I
					</div>
				</>
			),
			width: 120,
			editable: false,
			type: 'number',
			align: 'center',
			headerAlign: 'center',
			headerClassName: 'multi-line-header',
		},
		{
			field: 'heSoTrachNhiem',
			headerName: (
				<>
					<div style={{ textAlign: 'center' }}>
						Hệ số trách nhiệm <br />II
					</div>
				</>
			),
			width: 150,
			editable: false,
			type: 'number',
			headerClassName: 'multi-line-header',
			headerAlign: 'center',
			align: 'center'
		},
		{
			field: 'luongCoBanNgay',
			headerName: (
				<>
					<div style={{ textAlign: 'center' }}>
						Lương cơ bản ngày <br />III
					</div>
				</>
			),
			width: 150,
			editable: false,
			type: 'number',
			headerClassName: 'multi-line-header',
			headerAlign: 'center',
			align: 'center'
		},
		{
			field: 'luongCoBanTangCa',
			headerName: (
				<>
					<div style={{ textAlign: 'center' }}>
						Lương cơ bản tăng ca giờ <br />IV
					</div>
				</>
			),
			width: 230,
			editable: false,
			type: 'number',
			headerClassName: 'multi-line-header',
			headerAlign: 'center',
			align: 'center'
		},
		{
			field: 'soCong',
			headerName: (
				<>
					<div style={{ textAlign: 'center' }}>
						Số công <br />V
					</div>
				</>
			),
			width: 100,
			editable: false,
			type: 'number',
			headerClassName: 'multi-line-header',
			headerAlign: 'center',
			align: 'center'
		},
		{
			field: 'gioTangCa',
			headerName: (
				<>
					<div style={{ textAlign: 'center' }}>
						Giờ tăng ca <br />VI
					</div>
				</>
			),
			width: 100,
			editable: true,
			type: 'number',
			headerClassName: 'multi-line-header',
			headerAlign: 'center',
			align: 'center'
		},
		{
			field: 'luongCapBac',
			headerName: (
				<>
					<div style={{ textAlign: 'center' }}>
						Lương cấp bậc <br />VII = I x III x V
					</div>
				</>
			),
			width: 150,
			editable: false,
			type: 'number',
			headerClassName: 'multi-line-header',
			headerAlign: 'center',
			align: 'center'
		},
		{
			field: 'luongTrachNhiem',
			headerName: (
				<>
					<div style={{ textAlign: 'center' }}>
						Lương trách nhiệm <br />VIII = II x III x V
					</div>
				</>
			),
			width: 150,
			editable: false,
			type: 'number',
			headerClassName: 'multi-line-header',
			headerAlign: 'center',
			align: 'center'
		},
		{
			field: 'luongTangCa',
			headerName: (
				<>
					<div style={{ textAlign: 'center' }}>
						Lương tăng ca <br />IX = IV x VI
					</div>
				</>
			),
			width: 150,
			editable: false,
			type: 'number',
			headerClassName: 'multi-line-header',
			headerAlign: 'center',
			align: 'center'
		},
		{
			field: 'phuCap',
			headerName: (
				<>
					<div style={{ textAlign: 'center' }}>
						Phụ cấp <br /> X
					</div>
				</>
			),
			width: 100,
			editable: false,
			type: 'number',
			headerClassName: 'multi-line-header',
			headerAlign: 'center',
			align: 'center'
		},
		{
			field: 'khenThuong',
			headerName: (
				<>
					<div style={{ textAlign: 'center' }}>
						Khen thưởng <br /> XI
					</div>
				</>
			),
			width: 120,
			editable: true,
			type: 'number',
			headerClassName: 'multi-line-header',
			headerAlign: 'center',
			align: 'center'
		},
		{
			field: 'kyLuat',
			headerName: (
				<>
					<div style={{ textAlign: 'center' }}>
						Kỷ luật - phạt <br /> XII
					</div>
				</>
			),
			width: 120,
			editable: true,
			type: 'number',
			headerClassName: 'multi-line-header',
			headerAlign: 'center',
			align: 'center'
		},
		{
			field: 'baoHiemXaHoi',
			headerName: (
				<>
					<div style={{ textAlign: 'center' }}>
						BHXH <br /> XIII
					</div>
				</>
			),
			width: 100,
			editable: true,
			type: 'number',
			headerClassName: 'multi-line-header',
			headerAlign: 'center',
			align: 'center'
		},
		{
			field: 'luongThucNhan',
			headerName: (
				<>
					<div style={{ textAlign: 'center' }}>
						Thực nhận <br />XIV = VII + VIII + IX + X + XI - XII - XIII
					</div>
				</>
			),
			width: 250,
			editable: false,
			type: 'number',
			headerClassName: 'multi-line-header',
			headerAlign: 'center',
			align: 'center'
		},
		{
			field: 'ten_PhongBan',
			headerName: 'Bộ phận',
			width: 200,
			editable: false,
			headerAlign: 'center',
			align: 'left'
		},
		{
			field: '',
			headerName: 'Chức năng',
			width: 100,
			align: 'center',
			renderCell: RenderPrintCell,
		},
	];

	useEffect(() => {
		setIdYear(new Date().getFullYear());
		setIdMonth(new Date().getMonth() + 1);
		getAll();
		dispatch(reFetchData(false));
	}, [isReload])

	const getAll = () => {
		var params = {
			donVi: props.userInfo?.user?.donVi,
			month: new Date().getMonth() + 1,
			year: new Date().getFullYear(),
			status: 0
		}
		luongNhanVienSerVice.getAllLuong(params).then((result) => {
			setData(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}


	const onCellEditCommit = (cellData) => {
		const { id, field, value } = cellData;
		let newArr = [...data];
		if (newArr.length == 1) {
			newArr[0][field] = value;
			newArr[0]['luongTangCa'] = newArr[0]['luongCoBanTangCa'] * newArr[0]['gioTangCa'];
			newArr[0]['luongThucNhan'] = newArr[0]['luongCapBac'] + newArr[0]['luongTrachNhiem']
				+ (newArr[0]['luongCoBanTangCa'] * newArr[0]['gioTangCa']) + newArr[0]['phuCap'] + newArr[0]['khenThuong'] - newArr[0]['kyLuat'] - newArr[0]['baoHiemXaHoi'];
		}
		else {
			newArr[id - 1][field] = value;
			newArr[id - 1]['luongTangCa'] = newArr[id - 1]['luongCoBanTangCa'] * newArr[id - 1]['gioTangCa'];
			newArr[id - 1]['luongThucNhan'] = newArr[id - 1]['luongCapBac'] + newArr[id - 1]['luongTrachNhiem']
				+ (newArr[id - 1]['luongCoBanTangCa'] * newArr[id - 1]['gioTangCa']) + newArr[id - 1]['phuCap'] + newArr[id - 1]['khenThuong'] - newArr[id - 1]['kyLuat'] - newArr[id - 1]['baoHiemXaHoi'];
		}
		setData(newArr);

		var params = {
			donVi: props.userInfo?.user?.donVi,
			listLuongUd: newArr,
		}
		dispatch(showLoading(true));
		luongNhanVienSerVice.updateLuongNhanVien(params).then((result) => {
			dispatch(hideLoading());
			showMessageByType(null, "success", TYPE_ERROR.success)
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const handleTinhluong = () => {

		var params = {
			donVi: props.userInfo?.user?.donVi,
			month: id_MonthNew == 0 ? id_Month : id_MonthNew,
			year: id_YearNew == 0 ? id_Year : id_YearNew,
			status: 1
		}
		dispatch(showLoading(true));
		luongNhanVienSerVice.getAllLuong(params).then((result) => {
			setData(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const handleSearch = () => {
		var params = {
			donVi: props.userInfo?.user?.donVi,
			month: id_MonthNew == 0 ? id_Month : id_MonthNew,
			year: id_YearNew == 0 ? id_Year : id_YearNew,
			status: 0
		}
		dispatch(showLoading(true));
		luongNhanVienSerVice.getAllLuong(params).then((result) => {
			if (result.data.length == 0) {
				showMessageByType(null, "Vui lòng tính lương nhân viên", TYPE_ERROR.warning)
			}
			setData(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}
	const printListIframe = () => {
		dispatch(showLoading(true));
		var params = {
			donVi: props.userInfo?.user?.donVi,
			month: id_MonthNew == 0 ? id_Month : id_MonthNew,
			year: id_YearNew == 0 ? id_Year : id_YearNew,
			so_NV: 0,
			status: 1
		}
		dispatch(showLoading(true));
		luongNhanVienSerVice.getLuongNhanVienById(params).then((result) => {
			dispatch(hideLoading());
			var dataPrint = {
				nameRow: result.data
			}
			if (dataPrint.nameRow.length === 0) {
				showMessageByType(null, "Vui lòng thực hiện tính lương nhân viên", TYPE_ERROR.warning)
				return;
			}
			localStorage.setItem("printListLuongNV", JSON.stringify(dataPrint));

			const iframe = iframeRef.current; // Truy cập iframe thông qua ref

			if (iframe) {
				iframe.src = "/print-listluongnv";

				setTimeout(() => {
					dispatch(hideLoading());
					const iframeWindow = iframe.contentWindow || iframe;
					iframe.focus();
					iframeWindow.print();
				}, 2000);
			}
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})

		return false;
	};
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
						BẢNG LƯƠNG NHÂN VIÊN
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
						<Grid item xs={12} sm={3}>
							<FormControl size="small" fullWidth onClick={printListIframe}>
								<Button variant="outlined" >
									IN BẢNG LƯƠNG
								</Button>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={12} style={{ display: 'none' }}>
							<div style={{ height: 500, width: '100%' }}>
								{/* Đặt iframe trực tiếp tại đây */}
								<iframe
									ref={iframeRef}
									id="receiptList"
									src='/print-listluongnv'
									style={{ display: 'none' }}
									title="receiptList"
								/>
							</div>
						</Grid>
						<Grid item xs={12} sm={3}>
							<FormControl size="small" fullWidth>
								<Button variant="outlined" onClick={handleTinhluong}>
									TÍNH LƯƠNG
								</Button>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={12}>
							<div style={{ height: 500, width: '100%' }}>
								{data &&
									<DataGrid
										rows={data.map((item, index) => ({ id: index + 1, ...item }))}
										onCellEditCommit={onCellEditCommit}
										sortingMode={false}
										columns={columns}
										hideFooter={true}
									/>
								}
							</div>
						</Grid>
					</Grid>
				</Box>
				{/* {open && <PrintLuongNhanVien open={open}
					nameRow={nameRow}
					handleClose={handleClose}
				/>} */}
				{/* {openEdit && <PrintListLuongNhanVien
					open={openEdit} nameRow={nameRow}
					handleClose={handleEditClose}
				/>} */}
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
export default connect(mapStateToProps)(ListLuongNhanVien);