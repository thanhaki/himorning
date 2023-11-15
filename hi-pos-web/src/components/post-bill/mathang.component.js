import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useDispatch, connect } from 'react-redux';
import { formatMoney } from '../../helpers/utils';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Grid from '@mui/material/Grid';
import { GIA_TRI_CHIET_KHAU } from '../../consts/constsCommon';
import InputPriceToSell from './control/input-price.component';
import { useState } from 'react';
const ItemMatHang = (props) => {
    const { listMatHang, handleChangeMH } = props;
    const [open, setOpen] = useState(false);
    const [matHang, setMatHang] = useState({});
    const addToCart = (mh) => {
        var item = props.orderNewList?.find(x => x.id === mh.id);
        if (mh && mh.isNhapGiaBan && !item) {
            setMatHang(mh);
            setOpen(true);
        } else {
            if (handleChangeMH) {
                mh.soLuong = 1;
                mh.ghiChu = '';
                mh.chietKhau = {
                    loaiCk: GIA_TRI_CHIET_KHAU.PHAN_TRAM,
                    valueCk: '0'
                };
                handleChangeMH(mh);
            }
        }
    }
    
    const handleCallbackFunc = (mh) => {
        if (handleChangeMH) {
            mh.chietKhau = {
                loaiCk: GIA_TRI_CHIET_KHAU.PHAN_TRAM,
                valueCk: '0'
            };
            handleChangeMH(mh);
        }
    }

    const handleClose = () => {
        setOpen(false);
    }
    const render = () => {
        var items = listMatHang.map((mathang, index) => (
            <Grid item xs={2} sm={4} md={2} key={index}>
                <Card>
                    <CardActionArea onClick={() => addToCart(mathang)}>
                        <CardMedia sx={{ textAlign: "center" }} style={{widthMin: 50}}>
                            <img src={mathang.hinhAnh_MH} width={"50px"} height={"50px"} style={{ borderBottomLeftRadius: 10,
                             borderBottomRightRadius: 10,  borderTopRightRadius: 10,  borderTopLeftRadius: 10,  overflow: 'hidden',}} />
                        </CardMedia>

                        <CardContent sx={{ padding: "0px 5px 0 5px", minHeight: 80 }}>
                            <Typography gutterBottom variant="subtitle1" component="div">
                                {mathang.ten_MH}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {formatMoney(mathang.gia_Ban)}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions sx={{ justifyContent: "center" }}>
                        <Button variant="contained" onClick={() => addToCart(mathang)} size="small" color="primary">
                            <AddShoppingCartIcon />
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            
        ));
        return items;
    }
    return (
        <>
            {render()}
            {<InputPriceToSell 
                open={open}
                matHang={matHang}
                handleClose={handleClose}
                handleCallbackFunc={handleCallbackFunc}
            />}
        </>
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
        listOutlet,
        outlet,
        listThucDon,
        orderNewList
    };
}

export default connect(mapStateToProps)(ItemMatHang);