import React, { useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Alert from '@mui/material/Alert';
import { isValidEmail } from '../../helpers/utils';
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading,forgotPassword,clearMessage, setMessage, sendcode } from '../../actions/index';
import { useNavigate } from 'react-router-dom';
import { connect } from "react-redux";

const theme = createTheme();
const validationSchema = yup.object({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required('Email không được bỏ trống'),
  codeVerify: yup
    .string()
    .min(6, "Mã xác nhận không hợp lệ")
    .max(6, "Mã xác nhận không hợp lệ")
    .required('Email không được bỏ trống'),
  password: yup
    .string()
    .min(4, 'Mật khẩu tối thiểu 4 ký tự')
    .required('Mật khẩu không được bỏ trống'),
  passwordNew: yup
    .string()
    .required("Mật khẩu không được bỏ trống")
    .oneOf([yup.ref("password"), null], "Mật khẩu không khớp")
});

const ForgotPassword = (props) => {

  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const interval = useRef();
  const [ctime, setctime] = useState();

  function enterdown(value) {
    clearInterval(interval.current);

    setctime(value);
    interval.current = setInterval(() => {
      value--;
      if (value === 0) {
        clearInterval(interval.current);
        setctime(undefined);
      } else {
        setctime(value);
      }
    }, 1000);
  };

  const handleClose = () => {
    dispatch(clearMessage());
  };

  function sendCodeVerify() {
    const { email } = formik.values;
    if (!isValidEmail(email)) {
      dispatch(setMessage("Email không hợp lệ"));
      setIsError(true);
    } else {
      // send mail create code.
      var data = {
        email: email
      }
      dispatch(showLoading(true));
      dispatch(sendcode(data)).then(() => {
        enterdown(20);
        dispatch(setMessage("Mã xác nhận đã dc gửi vui lòng kiểm tra email."))
        setIsError(false);
        dispatch(hideLoading());
      }).catch(() => {
        setIsError(true);
        dispatch(hideLoading());
      });
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      codeVerify: '',
      password: '',
      passwordNew: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(showLoading(true));
      dispatch(forgotPassword(values)).then(() => {
        dispatch(hideLoading());
        navigate('/sign-in');
      }).catch(() => {
        dispatch(hideLoading());
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            QUÊN MẬT KHẨU
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {props.message && <Alert onClose={handleClose} severity={isError ? "error" : "success"} sx={{ width: '100%' }}>
                  {props.message}
                </Alert>}
              </Grid>
              <Grid container item xs={12} sm={12} spacing={1}>
                <Grid item xs={8} sm={8}>
                  <TextField
                    autoComplete="given-email"
                    name="email"
                    fullWidth
                    id="email"
                    label="Email đăng ký"
                    autoFocus
                    size='small'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={4} sm={4}>
                  <Link onClick={sendCodeVerify} disabled={ctime ? true : false} variant="body2" underline={ctime ? "none" : "hover"} component="button">
                    Gửi mã xác nhận {ctime && `(${ctime})`}
                  </Link>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="codeVerify"
                  label="Mã xác nhận"
                  name="codeVerify"
                  autoComplete="codeVerify"
                  size='small'
                  value={formik.values.codeVerify}
                  onChange={formik.handleChange}
                  error={formik.touched.codeVerify && Boolean(formik.errors.codeVerify)}
                  helperText={formik.touched.codeVerify && formik.errors.codeVerify}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Mật khẩu mới"
                  type="password"
                  id="password"
                  autoComplete="password"
                  size='small'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="passwordNew"
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  id="passwordNew"
                  autoComplete="passwordNew"
                  size='small'
                  value={formik.values.passwordNew}
                  onChange={formik.handleChange}
                  error={formik.touched.passwordNew && Boolean(formik.errors.passwordNew)}
                  helperText={formik.touched.passwordNew && formik.errors.passwordNew}
                />
              </Grid>
            </Grid>
            <Button
              onClick={() => {
                formik.handleSubmit();
              }}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đổi mật khẩu
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/sign-in" variant="body2">
                  Bạn đã có tài khoản? Đăng nhập
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.appReducers.auth;
  const { message } = state.appReducers.message;
  return {
    message,
    isLoggedIn
  };
}

export default connect(mapStateToProps)(ForgotPassword);