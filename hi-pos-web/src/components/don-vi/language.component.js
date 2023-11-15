import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { useDispatch, connect } from 'react-redux'
import { showLoading, hideLoading, clearMessage, setMessage, validateCode } from '../../actions/index';
import { Container, Typography, Select, TextField, FormControl, MenuItem, InputLabel, Box, Button, Divider } from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import donviService from '../../services/donvi.service';
import { DataGrid } from '@mui/x-data-grid';


const columns = [
    { field: 'id', headerName: 'STT', width: 50, sortable: false },
    { field: 'type', headerName: 'Phân hệ', width: 100, sortable: false },
    {
        field: 'data',
        headerName: 'Thuật ngữ chung',
        align: 'left',
        headerAlign: 'left',
        width: 380,
        sortable: false
    },
    {
        field: 'vietNamese',
        headerName: 'Thuật ngữ tiếng việt chuyên ngành',
        width: 380,
        editable: true,
        sortable: false
    },
    {
        field: 'english',
        headerName: 'Thuật ngữ tiếng anh chuyên ngành',
        width: 380,
        editable: true,
        sortable: false
    },
];
const SetUpLanguage = (props) => {
    const [code, setCode] = useState(0);
    const [listLanguage, setListLanguage] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        getDataNNTheoNganhHang();
    }, [code]);

    const getDataNNTheoNganhHang = () => {
        dispatch(showLoading(true));
        donviService.getDataNgonNguTheoNganhHang(code).then(res => {
            console.log("res", res.data);
            setListLanguage(res.data);
            dispatch(hideLoading());
        }).catch(error => {
            console.log("error", error);
            dispatch(hideLoading());
        })
    }
    const handleChangeNganhHang = (e) => {
        setCode(e.target.value);
    }

    const handleSaveLanguage = (e) => {
        console.log("listLanguage", listLanguage)
        var data = {
            ListData: listLanguage,
            MaNganhHang: code
        }
        dispatch(showLoading(true));
        donviService.updateNgonNguTheoNganhHang(data).then(res => {
            console.log("res", res.data)
            dispatch(hideLoading());
        }).catch(error => {
            dispatch(hideLoading());
            console.log("error", error);
        })
    }

    const onCellEditCommit= (cellData) => {
        const { id, field, value } = cellData;
        let newArr = [...listLanguage];
        newArr[id-1][field] = value; 
        setListLanguage(newArr);
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
                    DỊCH THUẬT NGỮ
                </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={2}>
                        <Typography component="h1" variant="h6">
                            Chọn ngành hàng:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={10}>
                        <FormControl sx={{ m: 1 }} fullWidth size="small">
                            <InputLabel id="demo-select-small-label">Ngành hàng</InputLabel>
                            <Select
                                fullWidth
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={code}
                                label="Ngành hàng"
                                onChange={handleChangeNganhHang}
                            >
                                {props.listNganhHangs && props.listNganhHangs.map((item) => {
                                    return (<MenuItem key={item.no} value={item.no}>{item.data}</MenuItem>)
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <div style={{ height: 1000, width: '100%' }}>
                            {listLanguage &&
                                <DataGrid
                                    rows={listLanguage.map((item, index) => ({ id: index + 1, ...item }))}
                                    onCellEditCommit={onCellEditCommit}
                                    sortingMode={false}
                                    columns={columns} />
                            }
                        </div>
                    </Grid>
                    <Grid xs={12} sm={12} sx={{ mt: 2, mb: 2 }}>
                        <Button variant='contained' startIcon={<SaveAltIcon />} onClick={handleSaveLanguage}>Lưu</Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

function mapStateToProps(state) {
    const { message } = state.appReducers.message;
    const { listNganhHangs } = state.appReducers.mdata;

    return {
        message,
        listNganhHangs
    };
}

export default connect(mapStateToProps)(SetUpLanguage);