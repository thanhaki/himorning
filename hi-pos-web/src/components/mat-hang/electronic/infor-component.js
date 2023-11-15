import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Grid } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const InfoStoreElectronic = (props) => {
    const {inforDonVi} = props;
    return inforDonVi && (
        <Grid item xs={12} sm={12} sx={{p:'16px !important'}}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                        <TableRow>
                            <TableCell rowSpan={5} width={125}>
                                {inforDonVi.logoDonVi && <img src={inforDonVi.logoDonVi} width={125} />}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <b>{inforDonVi.tenCongTy} </b>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                Địa chỉ: {inforDonVi.diaChiDonVi}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                Điện thoại: {inforDonVi.phone}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                Email: {inforDonVi.email}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
};

function mapStateToProps(state) {
    return {
    };
}

export default connect(mapStateToProps)(InfoStoreElectronic);