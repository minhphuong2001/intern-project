import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Grid, Typography } from '@mui/material';
import SelectField from '../../payroll/components/SelectField';
import DateField from '../../payroll/components/DateField';
import InputField from '../../payroll/components/InputField';
import PayrollTable from '../../payroll/components/PayrollTable';
import { useDispatch, useSelector } from 'react-redux';
import { replace } from 'connected-react-router';
import { ROUTES } from '../../../configs/routes';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'typesafe-actions';  
import { LIST_PAYROLL } from '../../payroll/utils/mock_data';
import { IPayrollData } from '../../../models/payroll';
import { setPayroll } from '../../payroll/redux/payrollReducer';

const statusOptions = [
    {
        value: 'pending',
        label: 'pending'
    },
    {
        value: 'fullfied',
        label: 'fullfied'
    },
]

const clientOpitons = [
    {
        value: 'denglun',
        label: 'deng lun'
    },
    {
        value: 'xiao zhan',
        label: 'xiao zhan'
    },
]

export default function PayrollPage() {
    const [status, setStatus] = useState('');
    const [client, setClient] = useState('');
    const [invoice, setInvoice] = useState('');
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateTo, setDateTo] = useState<Date | null>(null);
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
    const { payrolls } = useSelector((state: AppState) => state.payroll);
    
    const getPayroll = useCallback(() => {
        dispatch(setPayroll(LIST_PAYROLL.payrolls as IPayrollData[]));
    }, [dispatch])

    useEffect(() => {
        getPayroll();
    }, [getPayroll])

    // useEffect(() => {
    //     setPayrollData([...payrolls])
    // }, [payrolls])

    const handleClear = () => {
        setStatus('');
        setClient('');
        setInvoice('');
        setDateFrom(null);
        setDateTo(null);
    }

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
                    <Button size='small' variant='contained' endIcon={<i className='bx bx-chevron-down'></i>}>Export CSV</Button>
                </Box>
                <Grid container spacing={3}>
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
                        />
                        <SelectField
                            name='Client'
                            label='Client'
                            value={client}
                            setValue={setClient}
                            options={clientOpitons}
                        />
                        <DateField
                            label='From'
                            value={dateFrom}
                            setValue={setDateFrom}
                        />
                        <DateField
                            label='To'
                            value={dateTo}
                            setValue={setDateTo}
                        />
                        <InputField
                            label='Invoice #'
                            value={invoice}
                            setValue={(e: any) => setInvoice(e.target.value)}
                        />
                    </Grid>
                    <Grid item md={2} mt={1}>
                        <Button
                            variant='outlined'
                            color='primary'
                            sx={{ marginRight: '10px' }}
                        >Apply</Button>
                        <Button variant='outlined' color='error' onClick={handleClear}>Clear</Button>
                    </Grid>
                </Grid>
                <Box mt={2}>
                    <PayrollTable payrolls={payrolls}/>
                </Box>
            </Box>
        </Box>
    )
    
}