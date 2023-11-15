import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Registration from '../../assets/images/Registration.gif'
import ConfirmIdentity from '../../components/don-vi/confirm.component'
import InforCompany from '../../components/don-vi/infor.component'
import { connect, useDispatch } from "react-redux";
import { showLoading, hideLoading,register } from "../../actions/index";

const validationSchema = yup.object({
  tenDonVi: yup
    .string()
    .required('Tên cửa hàng/công ty không được bỏ trống'),
  diaChiDonVi: yup
    .string()
    .required('Địa chỉ không được bỏ trống'),
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email không được bỏ trống'),
  dienThoaiLienHe: yup
    .string()
    .matches(/^[0-9]+$/, "Chỉ nhập số")
    .min(10, 'Số điện thoại không hợp lệ')
    .max(10, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại không được bỏ trống'),
  password: yup
    .string()
    .min(4, 'Mật khẩu tối thiểu 4 ký tự')
    .required('Mật khẩu không được bỏ trống'),
});

const SignUp = (props) => {
  const [isConfirm, setIsConfirm] = useState(false);
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      tenDonVi: '',
      diaChiDonVi: '',
      email: '',
      dienThoaiLienHe: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(showLoading(true));
      dispatch(register(values))
        .then((res) => {
          dispatch(hideLoading());
          setIsConfirm(true);
        }).catch(() => {
          setIsConfirm(false);
          dispatch(hideLoading());
        });
    },
  });

  return (
    <Container maxWidth='true'>
      <CssBaseline />
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {!isConfirm && <InforCompany
            values={formik.values}
            touched={formik.touched}
            errors={formik.errors}
            onChange={formik.handleChange} />
          }

          {isConfirm && <ConfirmIdentity values={formik.values} />}
          <Grid item xs={12} sm={6}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100%"
              minWidth="100%"
            >
              <img src={Registration} width="100%"/>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};
function mapStateToProps(state) {
  const { message } = state.appReducers.message;
  return {
    message,
  };
}

export default connect(mapStateToProps)(SignUp);