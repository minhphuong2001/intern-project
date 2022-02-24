import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterMomentFns from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { FormControl, FormHelperText } from '@mui/material';

interface DateFieldProps {
    label: string;
    value: Date | null;
    setValue: (e: any) => void;
    error?: string | Date | null;
    minDate?: Date;
}

export default function DateField({ label, value, setValue, error, minDate }: DateFieldProps) {

    return (
        <div style={{ marginTop: '8px', marginLeft: '10px', width: '250px'}}>
           <LocalizationProvider dateAdapter={AdapterMomentFns}>
                <DatePicker
                    label={label}
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                    minDate={minDate}
                    renderInput={(params) => (
                        <FormControl>
                            <TextField
                                {...params}
                                size='small'
                                error={error ? true : false}
                            />
                            {error && <FormHelperText error sx={{margin: '8px 0'}}>{error}</FormHelperText>}
                        </FormControl>
                        
                    )}
                />
            </LocalizationProvider> 
        </div>
        
    );
}
