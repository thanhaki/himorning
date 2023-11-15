import React, { useEffect, useState } from 'react';
import { logout } from '../actions/index';
import { useDispatch } from 'react-redux'
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Logout from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import AddNhanVien from '../components/nhan-vien/addNhanVien.component'
import { connect } from "react-redux";
import userService from '../services/user.service';
import { showMessageByType } from '../helpers/handle-errors';
import { TYPE_ERROR } from '../helpers/handle-errors';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { TextField, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { showLoading, hideLoading } from "../actions/index";
import logoPng from '../assets/images/himorning-logo.jpg';

const MenuRight = (props) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [openEdit, setOpenEdit] = useState(false);
    const [openChangePw, setOpenChangePw] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isReload, setIsReload] = useState(false);
    const [completed, setCompleted] = React.useState({});

    const objDefault = {
        password: {
            value: '',
            error: ''
        },
        passwordNew: {
            value: '',
            error: ''
        },
        passwordNew1: {
            value: '',
            error: ''
        }
    }

    const [objChangePw, setObjChangePw] = useState(objDefault);

    const dispatch = useDispatch();

    // useEffect(() => {
    //     let data = props.userInfo?.user?.donVi
    //     dispatch(showLoading(true));
    //     TableService.getResultCheckTheSalesGuideSection(data).then((result) => {
    //         const newCompleted = {};
    //         result.data.forEach((value, index) => {
    //             if (value > 0) {
    //                 newCompleted[index] = true;
    //             }
    //         });
    //         setCompleted(newCompleted);
    //         dispatch(hideLoading());
    //     }).catch((error) => {
    //         showMessageByType(error, 'Lỗi lấy thông tin', TYPE_ERROR.error);
    //         dispatch(hideLoading());
    //     })
    // }, [isReload]);

    const getUserInfo = () => {
        const data = {
            no_User: props.userInfo?.user?.no_User
        };
        dispatch(showLoading(true));
        userService.getUserById(data).then((res) => {
            setUserInfo(res.data);
            setOpenEdit(true);
            dispatch(hideLoading());
        }).catch(error => {
            showMessageByType(error, "Lấy thông tin tài khoản thất bại", TYPE_ERROR.error);
            dispatch(hideLoading());
        });
    }

    // const introductAction = () => {
    //     navigate("/introduction");
    // }

    const handleEditInfo = () => {
        getUserInfo();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    }
    const logoutAction = () => {
        dispatch(logout());
        navigate("/sign-in");
        window.location.reload();
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setIsReload(!isReload);
    };

    const handleOpenDialogChangePw = (event) => {
        setOpenChangePw(true);
    }

    const handleCloseChangePw = (event) => {
        setOpenChangePw(false);
        setObjChangePw(objDefault);
    }

    const handleUpdatePw = () => {

        if (!isSubmited()) {
            showMessageByType(null, 'Mật khẩu hiện tại hoặc mật khẩu xác nhận không khớp', TYPE_ERROR.error);
            return;
        }
        var data = {
            password: objChangePw.password.value,
            passwordNew: objChangePw.passwordNew.value
        };

        dispatch(showLoading(true));
        userService.changePassword(data).then(res => {
            showMessageByType(null, 'Thay đổi mật khẩu thành công');
            handleCloseChangePw();
            dispatch(hideLoading());
        }).catch(error => {
            showMessageByType(error, 'Lấy thông tin danh mục thu chi thất bại', TYPE_ERROR.error);
            dispatch(hideLoading());
        });
    }

    const handleChangePw = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        const test = objChangePw[event.target.name];
        test.value = value;

        setObjChangePw(prev => ({
            ...prev,
            [name]: test,
        }));
    }

    const handleOnBlur = (event) => {
        const nameEle = event.target.name;
        const test = objChangePw[nameEle];

        if (test.value.length < 4) {
            test.error = 'Mật khẩu tối thiểu 4 ký tự';
        } else {
            if (nameEle === "passwordNew1" || nameEle === "passwordNew") {
                const test1 = objChangePw['passwordNew1'];
                if (objChangePw.passwordNew1.value !== objChangePw.passwordNew.value) {
                    test1.error = 'Mật khẩu xác nhận không khớp';
                } else {
                    test1.error = '';
                }

                setObjChangePw(prev => ({
                    ...prev,
                    ['passwordNew1']: test1,
                }));

            } else {
                test.error = '';
            }
        }

        setObjChangePw(prev => ({
            ...prev,
            [nameEle]: test,
        }));
    }
    const isSubmited = () => {
        const isValid = (objChangePw.password.value.length > 0) &&
            (objChangePw.passwordNew.value.length > 0 && objChangePw.passwordNew1.value.length > 0 && objChangePw.passwordNew.value === objChangePw.passwordNew1.value)

        return isValid;

    }
    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>
                            <img src={props.userInfo?.user?.logoDonVi ? props.userInfo?.user?.logoDonVi : logoPng} width={32} />
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleOpenDialogChangePw}>
                    <ListItemIcon>
                        <ChangeCircleIcon fontSize="small" />
                    </ListItemIcon>
                    Đổi mật khẩu
                </MenuItem>
                <MenuItem onClick={handleEditInfo}>
                    <ListItemIcon>
                        <InfoIcon fontSize="small" />
                    </ListItemIcon>
                    Thông tin tài khoản
                </MenuItem>
                {/* <MenuItem onClick={introductAction}>
                    <ListItemIcon>
                        <HubIcon fontSize="small" />
                    </ListItemIcon>
                    Hướng dẫn thiết lập {!(completed[0] && completed[1] && completed[2] && completed[3] && completed[4] && completed[5] && completed[6] && completed[7] && completed[8] && completed[9]) ? < PriorityHighIcon sx={{ ml: 1, color: 'red' }} /> : ''}
                </MenuItem> */}
                <Divider />
                <MenuItem onClick={logoutAction}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Đăng xuất
                </MenuItem>
            </Menu>
            {openEdit && <AddNhanVien
                open={openEdit}
                nameRow={userInfo}
                title={"Thông tin tài khoản"}
                handleClose={handleCloseEdit}
                isHiddenOptionRightMenu={true} />}

            <Dialog open={openChangePw} onClose={handleCloseChangePw}>
                <DialogTitle>ĐỔI MẬT KHẨU</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        name='password'
                        label="Mật khẩu hiện tại"
                        type="password"
                        fullWidth
                        onChange={handleChangePw}
                        variant="standard"
                        value={objChangePw.password.value}
                        onBlur={handleOnBlur}
                        helperText={objChangePw.password.error}
                        error={objChangePw.password.error && objChangePw.password.error.length > 0}
                    />
                    <TextField
                        onChange={handleChangePw}
                        margin="dense"
                        id="passwordNew"
                        name='passwordNew'
                        label="Mật khẩu mới"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={objChangePw.passwordNew.value}
                        onBlur={handleOnBlur}
                        helperText={objChangePw.passwordNew.error}
                        error={objChangePw.passwordNew.error && objChangePw.passwordNew.error.length > 0}
                    />
                    <TextField
                        onChange={handleChangePw}
                        margin="dense"
                        id="passwordNew1"
                        name='passwordNew1'
                        label="Xác nhận mật khẩu mới"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={objChangePw.passwordNew1.value}
                        onBlur={handleOnBlur}
                        helperText={objChangePw.passwordNew1.error}
                        error={objChangePw.passwordNew1.error && objChangePw.passwordNew1.error.length > 0}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseChangePw} variant='outlined' color='error'>Đóng</Button>
                    <Button onClick={handleUpdatePw} disabled={!isSubmited()} startIcon={<SaveIcon />} variant='outlined'>Lưu</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
function mapStateToProps(state) {
    const { message } = state.appReducers;
    const { user } = state.appReducers.auth;
    return {
        message,
        userInfo: user
    };
}

export default connect(mapStateToProps)(MenuRight);