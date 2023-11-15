import React, { useEffect, useState } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useDispatch, connect } from 'react-redux';
import { showLoading, hideLoading, setTablesList, setListOutlet, setOrderNewList, setOrderedList, setOutlet, setTableCurrent, setChietKhauBill, setLoaiDonHang, setSelectedCustomer, reFetchData } from "../../actions/index";
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';
import { Container, Typography, Box } from '@mui/material';
import Draggable from 'react-draggable';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import { useNavigate } from 'react-router-dom';
import OrderDialog from '../post-bill/details.component';
import moment from 'moment';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}
const MapTables = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState(0);

    const handleChange = (event, newValue) => {
        getTableByOutletId(newValue);
        let outlet = props.listOutlet.find(x => x.ma_Outlet === newValue);
        dispatch(setOutlet(outlet));
        setValue(newValue);
    };

    const getAllOutletByDV = () => {
        dispatch(showLoading(true));
        dispatch(setListOutlet()).then((res) => {
            dispatch(hideLoading());
        }).catch((error) => {
            showMessageByType(error, props.message, TYPE_ERROR.error)
            dispatch(hideLoading());
        });
    }

    const handleLoadTable = () => {
        if (props.listOutlet.length > 0) {
            if (Object.keys(props.outlet).length === 0) {
                getTableByOutletId(props.listOutlet[0].ma_Outlet);
                setValue(props.listOutlet[0].ma_Outlet);
                dispatch(setOutlet(props.listOutlet[0]));
            } else {
                setValue(props.outlet.ma_Outlet);
                getTableByOutletId(props.outlet.ma_Outlet);
                dispatch(setOutlet(props.outlet));
            }
        }
    }

    useEffect(() => {
        if (props.isReFetchData) {
            handleLoadTable();
            dispatch(reFetchData(false));
        }
    }, [props.isReFetchData])

    useEffect(() => {
        handleLoadTable();
    }, [props.listOutlet]);

    useEffect(() => {
        getAllOutletByDV();
        clearData();
    }, []);


    const clearData = () => {
        dispatch(setOrderNewList([]));
        dispatch(setOrderedList([]));
        dispatch(setChietKhauBill(null));
        // dispatch(setTableCurrent({}));
        dispatch(setLoaiDonHang(81));
        dispatch(setSelectedCustomer(null));
        dispatch(reFetchData(true));
        localStorage.removeItem("dataPrint");
    }
    const getTableByOutletId = (idOutlet) => {
        let data = {
            id: idOutlet
        };
        dispatch(setTablesList(data)).then((res) => {
        })
            .catch((error) => {
            });
    }

    const handlePostBill = (e, item) => {
        e.stopPropagation();
        dispatch(setOrderNewList([]));
        if (item.tinhTrangDonHang === 1) {
            goToDetailPage(item);
            setOpen(true);
        } else {
            if (item.tinhTrangDonHang === 0) {
                dispatch(setTableCurrent(item));
                navigate({
                    pathname: '/post-bill',
                    search: `outlet=${value}&table=${item.id}`,
                });
            }
        }
    }

    const goToDetailPage = (table) => {
        dispatch(setTableCurrent(table));
        setOpen(true);
    }
    const handleClose = () => {
        navigate('/post-bill');
        setOpen(false);
    };

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         // setTime(seconds => seconds + 1);
    //     }, 60000);

    //     return () => clearInterval(interval);
    // }, []);

    const getClassColorStatus = (table) => {
        var className = "box no-cursor"
        if (table.tinhTrangDonHang === 1) {
            className = className + " ban-co-khach";
        }
        return className;
    }
    return (
        <Container component="main" maxWidth="true" >
            <CssBaseline />
            <Box sx={{ mt: 2 }}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12}>
                        <Typography component="h1" variant="h5">
                            <b>{props.userInfo?.user?.tenDonVi}</b>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                    >
                        {
                            props.listOutlet.map((item, index) => {
                                return <Tab label={item.ten_Outlet} key={index} value={item.ma_Outlet} />
                            })
                        }
                    </Tabs>
                </Grid>
                <Grid item xs={12} sm={12}>

                    <TabPanel value={value} index={value}>
                        <div className="box" style={{ height: 'auto', width: '100%', position: 'relative', overflow: 'auto', padding: '0' }}>
                            <div style={{ height: '100%', width: '100%', borderRadius: '3px' }}>
                                {
                                    props.tableList.map((table, index) => {
                                        return (<Draggable
                                            position={{ x: table.x, y: table.y }}
                                            handle="strong"
                                            className="test"
                                            key={index}>
                                            <div className={getClassColorStatus(table)} onClick={(e) => handlePostBill(e, table)}>
                                                <span onClick={(e) => handlePostBill(e, table)}>
                                                    <div className={table.inTamTinh === 1 ? 'ban-in-tam' : ''}>{table.tenBan}</div>
                                                </span>

                                                <Box textAlign={'center'} fontSize={12}>
                                                    {table.tinhTrangDonHang === 0 && <>Trống</>}
                                                    {table.tinhTrangDonHang === 1 && <>{table.thoiGianSuDung + time + " Phút"}</>}
                                                </Box>
                                            </div>
                                        </Draggable>)
                                    })
                                }
                            </div>
                        </div>
                    </TabPanel>
                </Grid>
            </Grid>

            <OrderDialog
                open={open}
                thoiGianTamTinh={moment(new Date())}
                handleClose={handleClose}
            />
        </Container>
    );
}
function mapStateToProps(state) {
    const { isLoggedIn } = state.appReducers.auth;
    const { message } = state.appReducers.message;
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { outlet, listOutlet } = state.appReducers.outlet;
    const { tableList, table } = state.appReducers.setupTbl;
    return {
        isLoggedIn,
        message,
        isReFetchData,
        userInfo: user,
        outlet,
        listOutlet,
        tableList,
        table
    };
}
export default connect(mapStateToProps)(MapTables);