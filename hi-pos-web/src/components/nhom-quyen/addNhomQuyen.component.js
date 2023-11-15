import React, { useState, useEffect } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { Typography, TextField, Box, Button } from '@mui/material';
import { connect } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import { showLoading, hideLoading } from "../../actions/index";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { Grid} from '@mui/material';
import nhomQuyenService from '../../services/nhomQuyen.service';


const AddNhomQuyen = (props) => {
	const [tenVaiTro, setTenVaiTro] = useState("");
	const [ghiChu, setGhiChu] = useState("");
	const { open, openEdit, handleClose, handleLoadPageParent, title } = props;
	const dispatch = useDispatch()
	const [selectedIds, setSelectedIds] = useState([]);
	const { nameRow } = props;

	const [baoCao, setListItemBaocao] = useState(null);

	useEffect(() => {
		if (nameRow && Object.keys(nameRow).length > 0) {
			setTenVaiTro(nameRow.row.tenNhomQuyen);
			setGhiChu(nameRow.row.ghiChuNhomQuyen);
			dispatch(showLoading(true));
			var data = {
				donVi: props.userInfo?.user?.donVi,
				m_NhomQuyen: nameRow.row.ma_NhomQuyen,
			}
			nhomQuyenService.GetAllNhomQuyenByIdData(data).then((result) => {
				setListItemBaocao(result.data);
				setSelectedIds(result.data.listCheck);
				dispatch(hideLoading());
			}).catch((error) => {
				dispatch(hideLoading());
				showMessageByType(error, "Lỗi load dữ liệu nhóm quyền", TYPE_ERROR.error)
			})
		}
		else {
			load();
		}
	}, [])

	const load = () => {
		dispatch(showLoading(true));
		var data = {
			donVi: props.userInfo?.user?.donVi,
		}
		nhomQuyenService.getDataByGroupChucNang(data).then((result) => {
			debugger;
			setListItemBaocao(result.data);
			dispatch(hideLoading());
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}
	const handleGroupBaoCao = (event) => {
		const id = parseInt(event.target.value);
		const isChecked = event.target.checked;

		if (isChecked) {
			const listCheck = selectedIds;
			listCheck.push(id);
			setSelectedIds(listCheck);
		} else {
			const removeCheck = selectedIds.filter((selectedId) => selectedId !== id)
			setSelectedIds(removeCheck);
		}
	}

	const handleCancel = (event, reason) => {
		if (reason && reason === "backdropClick")
			return;
		if (handleClose) { handleClose() }
	}

	const handleAdd = () => {
		if (tenVaiTro === '') {
			showMessageByType(null, "Chưa nhập tên nhóm quyền", TYPE_ERROR.error)
		}
		else {
			var data = {
				tenNhomQuyen: tenVaiTro,
				ghiChuNhomQuyen: ghiChu,
				ma_NhomQuyen: nameRow === undefined ? 0 : nameRow.row.id,
				ids: selectedIds,
			}

			dispatch(showLoading(true));
			nhomQuyenService.addNhomQuyen(data).then((res) => {
				dispatch(hideLoading());
				if (handleClose) { handleClose() }
				showMessageByType(null, "success", TYPE_ERROR.success)
				if (handleLoadPageParent) { handleLoadPageParent(); }
			}).catch((error) => {
				showMessageByType(error, "error", TYPE_ERROR.error)
				dispatch(hideLoading());
			})
		}
	}
	return (
		<div>
			<Dialog
				open={open}
				onClose={handleCancel}
				scroll={"paper"}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
				maxWidth="lg"
			>
				<DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
				<Grid container>

					<Grid item xl={12} xs={12}>
						<DialogContent dividers={true}>
							<DialogContentText
								id="scroll-dialog-description"
								// ref={descriptionElementRef}
								tabIndex={-1}
							>
								<Box sx={{ flexGrow: 1 }}>
									<Grid container spacing={2}>
										<Grid item xs={12} sm={2}>
											<Typography variant="subtitle1" style={{fontWeight: "bold"}}>
												Tên vai trò:
											</Typography>
										</Grid>
										<Grid item xs={12} sm={10}>
											<TextField
												id="tenMatHang"
												fullWidth
												variant="outlined"
												size="small"
												value={tenVaiTro}
												onChange={e => setTenVaiTro(e.target.value)}
											/>
										</Grid>
										<Grid item xs={12} sm={2}>
											<Typography variant="subtitle1" style={{fontWeight: "bold"}}>
												Ghi chú:
											</Typography>
										</Grid>
										<Grid item xs={12} sm={10}>
											<TextField
												id="tenMatHang"
												fullWidth
												variant="outlined"
												size="small"
												value={ghiChu}
												onChange={e => setGhiChu(e.target.value)}
											/>
										</Grid>
										<Grid item xs={12} sm={3}>
											<Typography variant="subtitle1" style={{fontWeight: "bold"}}>
												Báo cáo:
											</Typography>
											<FormGroup>
												{baoCao && baoCao.baoCao && baoCao.baoCao.map((item, index) => (
													<FormControlLabel
														key={index}
														control={
															<Checkbox
																defaultChecked={item.isCheck}
																onChange={handleGroupBaoCao}
																name={index}
																value={item.no}
															/>
														}
														label={item.data}
													/>
												))}
											</FormGroup>
										</Grid>

										<Grid item xs={12} sm={3}>
											<Typography variant="subtitle1"style={{fontWeight: "bold"}}>
												Mặt hàng:
											</Typography>
											<FormGroup>
												{baoCao && baoCao.matHang && baoCao.matHang.map((item, index) => (
													<FormControlLabel
														key={index}
														control={
															<Checkbox
																defaultChecked={item.isCheck}
																onChange={handleGroupBaoCao}
																name={index}
																value={item.no}
															/>
														}
														label={item.data}
													/>
												))}
											</FormGroup>
										</Grid>

										<Grid item xs={12} sm={3}>
											<Typography variant="subtitle1"style={{fontWeight: "bold"}}>
												Kho hàng:
											</Typography>
											<FormGroup>
												{baoCao && baoCao.khoHang && baoCao.khoHang.map((item, index) => (
													<FormControlLabel
														key={index}
														control={
															<Checkbox
																defaultChecked={item.isCheck}
																onChange={handleGroupBaoCao}
																name={index}
																value={item.no}
															/>
														}
														label={item.data}
													/>
												))}
											</FormGroup>
										</Grid>

										<Grid item xs={12} sm={3}>
											<Typography variant="subtitle1"style={{fontWeight: "bold"}}>
												Đối tượng:
											</Typography>
											<FormGroup>
												{baoCao && baoCao.doiTuong && baoCao.doiTuong.map((item, index) => (
													<FormControlLabel
														key={index}
														control={
															<Checkbox
																defaultChecked={item.isCheck}
																onChange={handleGroupBaoCao}
																name={index}
																value={item.no}
															/>
														}
														label={item.data}
													/>
												))}
											</FormGroup>
										</Grid>


										<Grid item xs={12} sm={3}>
											<Typography variant="subtitle1"style={{fontWeight: "bold"}}>
												Đăng ký:
											</Typography>
											<FormGroup>
												{baoCao && baoCao.dangKy && baoCao.dangKy.map((item, index) => (
													<FormControlLabel
														key={index}
														control={
															<Checkbox
																defaultChecked={item.isCheck}
																onChange={handleGroupBaoCao}
																name={index}
																value={item.no}
															/>
														}
														label={item.data}
													/>
												))}
											</FormGroup>
										</Grid>

										<Grid item xs={12} sm={3}>
											<Typography variant="subtitle1"style={{fontWeight: "bold"}}>
												Bán hàng:
											</Typography>
											<FormGroup>
												{baoCao && baoCao.banHang && baoCao.banHang.map((item, index) => (
													<FormControlLabel
														key={index}
														control={
															<Checkbox
																defaultChecked={item.isCheck}
																onChange={handleGroupBaoCao}
																name={index}
																value={item.no}
															/>
														}
														label={item.data}
													/>
												))}
											</FormGroup>
										</Grid>

										<Grid item xs={12} sm={3}>
											<Typography variant="subtitle1"style={{fontWeight: "bold"}}>
												Thiết lập:
											</Typography>
											<FormGroup>
												{baoCao && baoCao.thietLap && baoCao.thietLap.map((item, index) => (
													<FormControlLabel
														key={index}
														control={
															<Checkbox
																defaultChecked={item.isCheck}
																onChange={handleGroupBaoCao}
																name={index}
																value={item.no}
															/>
														}
														label={item.data}
													/>
												))}
											</FormGroup>
										</Grid>

										<Grid item xs={12} sm={3}>
											<Typography variant="subtitle1"style={{fontWeight: "bold"}}>
												Thu chi:
											</Typography>
											<FormGroup>
												{baoCao && baoCao.thuChi && baoCao.thuChi.map((item, index) => (
													<FormControlLabel
														key={index}
														control={
															<Checkbox
																defaultChecked={item.isCheck}
																onChange={handleGroupBaoCao}
																name={index}
																value={item.no}
															/>
														}
														label={item.data}
													/>
												))}
											</FormGroup>
										</Grid>


									</Grid>
									<Grid
										container
										direction="row"
										justifyContent="flex-end"
										alignItems="center"
										sx={{ pt: 2 }}>
										<Grid>
											<Button variant="outlined" startIcon={<CloseIcon />} onClick={handleCancel} size="small">Hủy</Button>
										</Grid>
										<Grid sx={{ pl: 2 }}>
											<Button variant="outlined" startIcon={<SendIcon />} onClick={handleAdd} size="small">Lưu</Button>
										</Grid>
									</Grid>
								</Box>

							</DialogContentText>
						</DialogContent>
					</Grid>

				</Grid>
			</Dialog>

		</div>

	);
};

function mapStateToProps(state) {
	const { message } = state.appReducers;
	const { user } = state.appReducers.auth;
	return {
		message,
		userInfo: user
	};
}

export default connect(mapStateToProps)(AddNhomQuyen);