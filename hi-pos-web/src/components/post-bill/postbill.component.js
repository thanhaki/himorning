import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Typography, Box, Tab, Tabs, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import PostbillService from '../../services/postbill.service';
import { showLoading, hideLoading, setListThucDon, setListOutlet, setOrderNewList, setOrderedList, addMenuToOrder, updateMenuOrder, setTableCurrent} from "../../actions/index";
import ItemMatHang from './mathang.component';
import { formatMoney } from '../../helpers/utils';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import OrderDialog from './details.component';
import { calculatorAmountAfterChietKhau } from './calculator-money';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { useNavigate } from 'react-router-dom';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <Box sx={{ flexGrow: 1 }}
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    {children}
                </Box>
            )}
        </Box>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const PostBill = (props) => {
    const [value, setValue] = useState(0);
    const [listMatHang, setListMatHang] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleChange = (event, newValue) => {
        var currentMenu = props.listThucDon.find(x => x.id === newValue);
        if (currentMenu) {
            setListMatHang(currentMenu.listMatHang)
        }
        setValue(newValue);
    };

    const getAllOutletByDV = () => {
        dispatch(showLoading(true));
        dispatch(setListOutlet()).then((res) => {
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, props.message, TYPE_ERROR.error)
        });
    }

    const getData = () => {
        dispatch(showLoading(true));
        const donVi = props.userInfo?.user?.donVi;
        PostbillService.getMenuProduct(donVi).then((res) => {
            if (res && res.data && res.data.length > 0) {
                dispatch(setListThucDon(res.data));
                const idDefault = res.data[0].id;
                setValue(idDefault);
                var menuDefault = res.data.find(x => x.id === idDefault);
                if (menuDefault) {
                    setListMatHang(menuDefault.listMatHang)
                }
            }
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, "Lỗi load dữ liệu thực đơn", TYPE_ERROR.error)
        });
    }

    useEffect(() => {
        getData();
        if (props.listOutlet.length === 0) {
            getAllOutletByDV();
        }
    }, []);

    const handleChangeMH = (mh) => {
        if (props.orderNewList?.length === 0) {
            dispatch(addMenuToOrder(mh));
        } else {
            var item = props.orderNewList?.find(x => x.id === mh.id);
            if (item) {
                mh.chietKhau = undefined;
                dispatch(updateMenuOrder(mh));
            } else {
                dispatch(addMenuToOrder(mh));
            }
        }
    }
    const returnQuantity = () => {
        const initialValue = 0;
        if (props.orderNewList) {
            const sumWithInitial = props.orderNewList.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.soLuong
            },initialValue);
            return sumWithInitial;
        }
        return 0;
    }
    const returnAmount = () => {
        if (props.orderNewList) {
            const initialValue = 0;
            const sumWithInitial = props.orderNewList.reduce((accumulator, currentValue) => {
                return accumulator + calculatorAmountAfterChietKhau(currentValue)
            }, initialValue);
            return sumWithInitial;
        }
        return 0;
    }
    const handleNext = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleGotoMapTable = () => {
        navigate('/map-table');
        handleClose();
        dispatch(setTableCurrent({}));
        dispatch(setOrderNewList([]));
        dispatch(setOrderedList([]));
    }
    return (
        <Container component="main" maxWidth="true" >
            <CssBaseline />
            {props.listThucDon.length > 0 && <Box sx={{ mt: 2 }}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} textAlign="center">
                        <Typography component="h1" variant="h5">
                            {(props.outlet?.ten_Outlet && props.table?.tenBan) ? props.outlet.ten_Outlet + " - " + props.table.tenBan : ""}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <Box
                        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}
                    >
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            sx={{ borderRight: 1, borderColor: 'divider' }}
                        >
                            {props.listThucDon.map((item, index) => {
                                return <Tab style={{float: "left"}} key={index} sx={{ alignItems: 'start', pl: 0 }} value={item.id} label={item.ten_TD} {...a11yProps(index)} wrapped />
                            })}
                        </Tabs>

                        <TabPanel value={value} index={value}>
                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                <ItemMatHang
                                    listMatHang={listMatHang}
                                    handleChangeMH={handleChangeMH}
                                />
                            </Grid>
                        </TabPanel>
                    </Box>
                </Grid>
                <Grid item xs={4} sm={4}>
                    <Typography component="h1" variant="subtitle1" style={{fontWeight:800}}>
                        Thành Tiền: {formatMoney(returnAmount(), 'đ')}
                    </Typography>
                    <Typography component="h1" variant="subtitle1" style={{fontWeight:800}}>
                        Mặt hàng: {returnQuantity()}
                    </Typography>
                </Grid>
                <Grid item xs={8} sm={8}
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center">
                    <Button
                        variant="outlined"
                        color='warning'
                        sx={{ mr: 1 }}
                        startIcon={<NavigateBeforeIcon />}
                        onClick={handleGotoMapTable}
                        size="small">Đóng</Button>
                    <Button
                        variant="contained"
                        endIcon={<NavigateNextIcon />}
                        onClick={handleNext}
                        disabled={!props.orderNewList || props.orderNewList.length === 0}
                        size="small">Tiếp theo</Button>
                </Grid>
            </Grid>

            <OrderDialog
                open={open}
                handleClose={handleClose}
            />
        </Container>

    );
}
function mapStateToProps(state) {
    const { isLoggedIn } = state.appReducers.auth;
    const { message, isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { listOutlet, outlet } = state.appReducers.outlet;
    const { listThucDon, orderNewList } = state.appReducers.thucdon;
    const { table } = state.appReducers.setupTbl;

    return {
        isLoggedIn,
        message,
        isReFetchData,
        userInfo: user,
        listOutlet,
        outlet,
        listThucDon,
        orderNewList,
        table
    };
}

export default connect(mapStateToProps)(PostBill);