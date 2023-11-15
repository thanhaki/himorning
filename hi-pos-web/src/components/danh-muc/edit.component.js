import React, { useState, useEffect, useRef } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch } from 'react-redux';
import ProductService from '../../services/product.service';
import { DataGrid } from '@mui/x-data-grid';
import { connect } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import productService from '../../services/product.service';
import categoriesService from '../../services/categories.service';
import { ROWS_PER_PAGE_OPTIONS } from '../../consts/constsCommon'
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { formatMoney } from '../../helpers/utils';
const RenderDeleteCell = (props) => {
  const dispatch = useDispatch();
  const handleDelete = () => {
    var data = {
      id: props.row.ma_MH
    };
    dispatch(showLoading(true));
    productService.updateMatHangById(data).then(() => {
      dispatch(hideLoading());
      dispatch(reFetchData(true));
      showMessageByType(null, "success", TYPE_ERROR.success)
    }).catch((error) => {
      dispatch(hideLoading());
      showMessageByType(error, "error", TYPE_ERROR.error)
    });
  }
  return (
    <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
      <DeleteIcon fontSize="small" onClick={handleDelete} />
    </div>
  );
}
const renderImage = (props) => {
  const { value } = props;
  return <img src={value} width="30px" height="30px" />
}


const EditCategory = (props) => {
  const { open, handleClose, handleLoadPageParent, title } = props;
  const dispatch = useDispatch()
  const { nameRow } = props;
  let [Product, setProduct] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [txtSearch, setTxtSearch] = useState('');
  const [danhMuc, setDanhMuc] = useState({});
  const [tenDanhMuc, setTenDanhMuc] = useState('');

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      if (nameRow && Object.keys(nameRow).length > 0) {
        setDanhMuc(nameRow.row);
        setTenDanhMuc(nameRow.row.ten_DanhMuc);
        getProductSearch();
      }

      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const columns = [
    // { field: 'id', headerName: 'STT', width: 50 },
    {
      field: 'hinhAnh_MH',
      headerName: 'Hình ảnh',
      width: 100,
      renderCell: renderImage,
      align: 'center'
    },
    {
      field: 'ten_MH',
      headerName: 'Tên '+ title,
      width: 120,
      align: 'center'
    },
    {
      field: 'gia_Ban',
      headerName: 'Giá thành',
      valueFormatter: params =>
        formatMoney(params?.value),
      width: 80,
      align: 'right'
    },
    {
      field: '',
      headerName: 'Chức năng',
      width: 100,
      align: 'center',
      renderCell: RenderDeleteCell,
    },
  ];

  useEffect(() => {
    if (props.isReFetchData) {
      getProductSearch();
      dispatch(reFetchData(false));
    }
  }, [props.isReFetchData])
  
  const handleCancel = () => {
    if (handleClose) { 
      handleClose() ;
    }
  }

  const getProductSearch = () => {
    var data = {
      maDanhMuc: nameRow.id,
      donVi: props.userInfo?.user?.donVi,
    }
    dispatch(showLoading(true));
    ProductService.getAllProductSearch(data).then((result) => {
      setProduct(result.data);
      dispatch(hideLoading());
    }).catch((error) => {
      dispatch(hideLoading());
      showMessageByType(error, "error", TYPE_ERROR.error)
    })
  }

  const handleUpdate = () => {
    var data = {
      ma_DanhMuc: danhMuc.id,
      ten_DanhMuc: tenDanhMuc
    }
    dispatch(showLoading(true));
    categoriesService.updateCategory(data).then((res) => {
      dispatch(hideLoading());
      showMessageByType(null, "success", TYPE_ERROR.success)
      if (handleLoadPageParent) { handleLoadPageParent(); }
    }).catch((error) => {
      showMessageByType(error, "error", TYPE_ERROR.error)
      dispatch(hideLoading());
    })
  }

  const HandleDanhMuc = (event) => {
    setTenDanhMuc(event.target.value);
  };


  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    id="tenDanhMuc"
                    fullWidth
                    label={'Tên ' + title}
                    value={tenDanhMuc}
                    onChange={HandleDanhMuc}
                    variant="outlined"
                    size="small" />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Box sx={{ height: 300, width: '100%' }}>
                    <DataGrid
                      rows={Product}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[ROWS_PER_PAGE_OPTIONS]}
                      editingMode="modal"
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
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" startIcon={<CloseIcon />} onClick={handleCancel} size="small">Hủy</Button>
          <Button variant="outlined" startIcon={<SendIcon />} onClick={handleUpdate} size="small">Lưu</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function mapStateToProps(state) {
  const { message, isReFetchData } = state.appReducers.message;
  const { user } = state.appReducers.auth;
  return {
    message,
    isReFetchData,
    userInfo: user
  };
}

export default connect(mapStateToProps)(EditCategory);