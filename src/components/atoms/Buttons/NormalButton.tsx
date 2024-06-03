// NormalButton.tsx
import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

interface NormalButtonProps {
  children?: React.ReactNode;  // ボタンの中身を動的にするための children prop
  onClick?: () => void;       // クリックイベントのハンドラー
  color?: 'primary' | 'secondary' | 'red';  // ボタンの色に 'red' を追加
  variant?: 'text' | 'outlined' | 'contained';  // ボタンのバリアント
}

const RedButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText('#f44336'),
    backgroundColor: '#f44336',
    '&:hover': {
    backgroundColor: '#d32f2f',
    },
}));

const NormalButton: React.FC<NormalButtonProps> = ({
    children,
    onClick,
    color = 'primary',
    variant = 'contained'
}) => {
    if (color === 'red') {
    return (
        <RedButton onClick={onClick} variant={variant}>
            {children}
        </RedButton>
    );
    }

    return (
        <Button onClick={onClick} color={color} variant={variant}>
            {children}
        </Button>
    );
};

export default NormalButton;
