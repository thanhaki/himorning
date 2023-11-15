import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import PrintPhongKhamPhamacity from './phong-kham-phamacity.component';
import PrintBillDialog from '../payment/print-bill.component';
const PrintTempate = (props) => {
    const data = localStorage.getItem("dataPrint");
    var dataParse = JSON.parse(data);

    const renderTemplate = () => {
        if (dataParse) {
            switch (dataParse.templateType) {
                case 9:
                    return <PrintPhongKhamPhamacity />
                default:
                    return <PrintBillDialog />
            }
        }
    }
    return <>
        {renderTemplate()}
    </>
}

function mapStateToProps(state) {
    const { isLoggedIn, user } = state.appReducers.auth;

    return {
        isLoggedIn,
    };
}

export default connect(mapStateToProps)(PrintTempate);