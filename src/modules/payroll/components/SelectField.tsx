import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

interface SelectFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
    value: string;
    setValue: (e: any) => void;
}

export default function SelectField({ name, value, label, setValue }: SelectFieldProps) {

    const handleChange = (e: any) => {
        setValue(e.target.value)
    }

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 150 }} size='small'>
                <InputLabel>{name}</InputLabel>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={value}
                    onChange={handleChange}
                    autoWidth
                    label={label}
                >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                    <MenuItem value={10}>Twenty</MenuItem>
                    <MenuItem value={21}>Twenty one</MenuItem>
                    <MenuItem value={22}>Twenty one and a half</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}
