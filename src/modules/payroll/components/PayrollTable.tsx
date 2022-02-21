import React, { useEffect, useMemo, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import {Button, IconButton, Pagination, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { checkStatus, numberFormat } from '../utils/common';
import { CustomDialog } from './CustomDialog';
import { LoadingButton } from '@mui/lab';
import { IPayrollData } from '../../../models/payroll';

export interface UpdateProps {
    fees?: any;
    volume_input_in_input_currency?: any;
}
interface PayrollTableProps {
    payrolls: IPayrollData[];
    onDelete: (value: any) => void;
    onUpdate: (index: number, values: UpdateProps) => void;
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

export default function PayrollTable({ payrolls, onDelete, onUpdate }: PayrollTableProps) {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showDeleteItem, setShowDeleteItem] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const limit = 10;
    const { items, requestSort, sortConfig } = useSortTable(payrolls);
    const initialShow = items.slice(0 , limit);
    const [limitData, setLimitData] = useState(initialShow);
    const [item, setItem] = useState<IPayrollData>();
    const [fees, setFees] = useState();
    const [money, setMoney] = useState();
    const [activeIndex, setActiveIndex] = useState<Number>();

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
                        <TableCell align='left' sx={{ fontWeight: 600, width: '200px' }}>Funding Method</TableCell>
                        <TableCell align='left' sx={{ fontWeight: 600 }}>Payroll Currency</TableCell>
                        <TableCell
                            align='left'
                            sx={{ fontWeight: 600, cursor: 'pointer' }}
                            onClick={() => requestSort('volume_input_in_input_currency')}
                            className={getClassName('volume_input_in_input_currency')}
                        >
                            Total
                        </TableCell>
                        <TableCell align='left' sx={{ fontWeight: 600, width: '150px' }}>Order #</TableCell>
                        <TableCell align='right' sx={{width: '250px', fontWeight: 600 }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {limitData.slice(0, limit).map((item: IPayrollData, index: number) => {
                        let colorStatus = '';
                        switch (checkStatus({...item})) {
                            case 'Fulfilled':
                                colorStatus = '#000'
                                break;
                            case 'Processing':
                                colorStatus = '#8e44ad'
                                break;
                            case 'Canceled':
                                colorStatus = '#c0392b'
                                break;
                            case 'Received':
                                colorStatus = '#2980b9'
                                break;
                            default:
                                colorStatus = '#f1c40f'
                                break;
                        }

                        return (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell
                                    component="th"
                                    scope="row"
                                    sx={{ color: colorStatus}}
                                >
                                    {checkStatus({...item})}
                                </TableCell>
                                <TableCell align='left'>{moment(item.time_created).format('MM/DD/YYYY')}</TableCell>
                                <TableCell align='left'>{item.payment_type}</TableCell>
                                <TableCell align='left' sx={{ textTransform: 'uppercase' }}>{item.currency}</TableCell>
                                <TableCell align='left' sx={{ fontWeight: 600 }}>{numberFormat(Number(item.fees) + Number(item.volume_input_in_input_currency))}</TableCell>
                                <TableCell align='left'>
                                    <span className='three-dots'>{item.payroll_id}</span>
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
                                        onClick={() => {setShowAddDialog(true), setItem(item), setActiveIndex(index)}}
                                    >
                                        View Details</Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
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
                    <Box width='400px' my={1}>
                        <TextField
                            name='order'
                            label='Order #'
                            size='small'
                            value={item?.payroll_id}
                            disabled
                            fullWidth
                        />
                        <Box mt={2} sx={{ display: 'flex', alignItems: 'center'}}>
                           <TextField
                                name='fees'
                                label='Fees'
                                size='small'
                                fullWidth
                                type='number'
                                sx={{ margin: '0 10px 0 0'}}
                                value={fees}
                                onChange={(e: any) => setFees(e.target.value)}
                            />
                            <TextField
                                name='money'
                                label='Money'
                                size='small'
                                type='number'
                                fullWidth
                                value={money}
                                onChange={(e: any) => setMoney(e.target.value)}
                            /> 
                        </Box>
                    </Box>
                }
                actions={
                    <Box width='100%' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <LoadingButton
                            variant='contained'
                            sx={{ marginRight: '1rem' }}
                            onClick={() => {
                                onUpdate(activeIndex as number, { fees, volume_input_in_input_currency: money });
                                setShowAddDialog(false)
                            }}
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
