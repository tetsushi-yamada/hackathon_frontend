import { List, ListItemButton, ListItemText, ListItemIcon, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import Home from "../../atoms/Icons/HomeIcon";
import UserPage from "../../atoms/Icons/UserPageIcon";
import Search from "../../atoms/Icons/SearchIcon";
import { Settings } from "../../atoms/Icons/SettingsIcon";

const Navbar = () => {
    const menuItems = [
        { text: 'Home', link: '/homepage', icon: Home },
        { text: 'Search', link: '/search', icon: Search },
        { text: 'Profile', link: '/userpage', icon: UserPage },
        { text: 'Settings', link: '/userpage/settings', icon: Settings },
    ];

    const isSmallScreen = useMediaQuery('(max-width:640px)');

    return (
        <List style={{
            display: 'flex',
            flexDirection: isSmallScreen ? 'row' : 'column',
            position: 'fixed',
            bottom: isSmallScreen ? 0 : 'auto',
            width: isSmallScreen ? '100%' : 'auto',
            justifyContent: isSmallScreen ? 'space-around' : 'flex-start',
            alignItems: 'center',
            padding: 0,
            margin: 0,
            background: isSmallScreen ? 'white' : 'transparent',
            zIndex: 1000, // スクロール時に他のコンテンツの上に表示されるようにする
        }}>
            {menuItems.map((item, index) => (
                <ListItemButton
                    component={Link}
                    to={item.link}
                    key={item.text}
                    style={{
                        padding: isSmallScreen ? '8px 0' : '4px 0',
                        minHeight: '40px',
                        margin: 0,
                        justifyContent: 'center',
                    }}
                >
                    <ListItemIcon style={{ minWidth: isSmallScreen ? 'unset' : '40px' }}>
                        {<item.icon />}
                    </ListItemIcon>
                    {!isSmallScreen && <ListItemText primary={item.text} />}
                </ListItemButton>
            ))}
        </List>
    );
};

export default Navbar;
