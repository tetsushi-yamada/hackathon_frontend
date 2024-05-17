// NormalButton.tsx
import React from 'react';
import Button from '@mui/material/Button';

interface NormalButtonProps {
  children?: React.ReactNode;  // ボタンの中身を動的にするための children prop
  onClick?: () => void;       // クリックイベントのハンドラー
  color?: 'primary' | 'secondary';  // ボタンの色
  variant?: 'text' | 'outlined' | 'contained';  // ボタンのバリアント
}

const NormalButton: React.FC<NormalButtonProps> = ({
    children,
    onClick,
    color = 'primary',
    variant = 'contained'
}) => {
    return (
    <Button onClick={onClick} color={color} variant={variant}>
        {children}
    </Button>
    );
};

export default NormalButton;
