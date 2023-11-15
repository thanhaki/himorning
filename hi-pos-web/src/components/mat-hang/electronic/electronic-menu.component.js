import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux'
import { Container, Grid } from '@mui/material';
import electronicService from '../../../services/electronic.service';
import { showMessageByType, TYPE_ERROR } from '../../../helpers/handle-errors';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import InfoStoreElectronic from './infor-component';
import { useLocation } from 'react-router-dom';
import { showLoading, hideLoading } from '../../../actions';
import PaginatedItems from './paginated-items-component';

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
            {value === index &&
                <>{children}</>
            }
        </div>
    );
}

const ElectronicMenu = (props) => {
    let location = useLocation();

    const dispatch = useDispatch();
    const [dataThucDon, setDataThucDon] = useState([]);
    const [value, setValue] = React.useState(0);
    const [inforDonVi, setInforDonVi] = useState({});
    const [page, setPage] = React.useState(1);
    const [itemOffset, setItemOffset] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        var arrayData = location.pathname.split('/');
        if (arrayData.length === 3) {
            let dv = arrayData[2];
            if (isFinite(dv)) {
                dispatch(showLoading(true));
                electronicService.getAllThucDonMatHang(dv).then(res => {
                    if (res.data) {
                        const { inforDonVi, listThucDons } = res.data;
                        if (listThucDons && listThucDons.length > 0) {
                            setValue(listThucDons[0].ma_TD);
                            setDataThucDon(listThucDons);
                        }
                        setInforDonVi(inforDonVi);
                    }
                    dispatch(hideLoading());
                }).catch(error => {
                    dispatch(hideLoading());
                    showMessageByType(error, "Lấy thông tin mặt hàng thất bại", TYPE_ERROR.error);
                })
            }
        }
    }, []);

    const findListMH = (idThucDon) => {
        var data = dataThucDon.find(x => x.ma_TD === idThucDon);
        if (data) {
            return data.listMH
        }
        return null;
    }
    return (
        <Container component="main" maxWidth="true" style={{padding: 1}}>
            {dataThucDon && <>

                <Grid container spacing={2}>
                    {inforDonVi && <Grid item md={12}>
                        <img src={inforDonVi.anhBiaPCDonVi} width={"100%"} />
                    </Grid>}
                    <Grid item xs={12} sm={12}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                        >
                            {
                                dataThucDon.map((item, index) => {
                                    return <Tab label={item.ten_TD} key={index} value={item.ma_TD} />
                                })
                            }
                        </Tabs>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <TabPanel value={value} index={value}>
                            <Grid container spacing={2}>
                                <PaginatedItems items={findListMH(value)} inforDonVi={inforDonVi} />
                            </Grid>
                        </TabPanel>
                    </Grid>
                    <InfoStoreElectronic inforDonVi={inforDonVi} />
                </Grid>
            </>}
        </Container>
    );
};

function mapStateToProps(state) {
    return {
    };
}

export default connect(mapStateToProps)(ElectronicMenu);