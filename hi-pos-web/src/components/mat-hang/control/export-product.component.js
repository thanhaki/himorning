import React from 'react'
import { Button } from '@mui/material';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const ExportProducts = ({csvData, fileName}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const Export = (csvData, fileName) => {
        var dataExport = []
        var select = csvData.map((item) => ({
            ten_MH: item.ten_MH,
            loai_MH: item.id_LoaiMH,
            ma_DanhMuc: item.ma_DanhMuc,
            ma_DonVi: item.ma_DonVi,
            gia_Ban: item.gia_Ban,
            gia_Von: item.gia_Von,
            isNhapGiaBan: item.isNhapGiaBan === false ? 0 : 1,
            mota_MH: item.mota_MH,
            soLuongTonKho: item.soLuongTonKho,
            qRCode: item.qrCode,
            tonKhoMin: item.tonKhoMin,
        }));

        select.map((item) => {
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
