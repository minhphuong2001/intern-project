import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterMomentFns from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

interface DateFieldProps {
    label: string;
    value: Date | null;
    setValue: (e: any) => void;
}

export default function DateField({ label, value, setValue }: DateFieldProps) {

    return (
        <div style={{ marginTop: '8px', marginLeft: '10px', width: '200px'}}>
           <LocalizationProvider dateAdapter={AdapterMomentFns}>
                <DatePicker
                    label={label}
                    value={value}
                    onChange={(newValue) => {
                        setValue(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} size='small'/>}
                />
            </LocalizationProvider> 
        </div>
        
    );
}
