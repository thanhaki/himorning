import React, { useState, useEffect, useRef } from 'react';
import { Select, TextField, FormControl, MenuItem, InputLabel, OutlinedInput, FormControlLabel, Checkbox, Box, Button, Grid, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { showLoading, hideLoading, reFetchData, getAllHttt } from "../../actions/index";
import { useDispatch } from 'react-redux';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { connect } from "react-redux";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveAltOutlined from '@mui/icons-material/SaveAltOutlined';
import { stylesErrorHelper } from '../../consts/modelStyle';
import PhieuThuChiService from '../../services/phieuThuChi.service';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import dayjs from 'dayjs';
import { FORMAT_YYYY_MM_DD, GROUP_DATA, LOAIDANHMUCTHUCHI } from '../../consts/constsCommon'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ImageUpload } from '../common/upload-image.component';
import Link from '@mui/material/Link';
import mdataService from '../../services/mdata.service';
import khachHangService from '../../services/khachHang.service';

const labelThu = {
    maPhieu: 'Mã phiếu thu',
    giaTri: 'Gia trị phiếu thu',
    danhMuc: 'Danh mục thu',
};

const lableChi = {
    maPhieu: 'Mã phiếu chi',
    giaTri: 'Gia trị phiếu chi',
    danhMuc: 'Danh mục chi',
};

const AddPhieuThuChi = (props) => {
    const dispatch = useDispatch();
    const { open, handleClose, getAllDataPhieuThu, loaiPhieuThuChi, danhMucThuChi } = props;
    const dateCurrent = moment(new Date()).format(FORMAT_YYYY_MM_DD);
    const [phieuThuChi, setPhieuThuChi] = useState(
        {
            giaTriThuChi: 0,
            ma_PhieuThuChi: 0,
            loai_PhieuThuChi: loaiPhieuThuChi,
            maDanhMucThuChi: 2,
            soHinhThucThanhToan: 86,
            thoiGianGhiNhan: dayjs(dateCurrent)
        });
    const loaiDanhMucThuChi = loaiPhieuThuChi === 1 ? LOAIDANHMUCTHUCHI.DANH_MUC_THU : LOAIDANHMUCTHUCHI.DANH_MUC_CHI;
    const [dsNhomKH, setDSNhomKH] = useState([]);
    const [dsKhachHangTheoNhom, setDSKhachHangTheoNhom] = useState([]);
    const { nameRow } = props;
    const descriptionElementRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleChangeImg = (img) => {
        setSelectedImage(img);
    }

    const getKhachHangTheoLoaiKH = (loaiKH) => {
        khachHangService.getListKhByLoaiKH(loaiKH).then(res => {
            setDSKhachHangTheoNhom(res.data);
        }).catch(error => {
            showMessageByType(error, 'Lấy thông tin khách hàng thất bại', TYPE_ERROR.error);
        })
    }

    const getNhomNguoiNop = () => {

        var data = {
            groupname: GROUP_DATA.LOAI_KHACH_HANG
        }

        mdataService.getMaDataByGroupName(data).then(res => {
            setDSNhomKH(res.data)
        }).catch(error => {
            showMessageByType(error, 'Lấy thông tin nhóm khách hàng thất bại', TYPE_ERROR.error);
        });
    }



    useEffect(() => {
        dispatch(getAllHttt()).then((res) => {
        }).catch((error) => {

        });

        getNhomNguoiNop();
        if (open) {
            if (nameRow && Object.keys(nameRow).length > 0) {
                const thoiGian = moment(nameRow.row.thoiGianGhiNhan).format(FORMAT_YYYY_MM_DD);
                nameRow.row.thoiGianGhiNhan = dayjs(thoiGian);
                getKhachHangTheoLoaiKH(nameRow.row.maNhomDoiTuong);
                setPhieuThuChi(nameRow.row);
            }else{
                phieuThuChi.hoachToanKinhDoanh = 1;
            }

            const { current: descriptionElement } = descriptionElementRef;

            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const handleCancel = () => {
        if (handleClose) { handleClose(); }
    }

    const updatePhieuThuChi = () => {
        phieuThuChi.thoiGianGhiNhan = moment(phieuThuChi.thoiGianGhiNhan.toDate()).format(FORMAT_YYYY_MM_DD);
        phieuThuChi.giaTriThuChi = (phieuThuChi.giaTriThuChi + '').replace(/\D/g, "");
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("data", JSON.stringify(phieuThuChi));
        dispatch(showLoading(true));
        PhieuThuChiService.updatePhieuThuChi(formData).then((res) => {
            showMessageByType(null, "Update phiếu thu chi thành công", TYPE_ERROR.success)
            dispatch(hideLoading());
            handleCancel();
            // set reload data = true
            dispatch(reFetchData(true));
        }).catch((error) => {
            showMessageByType(error, "Lỗi thêm phiếu thu chi", TYPE_ERROR.error)
            dispatch(hideLoading());
        });
    }

    const handleSave = () => {
        if (!phieuThuChi.so_PhieuThuChi || phieuThuChi.so_PhieuThuChi == 0) {
            phieuThuChi.thoiGianGhiNhan = moment(phieuThuChi.thoiGianGhiNhan.toDate()).format(FORMAT_YYYY_MM_DD);
            phieuThuChi.giaTriThuChi = (phieuThuChi.giaTriThuChi + '').replace(/\D/g, "");

            const formData = new FormData();
            formData.append("file", selectedImage);
            formData.append("data", JSON.stringify(phieuThuChi));
            dispatch(showLoading(true));
            PhieuThuChiService.addPhieuThu(formData).then((res) => {
                showMessageByType(null, "Thêm phiếu thu thành công", TYPE_ERROR.success)
                if (getAllDataPhieuThu) { getAllDataPhieuThu(); }
                dispatch(hideLoading());
                handleCancel();
                // set reload data = true
                dispatch(reFetchData(true));
            }).catch((error) => {
                showMessageByType(error, "Lỗi thêm phiếu thu", TYPE_ERROR.error)
                dispatch(hideLoading());
            });
        } else {
            if (phieuThuChi.so_PhieuThuChi > 0)
                updatePhieuThuChi();
        }
    }

    const formatNumberMoney = (value) => {
        const input = value.trim() === "" ? "0" : value;
        const formattedValue = parseFloat(input.replace(/\D/g, '')).toLocaleString('vi');
        return formattedValue;
    }

    const handleInputMoney = (event) => {
        setPhieuThuChi(prev => ({
            ...prev,
            [event.target.name]: formatNumberMoney(event.target.value),
        }));
    }

    const handleChange = (e) => {

        if (e.target.name === "maNhomDoiTuong") {
            getKhachHangTheoLoaiKH(e.target.value)
        }

        setPhieuThuChi(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }


    const handleChkChange = (e) => {
        setPhieuThuChi(prev => ({
            ...prev,
            [e.target.name]: e.target.checked ? 1 : 0,
        }));
    }

    const handleDatePickerChange = (newValue) => {
        setPhieuThuChi(prev => ({
            ...prev,
            ["thoiGianGhiNhan"]: newValue,
        }));
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={"paper"}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            component="main" maxWidth="md"
        >
            <DialogTitle id="scroll-dialog-title">{loaiPhieuThuChi === 1 ? "TẠO PHIẾU THU" : "TẠO PHIẾU CHI"} </DialogTitle>
            <DialogContent dividers={true}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                >
                    <Box sx={{ flexGrow: 1 }} container>
                        <Grid xs={12} sm={12} container>
                            <Grid xs={12} sm={8} container>
                                <Grid item xs={12} sm={6} style={{ padding: 5 }}>
                                    <FormControl size="small" fullWidth>
                                        <TextField
                                            id="ma_PhieuThuChi"
                                            fullWidth
                                            name='ma_PhieuThuChi'
                                            value={phieuThuChi.ma_PhieuThuChi}
                                            label={loaiPhieuThuChi === 1 ? labelThu.maPhieu : lableChi.maPhieu}
                                            onChange={handleChange}
                                            size="small"
                                            inputProps={
                                                { readOnly: true, }
                                            }
                                            disabled
                                            style={{ textAlign: "center" }}
                                        />
                                    </FormControl>

                                </Grid>
                                <Grid item xs={12} sm={6} style={{ padding: 5 }}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="danhmuc-thuchi-select-small">
                                            {loaiPhieuThuChi === 1 ? labelThu.giaTri : lableChi.giaTri}
                                        </InputLabel>
                                        <OutlinedInput
                                            id="giaTriThuChi"
                                            name="giaTriThuChi"
                                            fullWidth
                                            value={phieuThuChi.giaTriThuChi}
                                            label={loaiDanhMucThuChi === 1 ? labelThu.giaTri : lableChi.giaTri}
                                            onChange={handleInputMoney}
                                            size='small'
                                            inputProps={{ style: { textAlign: 'right' } }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} style={{ padding: 5 }}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="danhmuc-thuchi-select-small">
                                            {loaiPhieuThuChi === 1 ? labelThu.danhMuc : lableChi.danhMuc}
                                        </InputLabel>
                                        {phieuThuChi.maDanhMucThuChi && <Select
                                            labelId="danhMucThuChi-select-small"
                                            name="maDanhMucThuChi"
                                            id="danhMucThuChi-select-small"
                                            value={phieuThuChi.maDanhMucThuChi}
                                            label="Danh mục thu"
                                            onChange={handleChange}>
                                            {
                                                danhMucThuChi.map(x => {
                                                    return (
                                                        <MenuItem value={x.maDanhMucThuChi}>
                                                            <em>{x.ten_DanhMucThuChi}</em>
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                        }
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} style={{ padding: 5 }}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="danhmuc-thuchi-select-small">Nhóm người nộp</InputLabel>
                                        {(phieuThuChi.maNhomDoiTuong || dsNhomKH.length > 0) && <Select
                                            name="maNhomDoiTuong"
                                            id="maNhomDoiTuong"
                                            fullWidth
                                            value={phieuThuChi.maNhomDoiTuong}
                                            label="Nhóm người nộp"
                                            onChange={handleChange}>
                                            {
                                                dsNhomKH.map(x => {
                                                    return (
                                                        <MenuItem value={x.no}>
                                                            <em>{x.data}</em>
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                        }
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} style={{ padding: 5 }}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="danhmuc-thuchi-select-small">Tên người nộp</InputLabel>
                                        {(phieuThuChi.maDoiTuong || dsNhomKH.length > 0) && <Select
                                            name="maDoiTuong"
                                            id="maDoiTuong"
                                            fullWidth
                                            value={phieuThuChi.maDoiTuong}
                                            label="Tên người nộp"
                                            onChange={handleChange}>
                                            {
                                                dsKhachHangTheoNhom.map(x => {
                                                    return (
                                                        <MenuItem value={x.ma_KH}>
                                                            <em>{x.ten_KH}</em>
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                        }
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} style={{ padding: 5 }}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="danhmuc-thuchi-select-small">Phương thức thanh toán</InputLabel>
                                        {phieuThuChi.soHinhThucThanhToan && <Select
                                            name="soHinhThucThanhToan"
                                            id="soHinhThucThanhToan"
                                            fullWidth
                                            value={phieuThuChi.soHinhThucThanhToan}
                                            label="Phương thức thanh toán"
                                            onChange={handleChange}>
                                            {
                                                props.dataHttt.httt.map((item, index) => {
                                                    return (<MenuItem value={item.maHinhThucThanhToan} key={index}>{item.tenHinhThucThanhToan}</MenuItem>)
                                                })
                                            }
                                        </Select>
                                        }
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12} style={{ padding: 5 }}>
                                    <TextField
                                        id="noiDung"
                                        fullWidth
                                        name='noiDung'
                                        variant="outlined"
                                        label="Miêu tả"
                                        value={phieuThuChi.noiDung}
                                        onChange={handleChange}
                                        size="small"
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                            </Grid>
                            <Grid xs={12} sm={4} container direction="row" alignItems="flex-start">
                                <Grid item xs={12} sm={12} style={{ padding: 5 }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            className='customsize-datepicker'
                                            id="thoiGianGhiNhan"
                                            fullWidth
                                            name='thoiGianGhiNhan'
                                            variant="outlined"
                                            label="Thời gian ghi nhận"
                                            defaultValue={dayjs(dateCurrent)}
                                            value={dayjs(phieuThuChi.thoiGianGhiNhan)}
                                            onChange={handleDatePickerChange}
                                            size="small"
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={12} sm={12} style={{ padding: 5 }}>
                                    <ImageUpload
                                        selectedFile={selectedImage}
                                        setSelectedFile={handleChangeImg}
                                        isShowNameFile={true}
                                        icon={<AttachFileIcon />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} style={{ padding: 5 }}>
                                    {phieuThuChi.fileThuChi && <Link href={phieuThuChi.fileThuChi} color="inherit" target='_blank'>
                                        Tải xuống file thu chi
                                    </Link>
                                    }
                                </Grid>
                                <Grid item xs={12} sm={12} style={{ padding: 5 }}>
                                    <FormControlLabel
                                        control={<Checkbox
                                            id="hoachToanKinhDoanh"
                                            name='hoachToanKinhDoanh'
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            checked={phieuThuChi.hoachToanKinhDoanh === 1 ? true : false}
                                            value={phieuThuChi.hoachToanKinhDoanh}
                                            onChange={handleChkChange}
                                            FormHelperTextProps={{ style: stylesErrorHelper.helper }}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />}
                                        label="Hoạch toán kinh doanh"
                                        labelPlacement="end"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleCancel} size="small">Đóng</Button>
                <Button variant="contained" startIcon={<SaveAltOutlined />} onClick={handleSave} size="small">Lưu</Button>
            </DialogActions>
        </Dialog>
    );
}

function mapStateToProps(state) {
    const { message } = state.appReducers;
    const { user } = state.appReducers.auth;
    const { httt, htttDefault } = state.appReducers.mdata;
    const dataHttt = {
        httt, htttDefault
    };
    return {
        message,
        userInfo: user,
        dataHttt
    };
}

export default connect(mapStateToProps)(AddPhieuThuChi);