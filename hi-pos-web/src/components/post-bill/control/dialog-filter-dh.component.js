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
import postbillService from '../../../services/postbill.service';
import khachHangService from '../../../services/khachHang.service';
import { showLoading, hideLoading, reFetchData, setObjectFilterData } from "../../../actions/index";
import { showMessageByType } from '../../../helpers/handle-errors';
import { TYPE_ERROR } from '../../../helpers/handle-errors';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { LOAI_KHACH_HANG } from '../../../consts/constsCommon';
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
  thungan: [],
  phucvu: [],
  khuvuc: [],
  phuongThucThanhToan: [],
  thoigian: {
    isFilterTheoNgay: false,
    tungay: '',
    denngay: ''
  },
  khachHang: [],
  tinhTrangDH: []
};
const DialogFilterDonHang = (props) => {
  const { open, handleClose } = props;
  const [listNhanVien, setListNhanVien] = useState([]);
  const [listKhachHang, setListKhachHang] = useState([]);
  const [dataFilter, setDataFilter] = useState(initData);

  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      getAllUser();
      getAllKhachHang();
    }
  }, [open]);

  const getAllUser = () => {
    dispatch(showLoading(true));
    postbillService.getalluser().then((res) => {
      setListNhanVien(res.data);
      dispatch(hideLoading());
    }).catch((error) => {
      showMessageByType(error, "error", TYPE_ERROR.error);
    });
  }

  const getAllKhachHang = () => {
    dispatch(showLoading(true));
    khachHangService.GetListKhByLoaiKHThanhToan(LOAI_KHACH_HANG.KHACH_HANG).then((result) => {
      setListKhachHang(result.data);
      dispatch(hideLoading());
    }).catch((error) => {
      dispatch(hideLoading());
      showMessageByType(error, "error", TYPE_ERROR.error);
    })
  }

  const handleFilter = () => {
    dispatch(setObjectFilterData(dataFilter));
    dispatch(reFetchData(true));
    if (handleClose) { handleClose() }
  }


  const handleResetFilter = () => {
    dispatch(setObjectFilterData(null));
    dispatch(reFetchData(true));
    setDataFilter(initData);
  }

  const hanldeChangeHttt = (event, data) => {
    const dataHttt = props.dataHttt.httt.filter((item) => {
      var ht = data.find(x => x.maHinhThucThanhToan === item.maHinhThucThanhToan);
      return ht;
    });

    setDataFilter(prev => ({
      ...prev,
      [event.target.name]: dataHttt,
    }));
  }

  const hanldeChangeKhuVuc = (event, data) => {
    const khuVuc = props.listOutlet.filter((item) => {
      var kv = data.find(x => x.ma_Outlet === item.ma_Outlet);
      return kv;
    });

    setDataFilter(prev => ({
      ...prev,
      [event.target.name]: khuVuc,
    }));
  }

  const hanldeChangePhucVu = (event, data) => {
    const phucvu = listNhanVien.filter((item) => {
      var pv = data.find(x => x.no_User === item.no_User);
      return pv;
    });

    setDataFilter(prev => ({
      ...prev,
      [event.target.name]: phucvu,
    }));
  }

  const hanldeChangeThuNgan = (event, data) => {
    const thungan = listNhanVien.filter((item) => {
      var tn = data.find(x => x.no_User === item.no_User);
      return tn;
    });

    setDataFilter(prev => ({
      ...prev,
      [event.target.name]: thungan,
    }));
  }

  const hanldeChangeKhachHang = (event, data) => {
    const khachahng = listKhachHang.filter((item) => {
      var kh = data.find(x => x.ma_KH === item.ma_KH);
      return kh;
    });

    setDataFilter(prev => ({
      ...prev,
      [event.target.name]: khachahng,
    }));
  }

  const hanldeChangeTinhTrangDH = (event, data) => {
    const ttdh = props.tinhTrangDonHang.filter((item) => {
      var tt = data.find(x => x.no === item.no);
      return tt;
    });

    setDataFilter(prev => ({
      ...prev,
      [event.target.name]: ttdh,
    }));
  }
  const handleChange = (event) => {
    const { target: { value } } = event;
    var data = typeof value === 'string' ? value.split(',') : value;

    if (event.target.name === "phuongThucThanhToan") {
      hanldeChangeHttt(event, data);
    }

    if (event.target.name === "khuvuc") {
      hanldeChangeKhuVuc(event, data);
    }

    if (event.target.name === "thungan") {
      hanldeChangeThuNgan(event, data);
    }

    if (event.target.name === "phucvu") {
      hanldeChangePhucVu(event, data);
    }

    if (event.target.name === "khachHang") {
      hanldeChangeKhachHang(event, data);
    }

    if (event.target.name === "tinhTrangDH") {
      hanldeChangeTinhTrangDH(event, data);
    }
  };

  const handleOnchangeChk = (event) => {
    var chked = event.target.checked;
    var test = dataFilter.thoigian;
    test.isFilterTheoNgay = chked;

    setDataFilter(prev => ({
      ...prev,
      [event.target.name]: test,
    }));
  }

  const isCheckedDropdown = (item, name) => {
    if (dataFilter.phuongThucThanhToan.length > 0 && name === 'phuongThucThanhToan') {
      var ht = dataFilter.phuongThucThanhToan.find(x => x.maHinhThucThanhToan === item.maHinhThucThanhToan);
      return ht && ht.maHinhThucThanhToan > 0;
    }

    if (dataFilter.khuvuc.length > 0 && name === 'khuvuc') {
      var kv = dataFilter.khuvuc.find(x => x.ma_Outlet === item.ma_Outlet);
      return kv && kv.ma_Outlet > 0;
    }

    if (dataFilter.phucvu.length > 0 && name === 'phucvu') {
      var pv = dataFilter.phucvu.find(x => x.no_User === item.no_User);
      return pv && pv.no_User > 0;
    }

    if (dataFilter.thungan.length > 0 && name === 'thungan') {
      var tn = dataFilter.thungan.find(x => x.no_User === item.no_User);
      return tn && tn.no_User > 0;
    }

    if (dataFilter.khachHang.length > 0 && name === 'khachHang') {
      var kh = dataFilter.khachHang.find(x => x.ma_KH === item.ma_KH);
      return kh && kh.ma_KH > 0;
    }
    if (dataFilter.tinhTrangDH.length > 0 && name === 'tinhTrangDH') {
      var ttdh = dataFilter.tinhTrangDH.find(x => x.no === item.no);
      return ttdh && ttdh.no > 0;
    }

    return false;
  }

  const renderValues = (selected, name) => {
    return selected.map(u => u[name]).join(', ');
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
      <DialogTitle>Lọc hóa đơn</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
            <FormControl sx={{ m: 1 }} size='small' fullWidth>
              <InputLabel id="thungan-multiple-checkbox-label">Thu Ngân</InputLabel>
              <Select
                name='thungan'
                labelId="thungan-multiple-checkbox-label"
                id="thungan-multiple-checkbox"
                multiple
                value={dataFilter.thungan}
                onChange={handleChange}
                input={<OutlinedInput label="Thu Ngân" />}
                renderValue={(selected) => renderValues(selected, 'fullName')}
                MenuProps={MenuProps}
                size='small'
              >
                {listNhanVien.map((item) => (
                  <MenuItem key={item.no_User} value={item}>
                    <Checkbox checked={isCheckedDropdown(item, 'thungan') || false} />
                    <ListItemText primary={item.fullName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl sx={{ m: 1 }} size='small' fullWidth>
              <InputLabel id="phucvu-multiple-checkbox-label">Phục vụ</InputLabel>
              <Select
                name='phucvu'
                labelId="phucvu-multiple-checkbox-label"
                id="phucvu-multiple-checkbox"
                multiple
                value={dataFilter.phucvu}
                onChange={handleChange}
                input={<OutlinedInput label="Phục vụ" />}
                renderValue={(selected) => renderValues(selected, 'fullName')}
                MenuProps={MenuProps}
                size='small'
              >
                {listNhanVien.map((item) => (
                  <MenuItem key={item.no_User} value={item}>
                    <Checkbox checked={isCheckedDropdown(item, 'phucvu') || false} />
                    <ListItemText primary={item.fullName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl sx={{ m: 1 }} size='small' fullWidth>
              <InputLabel id="khuvuc-multiple-checkbox-label">Khu vực</InputLabel>
              <Select
                name='khuvuc'
                labelId="khuvuc-multiple-checkbox-label"
                id="khuvuc-multiple-checkbox"
                multiple
                value={dataFilter.khuvuc}
                onChange={handleChange}
                input={<OutlinedInput label="Khu vực" />}
                renderValue={(selected) => renderValues(selected, 'ten_Outlet')}
                MenuProps={MenuProps}
                size='small'
              >
                {props.listOutlet.map((item) => (
                  <MenuItem key={item.ma_Outlet} value={item}>
                    <Checkbox checked={isCheckedDropdown(item, "khuvuc") || false} />
                    <ListItemText primary={item.ten_Outlet} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl sx={{ m: 1 }} size='small' fullWidth>
              <InputLabel id="phuongThucThanhToan-multiple-checkbox-label">Phương thức thanh toán</InputLabel>
              <Select
                name='phuongThucThanhToan'
                labelId="phuongThucThanhToan-multiple-checkbox-label"
                id="phuongThucThanhToan-multiple-checkbox"
                multiple
                value={dataFilter.phuongThucThanhToan}
                onChange={handleChange}
                input={<OutlinedInput label="Phương thức thanh toán" />}
                renderValue={(selected) => renderValues(selected, 'tenHinhThucThanhToan')}
                MenuProps={MenuProps}
                size='small'
              >
                {props.dataHttt.httt.map((item) => (
                  <MenuItem key={item.maHinhThucThanhToan} value={item}>
                    <Checkbox checked={isCheckedDropdown(item, "phuongThucThanhToan") || false} />
                    <ListItemText primary={item.tenHinhThucThanhToan} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl sx={{ m: 1 }} size='small' fullWidth>
              <FormControlLabel required control={<Checkbox checked={dataFilter.thoigian.isFilterTheoNgay} onChange={handleOnchangeChk} />}
                label="Lọc theo thời gian thanh toán" />
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
                  // defaultValue={dayjs(dateCurrent)}
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
              <InputLabel id="khachHang-multiple-checkbox-label">Khách hàng</InputLabel>
              <Select
                name='khachHang'
                labelId="khachHang-multiple-checkbox-label"
                id="khachHang-multiple-checkbox"
                multiple
                value={dataFilter.khachHang}
                onChange={handleChange}
                input={<OutlinedInput label="Khách hàng" />}
                renderValue={(selected) => renderValues(selected, 'ten_KH')}
                MenuProps={MenuProps}
                size='small'
              >
                {listKhachHang && listKhachHang.map((item) => (
                  <MenuItem key={item.ma_KH} value={item}>
                    <Checkbox checked={isCheckedDropdown(item, "khachHang")} />
                    <ListItemText primary={item.maHienThi_KH  ? (item.maHienThi_KH + " - " + item.ten_KH ) : item.ten_KH} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl sx={{ m: 1 }} size='small' fullWidth>
              <InputLabel id="tinhTrangDH-multiple-checkbox-label">Tình trạng đơn hàng</InputLabel>
              <Select
                name='tinhTrangDH'
                labelId="tinhTrangDH-multiple-checkbox-label"
                id="tinhTrangDH-multiple-checkbox"
                multiple
                value={dataFilter.tinhTrangDH}
                onChange={handleChange}
                input={<OutlinedInput label="Tình trạng đơn hàng" />}
                renderValue={(selected) => renderValues(selected, 'data')}
                MenuProps={MenuProps}
                size='small'
              >
                {props.tinhTrangDonHang.map((item) => (
                  <MenuItem key={item.no} value={item}>
                    <Checkbox checked={isCheckedDropdown(item, 'tinhTrangDH')} />
                    <ListItemText primary={item.data} />
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
  const { listOutlet, outlet } = state.appReducers.outlet;
  const { listThucDon, orderNewList, filterData } = state.appReducers.thucdon;
  const { httt, htttDefault, tinhTrangDonHang } = state.appReducers.mdata;
  const dataHttt = {
    httt, htttDefault
  };
  return {
    isLoggedIn,
    message,
    isReFetchData,
    userInfo: user,
    listOutlet: listOutlet,
    outlet: outlet,
    listThucDon: listThucDon,
    orderNewList: orderNewList,
    dataHttt,
    tinhTrangDonHang,
    filterData
  };
}

export default connect(mapStateToProps)(DialogFilterDonHang);