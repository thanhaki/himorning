import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import { useDispatch, connect } from 'react-redux'
import { formatMoney } from '../../../helpers/utils';
import { Box, Container, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import InfoStoreElectronic from './infor-component';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { showLoading, hideLoading } from "../../../actions/index";
import MatHangGallery from './image-gallery.component';
import electronicService from '../../../services/electronic.service';

function ElectronicDetail(props) {
  let location = useLocation();
  const [matHang, setMatHang] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    var arrayData = location.pathname.split('/');
    if (arrayData.length === 4) {
      var dataMh = arrayData[3];
      var dataDV = arrayData[2];
      if (dataMh.split('-') && dataMh.split('-').length === 2) {
        var idMh = dataMh.split('-')[1];
        var idDV = dataDV.split('-')[1];
        if (isFinite(idMh)) {
          dispatch(showLoading(true));
          electronicService.GetMatHangByIdMatHang({
            Id: idMh,
            donVi: idDV
          }).then(res => {
            setMatHang(res.data);
            dispatch(hideLoading());
          }).catch(error => {
            console.log("error", error);
            dispatch(hideLoading());
          })
        }
      }
    }
  }, []);

  return (
    <Container component="main" maxWidth="true" style={{padding: 1}}>
      {
        matHang && <>

          <Grid container spacing={2}>
            {matHang && matHang.inforDonVi && <Grid item md={12}>
              <img src={matHang.inforDonVi.anhBiaPCDonVi} width={"100%"} />
            </Grid>}

            <Grid item xs={12} sm={12} textAlign={'center'}>
              {matHang && <Typography variant="h5" component="h3">
                <b>{matHang.ten_MH?.toUpperCase()}</b>
              </Typography>}
            </Grid>
            <Grid
              item xs={12} sm={6}
              sx={{
                p: '10px !important',
                border: '1px solid rgba(224, 224, 224, 1);',
              }}
            >
            {matHang &&
              <Grid item xs={12} sm={12} style={{maxHeight:600, overflowY:'auto', padding:20}}>
                <div className='content-ckeditor' dangerouslySetInnerHTML={{ __html: matHang.mieuTa_MH }}>
                </div>
              </Grid>
            }
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pt: '0 !important' }}>
              <Table>
                <TableRow className='border-row-table'>
                  <TableCell align="left" width={150}><b>Giá bán</b></TableCell>
                  <TableCell align="left">{matHang && formatMoney(matHang.gia_Ban)}</TableCell>
                </TableRow>
                <TableBody>
                  <TableRow className='border-row-table'>
                    <TableCell align="left" width={150}><b>Số lượng bán</b></TableCell>
                    <TableCell align="left">{matHang && matHang.soLuongDaBan}</TableCell>
                  </TableRow>
                  <TableRow className='border-row-table'>
                    <TableCell align="center" colSpan={2}> <b>Hình ảnh mẫu</b>
                    </TableCell>
                  </TableRow>
                  <TableRow className='border-row-table' >
                    {matHang && matHang.listImages && <TableCell colSpan={2}>
                      <MatHangGallery listImages={matHang.listImages.filter(x => x !== null)} galleryID="my-test-gallery" />
                    </TableCell>}
                  </TableRow>

                  {matHang && matHang.video_MH && <TableRow>
                    <TableCell align="center" colSpan={2} style={{padding:0}}>
                      <video width="100%" controls>
                        <source src={matHang.video_MH} type="video/mp4" />
                      </video>
                    </TableCell>
                  </TableRow>}
                </TableBody>
              </Table>
            </Grid>

          </Grid>
          <InfoStoreElectronic inforDonVi={matHang?.inforDonVi} />
        </>
      }
    </Container>
  );
}

ElectronicDetail.propTypes = {
  post: PropTypes.shape({
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageLabel: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};
function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ElectronicDetail);