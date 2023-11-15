import React, { useState, useEffect, useRef } from 'react';
import { showLoading, hideLoading } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { connect } from "react-redux";
import {
  Container, FormControl, FormControlLabel, Select,
  MenuItem, FormHelperText, InputLabel, Radio, Grid, Button, Box, TextareaAutosize,
  Typography, TextField, DialogContentText, DialogTitle, DialogContent,
  DialogActions, Dialog
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProductService from '../../services/product.service';
import CategoriesService from '../../services/categories.service';
import productUnitService from '../../services/productUnit.service';
import Checkbox from '@mui/material/Checkbox';
import menuService from '../../services/menu.service';
import { SketchPicker } from "react-color";
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import { ImageUpload } from '../common/upload-image.component';
import InputMoney from '../common/input-money.component';
import { showMessageByType } from '../../helpers/handle-errors';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import PrinterService from '../../services/printer.service';
import SaveIcon from '@mui/icons-material/Save';
import { LOAI_THOI_GIAN_APDUNG, TINH_TIEN_THEO_THOI_GIAN } from '../../consts/constsCommon';

const AddProduct = (props) => {
  const { open, handleClose } = props;
  const dispatch = useDispatch()
  const [tenMatHang, setTenMatHang] = useState('');
  const [tenThucDon, setTenThucDon] = React.useState([]);
  const [selectedValue, setSelectedValue] = useState('1');
  const [selectedValueIcon, setSelectedValueIcon] = useState('color');
  const [id_LoaiMH, setIdLoaiMH] = useState(0);
  const [id_LoaiBep, setIdLoaiBep] = useState(0);
  const [txtGiaBan, setTxtGiaBan] = useState(0);
  const [txtGiaVon, setTxtGiaVon] = useState(0);
  const [donVinTinh, setTenDonVi] = useState([]);
  const [id_DonViTinh, setIdDonViTinh] = useState(0);
  const [txtMoTa, setMoTa] = useState('');
  const [inputSoluong, setInputSoluong] = useState(0);
  const [inputSoluongTT, setInputSoluongTT] = useState(0);
  const [danhMuc, setDanhMuc] = useState([]);
  const [thucDon, setThucDon] = useState([]);
  const [id_DanhMuc, setIdDanhMuc] = useState(0);
  const [color, setColor] = useState("#333");
  const [loaiMatHang, setLoaiMatHang] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [listPrinters, setListPrinters] = useState([]);
  const [nhapGiaKhiBan, setNhapGiaKhiBan] = useState(false);
  const [thoiGianApDung, setThoiGianApDung] = useState(1);
  const [loaiThoiGianApDung, setLoaiThoiGianApDung] = useState(1);
  const [qrCode, setQRCode] = useState("");
  const st = {
    width: '100%'
  }

  const handleCancel = (event, reason) => {
    if (reason && reason === "backdropClick")
      return;
    if (handleClose) { handleClose() }
  }

  const handleColorChange = ({ hex }) => {
    setColor(hex);
  }

  useEffect(() => {
    let donVi = props.userInfo?.user?.donVi
    dispatch(showLoading(true));
    productUnitService.getAllProductUnit(donVi).then((result) => {
      setTenDonVi(result.data);
      dispatch(hideLoading());
    }).catch((error) => {
      dispatch(hideLoading());
      showMessageByType(error, "error", TYPE_ERROR.error);
    })

    CategoriesService.getAllCategories(donVi).then((result) => {
      setDanhMuc(result.data);
      dispatch(hideLoading());
    }).catch((error) => {
      dispatch(hideLoading());
      showMessageByType(error, "error", TYPE_ERROR.error);
    })

    ProductService.getLoaiMatHang(donVi).then((result) => {
      setLoaiMatHang(result.data);
      dispatch(hideLoading());
    }).catch((error) => {
      dispatch(hideLoading());
      showMessageByType(error, "error", TYPE_ERROR.error);
    })


    menuService.getAllThucDon(donVi).then((result) => {
      setThucDon(result.data);
      dispatch(hideLoading());
    }).catch((error) => {
      dispatch(hideLoading());
      showMessageByType(error, "error", TYPE_ERROR.error);
    })

    getAllDataPrinters();

  }, [props.isReFetchData])

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

  const handleAdd = () => {

    let idsThucDon = [];
    if (tenThucDon.length > 0) {
      idsThucDon = tenThucDon.map((item) => { return item.id });
    }

    var data = {
      ten_MH: tenMatHang,
      ma_DanhMuc: id_DanhMuc,
      ma_DonVi: id_DonViTinh,
      loai_MH: id_LoaiMH,
      idThucDon: idsThucDon,
      gia_Ban: (txtGiaBan + "").replace(/\D/g, ""),
      gia_Von: (txtGiaVon + "").replace(/\D/g, ""),
      isNhapGiaBan: nhapGiaKhiBan,
      mota_MH: txtMoTa,
      mauSac_MH: color === undefined ? '#000' : color,
      SoLuongTonKho: inputSoluong,
      tonKhoMin: inputSoluongTT,
      donVi: props.userInfo?.user?.donVi,
      ma_Printer: id_LoaiBep,
      tonKho: selectedValue === 1 ? 'True' : 'False',
      loaiThoiGianApDung: loaiThoiGianApDung,
      thoiGianApDung: thoiGianApDung,
      qRCode: qrCode
    }
    if (tenMatHang === "") {
      showMessageByType(null, "Chưa nhập tên mặt hàng", TYPE_ERROR.warning)
    }
    else {
      dispatch(showLoading(true));
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("data", JSON.stringify(data));

      ProductService.addProduct(formData).then((res) => {
        dispatch(hideLoading());
        showMessageByType(null, "Thêm mặt hàng thành công", TYPE_ERROR.succeess)
        handClearModel();
        handleCancel();
      }).catch((error) => {
        showMessageByType(error, "error", TYPE_ERROR.warning)
        dispatch(hideLoading());
      })
    }
  }

  const handClearModel = (event) => {
    setTenMatHang('');
    setTxtGiaBan(0);
    setTxtGiaVon(0);
    setNhapGiaKhiBan(false);
    setMoTa('');
    setInputSoluong(0);
    setInputSoluongTT(0);
    setSelectedImage(null);
  }

  const handleLoai = (event) => {
    setIdLoaiMH(event.target.value);
    if (event.target.value !== LOAI_THOI_GIAN_APDUNG) {
      setLoaiThoiGianApDung(0);
      setThoiGianApDung(0);
    } else {
      setLoaiThoiGianApDung(1);
      setThoiGianApDung(1);
    }
  };
  const handlebep = (event) => {
    setIdLoaiBep(event.target.value);
  };

  const handleGiaVon = (value) => {
    setTxtGiaVon(value);
  }

  const handleGiaBan = (value) => {
    setTxtGiaBan(value);
  }

  const HandleTenMathang = (event) => {
    setTenMatHang(event.target.value);
  };
  const HandleMoTa = (event) => {
    setMoTa(event.target.value);
  };
  const handleSoLuong = (event) => {
    setInputSoluong(event.target.value);
  };
  const handleSoLuongTT = (event) => {
    setInputSoluongTT(event.target.value);
  };

  const HandleDonViTinh = (event) => {
    setIdDonViTinh(event.target.value);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleChangeImage = (event) => {
    setSelectedValueIcon(event.target.value);
  };

  const HandleDanhMuc = (event) => {
    setIdDanhMuc(event.target.value);
  };
  const HandleSearchThucDon = (event) => {
    const {
      target: { value },
    } = event;
    setTenThucDon(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const isCheckedDropdown = (item) => {
    if (tenThucDon.length > 0) {
      var td = tenThucDon.find(x => x.id === item.id);
      return td && td.id > 0;
    }
  }

  const renderValues = (selected) => {
    return selected.map(u => u["ten_TD"]).join(', ');
  }

  const handleChangeImg = (img) => {
    setSelectedImage(img);
  }
  const hanldeCheckNhapGiaKhiBan = (e) => {
    setNhapGiaKhiBan(e.target.checked);
  };

  const handleThoiGianApDung = (e) => {
    setThoiGianApDung(e.target.value);
  }
  const handleLoaiThoiGianSD = (e) => {
    setLoaiThoiGianApDung(e.target.value);
  }
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCancel}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="xl"
      >
        <Grid item xl={12} xs={12} >
          <DialogTitle id="scroll-dialog-title">Thêm mặt hàng</DialogTitle>
        </Grid>
        <Grid container spacing={1} style={{ padding: 10 }}>
          <Grid item sx={12} sm={8}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">
                  Tên mặt hàng
                </Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <TextField
                  id="tenMatHang"
                  fullWidth
                  value={tenMatHang}
                  onChange={HandleTenMathang}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">
                  Loại mặt hàng
                </Typography>
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="loaiDanhMuc-select-small"></InputLabel>
                  <Select
                    labelId="loaiDanhMuc-select-small"
                    id="loaiDanhMuc-select-small"
                    value={id_LoaiMH}
                    onChange={handleLoai}
                  >
                    {
                      loaiMatHang.map(x => {
                        return (
                          <MenuItem value={x.no}>
                            <em>{x.data}</em>
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Typography variant="subtitle1">
                  Mã QR
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id="qrCode"
                  fullWidth
                  value={qrCode}
                  onChange={(e) => setQRCode(e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">
                  Giá bán
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <InputMoney
                  id="giaBan"
                  value={txtGiaBan}
                  onChange={handleGiaBan}
                />
              </Grid>
              {id_LoaiMH !== TINH_TIEN_THEO_THOI_GIAN && <>
                <Grid item xs={12} sm={1}>
                  <Typography variant="subtitle1">
                    Giá vốn
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <InputMoney
                    id="giavon"
                    value={txtGiaVon}
                    onChange={handleGiaVon}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControlLabel control={<Checkbox checked={nhapGiaKhiBan} onChange={hanldeCheckNhapGiaKhiBan} />} label="Nhập giá khi bán" />
                </Grid>
              </>}

              {id_LoaiMH === TINH_TIEN_THEO_THOI_GIAN && <>
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle1">
                    Áp dụng cho khoảng thời gian
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <TextField
                    fullWidth
                    value={thoiGianApDung}
                    onChange={handleThoiGianApDung}
                    variant="outlined"
                    size="small"
                    type={'number'}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'right' }, min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl size="small" fullWidth>

                    <Select
                      labelId="loaiDanhMuc-select-small"
                      id="loaiDanhMuc-select-small"
                      value={loaiThoiGianApDung}
                      onChange={handleLoaiThoiGianSD}
                    >
                      {
                        LOAI_THOI_GIAN_APDUNG.map(x => {
                          return (
                            <MenuItem value={x.id}>
                              <em>{x.title}</em>
                            </MenuItem>
                          )
                        })
                      }
                    </Select>
                  </FormControl>
                </Grid>
              </>}
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">
                  Đơn vị
                </Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="donVi-select-small">Đơn vị</InputLabel>
                  <Select
                    labelId="donVi-select-small"
                    id="donVi-select-small"
                    value={id_DonViTinh}
                    label="Đơn vị"
                    onChange={HandleDonViTinh}
                  >
                    {
                      donVinTinh.map(x => {
                        return (
                          <MenuItem value={x.id}>
                            <em>{x.ten_DonVi}</em>
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">
                  Mô tả
                </Typography>
              </Grid>
              <Grid item xs={12} sm={10}>
                <TextareaAutosize
                  style={st}
                  id="MoTa"
                  minRows={4}
                  fullWidth
                  value={txtMoTa}
                  onChange={HandleMoTa}
                  size="small" />
              </Grid>

              <Grid item xs={12} sm={1}>
                <Radio
                  checked={selectedValue === '1'}
                  onChange={handleChange}
                  value="1"
                  overlay defaultChecked />
              </Grid>
              <Grid item xs={12} sm={5} sx={{ marginTop: 1 }}>
                <FormHelperText>Quản lý hàng tồn </FormHelperText>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Radio
                  checked={selectedValue === '0'}
                  onChange={handleChange}
                  value="0"
                  overlay defaultChecked />
              </Grid>
              <Grid item xs={12} sm={5} sx={{ marginTop: 1 }}>
                <FormHelperText>Quản lý nguyên liệu</FormHelperText>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">
                  Số lượng
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id="inputSoLuong"
                  fullWidth
                  value={inputSoluong}
                  onChange={handleSoLuong}
                  variant="outlined"
                  size="small"
                  type={'number'}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'right' }, min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">
                  Số lượng tối thiểu
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id="inputSoLuongTT"
                  fullWidth
                  value={inputSoluongTT}
                  onChange={handleSoLuongTT}
                  variant="outlined"
                  size="small"
                  type={'number'}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'right' }, min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">
                  Danh mục
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="donVi-select-small"></InputLabel>
                  <Select
                    labelId="danhMuc-select-small"
                    id="danhMuc-select-small"
                    value={id_DanhMuc}
                    onChange={HandleDanhMuc}
                  >
                    {
                      danhMuc.map(x => {
                        return (
                          <MenuItem value={x.id}>
                            <em>{x.ten_DanhMuc}</em>
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">
                  Thực đơn
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>

                <FormControl size="small" fullWidth>
                  <InputLabel id="donVi-select-small"></InputLabel>
                  <Select
                    labelId="ThucDon-select-small"
                    id="ThucDon-select-small"
                    value={tenThucDon}
                    multiple
                    input={<OutlinedInput />}
                    renderValue={(selected) => renderValues(selected)}
                    onChange={HandleSearchThucDon}
                  >

                    {thucDon.map((item) => (
                      <MenuItem key={item.id} value={item}>
                        <Checkbox checked={isCheckedDropdown(item) || false} />
                        <ListItemText primary={item.ten_TD} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Grid>

              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle1">
                  Máy in
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="loaiBep-select-small"></InputLabel>
                  <Select
                    labelId="loaiBep-select-small"
                    id="loaiBep-select-small"
                    value={id_LoaiBep}
                    onChange={handlebep}
                  >
                    {listPrinters.length > 0 &&
                      listPrinters.map(x => {
                        return (
                          <MenuItem value={x.ma_Printer}>
                            <em>{x.ten_Printer}</em>
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>


            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12}>
                <Typography variant="subtitle1">
                  Hình đại diện
                </Typography>
              </Grid>
              <Grid container xs={12} sm={6}>
                <Grid item xs={12} sm={2}>
                  <Radio
                    checked={selectedValueIcon === 'color'}
                    onChange={handleChangeImage}
                    value="color"
                    overlay defaultChecked />
                </Grid>
                <Grid item xs={12} sm={10} sx={{ marginTop: 1 }}>
                  <FormHelperText>Màu sắc </FormHelperText>
                </Grid>
              </Grid>
              <Grid container xs={12} sm={6}>
                <Grid item xs={2} sm={2}>
                  <Radio
                    checked={selectedValueIcon === 'image'}
                    onChange={handleChangeImage}
                    value="image"
                    overlay defaultChecked />
                </Grid>
                <Grid item xs={12} sm={10} sx={{ marginTop: 1 }}>
                  <FormHelperText>Hình ảnh</FormHelperText>
                </Grid>
              </Grid>
              <Grid item>
                {selectedValueIcon === 'image' && (
                  <ImageUpload
                    selectedFile={selectedImage}
                    setSelectedFile={handleChangeImg}
                    icon={<AttachFileIcon />}
                  />
                )}
                {selectedValueIcon !== 'image' && (
                  <Container maxWidth="sm" >
                    <Box my={4}>
                      <SketchPicker
                        color={color}
                        onChangeComplete={handleColorChange}
                      />
                    </Box>
                  </Container>
                )}
              </Grid>
            </Grid>
            <DialogActions>
              <Button
                type="button"
                startIcon={<CloseIcon />}
                variant="contained"
                onClick={handleCancel}
                size="small"
                color="error"
              >
                HỦY
              </Button>
              <Button variant="outlined" startIcon={<SaveIcon />} onClick={handleAdd} size="small">Lưu</Button>
            </DialogActions>
          </Grid>
        </Grid>
      </Dialog>

    </div>
  );
}

function mapStateToProps(state) {
  const { message } = state.appReducers;
  const { isReFetchData } = state.appReducers.message;
  const { user } = state.appReducers.auth;
  return {
    message,
    isReFetchData,
    userInfo: user
  };
}

export default connect(mapStateToProps)(AddProduct);