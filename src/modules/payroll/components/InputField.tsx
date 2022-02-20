import { TextField, FormControl, FormHelperText } from '@mui/material'
import React from 'react'

interface InputFieldProps {
    label: string;
    value: string;
    setValue: (e: any) => void;
    error?: string;
}

export default function InputField({ label, value, setValue, error }: InputFieldProps) {

    const handleChangeInput = (e: any) => {
        setValue(e.target.value);
    }
    
    return (
        <FormControl sx={{ marginTop: '8px'}}>
            <TextField
                id="outlined-basic"
                variant="outlined"
                size='small'
                label={label}
                value={value}
                onChange={handleChangeInput}
                error={error ? true : false}
            />
            {error && <FormHelperText error sx={{margin: '8px 0'}}>{error}</FormHelperText>}
        </FormControl>
    )
}