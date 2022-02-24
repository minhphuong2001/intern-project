import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormHelperText } from '@mui/material';

interface SelectFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
    value: string;
    setValue: (value: string) => void;
    options: String[];
    error?: string;
}

export default function SelectField({ name, value, label, setValue, options, error }: SelectFieldProps) {

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 250 }} size='small'>
                <InputLabel>{name}</InputLabel>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    autoWidth
                    label={label}
                    error={error ? true : false}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {options.map((option: any, index: number) => {
                        return (
                            <MenuItem sx={{minWidth: 250}} key={index} value={option}>{option}</MenuItem>
                        )
                    })}
                </Select>
                {error && <FormHelperText error sx={{margin: '8px 0'}}>{error}</FormHelperText>}
            </FormControl>
        </div>
    );
}
