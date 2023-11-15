// Import thư viên mui hoặc component
import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, TextField, FormControl, MenuItem, InputLabel, Box, Button, Grid, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import DanhMucThuChiService from '../../services/danhMucThuChi.service';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon'
import AlertDialogMessage from '../common/dialog-confirm.component';
import AddDanhMucThuChi from '../danhmuc-thuchi/addDanhMucThuChi.component';
import EditDanhMucThuChi from '../danhmuc-thuchi/addDanhMucThuChi.component';

const theme = createTheme();

//Định nghĩa cột trong grid
const columns = [
  {
    field: 'ten_DanhMucThuChi',
    headerName: 'Tên danh mục thu chi',
    width: 250,
    editable: true,
  },
  {
    field: 'ghiChu_DanhMucThuChi',
    headerName: 'Miêu tả danh mục thu chi',
    width: 250,
    editable: true,
  }
];

function ListDanhMucThuChi(props) {
  //Khai báo biến
  const [listDanhMucThuChi, setListDanhMucThuChi] = useState([]);
  const [loaiDanhMucThuChi, setDanhMucThuChi] = useState(105);
  const [selectionModel, setSelectionModel] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const dispatch = useDispatch();
  const [nameRow, setNameRow] = useState({});
  const [isAdd, setIsAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // khi isReFetchData thay đổi thì nó sẽ auto gọi lại function này
  useEffect(() => {
    //true thi mình gọi lại
    getAllDataDanhMucThuChi();
    // gọi xong set lại = false
    dispatch(reFetchData(false));
  }, [loaiDanhMucThuChi])

  //Hàm load data Printer
  const getAllDataDanhMucThuChi = () => {
    let data = {
      donVi: props.userInfo?.user?.donVi,
      Loai_DanhMucThuChi: loaiDanhMucThuChi,
    };
  dispatch(showLoading(data));
  DanhMucThuChiService.getAllDataDanhMuc(data).then((result) => {
    setListDanhMucThuChi(result.data);
    dispatch(hideLoading());
  }).catch((error) => {
    dispatch(hideLoading());
    showMessageByType(error, "error", TYPE_ERROR.error);
  })
}

// Start Event
const handleRowClick = (params) => {
  setNameRow(params);
  setOpen(false);
  setOpenEdit(true)
};

const handleAdd = () => {
  setIsAdd(true);
}

const handleDanhMucThuChiChange = (event) => {
  setDanhMucThuChi(event.target.value);
};

const handleClose = () => {
  setIsAdd(false);
  setOpen(false);
}

const handleOpen = () => {
  setOpen(true);
}

const handleEditClose = () => setOpenEdit(false);

const handleDelete = () => {
  if (selectionModel.length === 0) {
    showMessageByType(null, "Chọn danh mục cần xóa!!", TYPE_ERROR.warning)
    return;
  }
  dispatch(reFetchData("Bạn có muốn xóa các danh mục <b>đã chọn</b> không?"))
  setOpenDelete(true);
}

const handleCloseDel = () => {
  setOpenDelete(false);
}
//End Event

// Start Function Delete
const handleDeleteOk = () => {
  var data = {
    ids: selectionModel
  }
  if (data.ids.length > 0) {
    dispatch(showLoading(true));
    DanhMucThuChiService.deleteDanhMucThuChi(data).then((res) => {
      dispatch(hideLoading());
      getAllDataDanhMucThuChi();
      setOpenDelete(false);
      showMessageByType(null, "success", TYPE_ERROR.success)
    }).catch((error) => {
      showMessageByType(error, "error", TYPE_ERROR.error)
      dispatch(hideLoading());
    })
  }
}
//End Function Delete

//Start view
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
      </Box>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={2}>
            <FormControl sx={{ minWidth: 120 }} size="small" fullWidth>
              <InputLabel id="danhmuc-thuchi-select-small">Loại danh mục thu chi</InputLabel>
              {loaiDanhMucThuChi && <Select
                labelId="danhmuc-thuchi-select-small"
                id="danhmuc-thuchi-select-small"
                value={loaiDanhMucThuChi}
                label="loại danh mục thu chi"
                onChange={handleDanhMucThuChiChange}
              >
                {props.loaiDanhMucThuChi.map((tt, index) => {
                  return (<MenuItem key={index} value={tt.no}>{tt.data}</MenuItem>)
                })}
              </Select>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={listDanhMucThuChi}
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
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete} size="small">Xóa</Button>
          <Button variant="outlined" startIcon={<SendIcon />} onClick={handleAdd}>Thêm mới</Button>
        </Grid>
      </Box>
      {isAdd && <AddDanhMucThuChi open={isAdd} handleClose={handleClose} getAllDataDanhMucThuChi={getAllDataDanhMucThuChi} />}
      {openEdit && <EditDanhMucThuChi open={openEdit} nameRow={nameRow} handleClose={handleEditClose} getAllDataDanhMucThuChi={getAllDataDanhMucThuChi} />}
      <AlertDialogMessage
        open={openDelete}
        handleClose={handleCloseDel}
        title="Bạn muốn xóa danh mục được chọn?"
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
  const { loaiDanhMucThuChi } = state.appReducers.mdata;

  return {
    userInfo: user,
    isReFetchData: isReFetchData,
    loaiDanhMucThuChi: loaiDanhMucThuChi ? loaiDanhMucThuChi : [],
  };
}

export default connect(mapStateToProps)(ListDanhMucThuChi);