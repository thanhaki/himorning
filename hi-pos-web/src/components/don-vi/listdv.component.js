import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, TextField, FormControl, MenuItem, InputLabel, Box, Button } from '@mui/material';
import DonviService from '../../services/donvi.service';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { showLoading, hideLoading, reFetchData } from "../../actions/index";
import { useDispatch, connect } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import SelectTinhTrang from './render-cell/tinhTrang.component';
import DialogSelectSupporter from './render-cell/supporter.component';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import { ROWS_PER_PAGE_OPTIONS, FORMAT_DD_MM_YYYY } from '../../consts/constsCommon'
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
const theme = createTheme();

const RenderBtnDel = (props) => {
    const dispatch = useDispatch();
    const { row } = props;
    const handleDelete = () => {
        var data = {
            id: row.maDonVi
        };
        dispatch(showLoading(true));
        DonviService.deleteDonVi(data).then(() => {
            dispatch(hideLoading());
            dispatch(reFetchData(1));
            showMessageByType(null, "Xoá đơn vị thành công", TYPE_ERROR.success)

        }).catch((error) => {
            showMessageByType(error, "Xoá đơn vị không thành công", TYPE_ERROR.error)
            dispatch(hideLoading());
        });
    }
    return (
        <IconButton aria-label="delete" size="small" onClick={handleDelete} >
            <DeleteIcon fontSize="small" />
        </IconButton>
    );
};

const RenderApprovedCell = (props) => {
    const { row } = props;
    const dispatch = useDispatch();
    const handleApproved = () => {
        var data = {
            id: row.maDonVi
        };
        dispatch(showLoading(true));
        DonviService.approvedDonVi(data).then(() => {
            dispatch(hideLoading());
            dispatch(reFetchData(0));
            showMessageByType(null, "Đơn vị được duyệt thành công", TYPE_ERROR.success)
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "Duyệt đơn vị không thành công", TYPE_ERROR.error)
        });
    }
    return (
        <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
            {row.approved === 1 ? <CheckIcon /> :
                <Button size="small" fontSize="inherit" onClick={handleApproved}>
                    xác nhận
                </Button>
            }
        </div>
    );
}

const RenderTinhTrangDropdown = (props) => {
    return <SelectTinhTrang props={props} />
}

const RenderSupporterDropdown = (props) => {
    return <DialogSelectSupporter props={props} />
}

const columns = [
    { field: 'id', headerName: 'STT', width: 10 },
    { field: 'maDonVi', headerName: 'Mã DV', width: 60 },
    { field: 'tenDonVi', headerName: 'Tên đơn vị', width: 200 },
    { field: 'dienThoaiLienHe', headerName: 'Điện thoại LH', width: 120 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
        field: 'ngayDangKy', headerName: 'Ngày đăng ký', width: 100,
        valueFormatter: params =>
            moment(params?.value).format(FORMAT_DD_MM_YYYY),
    },
    {
        field: 'ngayGiaHan', headerName: 'Ngày gia hạn', width: 100,
        valueFormatter: params =>
            moment(params?.value).format(FORMAT_DD_MM_YYYY),
    },
    { field: 'goiDichVu', headerName: 'Gói dịch vụ', width: 90 },
    { field: 'tenTinhTrang', headerName: 'Tình trạng', width: 95, renderCell: RenderTinhTrangDropdown },
    { field: 'supporter', headerName: 'Supporter', width: 150, renderCell: RenderSupporterDropdown },
    { field: 'approved', headerName: 'Approved', width: 90, renderCell: RenderApprovedCell, align: 'center' },
    { field: '', headerName: 'Chức năng', width: 100, renderCell: RenderBtnDel, align: 'center' },
];

function DataGridDonVi(props) {
    const [listDonVi, setListDonVi] = useState([]);
    const [personName, setPersonName] = React.useState([]);
    const [tinhTrang, setTinhTrang] = useState(0);
    const [approved, setApproved] = useState(-1);
    const [txtSearch, setTxtSearch] = useState('');
    const [objSearch, setObjectSearch] = useState({
        tinhTrang: 0,
        approved: -1,
        nameOrPhoneNumber: "",
        supporterName: []
    });
    const dispatch = useDispatch();

    const getAllDV = () => {
        dispatch(showLoading(true));
        DonviService.getAllDonVi(objSearch).then((res) => {
            setListDonVi(res.data);
            dispatch(hideLoading());
        }).catch((error) => {
            showMessageByType(error, "Lấy thông tin đơn vi thất bại", TYPE_ERROR.error);
            dispatch(hideLoading());
        });
    }

    useEffect(() => {
        getAllDV();
    }, [objSearch, props.isReFetchData])

    const handleApprovedChange = (event) => {
        setApproved(event.target.value);
    };

    const handleTinhTrangChange = (event) => {
        setTinhTrang(event.target.value);
    };

    const handleTxtChange = (event) => {
        setTxtSearch(event.target.value);
    };

    const handleSearch = () => {
        var dataSearch = {
            tinhTrang: tinhTrang,
            approved: approved,
            nameOrPhoneNumber: txtSearch,
            supporterName: personName
        }
        setObjectSearch(dataSearch);
        dispatch(reFetchData(true));
    }
    const handleSupporterChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    }
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="true">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                </Box>
                <Typography component="h1" variant="h5">
                    Danh sách đơn vị
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={2}>
                            <FormControl sx={{ minWidth: 120 }} size="small" fullWidth>
                                <InputLabel id="tinhTrang-select-small">Tình trạng</InputLabel>
                                <Select
                                    labelId="tinhTrang-select-small"
                                    id="tinhTrang-select-small"
                                    value={tinhTrang}
                                    label="Tình trạng"
                                    onChange={handleTinhTrangChange}
                                >
                                    <MenuItem value={0}>
                                        <em>Tất cả</em>
                                    </MenuItem>
                                    {props.listTTDonVi.map((tt) => {
                                        return (<MenuItem key={tt.no} value={tt.no}>{tt.data}</MenuItem>)
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <FormControl sx={{ minWidth: 120 }} size="small" fullWidth>
                                <InputLabel id="support-select-small">Supporter</InputLabel>
                                <Select
                                    labelId="support-select-small"
                                    id="support-select-small"
                                    value={personName}
                                    multiple
                                    label="Supporter"
                                    input={<OutlinedInput label="Supporter" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    onChange={handleSupporterChange}
                                >
                                    {props.listSalers.map((item) => (
                                        <MenuItem key={item.ten_Saler} value={item.ten_Saler}>
                                            <Checkbox checked={personName.indexOf(item.ten_Saler) > -1} />
                                            <ListItemText primary={item.ten_Saler} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <FormControl sx={{ minWidth: 120 }} size="small" fullWidth>
                                <InputLabel id="support-select-small">Trạng thái</InputLabel>
                                <Select
                                    labelId="support-select-small"
                                    id="support-select-small"
                                    value={approved}
                                    label="Supporter"
                                    onChange={handleApprovedChange}
                                >
                                    <MenuItem value={-1}>
                                        <em>Tất cả</em>
                                    </MenuItem>
                                    <MenuItem value={1}>Đã xác nhận</MenuItem>
                                    <MenuItem value={0}>Chưa xác nhận</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl sx={{ minWidth: 120 }} size="small" fullWidth>
                                <TextField
                                    id="searchTxt"
                                    fullWidth
                                    value={txtSearch}
                                    onChange={handleTxtChange}
                                    label="Tên đơn vị hoặc số điện thoại"
                                    variant="outlined"
                                    placeholder='Tên đơn vị hoặc số điện thoại'
                                    size="small" />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <FormControl sx={{ minWidth: 120 }} size="small" fullWidth>
                                <Button variant="outlined" onClick={handleSearch}>
                                    <SearchIcon />Tìm kiếm
                                </Button>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Box sx={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={listDonVi.map((item, index) => ({ id: index + 1, ...item }))}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[ROWS_PER_PAGE_OPTIONS]}
                                    disableSelectionOnClick
                                    experimentalFeatures={{ newEditingApi: true }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </ThemeProvider>
    );

}

function mapStateToProps(state) {
    const { isLoggedIn } = state.appReducers.auth;
    const { message } = state.appReducers.message;
    const { isReFetchData } = state.appReducers.message;
    const { listTTDonVi } = state.appReducers.mdata;
    const { listSalers } = state.appReducers.mdata;

    return {
        isLoggedIn,
        message,
        listTTDonVi: listTTDonVi ? listTTDonVi : [],
        isReFetchData,
        listSalers: listSalers ? listSalers : [],
    };
}

export default connect(mapStateToProps)(DataGridDonVi);