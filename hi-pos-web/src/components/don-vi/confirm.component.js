import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useNavigate  } from 'react-router-dom';
import { useDispatch, connect } from 'react-redux'
import { showLoading, hideLoading, clearMessage, setMessage, validateCode } from '../../actions/index';

const ConfirmIdentity = (props) => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(clearMessage());
  };

  const { values } = props;

  function handleConfirmCode(event) {
    event.preventDefault();
    if (!code || code.length !== 6) {
      dispatch(setMessage("Mã xác thực không hợp lệ."));
      return;
    }
    var data = {
      email: values.email,
      CodeVerify: code
    }
    dispatch(showLoading(true));
    
    dispatch(validateCode(data)).then(() => {
      dispatch(hideLoading());
      navigate('/sign-in');
    }).catch(() => {
      dispatch(hideLoading());
    });
  }

  function handleCancel() {
    navigate('/sign-in');
  }

  return (
    <Grid item xs={12} sm={6}>
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
            XÁC MINH DANH TÍNH
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sx={{ mb: 1 }}>
        <label>
          Hãy nhập mã số đã được gửi về email: <b>{values.email}</b>
        </label>
        {props.message && <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {props.message}
        </Alert>}
      </Grid>
      <Grid item xs={12} sx={{ mb: 1 }}>
        <TextField
          fullWidth
          id="codeConfirm"
          name="codeConfirm"
          label="Mã xác nhận"
          size='small'
          value={code}
          placeholder='Mã xác nhận'
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          onChange={e => setCode(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sx={{ mb: 1 }}>
        <Link href="#" variant="body2">
          <i>Sử dụng một tùy chọn xác nhận khác</i>
        </Link>
      </Grid>
      <Grid container justifyContent="flex-end">
        <Grid item xs={2} sm={2} sx={{ mr: 2 }}>
          <Button color="secondary" fullWidth variant="outlined" onClick={handleCancel}>
            Hủy
          </Button>
        </Grid>
        <Grid item xs={4} sm={4}>
          <Button color="primary" fullWidth variant="contained" onClick={handleConfirmCode}>
            Tiếp theo
          </Button>
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

export default connect(mapStateToProps)(ConfirmIdentity);