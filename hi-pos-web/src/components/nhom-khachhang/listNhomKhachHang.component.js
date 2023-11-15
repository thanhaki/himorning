// Import thư viên mui hoặc component
import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, TextField, FormControl, MenuItem, InputLabel, Box, Button, Grid, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import nhomKhachHangService from '../../services/nhomKhachHang.service';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon'
import AlertDialogMessage from '../common/dialog-confirm.component';
import AddNhomKhachHang from './addNhomKhachHang.component';
const theme = createTheme();

const columns = [
  {
    field: 'ten_NKH',
    headerName: 'Tên nhóm khách hàng',
    width: 250,
    editable: true,
  },
  {
    field: 'soLuong',
    headerName: 'Số lượng khách',
    width: 250,
    editable: true,
  }
];

function ListNhomKhachHang(props) {
  //Khai báo biến
  const [listDanhSachNhom, setlistDanhSachNhom] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [open, setOpen] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const dispatch = useDispatch();
  const [nameRow, setNameRow] = useState({});
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    getAllNhomKhachHang();
    dispatch(reFetchData(false));
  }, [isReload])

  const getAllNhomKhachHang = () => {
	let data = props.userInfo?.user?.donVi
  dispatch(showLoading(data));
  nhomKhachHangService.getAllNhomKhachHang(data).then((result) => {
    setlistDanhSachNhom(result.data);
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

const handleCloseEdit =()=>{
  setOpenEdit(false);
}

const handleDelete = () => {
  if (selectionModel.length === 0) {
    showMessageByType(null, "Chọn nhóm khác hàng cần xóa!!", TYPE_ERROR.warning)
    return;
  }
  dispatch(reFetchData("Bạn có muốn xóa các nhóm khách hàng <b>đã chọn</b> không?"))
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
    nhomKhachHangService.deleteNhomKhachHang(data).then((res) => {
      dispatch(hideLoading());
      getAllNhomKhachHang();
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
        <Typography component="h1" variant="h6">
					NHÓM KHÁCH HÀNG
				</Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={listDanhSachNhom}
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
      {open && <AddNhomKhachHang open={open} title={"THÊM MỚI NHÓM KHÁCH HÀNG"} handleClose={handleClose} handleLoadPageParent={handleLoadPage} />}
      {openEdit && <AddNhomKhachHang open={openEdit} nameRow={nameRow} title={"CHỈNH SỬA NHÓM KHÁCH HÀNG"} handleClose={handleCloseEdit} handleLoadPageParent={handleLoadPageEdit}/>}
      <AlertDialogMessage
        open={openDelete}
        handleClose={handleCloseDel}
        title="Bạn muốn xóa nhóm khách hàng được chọn?"
        callbackFunc={handleDeleteOk}
      />
    </Container>
  </ThemeProvider >
);
  //End view
}

//Hàm Props qua các component khác
function mapStateToProps(state) {
  const { isReFetchData } = state.appReducers.message;
  const { user } = state.appReducers.auth;

  return {
    userInfo: user,
    isReFetchData: isReFetchData,
  };
}

export default connect(mapStateToProps)(ListNhomKhachHang);