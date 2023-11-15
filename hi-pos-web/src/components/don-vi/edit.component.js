import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import { TextField, Button, Grid, Box, Container, Typography, FormControl, MenuItem, Select, InputLabel, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import { useDispatch, connect } from 'react-redux'
import { clearMessage, hideLoading, setCurrentDonVi,showLoading } from '../../actions/index';
import DonviService from '../../services/donvi.service';
import * as yup from 'yup';
import { useFormik } from 'formik';
import FormHelperText from '@mui/material/FormHelperText';
import { stylesErrorHelper } from '../../consts/modelStyle';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import QRCode from "react-qr-code";
import userService from '../../services/user.service';
import donviService from '../../services/donvi.service';
const theme = createTheme();
const validationSchema = yup.object({
  tenDonVi: yup
    .string()
    .max(255, "Tối đa 255 ký tự")
    .required('Tên nhà hàng không được bỏ trống'),
  diaChiDonVi: yup
    .string()
    .max(255, "Tối đa 255 ký tự")
    .required('Địa chỉ không được bỏ trống'),
  dienThoaiDonVi: yup
    .string()
    .matches(/^[0-9]+$/, "Chỉ nhập số")
    .min(10, 'Số điện thoại không hợp lệ')
    .max(10, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại không được bỏ trống'),
  nganhHang: yup
    .string()
    .required("Ngành hàng không được bỏ trống")
    .test('validate-nh', 'Ngành hàng không được bỏ trống', function (val) {
      return parseInt(val) > 0;
    }),
  donViTienTe: yup
    .string()
  // .required("Đơn vị tiền tệ không được bỏ trống")
  // .test('validate-nh', 'Đơn vị tiền tệ không được bỏ trống', function (val) {
  //   return parseInt(val) > 0;
  // })

})

function EditDonVi(props) {
  const [userInfo, setUserInfo] = useState(null);
  const [preview2, setPreview2] = useState();
  const [selectedFileImg2, setSelectedFileImg2] = useState(null);
  const dispatch = useDispatch()
  const { currentDV = {} } = props;

  const onSelectFile = (e) => {
    var file = undefined;
    if (e.target.files && e.target.files.length >= 0) {
        file = e.target.files[0];
    }
    setSelectedFileImg2(file);
    handleSaveImg(file);
  }   
  const handleSaveImg = (file, fileType) => {
    var values = {
        donVi : 0,
        fileName: fileType,
        anhBiaPCDonVi: userInfo.anhBiaPCDonVi,
    };
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append("data", JSON.stringify(values));
    donviService.updateImageDonVi(formData).then(res => {
        showMessageByType(null, "Cập nhật hình ảnh thành công", TYPE_ERROR.success);
        getUserInfo();
    }).catch(error => {
        console.log("error", error);
    });
  }

  useEffect(() => {
    let donVi = props.userInfo.user?.donVi;
    DonviService.getDonViById(donVi).then((res) => {
      dispatch(setCurrentDonVi(res.data));
    }).catch((error) => {
      showMessageByType(error, "", TYPE_ERROR.error)
    })

    if (!selectedFileImg2) {
      setPreview2(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(selectedFileImg2)
    setPreview2(objectUrl)

  }, []);


  useEffect(() => {
        getUserInfo();
    }, []);
    
    const getUserInfo = () => {
        const data = {
            no_User: props.userInfo?.user?.no_User
        };
        dispatch(showLoading(true));
        userService.getUserById(data).then((res) => {
            setUserInfo(res.data);
            dispatch(hideLoading());
        }).catch(error => {
            showMessageByType(error, "Lấy thông tin tài khoản thất bại", TYPE_ERROR.error);
            dispatch(hideLoading());
        });
  }
  const handleClose = () => {
    dispatch(clearMessage());
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: currentDV,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      DonviService.updateDonVi(values).then((res) => {
        showMessageByType(null, "Cập nhật đơn vị thành công", TYPE_ERROR.success)
      }).catch((error) => {
        showMessageByType(error, "Cập nhật đơn vị không thành công", TYPE_ERROR.error)
      });
    },
  });
  if ((Object.keys(formik.values).length > 0)) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" style={{textTransform: "uppercase", fontWeight:800, padding:10}}>
              QUÉT MÃ QR  {formik.values.tenDonVi}
            </Typography>
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "120px", width: "120px", marginTop:2}}
              value={window.location.origin + `${"/store/" + props.userInfo.user?.donVi}`}
              viewBox={`0 0 256 256`}
            />
            <form onSubmit={formik.handleSubmit}>

              <Box noValidate sx={{ mt: 1 }}>
                <Grid item xs={12} sx={{ mb: 1 }}>
                  <label>
                  </label>
                  {props.message && <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {props.message}
                  </Alert>}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Tên bảng hiệu (*)"
                    multiline
                    rows={3}
                    fullWidth
                    margin="normal"
                    name='tenDonVi'
                    value={formik.values.tenDonVi}
                    onChange={formik.handleChange}
                    error={formik.touched.tenDonVi && Boolean(formik.errors.tenDonVi)}
                    helperText={formik.touched.tenDonVi && formik.errors.tenDonVi}
                    FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                  />
                </Grid>

                <Grid container item xs={12} sm={12} spacing={1}>
                  <Grid item xs={12} sm={7}>
                    <TextField
                      margin="normal"
                      fullWidth
                      name="dienThoaiDonVi"
                      label="Số điện thoại (*)"
                      type="text"
                      id="dienThoaiDonVi"
                      autoComplete="current-dienThoaiDonVi"
                      size='small'
                      value={formik.values.dienThoaiDonVi}
                      onChange={formik.handleChange}
                      error={formik.touched.dienThoaiDonVi && Boolean(formik.errors.dienThoaiDonVi)}
                      helperText={formik.touched.dienThoaiDonVi && formik.errors.dienThoaiDonVi}
                      FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <FormControl
                      sx={{ mt: 2, minWidth: 120 }}
                      fullWidth
                      size="small"
                      error={Boolean(formik.errors.donViTienTe)}
                    >
                      <InputLabel id="demo-select-small">Đơn vị tiền tệ (*)</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        label="Đơn vị tiền tệ (*)"
                        name="donViTienTe"
                        value={formik.values.donViTienTe}
                        onChange={formik.handleChange}
                        defaultValue="1"
                      >
                        <MenuItem value="1">
                          <em>Việt Nam Đồng(VND)</em>
                        </MenuItem>
                      </Select>
                      {formik.errors.donViTienTe && <FormHelperText style={stylesErrorHelper.helper}>{formik.errors.donViTienTe}</FormHelperText>}
                    </FormControl>

                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      id="outlined-multiline-static"
                      label="Địa chỉ (*)"
                      multiline
                      rows={3}
                      fullWidth
                      margin="normal"
                      name='diaChiDonVi'
                      value={formik.values.diaChiDonVi}
                      onChange={formik.handleChange}
                      error={formik.touched.diaChiDonVi && Boolean(formik.errors.diaChiDonVi)}
                      helperText={formik.touched.diaChiDonVi && formik.errors.diaChiDonVi}
                      FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                    />
                    <small><i>Cần nhập địa chỉ cụ thể số nhà, tên đường, để kết nối với Google My Business chính xác nhất</i></small>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>

                  <Grid item xs={12} sm={12}>
                    <FormControl
                      sx={{ mt: 2, minWidth: 120 }}
                      fullWidth
                      size="small"
                      error={Boolean(formik.errors.nganhHang)}
                    >
                      <InputLabel id="demo-select-small">Loại hình kinh doanh(*)</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        label="Loại hình kinh doanh (*)"
                        name="nganhHang"
                        value={formik.values.nganhHang}
                        onChange={formik.handleChange}
                      >
                        {props.listNganhHangs.map((item) => {
                          return (<MenuItem key={item.no} value={item.no}>{item.data}</MenuItem>)
                        })}
                      </Select>
                      {formik.errors.nganhHang && <FormHelperText style={stylesErrorHelper.helper}>{formik.errors.nganhHang}</FormHelperText>}
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={2} sx={{ borderRight: 'none', marginTop:1 }}>
                    <Grid item xs={12} sm={12}>
                        <Typography>
                            QR ngân hàng: 
                        </Typography>
                    </Grid>
                </Grid>
                <Grid xs={12} sm={10} sx={{ border: '1px groove', textAlign: 'center', borderRadius: 5, padding: 5 }}>
                    <IconButton color="primary" aria-label="upload picture" component="label" 
                        sx={{
                            border: "1px solid",
                            borderRadius: 'unset',
                            height: 150,
                             backgroundImage: `url(${preview2 ? preview2 : userInfo?.anhNganHang})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            width: 150,
                        }}
                    >
                        <input hidden
                            accept="image/*"
                            type="file"
                            onChange={(e) => onSelectFile(e)}
                        />
                    </IconButton>
                </Grid>

                <Grid container justifyContent="flex-end">

                  <Grid item xs={4} sm={4} align="right">
                    <Button
                      type='submit'
                      variant="contained"
                      sx={{ mt: 2 }}
                    >
                      Lưu
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}
function mapStateToProps(state) {
  const { user } = state.appReducers.auth;
  const { isLoggedIn } = state.appReducers.auth;
  const { message } = state.appReducers.message;
  const { listNganhHangs } = state.appReducers.mdata;
  const { currentDV } = state.appReducers.donvi;

  return {
    isLoggedIn,
    message,
    userInfo: user,
    listNganhHangs: listNganhHangs ? listNganhHangs : [],
    currentDV
  };
}

export default connect(mapStateToProps)(EditDonVi);