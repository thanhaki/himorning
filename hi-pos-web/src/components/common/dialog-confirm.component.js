import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import { useDispatch, connect } from 'react-redux';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField } from '@mui/material';
import { clearMessage } from '../../actions/index';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialogMessage = (props) => {
  const { open, handleClose, title, callbackFunc, isShowReason } = props
  const dispatch = useDispatch();
  const [reason, setReason] = useState('');

  const handleCls = (event, reason) => {
    if (reason && reason === "backdropClick")
            return;
    if (handleClose) { handleClose(); }
    dispatch(clearMessage());
    setReason('')
  };

  const handleCallBack = () => {
    if (callbackFunc) {
      if (isShowReason) {
        callbackFunc(reason);
      } else {
        callbackFunc();
      }
    }
  }

  return (
    <Dialog
      sx={{ zIndex: 9999999999 }}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCls}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div dangerouslySetInnerHTML={{ __html: props.message }}>
        </div>
        {isShowReason &&
          <TextField
            sx={{ mt: 2 }}
            id="outlined-multiline-static"
            label="Lý do"
            fullWidth
            multiline
            rows={3}
            value={reason}
            onChange={(e) => { setReason(e.target.value) }}
          />

        }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCls}>Hủy</Button>
        <Button onClick={handleCallBack} disabled={isShowReason && reason.trim().length === 0}>Đồng ý</Button>
      </DialogActions>
    </Dialog>
  );
}
function mapStateToProps(state) {
  const { message } = state.appReducers.message;
  const { user } = state.appReducers.auth;

  return {
    message,
    userInfo: user,
  };
}

export default connect(mapStateToProps)(AlertDialogMessage);