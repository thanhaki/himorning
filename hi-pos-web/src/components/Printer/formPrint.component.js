import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { Grid, Typography } from '@mui/material';
import DonviService from '../../services/donvi.service';
import { showMessageByType } from '../../helpers/handle-errors';
import { TYPE_ERROR } from '../../helpers/handle-errors';

const cssContentPreview = {
    p: 2,
    border: '1px dashed grey',
    backgroundColor: 'white',
    margin: 20,
    padding: 10,
}

const cssTitle = {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
};

const cssTitleRight = {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
};

const cssTitleLeft = {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
};

const cssLableHeader = {
    fontSize: 13,
    textAlign: 'center',
};

const cssLableHearderColumn = {
    fontSize: 13,
    fontWeight: 'bold',
};

const cssLableHearderColumnRight = {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'right',
};

const cssLableColumn = {
    fontSize: 13,
};

const cssLableColumnRight = {
    fontSize: 13,
    textAlign: 'right',
};

const cssLableSubColumn = {
    align: 'left',
    fontSize: 11,
    fontStyle: 'italic',
    paddingLeft: 2,
};

const cssLine = {
    borderBottom: '1px dashed grey',
}

const FormPrint = (props) => {
    const [donvi, setDonVi] = useState({});
    const [address, setAddress] = useState();
    useEffect(() => {
        let donVi = props.userInfo?.user?.donVi;
        DonviService.getDonViById(donVi).then((res) => {
            setDonVi(res.data);
            setAddress(props.editAddress ? props.addressNew : donvi.diaChiDonVi);
        }).catch((error) => {
            showMessageByType(error, "error", TYPE_ERROR.error)
        })
    }, [props.editAddress]);


    return (
        <Grid xs={12} container
            sx={{
                backgroundColor: 'gray',
                borderRadius: 1,
                margin: 3,
            }}>
            <Grid xs={2} container>

            </Grid>
            <Grid xs={8} container>
                <Grid item xs={12} sm={12} container
                    style={cssContentPreview}>
                    <Grid item xs={12} sm={12}>
                        <Typography xs={12} component={'h2'} variant="subtitle1" style={cssTitle}>
                            {donvi.tenDonVi}
                        </Typography>

                        <Typography xs={12} component={'h1'}
                            style={cssLableHeader}>
                            {/* {donvi.diaChiDonVi} */}
                            {address}
                        </Typography>

                        <Typography xs={12} component={'h1'}
                            style={cssLableHeader}>
                            Điện thoại: {donvi.dienThoaiDonVi}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <Typography xs={12} component={'h2'} variant="subtitle1"
                            sx={{
                                borderBottom: '1px dashed grey',
                            }}
                            style={cssTitle}
                        >
                            HÓA ĐƠN TÍNH TIỀN
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={12} container>
                        <Grid item xs={6} sm={6}>
                            <Typography component={'h2'} variant="subtitle1"
                                style={cssLableHearderColumn}>
                                Tại vị trí:
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                            <Typography component={'h2'} variant="subtitle1"
                                style={cssLableHearderColumnRight}>
                                Sảnh trước B7
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} container style={cssLine}>
                        <Grid item xs={7} sm={7}>
                            <Typography component={'h2'} variant="subtitle1"
                                style={cssLableColumn}>
                                Giờ vào: 20:59:00 31/03/2023
                            </Typography>
                        </Grid>
                        <Grid item xs={5} sm={5}>
                            <Typography component={'h2'} variant="subtitle1"
                                style={cssLableColumnRight}>
                                Giờ in: 22:05:00
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} container style={cssLine}>
                        <Grid item xs={6} sm={6}>
                            <Typography component={'h2'} variant="subtitle1"
                                style={cssLableColumn}>
                                Khách hàng:
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                            <Typography component={'h2'} variant="subtitle1"
                                style={cssLableColumnRight}>
                                Vũ Mạnh Toàn
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} container>
                        <Grid item xs={7} sm={7}>
                            <Typography component={'h2'} variant="subtitle1"
                                style={cssLableHearderColumn}>
                                Mặt hàng
                            </Typography>
                        </Grid>
                        <Grid item xs={2} sm={2}>
                            <Typography component={'h2'} variant="subtitle1"
                                sx={{
                                    textAlign: 'center',
                                }}
                                style={cssLableHearderColumn}>
                                SL
                            </Typography>
                        </Grid>
                        <Grid item xs={3} sm={3}>
                            <Typography component={'h2'} variant="subtitle1"
                                sx={{
                                    textAlign: 'right',
                                }}
                                style={cssLableHearderColumn}>
                                Thành tiền
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} container
                        style={cssLine}>
                        <Grid item xs={12} sm={12} container>
                            <Grid item xs={7} sm={7}>
                                <Typography component={'h2'} variant="subtitle1"
                                    style={cssLableColumn}>
                                    Trà sữa O Long (size L)
                                </Typography>
                            </Grid>
                            <Grid item xs={2} sm={2}>
                                <Typography component={'h2'} variant="subtitle1"
                                    sx={{
                                        textAlign: 'center',
                                    }}
                                    style={cssLableColumn}>
                                    1
                                </Typography>
                            </Grid>
                            <Grid item xs={3} sm={3}>
                                <Typography component={'h2'} variant="subtitle1"
                                    sx={{
                                        textAlign: 'right',
                                    }}
                                    style={cssLableColumn}>
                                    65,000
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={12} container>
                                <Grid item xs={12} sm={12}>
                                    <Typography component={'h2'} variant="subtitle1"
                                        style={cssLableSubColumn}>
                                        Ghi chú: ít đá, không lấy ống hút
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>



                        <Grid item xs={12} sm={12} container>
                            <Grid item xs={7} sm={7}>
                                <Typography component={'h2'} variant="subtitle1"
                                    style={cssLableColumn}>
                                    Cơm gà chua ngọt
                                </Typography>
                            </Grid>
                            <Grid item xs={2} sm={2}>
                                <Typography component={'h2'} variant="subtitle1"
                                    sx={{
                                        textAlign: 'center',
                                    }}
                                    style={cssLableColumn}>
                                    1
                                </Typography>
                            </Grid>
                            <Grid item xs={3} sm={3}>
                                <Typography component={'h2'} variant="subtitle1"
                                    sx={{
                                        textAlign: 'right',
                                    }}
                                    style={cssLableColumn}>
                                    60,000
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} container>
                                <Grid item xs={12} sm={12}>
                                    <Typography component={'h2'} variant="subtitle1"
                                        style={cssLableSubColumn}>
                                        Ghi chú: không cay, cơm nhiều.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} container>
                        <Grid item xs={8} sm={8}>
                            <Typography component={'h2'} variant="subtitle1"
                                style={cssLableHearderColumn}>
                                Tiền hàng:
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <Typography component={'h2'} variant="subtitle1"
                                style={cssLableHearderColumnRight}>
                                125,000
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} container
                        style={cssLine}>
                        <Grid item xs={8} sm={8}>
                            <Typography component={'h2'} variant="subtitle1"
                                style={cssLableHearderColumn}>
                                Tiền giảm giá (10%):
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <Typography component={'h2'} variant="subtitle1"
                                style={cssLableHearderColumnRight}>
                                - 12,500
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} container
                        sx={{
                            borderBottom: '1px double grey',
                            paddingTop: 3,
                            paddingBottom: 3,
                        }}
                    >
                        <Grid item xs={8} sm={8}>
                            <Typography component={'h2'} variant="subtitle1"
                                style={cssTitleLeft}>
                                Thành tiền:
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <Typography component={'h2'} variant="subtitle1"
                                style={cssTitleRight}>
                                112,500
                            </Typography>
                        </Grid>
                    </Grid>

                    {
                        props.isShowFooter && <Grid item xs={12} sm={12} container>
                            <Grid item xs={12} sm={12}>
                                <Typography id='labInfoFooter' component={'h2'} variant="subtitle1"
                                    sx={{
                                        textAlign: 'center',
                                    }}
                                    style={cssLableColumn}>
                                    {props.infoFooterParent}
                                </Typography>
                            </Grid>
                        </Grid>
                    }

                    <Grid item xs={12} sm={12} container>
                        <Grid item xs={12} sm={12}>
                            <Typography component={'h2'} variant="subtitle1"
                                sx={{
                                    textAlign: 'center',
                                }}
                                style={cssLableColumn}>
                                POS - Một sản phẩm của himon.vn
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid xs={2} container>

            </Grid>
        </Grid>
    )
}


function mapStateToProps(state) {
    const { message } = state.appReducers;
    const { user } = state.appReducers.auth;
    const { isShowFooter } = state.appReducers.printer;
    // const { isEditAddress } = state.appReducers.printer;
    return {
        message,
        userInfo: user,
        isShowFooter,
        // isEditAddress
    };
}
export default connect(mapStateToProps)(FormPrint);