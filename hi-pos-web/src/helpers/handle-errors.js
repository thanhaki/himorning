

import { toast } from 'react-toastify';
import authService from '../services/auth.service';

export const AUTO_CLOSE_TOAST = 3000;

export const TYPE_ERROR = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
  default: 'default',
}

const getMessageError = (error) => {
  const message =
    (error.response &&
      error.response.data &&
      error.response.data.message) ||
    error.message ||
    error.toString();
    var statusText = error.response?.statusText;
    var status = error.response?.status;
  return {
    message: statusText === "Unauthorized" ? "Phiên làm việc của bạn đã hết, vui lòng đăng nhập lại" : message,
    code: error.code,
    statusText,
    status
  }
}

export function showMessageByType(error, message, type) {
  type = type ? type : TYPE_ERROR.success;
  if (error) {
    console.log(error);
    const objMsg = getMessageError(error);
    toast(objMsg.message ? objMsg.message : message, { type: type, autoClose: AUTO_CLOSE_TOAST });
    if (objMsg.statusText === "Unauthorized" || objMsg.status === 401) {
      window.location.href = "/sign-in";
    }
  } else {
    toast(message, { type: type, autoClose: AUTO_CLOSE_TOAST });
  }
}
