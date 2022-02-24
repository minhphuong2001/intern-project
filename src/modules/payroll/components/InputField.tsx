import { TextField, FormControl, FormHelperText } from '@mui/material'
import React from 'react'

interface InputFieldProps {
    label: string;
    value: string;
    setValue: (e: any) => void;
    error?: string;
}

export default function InputField({ label, value, setValue, error }: InputFieldProps) {
    
    return (
        <FormControl sx={{ marginTop: '8px', width: '250px'}}>
            <TextField
                id="outlined-basic"
                variant="outlined"
                size='small'
                label={label}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                error={error ? true : false}
            />
            {error && <FormHelperText error sx={{margin: '8px 0'}}>{error}</FormHelperText>}
        </FormControl>
    )
}