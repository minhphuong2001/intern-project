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
import { validateFilterPayroll, validFilterPayroll } from '../../payroll/utils/validate';
import { ExportToExcel } from '../../payroll/components/ExportToExcel';
import { LIST_STATUS } from '../../../utils/constants';
import { checkStatus } from '../../payroll/utils/common';
import moment from 'moment';

export default function PayrollPage() {
    const [filterValues, setFilterValues] = useState({
        status: '',
        dateFrom: new Date(),
        dateTo: new Date(new Date().setDate(new Date().getDate() + 1)),
        order: ''
    });
    const statusOption = LIST_STATUS;
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
        setFilterValues({
            status: '',
            dateFrom: new Date(),
            dateTo: new Date(new Date().setDate(new Date().getDate() + 1)),
            order: ''
        });
        setPayrollData([...payrolls]);
    }

    const handleDeleteItem = (id: string) => {
        const newPayroll = payrolls.filter(value => value.payroll_id !== id);
        dispatch(setPayroll(newPayroll));
        console.log(id);
    }

    const handleUpdateItem = (index: number, values: UpdateProps) => {
        const { fees, volume_input_in_input_currency } = values;
        const updateItem = { ...payrollData[index], fees, volume_input_in_input_currency };
        const newPayroll = [...payrollData];
        newPayroll[index] = updateItem;
        setPayrollData(newPayroll);
    }

    const handleFilter = useCallback((values: ListParams) => {
        const validate = validateFilterPayroll(filterValues);
        setValidate(validate);

        if (!validFilterPayroll(validate)) {
            return;
        } else {
            const { status, dateFrom, dateTo, order } = values;
            let newPayroll = [...payrolls];
            let newPayrollDetail = [...newPayroll];
            if (status) {
                newPayrollDetail = newPayrollDetail.filter(item => checkStatus({ ...item }) === status);
            } else if (order) {
                newPayrollDetail = newPayrollDetail.filter(item => item.payroll_id.indexOf(order) !== -1);
            } else {
                newPayrollDetail = newPayrollDetail.filter(item => (dateFrom <= new Date(item.time_created)) && (dateTo >= new Date(item.time_created)));
            }
            newPayroll = newPayrollDetail;
            console.log(values);
            console.log(filterValues);
            console.log(newPayroll);

            setPayrollData([...newPayroll]);
        }
    }, [payrolls, filterValues])

    const exportCSVFile = [...payrolls].map((item) => {
        const status = checkStatus({ ...item });
        const date = moment(item.time_created).format('DD/MM/YYYY');
        const fundingMethod = item.payment_type;
        const total = +(item.fees + item.volume_input_in_input_currency);
        const order = item.payroll_id;

        return {
            status,
            date,
            fundingMethod,
            total,
            order
        }
    })

    useEffect(() => {
        setPayrollData([...payrolls]);
    }, [payrolls])

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
                    <ExportToExcel dataApi={exportCSVFile} fileName={fileName} />
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
                            value={filterValues.status}
                            setValue={(value: string) => setFilterValues({...filterValues, status: value})}
                            options={statusOption}
                            error={validate?.status}
                        />
                        <DateField
                            label='From'
                            value={filterValues.dateFrom}
                            setValue={(date: Date) => setFilterValues({...filterValues, dateFrom: date})}
                            error={validate?.dateFrom}
                        />
                        <DateField
                            label='To'
                            value={filterValues.dateTo}
                            setValue={(date: Date) => setFilterValues({...filterValues, dateTo: date})}
                            error={validate?.dateTo}
                            minDate={filterValues.dateFrom}
                        />
                        <InputField
                            label='Order #'
                            value={filterValues.order}
                            setValue={(value: string) => setFilterValues({...filterValues, order: value})}
                            error={validate?.order}
                        />
                    </Grid>
                    <Grid item md={2} mt={1}>
                        <Button
                            variant='outlined'
                            color='primary'
                            sx={{ marginRight: '10px' }}
                            onClick={() => handleFilter(filterValues)}
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