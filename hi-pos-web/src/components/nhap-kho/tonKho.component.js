import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, TextField, FormControl, MenuItem, InputLabel, Box, Button, Grid, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import { ROWS_PER_PAGE_OPTIONS} from '../../consts/constsCommon'
import lichSuKho from '../../services/lichSuKho.service';
import SearchIcon from '@mui/icons-material/Search';
import {ExportTonKho} from '../nhap-kho/control/export-tonkho.component';


const theme = createTheme();

const columns = [
	{
		field: 'ten_MH',
		headerName: 'Tên mặt hàng',
		width: 200,
		editable: false,
		align: 'center'
	},
	{
		field: 'ten_DonVi',
		headerName: 'Đơn vị',
		width: 250,
		editable: false,
		align: 'center'
	},
	{
		field: 'tonKhoMin',
		headerName: 'Số lượng tối thiểu',
		width: 200,
		editable: false,
		align: 'right'
	},
	{
		field: 'soLuongToiThieu',
		headerName: 'Số lượng tồn',
		width: 200,
		editable: false,
		align: 'right'
	},
	{
		field: 'trangThai',
		headerName: 'Trạng thái',
		width: 200,
		editable: false,
		align: 'right'
	}
];



function DsTonKho(props) {

	const [listDanhSach, setlistDanhSach] = useState([]);
	const [selectionModel, setSelectionModel] = useState([]);
	const [isReload, setIsReload] = useState(false);
	const [txtSearch, setTxtSearch] = useState('');
	const dispatch = useDispatch();

	useEffect(() => {
		getAllDanhSach();
		dispatch(reFetchData(false));
	}, [isReload])


	const getAllDanhSach = () => {
		let data =  props.userInfo.user?.donVi;
		dispatch(showLoading(data));
		lichSuKho.getDanhSachTonKho(data).then((result) => {
			setlistDanhSach(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}
	const handleSearch = () => {
		var dataSearch = {
			donVi: props.userInfo.user?.donVi,
			tenMH: txtSearch,
		}
		dispatch(showLoading(true));
		lichSuKho.getFilterMh(dataSearch).then((result) => {
			setlistDanhSach(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
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
					DANH SÁCH TỒN KHO
				</Typography>
				</Box>
				<Box sx={{ mt: 3 }}>
					<Grid container item xs={12} sm={12} spacing={2}>

						<Grid item xs={12} sm={4}>
							<FormControl size="small" fullWidth>
								<TextField
									id="searchTxt"
									fullWidth
									value={txtSearch}
									label="Tên mặt hàng"
									onChange={handleTxtChange}
									variant="outlined"
									placeholder='Tên mặt hàng'
									size="small" />
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={2}>
							<FormControl size="small" fullWidth>
								<Button variant="outlined" startIcon={<SearchIcon />} onClick={handleSearch}>
									Tìm kiếm
								</Button>
							</FormControl>
						</Grid>

						<Grid item xs={12} sm={3} textAlign={'right'}>
							<ExportTonKho csvData={listDanhSach} fileName='danh-sach-ton-kho' />
						</Grid>

						<Grid item xs={12} sm={12}>
							<Box sx={{ height: 400, width: '100%' }}>
								<DataGrid
									rows={listDanhSach}
									columns={columns}
									pageSize={5}
									rowsPerPageOptions={[ROWS_PER_PAGE_OPTIONS]}
									editingMode="modal"
									// checkboxSelection
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
export default connect(mapStateToProps)(DsTonKho);