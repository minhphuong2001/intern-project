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
import { IFilterPayrollValidation, IPayrollData, ListParams } from '../../../models/payroll';
import { setPayroll } from '../../payroll/redux/payrollReducer';
import moment from 'moment';
import { validateFilterPayroll, validFilterPayroll } from '../../payroll/utils/validate';
import { ExportToExcel } from '../../payroll/components/ExportToExcel';

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
        setClient('');
        setInvoice('');
        setDateFrom(null);
        setDateTo(null);
        setPayrollData([...payrolls]);
    }

    const handleDeleteItem = (id: string) => {
        const newPayroll = payrolls.filter(value => value.payroll_id !== id);
        dispatch(setPayroll(newPayroll));
    }

    const handleFilter = (values: ListParams) => {
        const validate = validateFilterPayroll({ status, client, dateFrom, dateTo, invoice });
        setValidate(validate);

        if (!validFilterPayroll(validate)) {
            return;
        } else {
            const newPayroll = [...payrollData].filter(e => moment(e.time_created).format('Do MMMM YYYY') === values.dateFrom);
            // console.log(newPayroll);
            // console.log(values);
            setPayrollData(newPayroll);
        }
    }

    useEffect(() => {
        setPayrollData([...payrolls]);
    }, [payrolls])    

    const from = moment(dateFrom).format('Do MMMM YYYY');
    const to = moment(dateTo).format('Do MMMM YYYY');

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
                    {/* <Button size='small' variant='contained' endIcon={<i className='bx bx-chevron-down'></i>}>Export CSV</Button> */}
                    <ExportToExcel item={payrollData} fileName={fileName} />
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
                            error={validate?.status}
                        />
                        <SelectField
                            name='Client'
                            label='Client'
                            value={client}
                            setValue={setClient}
                            options={clientOpitons}
                            error={validate?.client}
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
                        />
                        <InputField
                            label='Invoice #'
                            value={invoice}
                            setValue={setInvoice}
                            error={validate?.invoice}
                        />
                    </Grid>
                    <Grid item md={2} mt={1}>
                        <Button
                            variant='outlined'
                            color='primary'
                            sx={{ marginRight: '10px' }}
                            onClick={() => handleFilter({
                                status,
                                client,
                                dateFrom: from,
                                dateTo: to,
                                invoice
                            })}
                        >
                            Apply
                        </Button>
                        <Button variant='outlined' color='error' onClick={handleClear}>Clear</Button>
                    </Grid>
                </Grid>
                <Box mt={2}>
                    <PayrollTable payrolls={payrollData} onDelete={handleDeleteItem}/>
                </Box>
            </Box>
        </Box>
    )
    
}