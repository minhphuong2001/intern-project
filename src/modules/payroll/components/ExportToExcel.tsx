import React from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Button, Tooltip } from '@mui/material';

interface ExportToExcelProps {
    dataApi: any;
    fileName: string;
}

export const ExportToExcel = ({ dataApi, fileName }: ExportToExcelProps) => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const exportToCSV = (dataApi: any, fileName: string) => {
        const ws = XLSX.utils.json_to_sheet(dataApi);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    return (
        <Tooltip title='Export to excel file'>
            <Button
                size='small'
                variant='contained'
                onClick={() => exportToCSV(dataApi, fileName)}
                endIcon={<i className='bx bx-chevron-down'></i>}
            >
                Export CSV
            </Button>
        </Tooltip>
    );
};