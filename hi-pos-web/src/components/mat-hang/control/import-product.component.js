import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import ProductService from '../../../services/product.service';
import { showMessageByType,TYPE_ERROR } from '../../../helpers/handle-errors';
import { Button, Grid } from '@mui/material';


class ReadExcel extends Component {
    state = {}
    constructor(props) {
        super(props);
        this.state = {
            file: {},
            data: [],
            cols: [],
            isEmpty: true,
        }
        this.handleFile = this.handleFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(e) {
        const files = e.target.files;
        if (files && files[0]) this.setState({ file: files[0] });
    };

    handleFile() {
        try {
            const reader = new FileReader();
            const rABS = !!reader.readAsBinaryString;

            reader.onload = (e) => {
                /* Parse data */
                const bstr = e.target.result;
                const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_json(ws);
                /* Update state */
                this.setState({ data: data, isEmpty: false });
                
                const formData = new FormData();
                
                formData.append("data", JSON.stringify(data));

                ProductService.importProduct(formData).then((res) => {
                    showMessageByType(null, "Import mặt hàng thành công", TYPE_ERROR.success);
                    this.props.handleLoadPageParent();
                }).catch((error) => {
                    showMessageByType(error, "error", TYPE_ERROR.error);
                })
            };

            if (rABS) {
                reader.readAsBinaryString(this.state.file);
            } else {
                reader.readAsArrayBuffer(this.state.file);
            };
        } catch (e) {
            console.log("Empty!");
        }
    }

    render() {
        return (
            <Grid>
                <input type="file" accept=".xlsx" onChange={this.handleChange} />
                <Button variant='outlined' onClick={this.handleFile}>Import</Button>
            </Grid>
        )
    }
}

export default ReadExcel;