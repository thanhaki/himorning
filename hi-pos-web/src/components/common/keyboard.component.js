import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import InputMoney from './input-money.component';
import CloseIcon from '@mui/icons-material/Close';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

function createRow(n1, n2, n3, n4) {
    return { n1, n2, n3, n4 };
}

const rows = [
    createRow('1', '2', '3', '<='),
    createRow('4', '5', '6', 'C'),
    createRow('7', '8', '9', 'OK'),
    createRow('0', '000', ','),
];


const itemCell = (value, handleClick, handleCloseKeyboard) => {
    if (value) {
        return (<TableCell align='center' sx={{ padding: 0.5, border: "1px solid rgba(224, 224, 224, 1)" }}>
            <Button id={value} fullWidth onClick={handleClick}>{value}</Button>
        </TableCell>);
    } else {
        return (<TableCell align='center' sx={{ padding: 0.5, border: "1px solid rgba(224, 224, 224, 1)" }}>
            <Button id={value} fullWidth onClick={handleCloseKeyboard} color={'error'}><CloseIcon /></Button>
        </TableCell>);
    }
}


const GridKeyBoard = (props) => {
    const { handleReturnValue, icon, handleOK, handleClose, valueCurrent } = props;
    const [valueInput, setValueInput] = useState('0');
    
    useEffect(() => {
        setValueInput(valueCurrent);
    }, []);

    const handleClick = (event) => {
        let value = '';
        if (event.target.id === '<=') {
            value = (valueInput + '').slice(0, -1);

            if (value.length === 0) {
                value = '0';
            }

        } else if (event.target.id === 'C') {
            value = '0';
        } else if (event.target.id === 'OK') {
            if (handleOK) { handleOK() };
        } else {
            value = valueInput === '0' ? event.target.id : valueInput + event.target.id;
        }
        value = value.length === 0 ? '0' : value;

        const formattedValue = parseFloat(value.replace(/\D/g, '')).toLocaleString('vi');
        setValueInput(formattedValue);
        if (handleReturnValue) {
            handleReturnValue(formattedValue);
        }
    }

    const handleCloseKeyboard = () => {
        if (handleClose) { handleClose(); }
    }

    const handleChangeValueInput = (value) => {
        setValueInput(value);
        
        if (handleReturnValue) {
            const formattedValue = parseFloat(value.replace(/\D/g, '')).toLocaleString('vi');
            handleReturnValue(formattedValue);
        }
    }
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 350 }} aria-label="spanning table">
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={4} sx={{ padding: 0.5 }}>
<InputMoney
                                id="value"
                                value={valueInput}
                                onChange={handleChangeValueInput}
                                icon={icon}
                            />
                            {/* <TextField
                                id='value'
                                fullWidth
                                value={valueInput}
                                onChange={handleChangeValueInput}
                                variant="outlined"
                                size="small"
                                InputProps={{ endAdornment: <InputAdornment position="end">{icon ? icon : 'đ'}</InputAdornment> }}
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'right' }, }}
                            /> */}
                        </TableCell>
                    </TableRow>
                    {rows.map((row, index) => (
                        <TableRow key={index} sx={{ padding: 2 }}>
                            {itemCell(row.n1, handleClick)}
                            {itemCell(row.n2, handleClick)}
                            {itemCell(row.n3, handleClick)}
                            {itemCell(row.n4, handleClick, handleCloseKeyboard)}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default GridKeyBoard;