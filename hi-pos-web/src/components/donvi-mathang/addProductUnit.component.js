import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import DialogContentText from "@mui/material/DialogContentText";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { connect } from "react-redux";
import { showLoading, hideLoading } from "../../actions/index";
import { useDispatch } from 'react-redux';
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import {Grid,} from '@mui/material';
import productUnitService from '../../services/productUnit.service';


const AddProductUnit = (props) => {
	const [name, setNameCate] = useState("");
	const { open, handleClose, handleLoadPageParent } = props;
	const dispatch = useDispatch()

	const handleCancel = () => {
		if (handleClose) { handleClose(); }
	}

	const HandleSave = () => {

		var data = {
			ten_DonVi: name,
			donVi: props.userInfo?.user?.donVi
		}
		if (name === '') {
			showMessageByType(null, "Chưa nhập tên đơn vị", TYPE_ERROR.error)
		}
		else {
			dispatch(showLoading(true));
			productUnitService.addProductUnit(data).then((res) => {
				dispatch(hideLoading());
				showMessageByType(null, "success", TYPE_ERROR.success)
				handleCancel();
				if (handleLoadPageParent) { handleLoadPageParent(); }
			}).catch((error) => {
				showMessageByType(error, "error", TYPE_ERROR.error)
				dispatch(hideLoading());
			})
		}
	}
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			scroll={"paper"}
			aria-labelledby="scroll-dialog-title"
			aria-describedby="scroll-dialog-description"
		>
			<DialogTitle id="scroll-dialog-title">TẠO ĐƠN VỊ MẶT HÀNG</DialogTitle>
			<DialogContent dividers={true}>
				<DialogContentText
					id="scroll-dialog-description"
					tabIndex={-1}
				>
					<Box sx={{ flexGrow: 1 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={12}>
								<TextField
									id="ten_DonVi"
									fullWidth
									name='ten_DonVi'
									variant="outlined"
									label="Tên đơn vị"
									value={name}
									onChange={e => setNameCate(e.target.value)}
									size="small"
								/>
							</Grid>
						</Grid>
					</Box>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" startIcon={<CloseIcon />} onClick={handleCancel} size="small">Hủy</Button>
				<Button variant="outlined" startIcon={<SendIcon />} onClick={HandleSave} size="small">Thêm mới</Button>
			</DialogActions>
		</Dialog>

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

export default connect(mapStateToProps)(AddProductUnit);