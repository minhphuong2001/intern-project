import React, { useEffect, useState } from 'react';
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
import { numberFormat } from '../utils/common';
import { CustomDialog } from './CustomDialog';
import { LoadingButton } from '@mui/lab';
import { IPayrollData } from '../../../models/payroll';

interface PayrollTableProps {
    payrolls: IPayrollData[];
}

export default function PayrollTable({ payrolls }: PayrollTableProps) {
    
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showDeleteItem, setShowDeleteItem] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const limit = 10;
    const initialShow = payrolls.slice(0, limit);
    const [limitData, setLimitData] = useState(initialShow);

    useEffect(() => {
        const totalPages = Math.ceil(payrolls.length / 10);
        setTotalPage(totalPages);
    }, [payrolls]);
    
    const hanldeCloseDialog = () => {
        setShowAddDialog(false);
    }

    const hanldeCloseDelete = () => {
        setShowDeleteItem(false);
    }
    
    const handleChangePage = (e: any, value: any) => {
        const start = limit * page;
        let end = start + limit;
        if (end >= payrolls.length) {
            end = payrolls.length;
        }
        setPage(value);
        setLimitData(payrolls.slice(start, end));
        console.log({start, end});
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
                        <TableCell align='left' sx={{ fontWeight: 600, cursor: 'pointer' }}>Total</TableCell>
                        <TableCell align='left' sx={{ fontWeight: 600, width: '100px' }}>Invoice #</TableCell>
                        <TableCell align='right' sx={{width: '250px', fontWeight: 600 }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {limitData.slice(0, limit).map((item, index: number) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell
                                component="th"
                                scope="row"
                                // sx={{
                                //     color: `${item.status === 'pending' ? '#000' : `${item.status === 'processing' ? '#ff7675' : '#74b9f6'}`}`
                                // }}
                            >
                                {/* {item.status} */}
                                {index%2 === 0 ? 'fullfied' : 'pending'}
                            </TableCell>
                            <TableCell align='left'>{moment(item.time_created).format('Do MMMM YYYY')}</TableCell>
                            <TableCell align='left'>{index%2 === 0 ? 'deng lun' : 'xiao zhan'}</TableCell>
                            <TableCell align='left' sx={{ textTransform: 'uppercase' }}>{item.currency}</TableCell>
                            <TableCell align='left'>{numberFormat(item.fees + item.volume_input_in_input_currency)}</TableCell>
                            <TableCell align='left' className='three-dots'>{item.payroll_id}</TableCell>
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
                <Pagination
                    color="primary"
                    count={totalPage}
                    page={page}
                    onChange={(e, value) => handleChangePage(e, value)}
                />
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
