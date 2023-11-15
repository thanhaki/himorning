import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { useParams } from 'react-router-dom'
import OutletService from '../../services/outlet.service';
import { showLoading, hideLoading, setTablesList, addNewTable, setMessage, reFetchData } from "../../actions/index";
import { Container, Typography, Box, Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveAltOutlined from '@mui/icons-material/SaveAltOutlined';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { stylesErrorHelper } from '../../consts/modelStyle';
import DraggableItem from './draggable.component';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AlertDialogMessage from '../common/dialog-confirm.component';
import { v4 as uuid } from 'uuid';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
function SetupTable(props) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [currentOutlet, setCurrentOutlet] = useState({});
  const navigate = useNavigate();

  let params = useParams();

  const getOneOutletById = () => {
    let data = {
      id: params.id,
    };
      dispatch(setTablesList(data)).then((res) => {
    })
      .catch((error) => {
      });
  }
  useEffect(() => {
    setCurrentOutlet(props.outlet);
  }, [props.outlet]);

  useEffect(() => {
    getOneOutletById();
  }, []);

  useEffect(() => {
    if (props.isReFetchData) {
      getOneOutletById();
      dispatch(reFetchData(false));
    }
  }, [props.isReFetchData]);

  const handleSaveTable = () => {
    let donVi = props.userInfo?.user?.donVi;

    if (currentOutlet.ten_Outlet === "") {
      showMessageByType(null, "Tên khu vực không hợp lệ", TYPE_ERROR.error)
      return;
    }

    const data = {
      donVi: donVi,
      maOutlet: parseInt(params.id),
      tenOutlet: currentOutlet.ten_Outlet,
      tables: props.tableList
    }

    dispatch(showLoading(true));
    OutletService.AddTableToOutlet(data).then(() => {
      dispatch(hideLoading());
      showMessageByType(null, "Lưu thông tin Vị trí thành công", TYPE_ERROR.success)
      dispatch(reFetchData(true));
    }).catch((error) => {
      showMessageByType(error, "Lưu thông tin Vị trí không thành công", TYPE_ERROR.error)
      dispatch(hideLoading());
    });
  }

  const handleCancel = () => {
    navigate(-1);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const confirmDeleteOk = () => {
    let donVi = props.userInfo?.user?.donVi;
    var data = {
      ids: [parseInt(params.id)],
      donVi: donVi
    };
    dispatch(showLoading(true));
    OutletService.deleteOutlet(data).then(() => {
      showMessageByType(null, "Xoá khu vực thành công", TYPE_ERROR.success)
      setOpen(false);
      navigate(-1);
      dispatch(hideLoading());
    }).catch((error) => {
      showMessageByType(error, "Xoá khu vực không thành công", TYPE_ERROR.error)
      dispatch(hideLoading());
    });
  }

  const handleDelete = () => {
    setOpen(true);
    dispatch(setMessage(`Bạn có chắc chắn muốn xóa khu vực <b>${currentOutlet.ten_Outlet}</b> không?`))
  };

  const handleAddNewTable = () => {
    const unique_id = uuid();
    const small_id = unique_id.slice(0, 8)

    const item = {
      id: 0,
      x: 10,
      y: 10,
      idTemp: small_id,
      isAddNew: true,
      mieuTaBan: '',
      tenBan: 'mới'
    }
    dispatch(addNewTable(item))
  }

  const handleChange = (e) => {
    setCurrentOutlet(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <Container component="main" maxWidth="true">
      <CssBaseline />
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>

            <Typography component="h1" variant="h5">
              {props.userInfo?.user?.tenDonVi}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8} textAlign='right'>
            <Button variant="contained" startIcon={<AddBoxIcon />} onClick={handleAddNewTable} size="small">Thêm Vị trí mới</Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography component={'span'} variant="subtitle1">
              <b>Tên khu vực</b>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              id="ten_outLet"
              fullWidth
              name='ten_Outlet'
              variant="outlined"
              value={currentOutlet.ten_Outlet}
              onChange={handleChange}
              size="small"
              FormHelperTextProps={{ style: stylesErrorHelper.helper }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <DraggableItem />
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ mt: 2, mb: 2 }}>
          <Grid item xs={5} sm={5}>
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete} size="small">Xóa khu vực</Button>
          </Grid>
          <Grid item xs={7} sm={7} textAlign={'right'}>
            <Button variant="outlined" sx={{ mr: 2 }} startIcon={<ArrowBackIcon />} onClick={handleCancel} size="small">Quay lại</Button>
            <Button variant="contained" startIcon={<SaveAltOutlined />} onClick={handleSaveTable} size="small">Lưu </Button>
          </Grid>
        </Grid>
      </Box>
      <AlertDialogMessage
        open={open}
        handleClose={handleClose}
        title="Xóa Khu Vực"
        callbackFunc={confirmDeleteOk}
      />
    </Container>
  );
}
function mapStateToProps(state) {
  const { isLoggedIn } = state.appReducers.auth;
  const { message } = state.appReducers.message;
  const { isReFetchData } = state.appReducers.message;
  const { user } = state.appReducers.auth;
  const { tableList } = state.appReducers.setupTbl;
  const { outlet } = state.appReducers.outlet;

  return {
    isLoggedIn,
    message,
    isReFetchData,
    userInfo: user,
    tableList: tableList,
    outlet: outlet
  };
}
export default connect(mapStateToProps)(SetupTable);