import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { setOrderNewList, setTableCurrent } from '../../../actions';
const ListTable = (props) => {

    const {table, tableList} = props;
    const dispatch = useDispatch();

    const handleChange = (event) => {
        var tbl = tableList.find(x=>x.id === parseInt(event.target.value));
        if (tbl) {
            dispatch(setOrderNewList([]));
            dispatch(setTableCurrent(tbl));
        }
    };

    useEffect(() => {
        if (Object.keys(table).length === 0) {
            if (tableList && tableList.length > 0)
            dispatch(setTableCurrent(tableList[0]));
        }
    }, [tableList]);

    return (
        <FormControl sx={{ m: 1}} size="small" fullWidth>
            <InputLabel id="demo-select-small">Vị trí</InputLabel>
            {table.id && <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={table.id}
                label="Vị trí"
                fullWidth
                onChange={handleChange}
            >
                {tableList.map((item, index) => {
                    return <MenuItem key={index} value={item.id}>Vị trí {item.tenBan}</MenuItem>
                })}
                
            </Select>}
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
    const { tableList, table } = state.appReducers.setupTbl;
    return {
        isLoggedIn,
        message,
        isReFetchData,
        userInfo: user,
        listOutlet: listOutlet,
        outlet: outlet,
        listThucDon: listThucDon,
        orderNewList: orderNewList,
        tableList,
        table: table ? table : []
    };
}

export default connect(mapStateToProps)(ListTable);