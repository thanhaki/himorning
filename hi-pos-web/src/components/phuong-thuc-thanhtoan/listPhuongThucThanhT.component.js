import React, { useState, useEffect } from 'react';
import {
    DialogContent, DialogActions, DialogContentText, Button, InputLabel, Grid,
    MenuItem, FormControl, Select, Box, Container, Typography, CssBaseline
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { showLoading, hideLoading, reFetchData, getAllHttt } from "../../actions/index";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDispatch } from 'react-redux';
import TableContainer from '@mui/material/TableContainer';
import { connect } from "react-redux";
import Switch from "@mui/material/Switch";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import htttService from '../../services/httt.service';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { showMessageByType } from '../../helpers/handle-errors';


const theme = createTheme();

function ListPhuongThucTT(props) {

    const [listHTTT, setlistHTTT] = useState([]);
    const [isReload, setIsReload] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        getAllHttt();
    }, [isReload])

    const getAllHttt = () => {
        dispatch(showLoading(true));
        htttService.getAllHttt().then((result) => {
            setlistHTTT(result.data);
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error);
        })
    }
    const handleSetDefault = () => {
        var params = {
            donVi: props.userInfo?.user?.donVi,
            tinhTrangHinhThucThanhToan: 1,
            listHinhTTT: listHTTT
        }
        setlistHTTT(['']);
        dispatch(showLoading(true));
        htttService.addHinhThucTT(params).then((result) => {
            dispatch(hideLoading());
            setIsReload(!isReload);
            showMessageByType(null, "success", TYPE_ERROR.success)
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "error", TYPE_ERROR.error);
        })
    }
    const handleChange = (event) => {
        var params = {
            soHinhThucThanhToan: event.target.value,
            tinhTrangHinhThucThanhToan: event.target.checked === true ? 1 : 0,
        }
        dispatch(showLoading(true));
        htttService.updateHinhThucTT(params).then((result) => {
            dispatch(hideLoading());
            getAllHttt();
			showMessageByType(null, "success", TYPE_ERROR.success)
        }).catch((error) => {
            dispatch(hideLoading());
			showMessageByType(error, "error", TYPE_ERROR.error);
        })
    };

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
                    PHƯƠNG THỨC THANH TOÁN
                </Typography>
                <Grid item xs={12} sm={1} textAlign={'right'}>
                    <Button
                        variant='outlined'
                        onClick={handleSetDefault}
                        disabled={listHTTT.filter(x=>x.soHinhThucThanhToan == 0 || x.soHinhThucThanhToan == null).length === 0}
                    >
                        Set Default
                    </Button>
                </Grid>
                <>
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tất cả phương thức thanh toán</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
							{listHTTT.filter(x => x.tinhTrang === 0).length > 0 ? (
							<Typography variant="subtitle1" style={{ fontWeight: "bold" }}>KHÔNG CÓ DỮ LIỆU ĐỂ HIỂN THỊ</Typography>
							) :
							(
                            <TableBody>
                                {listHTTT.map((row) => (
                                    <TableRow
                                        key={row.maHinhThucThanhToan}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.tenHinhThucThanhToan}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Switch
                                                defaultChecked={row.tinhTrangHinhThucThanhToan === 1 ? true : false}
                                                value={row.soHinhThucThanhToan}
                                                onChange={handleChange}
                                                disabled = {row.soHinhThucThanhToan === null}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
							)}
                        </Table>
                    </TableContainer>
                </>
            </Container>
        </ThemeProvider >
    );
}

function mapStateToProps(state) {
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { httt, htttDefault } = state.appReducers.mdata;
    const dataHttt = {
        httt, htttDefault
    };
    return {
        userInfo: user,
        isReFetchData: isReFetchData,
        dataHttt
    };
}

export default connect(mapStateToProps)(ListPhuongThucTT);