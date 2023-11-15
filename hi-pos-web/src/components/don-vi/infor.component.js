import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { clearMessage } from "../../actions/index";
import { connect } from "react-redux";
import Alert from '@mui/material/Alert';
import { useDispatch } from 'react-redux'

const InforCompany = (props) => {
  const { values, touched, errors, onChange } = props;
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(clearMessage())
  }
  return (
    <Grid item xs={12} sm={6} container spacing={1}>
      <Grid item xs={12}>
        <Box
          sx={{
            marginTop: 2,
            marginBottom: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng ký
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        {props.message && <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {props.message}
        </Alert>}
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="tenDonVi"
          name="tenDonVi"
          label="Tên cửa hàng hoặc công ty"
          value={values.tenDonVi}
          onChange={onChange}
          error={touched.tenDonVi && Boolean(errors.tenDonVi)}
          helperText={touched.tenDonVi && errors.tenDonVi}
          size='small'
          placeholder='Công ty TNHH công nghệ giải pháp Tâm An'
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="diaChiDonVi"
          name="diaChiDonVi"
          label="Địa chỉ cửa hàng hoặc công ty"
          value={values.diaChiDonVi}
          onChange={onChange}
          error={touched.diaChiDonVi && Boolean(errors.diaChiDonVi)}
          helperText={touched.diaChiDonVi && errors.diaChiDonVi}
          size='small'
          placeholder='188 Yearsin, TP.Đà Lạt'
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={values.email}
          onChange={onChange}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
          size='small'
          placeholder='info.himorning@gmail.com'
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="dienThoaiLienHe"
          name="dienThoaiLienHe"
          label="Số điện thoại liên hệ"
          value={values.dienThoaiLienHe}
          onChange={onChange}
          error={touched.dienThoaiLienHe && Boolean(errors.dienThoaiLienHe)}
          helperText={touched.dienThoaiLienHe && errors.dienThoaiLienHe}
          size='small'
          placeholder='0918252214'
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          type={'password'}
          id="password"
          name="password"
          label="Mật khẩu đăng nhập hệ thống"
          value={values.password}
          onChange={onChange}
          error={touched.password && Boolean(errors.password)}
          helperText={touched.password && errors.password}
          size='small'
          placeholder='********'
        />
      </Grid>
      <Grid item xs={12}>
        <Button color="primary" variant="contained" fullWidth type="submit">
          TÔI MUỐN ĐĂNG KÝ
        </Button>
      </Grid>
      <Grid container justifyContent="flex-end" mt={1}>
        <Grid item>
          <Link href="/sign-in" variant="body2">
            Bạn đã có tài khoản? Đăng nhập
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
};

function mapStateToProps(state) {
  const { message } = state.appReducers.message;
  return {
    message,
  };
}

export default connect(mapStateToProps)(InforCompany);