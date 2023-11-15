import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useDispatch, connect } from 'react-redux'
import { Container, Typography, Box, Button } from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import IconButton from '@mui/material/IconButton';
import donviService from '../../services/donvi.service';
import { TYPE_ERROR, showMessageByType } from '../../helpers/handle-errors';
import userService from '../../services/user.service';
import { showLoading, hideLoading } from "../../actions/index";

const SetUpImages = (props) => {
    const [preview1, setPreview1] = useState();
    const [preview2, setPreview2] = useState();
    const [preview3, setPreview3] = useState();
    const [preview4, setPreview4] = useState();
    const [selectedFileImg1, setSelectedFileImg1] = useState(null);
    const [selectedFileImg2, setSelectedFileImg2] = useState(null);
    const [selectedFileImg3, setSelectedFileImg3] = useState(null);
    const [selectedFileImg4, setSelectedFileImg4] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const dispatch = useDispatch();

    const onSelectFile = (e, name) => {
        var file = undefined;
        if (e.target.files && e.target.files.length >= 0) {
            file = e.target.files[0];
        }

        switch(name){
            case 'LOGO':
                setSelectedFileImg1(file);
                handleSaveImg(file, 'LOGO');
                break;
            case 'COVER1':
                setSelectedFileImg2(file);
                handleSaveImg(file, 'COVER1');
                break;
            case 'COVER2':
                setSelectedFileImg3(file);
                handleSaveImg(file, 'COVER2');
                break;
            case 'COVER3':
                setSelectedFileImg4(file);
                handleSaveImg(file, 'COVER3');
                break;
        }
    }

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFileImg1) {
            setPreview1(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(selectedFileImg1)
        setPreview1(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFileImg1]);


    useEffect(() => {
        if (!selectedFileImg2) {
            setPreview2(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(selectedFileImg2)
        setPreview2(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFileImg2]);


    useEffect(() => {
        if (!selectedFileImg3) {
            setPreview3(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(selectedFileImg3)
        setPreview3(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFileImg3]);

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
    useEffect(() => {
        if (!selectedFileImg4) {
            setPreview3(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(selectedFileImg4)
        setPreview4(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFileImg4]);

    const handleSaveImg = (file, fileType) => {
        var values = {
            donVi : 0,
            fileName: fileType,
            logoDonVi: userInfo.logoDonVi,
            anhBiaPCDonVi: userInfo.anhBiaPCDonVi,
            anhBiaIPDonVi: userInfo.anhBiaIPDonVi,
            anhBiaSPDonVi: userInfo.anhBiaSPDonVi
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

    return (
        <Container component="main" maxWidth="true">
        <Box
            sx={{
                marginTop: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
                Thiết lập hình ảnh
            </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={2} sx={{ border: '1px solid green', borderRight: 'none' }}>
                    <Grid item xs={12} sm={12}>
                        <Typography component="h1" variant="h6">
                            Logo
                        </Typography>
                        <i>Hình ảnh được hiện thị ở hệ thống himon.vn, mẫu in báo cáo, hóa đơn.</i>

                    </Grid>
                </Grid>
                <Grid xs={12} sm={10} sx={{ border: '1px solid green', padding: 1 }}>
                    <IconButton color="primary" aria-label="upload picture" component="label"
                        sx={{
                            border: "1px solid",
                            borderRadius: 'unset',
                            width: 150,
                            height: 150,
                            backgroundImage: `url(${preview1 ? preview1 : userInfo?.logoDonVi})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                        }}
                    >
                        <input hidden
                            accept="image/*"
                            type="file"
                            id='LOGO'
                            onChange={(e) => onSelectFile(e, 'LOGO')}
                        />
                    </IconButton>
                </Grid>
                <Grid item xs={12} sm={12}></Grid>

                <Grid item xs={12} sm={2} sx={{ border: '1px solid green', borderRight: 'none' }}>
                    <Grid item xs={12} sm={12}>
                        <Typography component="h1" variant="h6">
                            Hình ảnh bìa 1:
                        </Typography>
                        <i>- Hình ảnh hiển thị khi khách hàng sử dụng máy tính.</i>
                        <br></br><i>- Kích thước: 1656 x 595px</i>
                    </Grid>
                </Grid>
                <Grid xs={12} sm={10} sx={{ border: '1px solid green', padding: 1 }}>
                    <IconButton color="primary" aria-label="upload picture" component="label"
                        sx={{
                            border: "1px solid",
                            borderRadius: 'unset',
                            width: "100%",
                            height: 350,
                            backgroundImage: `url(${preview2 ? preview2 : userInfo?.anhBiaPCDonVi})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                        }}
                    >
                        <input hidden
                            accept="image/*"
                            type="file"
                            onChange={(e) => onSelectFile(e, 'COVER1')}
                        />
                    </IconButton>
                </Grid>

                <Grid item xs={12} sm={12}></Grid>
                <Grid item xs={12} sm={2} sx={{ border: '1px solid green', borderRight: 'none' }}>
                    <Grid item xs={12} sm={12}>
                        <Typography component="h1" variant="h6">
                            Hình ảnh bìa 2:
                        </Typography>
                        <i>Hình ảnh hiển thị khi khách hàng sử dụng ipad</i>
                        <br></br><i>- Kích thước: 768 x 1024px</i>
                    </Grid>
                </Grid>
                <Grid xs={12} sm={10} sx={{ border: '1px solid green', padding: 1 }}>
                    <IconButton color="primary" aria-label="upload picture" component="label"
                        sx={{
                            border: "1px solid",
                            borderRadius: 'unset',
                            width: "100%",
                            height: 350,
                            backgroundImage: `url(${preview3 ? preview3 : userInfo?.anhBiaIPDonVi})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",

                        }}
                    >
                        <input hidden
                            accept="image/*"
                            type="file"
                            onChange={(e) => onSelectFile(e, 'COVER2')}
                        />
                    </IconButton>
                </Grid>
                <Grid item xs={12} sm={12}></Grid>
                <Grid item xs={12} sm={2} sx={{ border: '1px solid green', borderRight: 'none' }}>
                    <Grid item xs={12} sm={12}>
                        <Typography component="h1" variant="h6">
                            Hình ảnh bìa 3:
                        </Typography>
                        <i>- Hình ảnh hiển thị khi khách hàng sử dụng điện thoại</i>
                        <br></br><i>- Kích thước: 938 x 1720px</i>
                    </Grid>
                </Grid>
                <Grid xs={12} sm={10} sx={{ border: '1px solid green', padding: 1 }}>
                    <IconButton color="primary" aria-label="upload picture" component="label"
                        sx={{
                            border: "1px solid",
                            borderRadius: 'unset',
                            width: "15%",
                            height: 300,
                            backgroundImage: `url(${preview4})`,
                            backgroundImage: `url(${preview4 ? preview4 : userInfo?.anhBiaSPDonVi})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                        }}
                    >
                        <input hidden
                            accept="image/*"
                            type="file"
                            onChange={(e) => onSelectFile(e, 'COVER3')}
                        />
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    </Container>
    );
};

function mapStateToProps(state) {
    const { message } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    return {
        message,
        userInfo: user
    };
}

export default connect(mapStateToProps)(SetUpImages);