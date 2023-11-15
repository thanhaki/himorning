import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux'
import { Container, Button, Typography, Dialog, ListItem, ListItemText, List, Divider, Grid, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { TYPE_ERROR, showMessageByType } from '../../../helpers/handle-errors';
import { showLoading, hideLoading } from "../../../actions/index";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import electronicService from '../../../services/electronic.service';
import productService from '../../../services/product.service';


class MyUploadAdapter {
    constructor(loader) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                this._initRequest();
                this._initListeners(resolve, reject, file);
                this._sendRequest(file);
            }));
    }

    // Aborts the upload process.
    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        // Note that your request may look different. It is up to you and your editor
        // integration to choose the right communication channel. This example uses
        // a POST request with JSON as a data structure but your configuration
        // could be different.
        xhr.open('POST', 'http://localhost:5288/api/electronic-menu/update-file', true);
        xhr.responseType = 'json';
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve, reject, file) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${file.name}.`;

        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;

            // This example assumes the XHR server's "response" object will come with
            // an "error" which has its own "message" that can be passed to reject()
            // in the upload promise.
            //
            // Your integration may handle upload errors in a different way so make sure
            // it is done properly. The reject() function must be called when the upload fails.
            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : genericErrorText);
            }

            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            // This URL will be used to display the image in the content. Learn more in the
            // UploadAdapter#upload documentation.
            resolve({
                default: response.url
            });
        });

        // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
        // properties which are used e.g. to display the upload progress bar in the editor
        // user interface.
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    // Prepares the data and sends the request.
    _sendRequest(file) {
        // Prepare the form data.
        const data = new FormData();

        data.append('upload', file);

        // Important note: This is the right place to implement security mechanisms
        // like authentication and CSRF protection. For instance, you can use
        // XMLHttpRequest.setRequestHeader() to set the request headers containing
        // the CSRF token generated earlier by your application.

        // Send the request.
        this.xhr.send(data);
    }
}

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter(loader);
    };
}
const editorConfiguration = {
    extraPlugins: [MyCustomUploadAdapterPlugin]
};

const ProductDetail = (props) => {
    const { open, handleClose, ma_MH } = props;
    const [matHang, setMatHang] = useState(null);
    const dispatch = useDispatch();
    const [dataMieuTa, setDataMieuTa] = useState('');

    const onSelectFile = (e, name) => {
        var file = undefined;
        if (e.target.files && e.target.files.length >= 0) {
            file = e.target.files[0];
            handleUploadFile(file, name);
        }
    }

    const handleClsDialog = () => {
        if (handleClose) {
            handleClose();
        }
    }

    useEffect(() => {
        if (open) {
            GetMatHangById();
        }
    }, [open]);

    const GetMatHangById = () => {
        dispatch(showLoading(true));
        productService.GetMatHangByIdMatHang({
            Id: ma_MH
        }).then(res => {
            console.log("res", res);
            setMatHang(res.data);
            if (res.data) {
                setDataMieuTa(res.data.mieuTa_MH)
            }
            dispatch(hideLoading());
        }).catch(error => {
            console.log("error", error);
            dispatch(hideLoading());
        })
    }

    const handleUploadFile = (file, fileType) => {
        console.log(file);
        //check file size <= 5242880(5MB)

        if (file.size > 10485760 && fileType === "VIDEO") {
            showMessageByType(null, "Video có kích thước tối đa 10MB", TYPE_ERROR.error);
            return;
        } else {
            if (file.size > 5242880) {
                showMessageByType(null, "Hỉnh ảnh có kích thước tối đa 5MB", TYPE_ERROR.error);
                return;
            }
        }
        const values = {
            mieuTa_MH: dataMieuTa,
            ma_MH: ma_MH,
            fileName: fileType,
            donVi: props.userInfo?.user?.donVi
        };
        dispatch(showLoading(true));
        const formData = new FormData();
        formData.append('file', file);
        formData.append("data", JSON.stringify(values));
        electronicService.updatProductDetail(formData).then(res => {
            showMessageByType(null, "Upload thành thành công", TYPE_ERROR.success);
            dispatch(hideLoading());
        }).catch(error => {
            showMessageByType(error, "Lấy thông tin tài khoản thất bại", TYPE_ERROR.error);
            dispatch(hideLoading());
        })
    }
    const handleSave = () => {
        const values = {
            mieuTa_MH: dataMieuTa,
            ma_MH: ma_MH,
            donVi: props.userInfo?.user?.donVi
        };
        dispatch(showLoading(true));
        const formData = new FormData();
        formData.append("data", JSON.stringify(values));

        electronicService.updatProductDetail(formData).then(res => {
            showMessageByType(null, "Cập nhật thông tin mặt hàng thành công", TYPE_ERROR.success);
            dispatch(hideLoading());
            handleClose();
        }).catch(error => {
            showMessageByType(error, "Lấy thông tin tài khoản thất bại", TYPE_ERROR.error);
            dispatch(hideLoading());
        })
    }

    return (
        <Container component="main" maxWidth="true">
            <Dialog
                fullScreen
                open={open}
                onClose={handleClsDialog}
                disableEnforceFocus
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClsDialog}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Miêu tả mặt hàng
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleSave}>
                            Lưu
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box sx={{ height: "200px" }}>
                    <List sx={{ overflowY: 'scroll', height: "200px" }}>
                        <ListItem>
                            <ListItemText primary="Hình ảnh chia sẻ (Phù hợp 1200x627px)" />
                            <ListItemText>
                                {matHang && matHang.listImages[0] && <a href={matHang.listImages[0]} target='_blank'>Hình ảnh chia sẻ</a>}
                            </ListItemText>
                            <input
                                accept="image/*"
                                type="file"
                                id='LOGO'
                                onChange={(e) => onSelectFile(e, 'IMAG1')}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Video (nhỏ hơn <10mb và kéo dài tối đa 30 giây)" />
                            <ListItemText>
                                {matHang && matHang.video_MH && <a href={matHang.video_MH} target='_blank'>Video</a>}
                            </ListItemText>
                            <input
                                accept="video/mp4,video/x-m4v,video/*"
                                type="file"
                                id='LOGO'
                                onChange={(e) => onSelectFile(e, 'VIDEO')}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Hình ảnh mặt hàng (phụ hợp 900x900px)" />
                            <ListItemText>
                                {matHang && matHang.listImages[1] && <a href={matHang.listImages[1]} target='_blank'>Hình ảnh</a>}
                            </ListItemText>
                            <input
                                accept="image/*"
                                type="file"
                                id='LOGO'
                                onChange={(e) => onSelectFile(e, 'IMAG2')}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Hình ảnh mặt hàng (phụ hợp 900x900px)" />
                            <ListItemText>
                                {matHang && matHang.listImages[2] && <a href={matHang.listImages[2]} target='_blank'>Hình ảnh</a>}
                            </ListItemText>
                            <input
                                accept="image/*"
                                type="file"
                                id='LOGO'
                                onChange={(e) => onSelectFile(e, 'IMAG3')}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Hình ảnh mặt hàng (phụ hợp 900x900px)" />
                            <ListItemText>
                                {matHang && matHang.listImages[3] && <a href={matHang.listImages[3]} target='_blank'>Hình ảnh</a>}
                            </ListItemText>
                            <input
                                accept="image/*"
                                type="file"
                                id='LOGO'
                                onChange={(e) => onSelectFile(e, 'IMAG4')}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem >
                            <ListItemText primary="Hình ảnh mặt hàng (phụ hợp 900x900px)" />
                            <ListItemText>
                                {matHang && matHang.listImages[4] && <a href={matHang.listImages[4]} target='_blank'>Hình ảnh</a>}
                            </ListItemText>
                            <input
                                accept="image/*"
                                type="file"
                                id='LOGO'
                                onChange={(e) => onSelectFile(e, 'IMAG5')}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Hình ảnh mặt hàng (phụ hợp 900x900px)" />
                            <ListItemText>
                                {matHang && matHang.listImages[5] && <a href={matHang.listImages[5]} target='_blank'>Hình ảnh</a>}
                            </ListItemText>
                            <input
                                accept="image/*"
                                type="file"
                                id='LOGO'
                                onChange={(e) => onSelectFile(e, 'IMAG6')}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Hình ảnh mặt hàng (phụ hợp 900x900px)" />
                            <ListItemText>
                                {matHang && matHang.listImages[6] && <a href={matHang.listImages[6]} target='_blank'>Hình ảnh</a>}
                            </ListItemText>
                            <input
                                accept="image/*"
                                type="file"
                                id='LOGO'
                                onChange={(e) => onSelectFile(e, 'IMAG7')}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Hình ảnh mặt hàng (phụ hợp 900x900px)" />
                            <ListItemText>
                                {matHang && matHang.listImages[7] && <a href={matHang.listImages[7]} target='_blank'>Hình ảnh</a>}
                            </ListItemText>
                            <input
                                accept="image/*"
                                type="file"
                                id='LOGO'
                                onChange={(e) => onSelectFile(e, 'IMAG8')}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Hình ảnh mặt hàng (phụ hợp 900x900px)" />
                            <ListItemText>
                                {matHang && matHang.listImages[8] && <a href={matHang.listImages[8]} target='_blank'>Hình ảnh</a>}
                            </ListItemText>
                            <input
                                accept="image/*"
                                type="file"
                                id='LOGO'
                                onChange={(e) => onSelectFile(e, 'IMAG9')}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Hình ảnh mặt hàng (phụ hợp 900x900px)" />
                            <ListItemText>
                                {matHang && matHang.listImages[9] && <a href={matHang.listImages[9]} target='_blank'>Hình ảnh</a>}
                            </ListItemText>
                            <input
                                accept="image/*"
                                type="file"
                                id='LOGO'
                                onChange={(e) => onSelectFile(e, 'IMAG10')}
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Hình ảnh mặt hàng (phụ hợp 900x900px)" />
                            <ListItemText>
                                {matHang && matHang.listImages[10] && <a href={matHang.listImages[10]} target='_blank'>Hình ảnh</a>}
                            </ListItemText>
                            <input
                                accept="image/*"
                                type="file"
                                id='LOGO'
                                onChange={(e) => onSelectFile(e, 'IMAG11')}
                            />
                        </ListItem>
                        <Divider />
                    </List>
                </Box>

                <Grid container>
                    <Grid item xs={12} sm={12}>
                        {/* <Typography variant="h6" component="div">
                            Miêu tả chi tiết (Phù hợp với chữ, không sử dụng hình ảnh hoặc video)
                        </Typography> */}
                        <CKEditor
                            editor={Editor}
                            config={editorConfiguration}
                            data={dataMieuTa}
                            onReady={editor => {
                                // You can store the "editor" and use when it is needed.
                                console.log('Editor is ready to use!', editor);
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                console.log("data", data);
                                setDataMieuTa(data);
                            }}
                            onBlur={(event, editor) => {
                                console.log('Blur.', editor);
                            }}
                            onFocus={(event, editor) => {
                                console.log('Focus.', editor);
                            }}
                        />
                    </Grid>
                </Grid>
            </Dialog>
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

export default connect(mapStateToProps)(ProductDetail);