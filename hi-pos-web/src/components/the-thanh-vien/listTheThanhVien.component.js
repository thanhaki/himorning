import React, { useState, useEffect } from 'react';
import { Container, Typography,  Box, Button, Grid, CssBaseline } from '@mui/material';
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
import theThanhVienService from   '../../services/thethanhvien.service';
import AddTheThanhVien  from './addTheThanhVien.component';


const theme = createTheme();

const columns = [
	{
		field: 'ten_TTV',
		headerName: 'Thẻ thành viên',
		width: 250,
		editable: true,
	},
	{
		field: 'diemToiThieu',
		headerName: 'Điểm tối thiểu',
		width: 140,
        align: 'right',
		editable: true,
	},
	{
		field: 'diemToiDa',
		headerName: 'Điểm tối đa',
		width: 160,
        align: 'right',
		editable: true,
	},
	{
		field: 'soLuongTV',
		headerName: 'Số thành viên',
		width: 160,
        align: 'right',
		editable: true,
	}
];


function ListTheThanhVien(props){

    const [listTheThanhVien, setlistTheThanhVien] = useState([]);
	const [selectionModel, setSelectionModel] = useState([]);
	const [open, setOpen] = useState(false);
	const [isReload, setIsReload] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const dispatch = useDispatch();
	const [nameRow, setNameRow] = useState({});
	const [openDelete, setOpenDelete] = useState(false);

    useEffect(() => {
		getAllTheTV();
		dispatch(reFetchData(false));
	}, [isReload])

	const getAllTheTV = () => {
		let data = props.userInfo?.user?.donVi
		dispatch(showLoading(data));
		theThanhVienService.getAllThe(data).then((result) => {
			setlistTheThanhVien(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const handleRowClick = (params) => {
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
		getAllTheTV();
	}

	const handleDelete = () => {
		if (selectionModel.length === 0) {
			showMessageByType(null, "Chọn thẻ hàng cần xóa!!", TYPE_ERROR.warning)
			return;
		}
		dispatch(reFetchData("Bạn có muốn xóa các thẻ <b>đã chọn</b> không?"))
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
			theThanhVienService.deleteTheTV(data).then((res) => {
				dispatch(hideLoading());
				getAllTheTV();
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
                    THẺ THÀNH VIÊN
                </Typography>
				</Box>
				<Box sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12}>
							<Box sx={{ height: 400, width: '100%' }}>
								<DataGrid
									rows={listTheThanhVien}
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

				{open && <AddTheThanhVien open={open} title={"THÊM MỚI THẺ THÀNH VIÊN"} handleClose={handleClose} handleLoadPageParent={handleLoadPage} />}
				{openEdit && <AddTheThanhVien open={openEdit} nameRow={nameRow} title={"CHỈNH SỬA THẺ THÀNH VIÊN"} handleClose={handleCloseEdit} handleLoadPageParent={handleLoadPageEdit} />}
				<AlertDialogMessage
					open={openDelete}
					handleClose={handleCloseDel}
					title="Bạn muốn xóa thẻ được chọn?"
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

export default connect(mapStateToProps)(ListTheThanhVien);