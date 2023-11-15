import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Container from '@mui/material/Container';
import { showLoading, hideLoading, setMessage } from "../../actions/index";
import { useDispatch } from 'react-redux';
import AddCategory from './add.component';
import EditCategory from './edit.component';
import Grid from '@mui/material/Grid';
import CategoriesService from '../../services/categories.service';
import { connect } from "react-redux";
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon'
import AlertDialogMessage from '../common/dialog-confirm.component';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
const theme = createTheme();

function ListCategory(props) {
  const [listCate, setListCate] = useState([]);
  const [isReload, setIsReload] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const dispatch = useDispatch()
  const [nameRow, setNameRow] = useState({});

  const handleLoadPage = () => {
    setIsReload(!isReload);
  }

const columns = [
  {
    field: 'ten_DanhMuc',
    headerName: 'Tên ' + props.title,
    width: 200,
    editable: true,
  },
  {
    field: 'soluong_MH',
    headerName: 'Số lượng',
    width: 150,
    editable: true,
    align: 'center'
  },
];



  useEffect(() => {
    let data = props.userInfo?.user?.donVi
    dispatch(showLoading(data));
    CategoriesService.getAllCategories(data).then((result) => {
      setListCate(result.data);
      setNameRow('');
      dispatch(hideLoading());
    }).catch((error) => {
      dispatch(hideLoading());
      showMessageByType(error, 'Lỗi lấy thông tin ' + props.title, TYPE_ERROR.error);
    })
  }, [isReload])


  const handleRowClick = (params) => {
    setNameRow(params);
    setOpen(false);
    setOpenEdit(true)
  };

  const handleOpen = () => {
    setOpen(true);
  }
  const LoadData = () => {
    let data = props.userInfo?.user?.donVi
    dispatch(showLoading(data));
    CategoriesService.getAllCategories(data).then((result) => {
      setListCate(result.data);
      setNameRow('');
      dispatch(hideLoading());
    }).catch((error) => {
      dispatch(hideLoading());
      showMessageByType(error, 'Lỗi lấy thông tin ' + props.title, TYPE_ERROR.error);
    })
  }
  const handleCloseDel = () => {
    setOpenDelete(false);
  }
  const handleClose = () => {
    LoadData();
    setOpen(false);
  }
  const handleEditClose = () => {
    LoadData();
    setOpenEdit(false);
  }
  const handleDeleteOk = () => {
    var data = {
      ids: selectionModel
    }
    if (data.ids.length > 0) {
      dispatch(showLoading(true));
      CategoriesService.deleteCategory(data).then((res) => {
        dispatch(hideLoading());
        setOpenDelete(false);
        handleLoadPage();
        showMessageByType(null, "success", TYPE_ERROR.success)
      }).catch((error) => {
        showMessageByType(error, "error", TYPE_ERROR.error)
        dispatch(hideLoading());
      })
    }
  }

  const handleDelete = () => {
    if (selectionModel.length === 0) {
      showMessageByType(null, "Chọn danh mục cần xóa!!", TYPE_ERROR.warning)
      return;
    }
    dispatch(setMessage("Bạn có muốn xóa các danh mục <b>đã chọn</b> không?"))
    setOpenDelete(true);
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
          <Typography component="h1" variant="h6" style={{textTransform: 'uppercase'}}>
            {props.title}
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={listCate}
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
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} sx={{ mr: 2 }} onClick={handleDelete} size="small">Xóa</Button>
            <Button variant="outlined" startIcon={<SendIcon />} onClick={handleOpen}>Thêm mới</Button>
          </Grid>
        </Box>
      </Container>
      {open && <AddCategory open={open} title ={props.title} handleClose={handleClose} handleLoadPageParent={handleLoadPage} />}
      {/* {editCategory} */}
      {openEdit && <EditCategory open={openEdit} title ={props.title} nameRow={nameRow} handleClose={handleEditClose} handleLoadPageParent={handleLoadPage} />}
      <AlertDialogMessage
        open={openDelete}
        handleClose={handleCloseDel}
        title="Xóa Danh Mục"
        callbackFunc={handleDeleteOk}
      />
    </ThemeProvider >
  );
}

function mapStateToProps(state) {
  const { message, title } = state.appReducers.message;
  const { user } = state.appReducers.auth;
  return {
    message,
    userInfo: user,
    title
  };
}

export default connect(mapStateToProps)(ListCategory);