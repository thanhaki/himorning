import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import {TextField, Button, Link, Grid, Box, Container, Typography} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { useDispatch, connect } from 'react-redux'
import { clearMessage, login, logout } from '../../actions/index';
import logoPng from '../../assets/images/himorning-logo.jpg';

const theme = createTheme();

const validationSchema = yup.object({
  phoneNumber: yup
    .string()
    // .matches(/^[0-9]+$/, "Chỉ nhập số")
    // .min(10, 'Số điện thoại không hợp lệ')
    // .max(10, 'Số điện thoại không hợp lệ')
    .required('Tên đăng nhập không được bỏ trống'),
  password: yup
    .string()
    .min(4, 'Mật khẩu tối thiểu 4 ký tự')
    .required('Mật khẩu không được bỏ trống'),
});

function SignIn(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  useEffect(() => {
    console.log("clear session");
    dispatch(logout());
  },[]);

  const handleClose = () => {
    dispatch(clearMessage());
  };

  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(login(values))
        .then(() => {
          navigate("/");
          window.location.reload();
        })
        .catch(() => {
        });
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{bgcolor: 'transparent', width:150, height: 150 }}>
            <img src={logoPng} width="125px" height="125px" />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>
          <form onSubmit={formik.handleSubmit}>

            <Box sx={{ mt: 1 }}>
              <Grid item xs={12} sx={{ mb: 1 }}>
                <label>
                </label>
                {props.message && <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                  {props.message}
                </Alert>}
              </Grid>
              <TextField
                margin="normal"
                fullWidth
                id="phoneNumber"
                label="Số điện thoại"
                name="phoneNumber"
                autoComplete="phoneNumber"
                autoFocus
                size='small'
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Mật khẩu"
                type="password"
                id="password"
                autoComplete="current-password"
                size='small'
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <Button
                type='submit'
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb: 1 }}
              >
                Đăng Nhập
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/forgot-password" variant="body2">
                    Quên mật khẩu?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/sign-up" variant="body2">
                    {"Bạn chưa có tài khoản? Đăng ký"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
function mapStateToProps(state) {
  const { isLoggedIn } = state.appReducers.auth;
  const { message } = state.appReducers.message;
  return {
    isLoggedIn,
    message
  };
}

export default connect(mapStateToProps)(SignIn);