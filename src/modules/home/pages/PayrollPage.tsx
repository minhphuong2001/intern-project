import React, { useState } from 'react'
import { Box, Button, Grid, Typography } from '@mui/material';
import SelectField from '../../payroll/components/SelectField';
import DateField from '../../payroll/components/DateField';
import InputField from '../../payroll/components/InputField';
import PayrollTable from '../../payroll/components/PayrollTable';
import { useDispatch } from 'react-redux';
import { replace } from 'connected-react-router';
import { ROUTES } from '../../../configs/routes';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'typesafe-actions';  

export default function PayrollPage() {
    const [status, setStatus] = useState('');
    const [client, setClient] = useState('');
    const [invoice, setInvoice] = useState('');
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateTo, setDateTo] = useState<Date | null>(null);
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

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
            margin: '20px auto',
        }}>
            <div className="back" onClick={() => dispatch(replace(ROUTES.home))}>Back to home</div>
            <Box sx={{
                borderRadius: '10px',
                padding: '10px 15px',
                marginTop: '20px',
                backgroundColor: '#dfe6e9',
                boxShadow: '0 0 3px 3px rgba(0,0,0,0.1005)'
            }}>
                <Typography mb={3} sx={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '20px' }}>payroll transaction list</Typography>
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
                        />
                        <SelectField
                            name='Client'
                            label='Client'
                            value={client}
                            setValue={setClient}
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
                        <Button variant='outlined' color='primary' sx={{ marginRight: '10px'}}>Apply</Button>
                        <Button variant='outlined' color='error' onClick={handleClear}>Clear</Button>
                    </Grid>
                </Grid>
                <Box mt={2}>
                    <PayrollTable />
                </Box>
            </Box>
        </Box>
    )
    
}