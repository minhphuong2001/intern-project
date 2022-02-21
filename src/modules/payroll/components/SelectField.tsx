import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormHelperText } from '@mui/material';

export interface SelectOptions {
    label: string;
    value: number | string;
}
interface SelectFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
    value: string;
    setValue: (e: any) => void;
    options: SelectOptions[];
    error?: string;
}

export default function SelectField({ name, value, label, setValue, options, error }: SelectFieldProps) {

    const handleChange = (e: any) => {
        setValue(e.target.value)
    }

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 250 }} size='small'>
                <InputLabel>{name}</InputLabel>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={value}
                    onChange={handleChange}
                    autoWidth
                    label={label}
                    error={error ? true : false}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {options.map(option => {
                        return (
                            <MenuItem sx={{minWidth: 250}} key={option.value} value={option.value}>{option.label}</MenuItem>
                        )
                    })}
                </Select>
                {error && <FormHelperText error sx={{margin: '8px 0'}}>{error}</FormHelperText>}
            </FormControl>
        </div>
    );
}
