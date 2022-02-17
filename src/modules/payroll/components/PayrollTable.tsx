import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import {Button, IconButton, Pagination, Typography } from '@mui/material';
import { Box } from '@mui/system';
import formatMoney from '../utils/common';
import { CustomDialog } from './CustomDialog';
import { LoadingButton } from '@mui/lab';

interface TableData {
    status: string;
    date: string;
    client: string;
    currency: string;
    total: number;
    invoice: string;
}

function createData(
    status: string,
    date: string,
    client: string,
    currency: string,
    total: number,
    invoice: string
): TableData {
  return { status, date, client, currency, total, invoice};
}

const rows = [
  createData('pending', moment().format('MMMM Do YYYY'), 'Marry Clans', 'usd', 2300, 'abcadhfhfd'),
  createData('fullfiled', moment().format('MMMM Do YYYY'), 'Marry Clans', 'usd', 2100, 'abcadhfhfd'),
  createData('processing', moment().format('MMMM Do YYYY'), 'Marry Clans', 'usd', 2500, 'abcadhfhfd'),
];    
          
export default function PayrollTable() {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showDeleteItem, setShowDeleteItem] = useState(false);
    const [data, setData] = useState([...rows]);

    const hanldeCloseDialog = () => {
        setShowAddDialog(false);
    }

    const hanldeCloseDelete = () => {
        setShowDeleteItem(false);
    }

    const hanldeSortByTotal = () => {
        const newData = data.sort((a, b) => b.total - a.total);
        setData(newData);
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell align='left' sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell align='left' sx={{ fontWeight: 600 }}>Client</TableCell>
                        <TableCell align='left' sx={{ fontWeight: 600 }}>Currency</TableCell>
                        <TableCell align='left' sx={{ fontWeight: 600, cursor: 'pointer' }} onClick={hanldeSortByTotal}>Total</TableCell>
                        <TableCell align='left' sx={{ fontWeight: 600 }}>Invoice #</TableCell>
                        <TableCell align='right' sx={{width: '200px', fontWeight: 600 }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index: number) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell
                                component="th"
                                scope="row"
                                sx={{
                                    color: `${row.status === 'pending' ? '#000' : `${row.status === 'processing' ? '#ff7675' : '#74b9f6'}`}`
                                }}
                            >
                                {row.status}
                            </TableCell>
                            <TableCell align='left'>{row.date}</TableCell>
                            <TableCell align='left'>{row.client}</TableCell>
                            <TableCell align='left' sx={{ textTransform: 'uppercase' }}>{row.currency}</TableCell>
                            <TableCell align='left'>{formatMoney.format(row.total)}</TableCell>
                            <TableCell align='left'>{row.invoice}</TableCell>
                            <TableCell align='right' sx={{ display: 'flex', alignItems: 'center'}}>
                                <IconButton color='error' onClick={() => setShowDeleteItem(true)}><i className='bx bx-trash'></i></IconButton>
                                <Button
                                    color='primary'
                                    variant='outlined'
                                    size='small'
                                    sx={{ borderRadius: '10px', marginRight: '10px' }}
                                    onClick={() => setShowAddDialog(true)}
                                >
                                    View Details</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 16px'
            }}>
                <Typography>Show...</Typography>
                <Pagination count={10} color="primary" />
            </Box>
            {/* show dialog when user wants to update */}
            <CustomDialog
                open={showAddDialog}
                title='Update Payroll'
                content={
                    <Box width='400px'>
                        <Typography>this is content</Typography>
                    </Box>
                }
                actions={
                    <Box width='100%' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <LoadingButton
                            variant='contained'
                            sx={{ marginRight: '1rem' }}
                        >
                            update
                        </LoadingButton>
                        <Button
                            variant='outlined'
                            onClick={hanldeCloseDialog}
                        >
                            cancel
                        </Button>
                    </Box>
                }
            />
            {/* show dialog when user wants to delete? */}
            <CustomDialog
                open={showDeleteItem}
                title='Do you sure want to delete?'
                actions={
                    <Box width='100%' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant='contained'
                            sx={{ marginRight: '1rem' }}
                        >
                            update
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={hanldeCloseDelete}
                        >
                            cancel
                        </Button>
                    </Box>
                }
            />
        </TableContainer>
    );
}
