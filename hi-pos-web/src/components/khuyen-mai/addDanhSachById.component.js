import React, { useState, useEffect, useRef } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography, Box, Grid, Button } from '@mui/material';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { connect } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon'
import RenderIsCheckDsComponent from './render-check-ds.component';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import khuyenMaiService from '../../services/khuyenMai.service';
import SearchIcon from '@mui/icons-material/Search';
import { Title } from '@mui/icons-material';
import { setDanhSachKhuyenMaiAD } from '../../actions/product';
import { setDanhSachDanhMuc } from '../../actions/product';

const RenderCheck = (props) => {
	return <RenderIsCheckDsComponent dataKm={props} />
}


const columns = [
	{
		field: 'isCheck', headerName: '',
		width: 60,
		sortable: false,
		disableColumnMenu: true,
		renderCell: RenderCheck
	},
	{
		field: 'ten',
		headerName: 'Tên',
		width: 140,
	}
];

const AddDanhSachById = (props) => {
	const { open, handleClose, handleLoadPageParent, title, nameModel, handleChangeKmAd,selectedValueAD } = props;
	const dispatch = useDispatch()
	const [selectionModel, setSelectionModel] = useState([]);
	const descriptionElementRef = useRef(null);

	useEffect(() => {
		if (open || props.isReFetchData) {
			Search();
			const { current: descriptionElement } = descriptionElementRef;
			if (descriptionElement !== null) {
				descriptionElement.focus();
			}
		}
	}, [open, props.isReFetchData]);

	const Search = () => {
		var data = {
			selectedValueAD: props.selectedValueAD,
			donVi: props.userInfo?.user?.donVi,
			soKhuyenMai: props.nameRow === undefined ? 0 : props.nameRow.row.soKhuyenMai,
		}
		if (props.selectedValueAD == '1') {
			dispatch(showLoading(true));
			khuyenMaiService.getListKmCheckAD(data).then((result) => {
				dispatch(setDanhSachDanhMuc(result.data));
				dispatch(reFetchData(false));
				dispatch(hideLoading());
			}).catch((error) => {
				dispatch(hideLoading());
				showMessageByType(error, "error", TYPE_ERROR.error);
			})
		} else {
			dispatch(showLoading(true));
			khuyenMaiService.getListKmCheckAD(data).then((result) => {
				dispatch(setDanhSachKhuyenMaiAD(result.data));
				dispatch(reFetchData(false));
				dispatch(hideLoading());
			}).catch((error) => {
				dispatch(hideLoading());
				showMessageByType(error, "error", TYPE_ERROR.error);
			})
		}

	}

	const handleCancel = () => {
		if (handleChangeKmAd) {
			let lstArr = ([]);
			let lstName = ([]);
			if(props.selectedValueAD == '1'){
				props.danhSacDanhMuc.forEach((item) => {
					if (item.isCheck) {
						lstArr.push(item.ma);
						lstName.push(item.ten);
					}
				});
			}else{
				props.danhSachKmAd.forEach((item) => {
					if (item.isCheck) {
						lstArr.push(item.ma);
						lstName.push(item.ten);
					}
				});
			}
			handleChangeKmAd(lstArr, lstName)
		}

		if (handleClose) { handleClose() }
	}


	return (
		<div>
			<Dialog
				open={open}
				onClose={handleClose}
				scroll={"paper"}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
			>
				<DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
				<DialogContent dividers={true}>
					<DialogContentText
						id="scroll-dialog-description"
						ref={descriptionElementRef}
						tabIndex={-1}
					>
						<Box sx={{ flexGrow: 1 }}>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={12}>
									<Typography variant="subtitle1">
										{nameModel}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={12}>
									{props.selectedValueAD == '1' &&
										<div style={{ height: 300, width: '100%' }}>
											<DataGrid
												rows={props.danhSacDanhMuc}
												sortingMode={false}
												hideFooter={true}
												columns={columns}
												experimentalFeatures={{ newEditingApi: true }}
												onSelectionModelChange={(newSelectionModel) => {
													setSelectionModel(newSelectionModel);
												}}
												selectionModel={selectionModel}
											/>
										</div>
									}
									{props.selectedValueAD !== '1' &&
										<div style={{ height: 300, width: '100%' }}>
											<DataGrid
												rows={props.danhSachKmAd}
												sortingMode={false}
												hideFooter={true}
												columns={columns}
												experimentalFeatures={{ newEditingApi: true }}
												onSelectionModelChange={(newSelectionModel) => {
													setSelectionModel(newSelectionModel);
												}}
												selectionModel={selectionModel}
											/>
										</div>
									}
								</Grid>
							</Grid>
						</Box>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" startIcon={<SendIcon />} onClick={handleCancel} size="small">Chọn</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

function mapStateToProps(state) {
	const { message } = state.appReducers;
	const { isReFetchData } = state.appReducers.message;
	const { user } = state.appReducers.auth;
	const { danhSachKmAd,danhSacDanhMuc } = state.appReducers.product;
	return {
		message,
		isReFetchData,
		userInfo: user,
		danhSachKmAd: danhSachKmAd,
		danhSacDanhMuc: danhSacDanhMuc
	};
}

export default connect(mapStateToProps)(AddDanhSachById);