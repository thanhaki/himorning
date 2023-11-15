import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Container, Typography, Select, FormControl, MenuItem, InputLabel, Box, Button } from '@mui/material';
import { useDispatch, connect } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import BaoCaoKetQuaKinhDoanh from "./taichinh/ketqua-kinhdoanh.component";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormLabel from '@mui/material/FormLabel';
import dayjs from 'dayjs';
import { reFetchData, setObjectFilterData } from "../../actions/index";
import reportService from '../../services/report.service';
const loaiBaoCao = [
    {
        id: 1,
        title: 'Báo cáo kết quả kinh doanh'
    }
];

const thoiGian = [
    {
        id: 'HOMNAY',
        title: 'Hôm nay'
    },
    {
        id: 'HOMQUA',
        title: 'Hôm qua'
    },
    {
        id: 'TUAN',
        title: 'Tuần này'
    },
    {
        id: 'THANG',
        title: 'Tháng này'
    },
    {
        id: 'NAM',
        title: 'Năm này'
    },
    {
        id: 'THOIGIANKHAC',
        title: 'Khoảng thời gian khác'
    },
];
const BaoCaoTaiChinh = (props) => {

    const objDefault = {
        thoigian: thoiGian[0],
        tungay: "",
        denngay: ""
    };

    const [thoiGianSelected, setThoiGianSelected] = useState(objDefault);
    const [baoCaoCurrent, setBaoCaoCurrent] = useState(1);
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setObjectFilterData(objDefault));
        handleViewReport();
    }, []);

    const handleChangeThoiGian = (event) => {
        var dt = thoiGian.find(x => x.id === event.target.value);
        var test = {
            thoigian: dt
        };
        dispatch(setObjectFilterData(test));
        setThoiGianSelected(prev => ({
            ...prev,
            ['thoigian']: dt,
        }));
    };

    const handleChangeLoaiBaoCao = (event) => {
        setBaoCaoCurrent(event.target.value)
    }

    const handleShowTime = (event) => {
        setOpen(true);
    }
    const renderBaoCao = () => {
        switch (baoCaoCurrent) {
            case 1:
                return <BaoCaoKetQuaKinhDoanh loaiBaoCao={baoCaoCurrent}/>
        }
    }

    const handleViewReport = () => {
        dispatch(reFetchData(true));
    };

    const handleOk = () => {
        setOpen(false);
    };

    const handleDatePickerChange = (value, name) => {

        var test = {...thoiGianSelected};
        test[name] = value
        dispatch(setObjectFilterData(test));

        setThoiGianSelected(prev => ({
            ...prev,
            [name]: value,
        }));
    }
    const handleExportData = () => {
        var data = {
            donVi: 1
        }
        reportService.exportBaoCaoKetQuaKD(data).then(res => {
            console.log(res);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${"BaoCaoTaiChinh_" + Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
        }).catch(error => {

        });
    }
    return (
        <Container component="main" maxWidth="true" >
            <Box
                sx={{
                    marginTop: 2,
                    marginBottom: 2,
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    {props.title}
                </Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label" size='small'>Loại báo cáo</InputLabel>
                        <Select
                            size='small'
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={baoCaoCurrent}
                            label="Loại báo cáo"
                            onChange={handleChangeLoaiBaoCao}
                        >
                            {
                                loaiBaoCao.map(item => {
                                    return <MenuItem value={item.id}>{item.id + ". " + item.title}</MenuItem>
                                })
                            }

                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button variant='outlined' onClick={handleShowTime}> thời gian {"(" + thoiGianSelected.thoigian.title + ")"}</Button>
                </Grid>
                <Grid item xs={12} sm={6}
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center">
                    <Button onClick={handleViewReport} sx={{mr: 2}} disabled={props.isShow} variant='contained'>Xem báo cáo</Button>
                    <Button variant='contained' onClick={handleExportData} >Export data</Button>
                </Grid>
                <Grid item xs={12} sm={12}>
                    {renderBaoCao()}
                </Grid>
            </Grid>
            <Dialog
                open={open}
                onClose={handleOk}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={'xs'}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Thời gian"}
                </DialogTitle>
                <DialogContent>
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                            onChange={handleChangeThoiGian}
                            value={thoiGianSelected.thoigian.id}
                        >
                            {thoiGian.map((x) => {
                                return <FormControlLabel value={x.id} control={<Radio />} label={x.title} />
                            })}
                        </RadioGroup>

                        {thoiGianSelected.thoigian.id === "THOIGIANKHAC" && <>
                            <FormLabel id="demo-radio-buttons-group-label">Từ ngày</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    className='customsize-datepicker'
                                    id="tungay"
                                    name='tungay'
                                    variant="outlined"
                                    value={dayjs(thoiGianSelected.tungay)}
                                    onChange={(newValue) => { handleDatePickerChange(newValue, 'tungay') }}
                                    size="small"
                                />
                            </LocalizationProvider>
                            <FormLabel id="demo-radio-buttons-group-label">Đến ngày</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    className='customsize-datepicker'
                                    id="denngay"
                                    name='denngay'
                                    variant="outlined"
                                    value={dayjs(thoiGianSelected.denngay)}
                                    onChange={(newValue) => { handleDatePickerChange(newValue, 'denngay') }}
                                    size="small"
                                />
                            </LocalizationProvider>
                        </>}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOk} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
function mapStateToProps(state) {
    const { isLoggedIn } = state.appReducers.auth;
    const { message, isShow, title} = state.appReducers.message;
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { listOutlet, outlet } = state.appReducers.outlet;
    const { listThucDon, orderNewList, filterData, billIdsDelete, listBills } = state.appReducers.thucdon;
    const { httt, htttDefault } = state.appReducers.mdata;
    const dataHttt = {
        httt, htttDefault
    };

    return {
        isLoggedIn,
        message,
        isReFetchData,
        userInfo: user,
        listOutlet,
        outlet: outlet,
        listThucDon,
        orderNewList,
        dataHttt,
        filterData,
        billIdsDelete,
        listBills,
        isShow,
        title
    };
}

export default connect(mapStateToProps)(BaoCaoTaiChinh);