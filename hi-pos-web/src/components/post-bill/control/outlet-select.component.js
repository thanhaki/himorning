import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { showLoading, hideLoading, setTablesList, setListOutlet, setOutlet } from "../../../actions/index";
import { showMessageByType, TYPE_ERROR } from '../../../helpers/handle-errors';

const SelectOutlet = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        getAllOutletByDV();
    }, []);

    useEffect(() => {
        if (!props.outlet || Object.keys(props.outlet).length === 0 || props.outlet.ma_Outlet === 0) {
            const outlet = props.listOutlet[0];
            dispatch(setOutlet(outlet));
            getTableByOutletId(outlet?.ma_Outlet)
        } else {
            getTableByOutletId(props.outlet?.ma_Outlet)
        }
    }, [props.listOutlet]);

    const getAllOutletByDV = () => {
        dispatch(showLoading(true));
        dispatch(setListOutlet()).then((res) => {
            dispatch(hideLoading());
        }).catch((error) => {
            dispatch(hideLoading());
            showMessageByType(error, props.message, TYPE_ERROR.error)
        });
    }

    const handleChange = (e) => {
        const outlet = props.listOutlet.find(x=>x.ma_Outlet === e.target.value);
        dispatch(setOutlet(outlet));
        getTableByOutletId(e.target.value)
    };

    const getTableByOutletId = (idOutlet) => {
        let data = {
            id: idOutlet,
        };

        dispatch(setTablesList(data)).then((res) => {
        })
        .catch((error) => {
        });
    }
    return (
        <FormControl sx={{ m: 1 }} size="small" fullWidth>
            <InputLabel id="demo-select-small">Khu vực</InputLabel>
            {
                props.outlet?.ma_Outlet &&
                <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={props.outlet?.ma_Outlet}
                    label="Khu vực"
                    name='ma_Outlet'
                    fullWidth
                    onChange={handleChange}
                >
                    {props.listOutlet.map((item, index) => {
                        return <MenuItem key={index} value={item.ma_Outlet}>{item.ten_Outlet}</MenuItem>
                    })}
                </Select>
            }

        </FormControl>
    );
}
function mapStateToProps(state) {
    const { isLoggedIn } = state.appReducers.auth;
    const { message } = state.appReducers.message;
    const { isReFetchData } = state.appReducers.message;
    const { user } = state.appReducers.auth;
    const { listOutlet, outlet } = state.appReducers.outlet;
    const { listThucDon, orderNewList } = state.appReducers.thucdon;
    return {
        isLoggedIn,
        message,
        isReFetchData,
        userInfo: user,
        listOutlet: listOutlet,
        outlet: outlet,
        listThucDon: listThucDon,
        orderNewList: orderNewList
    };
}

export default connect(mapStateToProps)(SelectOutlet);