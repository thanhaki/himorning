import React, { useState, useEffect } from 'react';
import {
	Container, Typography, CssBaseline, Box, Button, Grid
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import heSoNhanVienService from '../../services/heSoNhanVien.service';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import '../lich-lam-viec/tableEdit.css'

const theme = createTheme();

const columns = [
	{
		field: 'ten_NV',
		headerName: 'Tên nhân viên',
		width: 200,
		editable: false,
		align: 'left'
	},
	{
		field: 'phongban',
		headerName: 'Bộ phận',
		width: 250,
		editable: false,
		align: 'left'
	},
	{
		field: 'congChuan',
		headerName: (
			<>
				<div style={{ textAlign: 'center' }}>
					Số công chuẩn/ tháng <br />I
				</div>
			</>
		),
		width: 180,
		editable: true,
		type: 'number',
		align: 'center',
		headerAlign: 'center',
		headerClassName: 'multi-line-header',
	},
	{
		field: 'luongCoBan',
		headerName: (
			<>
				<div style={{ textAlign: 'center' }}>
					Lương CB/Ngày <br />II
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
		field: 'heSoLuong',
		headerName: (
			<>
				<div style={{ textAlign: 'center' }}>
					Hệ số cấp bậc/ (Bằng cấp) <br />III
				</div>
			</>
		),
		width: 200,
		editable: true,
		type: 'number',
		headerClassName: 'multi-line-header',
		headerAlign: 'center',
		align: 'center'
	},
	{
		field: 'heSoTrachNhiem',
		headerName: (
			<>
				<div style={{ textAlign: 'center' }}>
					Hệ số trách nghiệm/ (thâm niên) <br />IV
				</div>
			</>
		),
		width: 230,
		editable: true,
		type: 'number',
		headerClassName: 'multi-line-header',
		headerAlign: 'center',
		align: 'center'
	},
	{
		field: 'phuCapThang',
		headerName: (
			<>
				<div style={{ textAlign: 'center' }}>
					Phụ cấp tháng <br />V
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
		field: 'tangCaGio',
		headerName: (
			<>
				<div style={{ textAlign: 'center' }}>
					Tăng ca/ giờ <br />VI
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
		field: 'baoHiemXaHoi',
		headerName: (
			<>
				<div style={{ textAlign: 'center' }}>
					BHXH <br />VII
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
		field: 'luongDuKien',
		headerName: (
			<>
				<div style={{ textAlign: 'center' }}>
					Lương dự kiến <br />[I x II x III] + [I x II x IV] + V - VII
				</div>
			</>
		),
		width: 180,
		editable: false,
		type: 'number',
		headerClassName: 'multi-line-header',
		headerAlign: 'center',
		align: 'center'
	},
	{
		field: 'ghiChu',
		headerName: 'Ghi chú',
		width: 250,
		editable: true,
		headerAlign: 'center',
		align: 'left'
	},
];


function ListHeSoNhanVien(props) {
	const [data, setData] = useState([]);
	const dispatch = useDispatch();
	const [isReload, setIsReload] = useState(false);

	useEffect(() => {
		getAll();
		dispatch(reFetchData(false));
	}, [isReload])

	const getAll = () => {
		var params = {
			donvi: props.userInfo?.user?.donVi,
		}
		heSoNhanVienService.getAllHeSoNhanVien(params).then((result) => {
			setData(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const handleSave = (event) => {
		var params = {
			donVi: props.userInfo?.user?.donVi,
			listHeSoLuong: data,
		}
		dispatch(showLoading(true));
		heSoNhanVienService.addHeSoNhanVien(params).then((result) => {
			dispatch(hideLoading());
			showMessageByType(null, "success", TYPE_ERROR.success)
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	};

	const onCellEditCommit = (cellData) => {
		const { id, field, value } = cellData;
		let newArr = [...data];
		if (newArr.length == 1) {
			newArr[0][field] = value;
			newArr[0]['luongDuKien'] = (newArr[0]['congChuan'] * newArr[0]['luongCoBan'] * newArr[0]['heSoLuong'])
				+ (newArr[0]['congChuan'] * newArr[0]['luongCoBan'] * newArr[0]['heSoTrachNhiem']) + newArr[0]['phuCapThang'] - newArr[0]['baoHiemXaHoi'];
		}
		else {
			newArr[id - 1][field] = value;
			newArr[id - 1]['luongDuKien'] = (newArr[id - 1]['congChuan'] * newArr[id - 1]['luongCoBan'] * newArr[id - 1]['heSoLuong'])
				+ (newArr[id - 1]['congChuan'] * newArr[id - 1]['luongCoBan'] * newArr[id - 1]['heSoTrachNhiem']) + newArr[id - 1]['phuCapThang'] - newArr[id - 1]['baoHiemXaHoi'];
		}

		setData(newArr);
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
						HỆ SỐ LƯƠNG NHÂN VIÊN
					</Typography>
				</Box>
				<Box sx={{ mt: 3 }}>
					<Grid container spacing={1}>
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
				<Box sx={{ mt: 3, mb: 3 }}>
					<Grid container justifyContent="flex-end">
						<Button
							variant='contained'
							startIcon={<SaveAltIcon />}
							onClick={handleSave}
						>
							Lưu</Button>
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
export default connect(mapStateToProps)(ListHeSoNhanVien);