import React, { useState, useEffect, useRef } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography, Box, Grid, Button,TextField } from '@mui/material';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { connect } from "react-redux";
import SendIcon from '@mui/icons-material/Send';
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon'
import RenderIsCheckProDuctComponent from './render-check-dsproduct.component';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import SearchIcon from '@mui/icons-material/Search';
import { setDanhSachKhuyenMaiAD } from '../../actions/product';
import phieuNhapXuatService from '../../services/phieuNhapXuat.service';

const RenderCheck = (props) => {
	return <RenderIsCheckProDuctComponent dataKm={props} />
}


const columns = [
	// {
	// 	field: 'isCheck', headerName: '',
	// 	width: 60,
	// 	sortable: false,
	// 	disableColumnMenu: true,
	// 	renderCell: RenderCheck
	// },
	{
		field: 'ten_MH',
		headerName: 'Tên mặt hàng',
		width: 300,
	}
];

const AddDanhSachProductById = (props) => {
	const { open, handleClose, handleLoadPageParent, title, nameRow,listProduct, handleChangeProduct } = props;
	const dispatch = useDispatch()
	const [selectionModel, setSelectionModel] = useState([]);
	const descriptionElementRef = useRef(null);
	const [tenMatHang, setTenMatHang] = useState('');
	const [productState, setProductState] = useState([]);

	useEffect(() => {
		if (open || props.isReFetchData) {
			const { current: descriptionElement } = descriptionElementRef;
			if (descriptionElement !== null) {
				descriptionElement.focus();
			}
		}
		setProductState(props.danhSachMH);
	}, [open, props.isReFetchData]);

	const HandleTenMathang = (event) => {
		setTenMatHang(event.target.value);
		const filterdRows  = props.danhSachMH.filter(x=>x.ten_MH.toLowerCase().includes(event.target.value.toLowerCase()));
		dispatch(setProductState(filterdRows));
	};

	const handleCancel = () => {
		var ids = selectionModel;
		const filteredData = productState.filter((data) => ids.includes(data.id));
		if (handleChangeProduct) {
			filteredData.forEach((item) => {
				item.isCheck = true;
			});
			handleChangeProduct(filteredData)
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
				<DialogTitle id="scroll-dialog-title">Chọn nguyên liệu, mặt hàng</DialogTitle>
				<DialogContent dividers={true}>
					<DialogContentText
						id="scroll-dialog-description"
						ref={descriptionElementRef}
						tabIndex={-1}
					>
						<Box sx={{ flexGrow: 1 }}>

							<Grid sx={{ display: { xs: 'none', sm: 'block' } }}>
								<Grid container spacing={1}>
									<Grid item xs={12} sm={12}>
										<TextField
											id="searchTxt"
											fullWidth
											value={tenMatHang}
											label="Tên mặt hàng"
											variant="outlined"
											placeholder='Tên mặt hàng'
											size="small"
											onChange={HandleTenMathang}
										/>
									</Grid>
									<Grid item xs={12} sm={12}>
										<Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
											Mặt hàng
										</Typography>
									</Grid>
									<Grid item xs={12} sm={12}>
										<Box sx={{ height: 300, width: '100%' }}>
											<div style={{ height: 'calc(100% - 48px)', overflow: 'auto' }}> {/* 48px là chiều cao của footer */}
												<DataGrid
													rows={productState}
													columns={columns}
													// pageSize={5}
													checkboxSelection
													hideFooter={true}
													rowsPerPageOptions={[ROWS_PER_PAGE_OPTIONS]}
													editingMode="modal"
													disableSelectionOnClick
													experimentalFeatures={{ newEditingApi: true }}
													onSelectionModelChange={(newSelectionModel) => {
														setSelectionModel(newSelectionModel);
													}}
													selectionModel={selectionModel}
												/>
											</div>
										</Box>
									</Grid>
								</Grid>
							</Grid>
							<Grid sx={{ display: { xs: 'block', sm: 'none' } }}>
								<Grid container spacing={1}>
									<Grid item xs={12} sm={12}>
										<TextField
											id="searchTxt"
											fullWidth
											value={tenMatHang}
											label="Tên mặt hàng"
											variant="outlined"
											placeholder='Tên mặt hàng'
											size="small"
											onChange={HandleTenMathang}
										/>
									</Grid>
									<Grid item xs={12} sm={12}>
										<Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
											Mặt hàng
										</Typography>
									</Grid>
									<Grid item xs={12} sm={12}>
										<Box sx={{ height: 300, width: '100%' }}>
											<div style={{ height: 'calc(100% - 48px)', overflow: 'auto' }}> {/* 48px là chiều cao của footer */}
												<DataGrid
													rows={productState}
													columns={columns}
													pageSize={5}
													hideFooter={true} 
													rowsPerPageOptions={[ROWS_PER_PAGE_OPTIONS]}
													editingMode="modal"
													disableSelectionOnClick
													experimentalFeatures={{ newEditingApi: true }}
													onSelectionModelChange={(newSelectionModel) => {
														setSelectionModel(newSelectionModel);
													}}
													selectionModel={selectionModel}
												/>
											</div>
										</Box>
									</Grid>
								</Grid>
							</Grid>
						</Box>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" startIcon={<SendIcon />} onClick={handleCancel} size="small">Chọn</Button>
				</DialogActions>
			</Dialog>
		</div >
	);
}

function mapStateToProps(state) {
	const { message } = state.appReducers;
	const { isReFetchData } = state.appReducers.message;
	const { user } = state.appReducers.auth;
	const { danhSachMH } = state.appReducers.product;
	return {
		message,
		isReFetchData,
		userInfo: user,
		danhSachMH: danhSachMH
	};
}

export default connect(mapStateToProps)(AddDanhSachProductById);