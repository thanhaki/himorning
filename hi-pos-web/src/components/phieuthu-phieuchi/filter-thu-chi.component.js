import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import FormControlLabel from '@mui/material/FormControlLabel';
import { reFetchData, setObjectFilterData } from "../../actions/index";
import AutorenewIcon from '@mui/icons-material/Autorenew';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const initData = {
  danhMucThuChi: [],
  thoigian: {
    isFilterTheoNgay: false,
    tungay: '',
    denngay: ''
  },
};
const DialogFilterThuChi = (props) => {
  const { open, handleClose, danhMucThuChi, loaiPhieuThuChi } = props;
  const [dataFilter, setDataFilter] = useState(initData);

  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
    }
  }, [open]);


  const handleFilter = () => {
    dispatch(setObjectFilterData(dataFilter));
    dispatch(reFetchData(true));
    if (handleClose) { handleClose() }
  }


  const handleResetFilter = () => {
    dispatch(setObjectFilterData(null));
    dispatch(reFetchData(true));
    setDataFilter(initData);
    if (handleClose) { handleClose() }
  }

  const handleChange = (event) => {
    const { target: { value } } = event;
    var data = typeof value === 'string' ? value.split(',') : value;

    const thuChi = danhMucThuChi.filter((item) => {
        var tc = data.find(x => x.maDanhMucThuChi === item.maDanhMucThuChi);
        return tc;
      });
  
      setDataFilter(prev => ({
        ...prev,
        ['danhMucThuChi']: thuChi,
      }));
  };

  const handleOnchangeChk = (event) => {
    var chked = event.target.checked;
    var test = dataFilter.thoigian;
    test.isFilterTheoNgay = chked;

    setDataFilter(prev => ({
      ...prev,
      ['thoigian']: test,
    }));
  }

  const isCheckedDropdown = (item) => {
    var ht = dataFilter.danhMucThuChi.find(x => x.maDanhMucThuChi === item.maDanhMucThuChi);
    return ht && ht.maDanhMucThuChi > 0;
  }

  const renderValues = (selected, name) => {
    return selected.map(u => u['ten_DanhMucThuChi']).join(', ');
  }

  const handleDatePickerChange = (value, name) => {
    const filterDate = dataFilter.thoigian;

    if (name === 'tungay') {
      filterDate.tungay = value;
    }

    if (name === 'denngay') {
      filterDate.denngay = value;
    }

    setDataFilter(prev => ({
      ...prev,
      ['thoigian']: filterDate,
    }));
  }
  return (
    <Dialog
      maxWidth='sm'
      open={open}
      fullWidth
      onClose={handleClose}
    >
      <DialogTitle>{ loaiPhieuThuChi === 1 ? "Lọc phiếu thu" : "Lọc phiếu chi"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>

          <Grid item xs={12} sm={12}>
            <FormControl sx={{ m: 1 }} size='small' fullWidth>
              <FormControlLabel required control={<Checkbox checked={dataFilter.thoigian.isFilterTheoNgay || false} onChange={handleOnchangeChk} />}
                label="Lọc theo thời gian tạo phiếu" />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ m: 1 }} size='small' fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className='customsize-datepicker'
                  id="tungay"
                  fullWidth
                  name='tungay'
                  variant="outlined"
                  label="Từ ngày"
                  disabled={!dataFilter.thoigian.isFilterTheoNgay}
                  value={dayjs(dataFilter.thoigian.tungay)}
                  onChange={(newValue) => { handleDatePickerChange(newValue, 'tungay') }}
                  size="small"
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ m: 1 }} size='small' fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  id="denngay"
                  fullWidth
                  name='denngay'
                  variant="outlined"
                  label="Đến ngày"
                  disabled={!dataFilter.thoigian.isFilterTheoNgay}
                  className='customsize-datepicker'
                  value={dayjs(dataFilter.thoigian.denngay)}
                  onChange={(newValue) => { handleDatePickerChange(newValue, 'denngay') }}
                  size="small"
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl sx={{ m: 1 }} size='small' fullWidth>
              <InputLabel id="danhMucThuChi-multiple-checkbox-label">{loaiPhieuThuChi === 1 ? "Danh mục thu" : "Danh mục chi"}</InputLabel>
              <Select
                name='danhMucThuChi'
                labelId="danhMucThuChi-multiple-checkbox-label"
                id="danhMucThuChi-multiple-checkbox"
                multiple
                value={dataFilter.danhMucThuChi}
                onChange={handleChange}
                input={<OutlinedInput label={loaiPhieuThuChi === 1 ? "Danh mục thu" : "Danh mục chi"} />}
                renderValue={(selected) => renderValues(selected)}
                MenuProps={MenuProps}
                size='small'
              >
                {danhMucThuChi.map((item) => (
                  <MenuItem key={item.maDanhMucThuChi} value={item}>
                    <Checkbox checked={isCheckedDropdown(item) || false} />
                    <ListItemText primary={item.ten_DanhMucThuChi} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleResetFilter} startIcon={<AutorenewIcon />} variant='outlined'>Reset</Button>
        <Button onClick={handleFilter} endIcon={<FilterAltIcon />} variant='outlined'>Lọc</Button>
      </DialogActions>
    </Dialog>

  )
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.appReducers.auth;
  const { message } = state.appReducers.message;
  const { isReFetchData } = state.appReducers.message;
  const { user } = state.appReducers.auth;

  return {
    isLoggedIn,
    message,
    isReFetchData,
    userInfo: user,
  };
}

export default connect(mapStateToProps)(DialogFilterThuChi);