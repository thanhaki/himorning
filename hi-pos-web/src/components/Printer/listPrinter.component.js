// Import thư viên mui hoặc component
import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Container from '@mui/material/Container';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import AddPrinter from './addPrinter.component';
import EditPrinter from './editPrinter.component';
import Grid from '@mui/material/Grid';
import PrinterService from '../../services/printer.service';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon'
import AlertDialogMessage from '../common/dialog-confirm.component';
import CheckIcon from '@mui/icons-material/Check';

const theme = createTheme();

//Set icon checked trên grid
const RenderApprovedCell = (props) => {
  const { id, value } = props;
  return (
    <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
      {value ? <CheckIcon /> :
        null
      }
    </div>
  );
}

//Định nghĩa cột trong grid
const columns = [
  {
    field: 'ten_Printer',
    headerName: 'Tên máy in',
    width: 250,
    editable: true,
  },
  {
    field: 'ip',
    headerName: 'IP',
    width: 250,
    editable: true,
  },
  {
    field: 'port',
    headerName: 'Port',
    editable: true,
  },
  {
    field: 'moKetTien',
    headerName: 'Mở két tiền',
    width: 90,
    renderCell: RenderApprovedCell,
    align: 'center',
  },
  {
    field: 'ghiChu',
    headerName: 'Ghi chú',
    width: 250,
    editable: true,
  },
];

// Định nghĩa danh sách printer
function ListPrinter(props) {
  //Khai báo biến
  const [listPrinters, setListPrinters] = useState([]);
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
    getAllDataPrinters();
    // gọi xong set lại = false
    dispatch(reFetchData(false));
  }, [props.isReFetchData])

  //Hàm load data Printer
  const getAllDataPrinters = () => {
    let data = props.userInfo?.user?.donVi
    dispatch(showLoading(data));
    PrinterService.getAllDataPrinter(data).then((result) => {
      setListPrinters(result.data);
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
      showMessageByType(null, "Chọn máy in cần xóa!!", TYPE_ERROR.warning)
      return;
    }
    dispatch(reFetchData("Bạn có muốn xóa các máy in <b>đã chọn</b> không?"))
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
      PrinterService.deletePrinter(data).then((res) => {
        dispatch(hideLoading());
        getAllDataPrinters();
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

        <Typography component="h1" variant="h5">
          Danh sách máy in
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Box sx={{ height: 400, width: '100%' }}>
                {listPrinters.length > 0 &&
                  <DataGrid
                    rows={listPrinters.map((item, index) => ({ id: index + 1, ...item }))}
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
                }
              </Box>
            </Grid>

          </Grid>
        </Box>
        <Box sx={{ mt: 3, mb: 3 }}>
          <Grid container justifyContent="flex-end">
            <Button variant="outlined" startIcon={<DeleteIcon />} sx={{ mr: 2 }} onClick={handleDelete} size='small' color='error'>Xóa</Button>
            <Button variant="outlined" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={handleAdd} size='small'>Thêm mới</Button>
          </Grid>
        </Box>
        {isAdd && <AddPrinter open={isAdd} handleClose={handleClose} getAllDataPrinters={getAllDataPrinters} />}
        {openEdit && <EditPrinter open={openEdit} nameRow={nameRow} handleClose={handleEditClose} getAllDataPrinters={getAllDataPrinters} />}
        <AlertDialogMessage
          open={openDelete}
          handleClose={handleCloseDel}
          title="Bạn muốn xóa máy in?"
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
    isReFetchData: isReFetchData
  };
}

export default connect(mapStateToProps)(ListPrinter);