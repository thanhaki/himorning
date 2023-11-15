import React, { useState, useEffect } from 'react';
import {
	DialogTitle, Dialog, DialogContent, DialogContentText,
	TextareaAutosize, Typography, TextField, Box, Button, InputLabel
} from "@mui/material";
import { connect } from "react-redux";
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm, Controller } from "react-hook-form";
import SaveAsIcon from '@mui/icons-material/SaveAs';
import workShift from '../../services/workShift.service';

const st = {
	width: '100%',
}

function AddCaLamViec(props) {

	const { open, handleClose, handleLoadPageParent } = props;
	const dispatch = useDispatch()
	const [isReload, setIsReload] = useState(false);
  const [decimalValue, setDecimalValue] = useState(0); // Giá trị thập phân
	const [listWorkShift, setListWorkShift] = React.useState(() => []);

	useEffect(() => {
		const formattedValue = decimalValue.toFixed(0);
    setDecimalValue(formattedValue);
		dispatch(reFetchData(false));
	}, [isReload])


	const handleCancel = (event, reason) => {
		if (reason && reason === "backdropClick")
			return;
		if (handleClose) { handleClose() }
	}

	const { register, setValue, formState: { errors }, handleSubmit, control } = useForm({
		defaultValues: {
			so_CaLamViec: 0,
			ma_CaLamViec: '',
			heSo_CaLamViec: '',
			moTa_CaLamViec: '',
		}
	});



	const onSubmit = (data) => {
		save(data);
	};

	const createRow = (event) => {
		return {ma_CaLamViec: event.ma_CaLamViec.toUpperCase(), heSo_CaLamViec: decimalValue, moTa_CaLamViec: event.moTa_CaLamViec };
	};

	const save = (values) => {
		const updatedList = [...listWorkShift, createRow(values)];
		var params = {
			donVi: props.userInfo?.user?.donVi,
			listCaLamViec: updatedList
		}
		dispatch(showLoading(true));
		workShift.addCaLamViec(params).then((result) => {
			dispatch(hideLoading());
			setIsReload(!isReload);
			showMessageByType(null, "success", TYPE_ERROR.success)
			if (handleLoadPageParent) {
				handleLoadPageParent();
				handleClose();
			}
		}).catch((error) => {
			dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
		})
	}

	const handleChange = (event) => {
    setDecimalValue(parseFloat(event.target.value));
  };

	return (
		<React.Fragment>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				scroll={"paper"}
				aria-describedby="scroll-dialog-description"
				maxWidth="md"
			>

				<form
					onSubmit={handleSubmit(onSubmit)}>
					<Box sx={{ mt: 1 }}>
						<Grid item xs={12} sm={12} >
							<DialogTitle id="scroll-dialog-title">THÊM MỚI CA LÀM VIỆC</DialogTitle>
						</Grid>
						<Grid container spacing={1} style={{ padding: 10 }}>
							<Grid container spacing={1} item xs={12} sm={12}>
								<Grid item xs={12} sm={8} >
									<InputLabel id="MaCa-select-small"></InputLabel>
									<Controller
										control={control}
										margin="nomal"
										name="ma_CaLamViec"
										fullWidth
										render={({ field: { onChange, value } }) => (
											<TextField
												onChange={onChange}
												{...register("ma_CaLamViec", { required: true })}
												label="Mã ca làm việc"
												size="small"
												inputProps={{ maxLength: 4 }}
												fullWidth
											/>
										)}
									/>
								</Grid>
								<Grid item xs={12} sm={4} >
									<InputLabel id="MaCa-select-small"></InputLabel>
									<TextField
										name="heSo_CaLamViec"
										size="small"
										fullWidth
										type="number"
										label="Hệ số công ngày"
										value={decimalValue}
										onChange={handleChange}
										margin="nomal"
									/>
								</Grid>
								<Grid item xs={12} sm={12}>
									<Grid item xs={12} sm={12}>
										<TextareaAutosize
											placeholder="Miêu tả ca làm việc"
											style={st}
											name="moTa_CaLamViec"
											defaultValue
											minRows={3}
											size="small"
											fullWidth
											{...register("moTa_CaLamViec")}
											margin="nomal"
										/>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						<DialogContent dividers={false}>
							<DialogContentText
								id="scroll-dialog-description"
								tabIndex={-1}
							>
								<Box sx={{ flexGrow: 1 }}>
									<Grid >
										<Grid container spacing={1} item xs={12} sm={12} justifyContent="flex-end">
											<Grid item >
												<Button
													type="button"
													startIcon={<ArrowBackIcon />}
													variant="contained"
													onClick={handleCancel}
													size="small"
													color="error"
												>
													ĐÓNG
												</Button>
											</Grid>
											<Grid item >
												<Button
													type="submit"
													startIcon={<SaveAsIcon />}
													variant="contained"
													size="small"
												>
													LƯU
												</Button>
											</Grid>
										</Grid>
									</Grid>
								</Box>

							</DialogContentText>
						</DialogContent>
					</Box>
				</form>
			</Dialog>
		</React.Fragment>
	);
}

function mapStateToProps(state) {
	const { message } = state.appReducers;
	const { user } = state.appReducers.auth;
	return {
		message,
		userInfo: user
	};
}
export default connect(mapStateToProps)(AddCaLamViec);