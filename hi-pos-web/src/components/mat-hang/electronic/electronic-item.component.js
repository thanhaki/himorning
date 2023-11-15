import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { formatMoney, removeVietnameseTones } from '../../../helpers/utils';
import Link from '@mui/material/Link';
import { useDispatch, connect } from 'react-redux'

function ElectronicItem(props) {
  const { matHang, inforDonVi } = props;
  return inforDonVi && (
    <Grid item xs={12} md={2}>
      <Card sx={{ display: 'flex' }}>
        <CardContent sx={{ flex: 1 }}>
        <Link href={`/${removeVietnameseTones(inforDonVi.tenCongTy, '-')}/dv-${inforDonVi.donVi}/mh-${matHang.ma_MH}`} underline="none" target='_blank'>
          {matHang.hinhAnh_MH01 && <CardMedia
            component="img"
            sx={{ display: { sm: 'block', height: 120, borderRadius: 10 } }}
            image={matHang.hinhAnh_MH01}
            alt={matHang.imageLabel}
          />}
          <Typography style={{paddingTop:10}}>
            {matHang.ten_MH}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {formatMoney(matHang.gia_Ban)}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Số lượng đã bán {matHang.soLuongDaBan}
          </Typography>
          </Link>
        </CardContent>
      </Card>
    </Grid>
  );
}

ElectronicItem.propTypes = {
  post: PropTypes.shape({
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageLabel: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(ElectronicItem);