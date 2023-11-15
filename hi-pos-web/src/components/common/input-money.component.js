

import React, { useState, useEffect, useRef } from 'react';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

const InputMoney = (props) => {
    const { id, value, onChange, icon,styleClass, disabled } = props;
    const handleChange = (event) => {
        const input = event.target.value.trim() === "" ? "0" : event.target.value;
        const formattedValue = parseFloat(input.replace(/\D/g, '')).toLocaleString('vi');
        if (onChange) {
            onChange(formattedValue);
        }
    }
    return (
        <TextField
            id={id}
            fullWidth
            disabled={disabled}
            value={value}
            onChange={handleChange}
            variant="outlined"
            size="small"
            className={styleClass}
            InputProps={{ endAdornment: <InputAdornment position="end">{icon ? icon : 'đ'}</InputAdornment> }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'right' }, }}
        />
    )
}

export default InputMoney;