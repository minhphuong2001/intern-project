import React, { useEffect, useMemo, useState } from 'react';
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
    onDelete: (value: any) => void;
}

const useSortTable = (items: any) => {
    const [sortConfig, setSortConfig] = useState<any>(null);

    const sortedItem = useMemo(() => {
        const sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig?.key] < b[sortConfig?.key]) {
                    return sortConfig?.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig?.key] > b[sortConfig?.key]) {
                    return sortConfig?.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            })
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key: string) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig?.key === key && sortConfig?.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }

    return { items: sortedItem, requestSort, sortConfig };
}

export default function PayrollTable({ payrolls, onDelete }: PayrollTableProps) {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showDeleteItem, setShowDeleteItem] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const limit = 10;
    const { items, requestSort, sortConfig } = useSortTable(payrolls);
    const initialShow = items.slice(0 , limit);
    const [limitData, setLimitData] = useState(initialShow);
    const [item, setItem] = useState<IPayrollData>();

    useEffect(() => {
        const totalPages = Math.floor(items.length / 10);
        setTotalPage(totalPages);
    }, [items]);
    
    useEffect(() => {
        setLimitData(items.slice(page - 1, limit + page));
    }, [items, page])
    
    const hanldeCloseDialog = () => {
        setShowAddDialog(false);
    }

    const hanldeCloseDelete = () => {
        setShowDeleteItem(false);
    }
    
    const handleChangePage = (e: any, value: any) => {
        const start = limit * page;
        let end = start + limit;
        if (end >= items.length) {
            end = items.length;
        }
        setPage(value);
        setLimitData(items.slice(start, end));
        console.log({ start, end });
    }

    const getClassName = (name: string) => {
        if (!sortConfig) {
            return;
        } else {
            return sortConfig?.key === name ? sortConfig?.direction : undefined;
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell
                            align='left'
                            sx={{ fontWeight: 600, cursor: 'pointer' }}
                            onClick={() => requestSort('time_created')}
                            className={getClassName('time_created')}
                        >
                            Date
                        </TableCell>
                        <TableCell align='left' sx={{ fontWeight: 600, width: '200px' }}>Client</TableCell>
                        <TableCell align='left' sx={{ fontWeight: 600 }}>Currency</TableCell>
                        <TableCell
                            align='left'
                            sx={{ fontWeight: 600, cursor: 'pointer' }}
                            onClick={() => requestSort('volume_input_in_input_currency')}
                            className={getClassName('volume_input_in_input_currency')}
                        >
                            Total
                        </TableCell>
                        <TableCell align='left' sx={{ fontWeight: 600, width: '150px' }}>Invoice #</TableCell>
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
                                {index % 2 === 0 ? 'fullfied' : 'pending'}
                            </TableCell>
                            <TableCell align='left'>{moment(item.time_created).format('Do MMMM YYYY')}</TableCell>
                            <TableCell align='left'>{index%2 === 0 ? 'deng lun' : 'xiao zhan'}</TableCell>
                            <TableCell align='left' sx={{ textTransform: 'uppercase' }}>{item.currency}</TableCell>
                            <TableCell align='left'>{numberFormat(item.fees + item.volume_input_in_input_currency)}</TableCell>
                            <TableCell align='left'>
                                <span className='three-dots'>{item.subpayroll_ids[0]}</span>
                            </TableCell>
                            <TableCell align='right' sx={{ display: 'flex', alignItems: 'center'}}>
                                <IconButton
                                    color='error'
                                    onClick={() => {setShowDeleteItem(true), setItem(item)}}
                                >
                                    <i className='bx bx-trash'></i>
                                </IconButton>
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
                <Typography>Show <span style={{ fontWeight: 600 }}>{limit}</span> data from <span style={{ fontWeight: 600 }}>{payrolls.length}</span></Typography>
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
                            onClick={() => {onDelete(item?.payroll_id), setShowDeleteItem(false)}}
                            size='small'
                        >
                            delete
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={hanldeCloseDelete}
                            size='small'
                        >
                            cancel
                        </Button>
                    </Box>
                }
            />
        </TableContainer>
    );
}
