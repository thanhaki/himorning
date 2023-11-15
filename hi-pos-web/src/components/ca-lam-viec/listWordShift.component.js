import React, { useState, useEffect } from 'react';
import {
	DialogContent, DialogActions, DialogContentText, Button, Checkbox, Grid,
	MenuItem, TextField, Select, Box, Container, Typography, CssBaseline
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { showLoading, hideLoading, reFetchData, getAllHttt,setMessage } from "../../actions/index";
import { useDispatch } from 'react-redux';
import TableContainer from '@mui/material/TableContainer';
import { connect } from "react-redux";
import Switch from "@mui/material/Switch";
import workShift from '../../services/workShift.service';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { showMessageByType } from '../../helpers/handle-errors';
import { ROWS_PER_PAGE_OPTIONS, FORMAT_DD_MM_YYYY } from '../../consts/constsCommon'
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SendIcon from '@mui/icons-material/Send';
import AddCaLamViec from './addCaLamViec.component'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import AlertDialogMessage from '../common/dialog-confirm.component';


const theme = createTheme();



function ListWorkShift(props) {

	const dispatch = useDispatch();
	const [listWorkShift, setListWorkShift] = useState([]);
	const [isReload, setIsReload] = useState(false);
	const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
	const [id_Ca, setId_Ca] = useState(null);


	const RenderBtnDel = (props) => {
		let id_Ca = props.row.so_CaLamViec;
		return (
			<IconButton aria-label="delete" size="small" onClick={() => handleDelete(id_Ca)} >
				<DeleteIcon fontSize="small" />
			</IconButton>
		);
	}

	const handleDelete = (id_Ca) => {
		if (id_Ca === 0) {
            showMessageByType(null, "Chọn ca làm việc cần xóa!", TYPE_ERROR.warning)
            return;
        }
		setId_Ca(id_Ca);
		dispatch(setMessage("Bạn có muốn xóa ca làm việc <b>đã chọn</b> không?"))
        setOpenDelete(true);
	}

	const handleDeleteOk = () => {
		if (id_Ca) {
			var listData = listWorkShift;
			var index = listData.filter(x => x.id !== id_Ca)
			setListWorkShift(index);
			dispatch(showLoading(true));
			var data = {
				donVi: props.userInfo?.user?.donVi,
				so_CaLamViec: id_Ca
			}
			workShift.deleteCalamViec(data).then((result) => {
				dispatch(hideLoading());
				handleLoadPage();
                setOpenDelete(false);
				getAll();
				showMessageByType(null, "success", TYPE_ERROR.success)
			}).catch((error) => {
				dispatch(hideLoading());
				showMessageByType(error, "error", TYPE_ERROR.error);
			})
		}
    }

	const columns = [
		{ field: 'id', headerName: 'STT', width: 50, sortable: false },
		{
			field: 'ma_CaLamViec',
			headerName: 'Mã ca làm việc',
			width: 120,
			editable: true,
			align: 'center'
		},
		{
			field: 'moTa_CaLamViec',
			headerName: 'Miêu tả ca làm việc',
			width: 300,
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
		{
			field: 'isCheck',
			headerName: 'Chức năng',
			width: 150,
			editable: false,
			renderCell: RenderBtnDel,
			align: 'center'
		},
	];

	const onCellEditCommit = (cellData) => {
		const { id, field, value } = cellData;
		let newArr = [...listWorkShift];
		newArr[id - 1][field] = value;
		setListWorkShift(newArr);
	}


	useEffect(() => {
		getAll();
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
	const handleSetDefault = () => {
		var params = {
			donVi: props.userInfo?.user?.donVi,
			listCaLamViec: listWorkShift
		}
		setListWorkShift(['']);
		dispatch(showLoading(true));
		workShift.addCaLamViec(params).then((result) => {
			dispatch(hideLoading());
			setIsReload(!isReload);
			showMessageByType(null, "success", TYPE_ERROR.success)
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}
	const handleSave = (event) => {
		var params = {
			donVi: props.userInfo?.user?.donVi,
			listCaLamViecUd: listWorkShift
		}
		dispatch(showLoading(true));
		workShift.updateCaLamViec(params).then((result) => {
			dispatch(hideLoading());
			showMessageByType(null, "success", TYPE_ERROR.success)
			getAllHttt();
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	};
	const handleAdd = () => {
		setOpen(true);
	}

	const handleClose = () => {
		getAll();
		setOpen(false);
	}
	const handleLoadPage = () => {
		setIsReload(!isReload);
	}

	const handleCancel = (event, reason) => {
		getAll();
	}
	const handleCloseDel = () => {
        setOpenDelete(false);
    }
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
						CA LÀM VIỆC
					</Typography>
				</Box>

				<Box sx={{ mt: 3 }}>
					<Grid container spacing={1}>
						<Grid item xs={12} sm={12} container justifyContent="flex-end">
							<Button
								variant='outlined'
								onClick={handleSetDefault}
								disabled={listWorkShift.filter(x => x.tinhTrang == 0 || x.tinhTrang == null).length === 0}
							>
								Set Default
							</Button>
						</Grid>
						{listWorkShift.filter(x => x.tinhTrang === 0).length > 0 ? (
							<Typography variant="subtitle1" style={{ fontWeight: "bold" }}>KHÔNG CÓ DỮ LIỆU ĐỂ HIỂN THỊ</Typography>
						) : (
							<Grid item xs={12} sm={12}>
								<div style={{ height: 400, width: '100%' }}>
									<DataGrid
										rows={listWorkShift.map((item, index) => ({ id: index + 1, ...item }))}
										onCellEditCommit={onCellEditCommit}
										sortingMode={false}
										hideFooter={true}
										columns={columns}
									/>
								</div>
							</Grid>
						)}
					</Grid>
				</Box>
				<Box sx={{ mt: 3, mb: 3 }}>
					<Grid container justifyContent="flex-end">
						<Grid item paddingLeft={2} align="right" spacing={2}>
							<Button startIcon={<ArrowBackIcon />} variant="contained" color="error" onClick={handleCancel} sx={{ mr: 1 }}>
								Đóng
							</Button>
						</Grid>
						<Button variant="outlined" startIcon={<SendIcon />} onClick={handleAdd} sx={{ mr: 1 }}
							disabled={listWorkShift.filter(x => x.tinhTrang == 1).length == 0}
						>Thêm mới</Button>
						<Button
							variant='contained'
							startIcon={<SaveAltIcon />}
							onClick={handleSave}
							disabled={listWorkShift.filter(x => x.tinhTrang == 1).length == 0}
						>
							Lưu</Button>
					</Grid>
				</Box>
				{open && <AddCaLamViec open={open} handleClose={handleClose} handleLoadPageParent={handleLoadPage} />}
				<AlertDialogMessage
					open={openDelete}
					handleClose={handleCloseDel}
					title="Xóa Ca Làm Việc"
					callbackFunc={handleDeleteOk}
				/>
			</Container>
		</ThemeProvider >
	);

}

function mapStateToProps(state) {
	const { isReFetchData } = state.appReducers.message;
	const { user } = state.appReducers.auth;
	const { httt, htttDefault } = state.appReducers.mdata;
	const dataHttt = {
		httt, htttDefault
	};
	return {
		userInfo: user,
		isReFetchData: isReFetchData,
		dataHttt
	};
}

export default connect(mapStateToProps)(ListWorkShift);