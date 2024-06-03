// src/components/NormalInput.tsx

import React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

interface NormalInputProps extends Omit<TextFieldProps, 'variant'> {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const NormalInput: React.FC<NormalInputProps> = ({ label, value, onChange, ...props }) => {
    return (
        <TextField
            label={label}
            value={value}
            onChange={onChange}
            variant="outlined"
            fullWidth
            {...props}
        />
    );
};

export default NormalInput;
