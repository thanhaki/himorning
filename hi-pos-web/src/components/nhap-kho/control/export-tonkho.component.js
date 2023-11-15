import React from 'react'
import { Button } from '@mui/material';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const ExportTonKho = ({csvData, fileName}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const Export = (csvData, fileName) => {
        var dataExport = []
        csvData.map((item) => {
            dataExport.push(item);
        });
        const ws = XLSX.utils.json_to_sheet(dataExport);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <Button variant='outlined' onClick={(e) => Export(csvData,fileName)}>Export</Button>
    )
}
