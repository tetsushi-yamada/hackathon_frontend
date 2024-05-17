import React from 'react';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import { SvgIconProps } from '@mui/material/SvgIcon'; 

interface HomeProps {
    color?: SvgIconProps['color']; 
    size?: SvgIconProps['fontSize'];
}

const Home: React.FC<HomeProps> = ({ color = 'primary', size = 'medium' }) => {
    return (
        <IconButton aria-label="home">
            <HomeIcon color={color} fontSize={size} />
        </IconButton>
    );
};

export default Home;
