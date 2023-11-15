import * as React from 'react';
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, connect } from 'react-redux';

function Row(props) {
    const { row, listCollapse } = props;
    const [open, setOpen] = React.useState(false);
    const [openb, setOpenb] = React.useState(false);
    const [settings, setSettings] = React.useState(listCollapse);
    const testfunc = (e, ma_MH) => {
        e.stopPropagation();

        setSettings(
            settings.map(item => 
                item.id === ma_MH ? { ...item, open: !item.open } : item
        ))
        setOpenb(!openb)
    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell style={{ padding: 4, width: "30%" }} colSpan={2} align='left'>
                    <b>{row.ten_DanhMuc}</b>
                </TableCell>
                <TableCell style={{ padding: 0, width: "30%" }}><b>{row.totalDM}</b></TableCell>
                <TableCell style={{ padding: 4, width: "39%" }}></TableCell>
                <TableCell style={{ padding: 4, width: "1%" }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <RemoveIcon /> : <AddIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ padding: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Table size="small" aria-label="purchases">
                            <TableBody>
                                {row.matHangDatas.map((historyRow, index) => (
                                    <>
                                        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                            <TableCell style={{ padding: 4, width: "1%" }} align='center'>{historyRow.stt}</TableCell>
                                            <TableCell style={{ padding: 4, width: "30%" }} align='left'>
                                                {historyRow.ten_MH}
                                            </TableCell>
                                            <TableCell style={{ padding: 0, width: "30%" }}>{historyRow.totalMh}</TableCell>
                                            <TableCell style={{ padding: 4, width: "39%" }}></TableCell>
                                            <TableCell style={{ padding: 4 }}>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={(e) => testfunc(e, historyRow.ma_MH)}
                                                >
                                                    {settings && settings.length > 0 && settings.find(item => item.id === historyRow.ma_MH).open ? <RemoveIcon /> : <AddIcon />}
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ padding: 0 }} colSpan={6}>
                                                <Collapse in={settings && settings.length > 0 && settings.find(item => item.id === historyRow.ma_MH).open} timeout="auto" key={historyRow.ma_MH}>
                                                    <Table size="small" aria-label="purchases">
                                                        <TableBody>
                                                            {historyRow.itemMhs.map((item) => (
                                                                historyRow.ma_MH === item.ma_MH &&
                                                                <TableRow key={item.ma_MH}>
                                                                    <TableCell style={{ padding: 4, width: "1%" }}></TableCell>
                                                                    <TableCell style={{ padding: 4, width: "30%" }}>{item.maDonHang}</TableCell>
                                                                    <TableCell style={{ padding: 0, width: "30%" }} > {item.soLuong_MH}</TableCell>
                                                                    <TableCell style={{ padding: 4, width: "39%" }}>{item.ghiChu}</TableCell>
                                                                    <TableCell style={{ padding: 4 }}>
                                                                        <IconButton
                                                                            sx={{ visibility: 'hidden' }}
                                                                            aria-label="expand row"
                                                                            size="small"
                                                                            onClick={() => setOpen(!open)}
                                                                        >
                                                                            <KeyboardArrowUpIcon />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        calories: PropTypes.number.isRequired,
        carbs: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        history: PropTypes.arrayOf(
            PropTypes.shape({
                amount: PropTypes.number.isRequired,
                customerId: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }),
        ).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        protein: PropTypes.number.isRequired,
    }).isRequired,
};

const CollapsibleTable = (props) => {
    const sumTotal = () => {
        if (props.dataDetail) {
            const initialValue = 0;
            const sumWithInitial = props.dataDetail.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.totalDM
            }, initialValue);
            return sumWithInitial;
        }
    }

    const getListIdCollapse = () => {
        var ids = [];
        if (props.dataDetail) {
            props.dataDetail.map(item => {
                if (item && item.matHangDatas) {
                    item.matHangDatas.map(item => {
                        ids.push({
                            id: item.ma_MH,
                            open: false
                        });
                    });
                }
            })
        }
        return ids;
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell width={'1%'} style={{ padding: 4 }}>STT</TableCell>
                        <TableCell style={{ padding: 4 }}>Mặt hàng</TableCell>
                        <TableCell style={{ padding: 0 }}>Số lượng hủy</TableCell>
                        <TableCell style={{ padding: 4 }}>Lý do hủy</TableCell>
                        <TableCell style={{ padding: 4 }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.dataDetail.map((row) => (
                        <Row key={row.ten_DanhMuc} row={row} listCollapse={getListIdCollapse()}/>
                    ))}
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2} className='txt-footer' align='center' style={{ padding: 4 }}><b>TỔNG CỘNG</b></TableCell>
                        <TableCell className='txt-footer' style={{ padding: 0 }}><b>{sumTotal()}</b></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}
function mapStateToProps(state) {
    const { isReFetchData } = state.appReducers.message;
  
    return {
      isReFetchData,
    };
  }
  
  export default connect(mapStateToProps)(CollapsibleTable);