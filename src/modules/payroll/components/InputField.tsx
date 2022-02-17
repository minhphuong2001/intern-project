import { TextField } from '@mui/material'
import React from 'react'

interface InputFieldProps {
    label: string;
    value: string;
    setValue: (e: any) => void;
}

export default function InputField({ label, value, setValue }: InputFieldProps) {
    
    return (
        <div style={{marginTop: '8px'}}>
            <TextField
                id="outlined-basic"
                variant="outlined"
                size='small'
                label={label}
                value={value}
                onChange={setValue}
            />
        </div>
    )
}