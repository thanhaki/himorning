// Import thư viên mui hoặc component
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import PhieuThuService from '../../services/phieuThuChi.service';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import { ROWS_PER_PAGE_OPTIONS, FORMAT_DD_MM_YYYY, LOAIDANHMUCTHUCHI, FORMAT_YYYY_MM_DD } from '../../consts/constsCommon'
import AlertDialogMessage from '../common/dialog-confirm.component';
import AddPhieuThuChi from './addPhieuThuChi.component';
import moment from 'moment';
import { formatMoney } from '../../helpers/utils';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import IconButton from '@mui/material/IconButton';
import DialogFilterThuChi from "./filter-thu-chi.component";
import danhMucThuService from '../../services/danhMucThuChi.service';

const theme = createTheme();

//Định nghĩa cột trong grid
const columnsThu = [
  {
    field: 'ngayLapPhieu',
    headerName: 'Ngày lập phiếu',
    width: 120,
    // flex: 1,
    valueFormatter: params =>
      moment(params?.value).format(FORMAT_DD_MM_YYYY),
  },
  {
    field: 'ma_PhieuThuChi',
    headerName: 'Mã phiếu thu',
    editable: true,
    width: 120,
    // flex: 1
  },
  {
    field: 'ten_DanhMucThuChi',
    headerName: 'Danh mục thu',
    editable: true,
    width: 250,
    // flex: 1
  },
  {
    field: 'giaTriThuChi',
    headerName: 'Số tiền',
    editable: true,
    width: 170,
    // flex: 1,
    align: 'right',
    valueFormatter: params =>
      formatMoney(params?.value),
  },
  {
    field: 'hinhThucThanhToan',
    headerName: 'HTTT',
    editable: true,
    width: 100,
    // flex: 1
  },
  {
    field: 'noiDung',
    headerName: 'Nội dung thu',
    editable: true,
    flex: 1
  }

];

const columnsChi = [
  {
    field: 'ngayLapPhieu',
    headerName: 'Ngày lập phiếu',
    width: 120,
    // flex: 1,
    valueFormatter: params =>
      moment(params?.value).format(FORMAT_DD_MM_YYYY),
  },
  {
    field: 'ma_PhieuThuChi',
    headerName: 'Mã phiếu chi',
    editable: true,
    width: 120,
    // flex: 1
  },
  {
    field: 'ten_DanhMucThuChi',
    headerName: 'Danh mục chi',
    editable: true,
    width: 250,
    // flex: 1
  },
  {
    field: 'giaTriThuChi',
    headerName: 'Số tiền',
    editable: true,
    width: 170,
    // flex: 1,
    align: 'right',
    valueFormatter: params =>
      formatMoney(params?.value),
  },
  {
    field: 'hinhThucThanhToan',
    headerName: 'HTTT',
    width: 100,
    editable: true,
    // flex: 1
  },
  {
    field: 'noiDung',
    headerName: 'Nội dung chi',
    editable: true,
    flex: 1
  }

];

const hiddenColumns = [
  {
    field: 'maDanhMucThuChi',
  },
  {
    field: 'soHinhThucThanhToan',
  },
  {
    field: 'thoiGianGhiNhan',
  },
];

function ListPhieuThuChi(props) {
  //Khai báo biến
  const [listPhieuThuChi, setListPhieuThuChi] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const dispatch = useDispatch();
  const [nameRow, setNameRow] = useState({});
  const [isAdd, setIsAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [title, setTitle] = useState(props.loaiPhieuThuChi === 1 ? 'Danh sách phiếu thu' : "Danh sách phiếu chi");
  const [openFilter, setOpenFilter] = useState(false);
  const [danhMucThuChi, setDanhMucThuChi] = useState([]);
  const loaiDanhMucThuChi = props.loaiPhieuThuChi === 1 ? LOAIDANHMUCTHUCHI.DANH_MUC_THU : LOAIDANHMUCTHUCHI.DANH_MUC_CHI;

  useEffect(() => {
    setTitle(props.loaiPhieuThuChi === 1 ? 'Danh sách phiếu thu' : "Danh sách phiếu chi");
    getAllDataPhieuThu();
    getDanhMucThuChi();
  }, [props.loaiPhieuThuChi])

  useEffect(() => {
    if (props.isReFetchData) {
      getAllDataPhieuThu();
      dispatch(reFetchData(false));
    }
  }, [props.isReFetchData])

  const getDanhMucThuChi = () => {
    let data = {
      donVi: props.userInfo?.user?.donVi,
      Loai_DanhMucThuChi: loaiDanhMucThuChi,
    };

    dispatch(showLoading(true));
    danhMucThuService.getAllDataDanhMuc(data).then((result) => {
      setDanhMucThuChi(result.data);
      dispatch(hideLoading());
    }).catch((error) => {
      dispatch(hideLoading());
      showMessageByType(error, 'Lấy thông tin danh mục thu chi thất bại', TYPE_ERROR.error);
    })
  }

  //Hàm load data Printer
  const getAllDataPhieuThu = () => {

    const thoigian = {
      isFilterTheoNgay: props.filterData.thoigian.isFilterTheoNgay,
      tungay: "",
      denngay: ""
    };

    // handle date filter 
    const dataTime = props.filterData.thoigian;
    if (thoigian.isFilterTheoNgay) {
      if (dataTime.tungay) {
        thoigian.tungay = moment(dataTime.tungay.toDate()).format(FORMAT_YYYY_MM_DD)
      }

      if (dataTime.denngay) {
        thoigian.denngay = moment(dataTime.denngay.toDate()).format(FORMAT_YYYY_MM_DD)
      }
    }

    let data = {
      donVi: props.userInfo?.user?.donVi,
      Loai_DanhMucThuChi: props.loaiPhieuThuChi,
      danhMucThuChi: props.filterData.danhMucThuChi ? props.filterData.danhMucThuChi.map(x => x.maDanhMucThuChi) : [],
      thoigian: thoigian
    };
    dispatch(showLoading(true));
    PhieuThuService.getAllPhieuThuChi(data).then((result) => {
      setListPhieuThuChi(result.data);
      dispatch(hideLoading());
    }).catch((error) => {
      dispatch(hideLoading());
      showMessageByType(error, "error", TYPE_ERROR.error);
    })
  }

  // Start Event
  const handleRowClick = (params) => {
    setNameRow(params);
    setOpenEdit(true)
  };

  const handleAdd = () => {
    setIsAdd(true);
  }

  const handleClose = () => {
    setIsAdd(false);
  }

  const handleEditClose = () => setOpenEdit(false);

  const handleDelete = () => {
    if (selectionModel.length === 0) {
      showMessageByType(null, "Chọn phiếu thu cần xóa!!", TYPE_ERROR.warning)
      return;
    }
    dispatch(reFetchData("Bạn có muốn xóa các phiếu thu <b>đã chọn</b> không?"))
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
      PhieuThuService.deletePhieuThuChi(data).then((res) => {
        dispatch(hideLoading());
        getAllDataPhieuThu();
        setOpenDelete(false);
        showMessageByType(null, "success", TYPE_ERROR.success)
      }).catch((error) => {
        showMessageByType(error, "error", TYPE_ERROR.error)
        dispatch(hideLoading());
      })
    }
  }

  const openDialogFilter = () => {
    setOpenFilter(true);
  }

  const handleCloseFilter = () => {
    setOpenFilter(false);
  }

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
          {title}
          <IconButton
            onClick={openDialogFilter}>
            <FilterAltIcon />
          </IconButton>
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={listPhieuThuChi}
                  columns={props.loaiPhieuThuChi === 1 ? columnsThu : columnsChi}
                  hiddenColumns={hiddenColumns}
                  pageSize={100}
                  rowHeight={38}
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
        {isAdd && <AddPhieuThuChi
          open={isAdd}
          handleClose={handleClose}
          loaiPhieuThuChi={props.loaiPhieuThuChi} 
          danhMucThuChi={danhMucThuChi}
          />}
        {openEdit && <AddPhieuThuChi
          open={openEdit}
          nameRow={nameRow}
          handleClose={handleEditClose}
          loaiPhieuThuChi={props.loaiPhieuThuChi}
          danhMucThuChi={danhMucThuChi}
        />}
        <AlertDialogMessage
          open={openDelete}
          handleClose={handleCloseDel}
          title="Bạn muốn xóa phiếu thu được chọn?"
          callbackFunc={handleDeleteOk}
        />
        <DialogFilterThuChi
          open={openFilter}
          handleClose={handleCloseFilter}
          danhMucThuChi={danhMucThuChi}
          loaiPhieuThuChi={props.loaiPhieuThuChi}
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
  const { filterData } = state.appReducers.thucdon;

  return {
    userInfo: user,
    isReFetchData,
    filterData
  };
}

export default connect(mapStateToProps)(ListPhieuThuChi);