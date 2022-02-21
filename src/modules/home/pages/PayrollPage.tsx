import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Grid, Typography } from '@mui/material';
import SelectField from '../../payroll/components/SelectField';
import DateField from '../../payroll/components/DateField';
import InputField from '../../payroll/components/InputField';
import PayrollTable, { UpdateProps } from '../../payroll/components/PayrollTable';
import { useDispatch, useSelector } from 'react-redux';
import { replace } from 'connected-react-router';
import { ROUTES } from '../../../configs/routes';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'typesafe-actions';  
import { LIST_PAYROLL } from '../../payroll/utils/mock_data';
import { IFilterPayrollValidation, IPayrollData, ListParams } from '../../../models/payroll';
import { setPayroll } from '../../payroll/redux/payrollReducer';
import moment from 'moment';
import { validateFilterPayroll, validFilterPayroll } from '../../payroll/utils/validate';
import { ExportToExcel } from '../../payroll/components/ExportToExcel';

const statusOptions = [
    {
        value: 'pending',
        label: 'Pending'
    },
    {
        value: 'fullfied',
        label: 'Fullfied'
    },
    {
        value: 'processing',
        label: 'Processing'
    },
    {
        value: 'canceled',
        label: 'Canceled'
    },
    {
        value: 'received',
        label: 'Received'
    },
]

export default function PayrollPage() {
    const [status, setStatus] = useState('');
    const [order, setOrder] = useState('');
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateTo, setDateTo] = useState<Date | null>(null);
    const [validate, setValidate] = React.useState<IFilterPayrollValidation>();
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
    const { payrolls } = useSelector((state: AppState) => state.payroll);
    const [payrollData, setPayrollData] = useState<IPayrollData[]>([]);
    const fileName = "myfile";
    
    const getPayroll = useCallback(() => {
        dispatch(setPayroll(LIST_PAYROLL.payrolls as IPayrollData[]));
    }, [dispatch])

    useEffect(() => {
        getPayroll();
    }, [getPayroll])

    const handleClear = () => {
        setStatus('');
        setOrder('');
        setDateFrom(null);
        setDateTo(null);
        setPayrollData([...payrolls]);
    }

    const handleDeleteItem = (id: string) => {
        const newPayroll = payrolls.filter(value => value.payroll_id !== id);
        dispatch(setPayroll(newPayroll));
        console.log(id);
    }

    const handleFilter = (values: ListParams) => {
        const validate = validateFilterPayroll({ status, dateFrom, dateTo, order });
        setValidate(validate);

        if (!validFilterPayroll(validate)) {
            return;
        } else {
            const newPayroll = [...payrollData].filter(e => moment(e.time_created).format('MM/DD/YYYY') === values.dateFrom);
            setPayrollData(newPayroll);
        }
    }

    const handleUpdateItem = (index: number, values: UpdateProps) => {
        
        const { fees, volume_input_in_input_currency } = values;
        const updateItem = { ...payrollData[index], fees, volume_input_in_input_currency };
        const newpayroll = [...payrollData];
        newpayroll[index] = updateItem;
        setPayrollData(newpayroll)
        console.log(index);
    }

    useEffect(() => {
        setPayrollData([...payrolls]);
    }, [payrolls])    

    const from = moment(dateFrom).format('MM/DD/YYYY');
    const to = moment(dateTo).format('MM/DD/YYYY');

    return (
        <Box sx={{
            width: '90%',
            margin: '10px auto',
        }}>
            <div className="back" onClick={() => dispatch(replace(ROUTES.home))}>Back to home</div>
            <Box sx={{
                borderRadius: '10px',
                padding: '10px 15px',
                marginTop: '20px',
                backgroundColor: '#dfe6e9',
                boxShadow: '0 0 3px 3px rgba(0,0,0,0.1005)'
            }}>
                <Box my={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='h5' sx={{ textTransform: 'capitalize', fontWeight: 600 }}>payroll transaction list</Typography>
                    <ExportToExcel item={payrollData} fileName={fileName} />
                </Box>
                <Grid container spacing={4}>
                    <Grid item md={10} sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between'
                    }}>
                        <SelectField
                            name='Status'
                            label='Status'
                            value={status}
                            setValue={setStatus}
                            options={statusOptions}
                            error={validate?.status}
                        />
                        <DateField
                            label='From'
                            value={dateFrom}
                            setValue={setDateFrom}
                            error={validate?.dateFrom}
                        />
                        <DateField
                            label='To'
                            value={dateTo}
                            setValue={setDateTo}
                            error={validate?.dateTo}
                            minDate={dateFrom}
                        />
                        <InputField
                            label='Order #'
                            value={order}
                            setValue={setOrder}
                            error={validate?.order}
                        />
                    </Grid>
                    <Grid item md={2} mt={1}>
                        <Button
                            variant='outlined'
                            color='primary'
                            sx={{ marginRight: '10px' }}
                            onClick={() => handleFilter({
                                status,
                                dateFrom: from,
                                dateTo: to,
                                order
                            })}
                        >
                            Apply
                        </Button>
                        <Button variant='outlined' color='error' onClick={handleClear}>Clear</Button>
                    </Grid>
                </Grid>
                <Box mt={2}>
                    <PayrollTable payrolls={payrollData} onDelete={handleDeleteItem} onUpdate={handleUpdateItem}/>
                </Box>
            </Box>
        </Box>
    )
    
}