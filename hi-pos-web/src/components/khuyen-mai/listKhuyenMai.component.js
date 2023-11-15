import React, { useState, useEffect } from 'react';
import { Container, Typography,  Box, Button, Grid, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import AlertDialogMessage from '../common/dialog-confirm.component';
import khuyenMaiService from   '../../services/khuyenMai.service';
import { ROWS_PER_PAGE_OPTIONS, FORMAT_DD_MM_YYYY } from '../../consts/constsCommon'
import AddKhuyenMai  from './addKhuyenMai.component';


const theme = createTheme();

const columns = [
	{
		field: 'tenKhuyenMai',
		headerName: 'Chương trình',
		width: 350,
		editable: true,
        align: 'center'
	},
	{
		field: 'loai',
		headerName: 'Loại khuyến mãi',
		width: 200,
		editable: true,
        align: 'center'
	},
	{
		field: 'khuyenMaiTuNgay',
		headerName: 'Bắt đầu',
		width: 100,
        valueFormatter: params =>
            moment(params?.value).format(FORMAT_DD_MM_YYYY),
		editable: true,
        align: 'center'
	},
	{
		field: 'khuyenMaiDenNgay',
		headerName: 'Kết thúc',
		width: 100,
        valueFormatter: params =>
            moment(params?.value).format(FORMAT_DD_MM_YYYY),
		editable: true,
        align: 'center'
	}
];


function ListKhuyenMai(props){

const [listKhuyenMai, setlistKhuyenMai] = useState([]);
	const [selectionModel, setSelectionModel] = useState([]);
	const [open, setOpen] = useState(false);
	const [isReload, setIsReload] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const dispatch = useDispatch();
	const [nameRow, setNameRow] = useState({});
	const [openDelete, setOpenDelete] = useState(false);
	const [nameDsKmAD, setListNameDsKmAD] = useState([]);
	const [nameDsKmDT, setListNameDsKmDT] = useState([]);

    useEffect(() => {
		getAllKhuyenMai();
		dispatch(reFetchData(false));
	}, [isReload])

	const getAllKhuyenMai = () => {
		let data = props.userInfo?.user?.donVi
		dispatch(showLoading(data));
		khuyenMaiService.getAllListKhuyenMai(data).then((result) => {
			setlistKhuyenMai(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const handleRowClick = async (params) => {
		if (params.row.apDungHoaDon !== 1) {
			try {
				dispatch(showLoading(true));
				const data = {
					selectedValueAD: params.row.apDungMatHang === 0 ? 1 : 2,
					donVi: props.userInfo?.user?.donVi,
					soKhuyenMai: params.row.soKhuyenMai,
				};
				const result = await khuyenMaiService.getListKmCheckAD(data);
				
				// Lọc những rows có isCheck = true
				const filteredRows = result.data.filter(row => row.isCheck);
				const names = filteredRows.map(row => row.ten); 
				const concatenatedNames = names.join(', '); 
				setListNameDsKmAD(concatenatedNames);
				dispatch(reFetchData(false));
			} catch (error) {
				showMessageByType(error, "error", TYPE_ERROR.error);
			} finally {
				dispatch(hideLoading());
			}
		}
		
		if (params.row.doiTuongTatCa !== 1) {
			try {
				const data = {
					selectedValueDT: params.row.doiTuongNhomKhachHang === 1 ? 1 : 2,
					donVi: props.userInfo?.user?.donVi,
					soKhuyenMai: params.row.soKhuyenMai,
				};
				const result = await khuyenMaiService.getListKmCheckDT(data);
				// Lọc những rows có isCheck = true
				const filteredRows = result.data.filter(row => row.isCheck);
				const names = filteredRows.map(row => row.ten); 
				const concatenatedNames = names.join(', '); 
				setListNameDsKmDT(concatenatedNames);
				dispatch(reFetchData(false));
			} catch (error) {
				showMessageByType(error, "error", TYPE_ERROR.error);
			}
		}
		
		setNameRow(params);
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
	}

	const handleDelete = () => {
		if (selectionModel.length === 0) {
			showMessageByType(null, "Chọn chương trình khuyến mãi cần xóa!!", TYPE_ERROR.warning)
			return;
		}
		dispatch(reFetchData("Bạn có muốn xóa các khuyến mãi <b>đã chọn</b> không?"))
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
			khuyenMaiService.deleteKhuyenMai(data).then((res) => {
				dispatch(hideLoading());
				getAllKhuyenMai();
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
                <Typography component="h1" variant="h6" >
                    CHƯƠNG TRÌNH KHUYẾN MÃI
                </Typography>
				</Box>
				<Box sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12}>
							<Box sx={{ height: 400, width: '100%' }}>
								<DataGrid
									rows={listKhuyenMai}
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

				{open && <AddKhuyenMai open={open} title={"THÊM MỚI CHƯƠNG TRÌNH KHUYẾN MÃI"} handleClose={handleClose} handleLoadPageParent={handleLoadPage} />}
				{openEdit && <AddKhuyenMai open={openEdit} nameRow={nameRow} nameDsKm={nameDsKmAD} nameDsDT={nameDsKmDT} title={"CHỈNH SỬA CHƯƠNG TRÌNH KHUYẾN MÃI"} handleClose={handleCloseEdit} handleLoadPageParent={handleLoadPageEdit} />}
				<AlertDialogMessage
					open={openDelete}
					handleClose={handleCloseDel}
					title="Bạn muốn xóa khuyến mãi được chọn?"
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

export default connect(mapStateToProps)(ListKhuyenMai);