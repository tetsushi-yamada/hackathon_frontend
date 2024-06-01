import { List, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import { Link } from "react-router-dom";
import Home from "../../atoms/Icons/HomeIcon"
import UserPage from "../../atoms/Icons/UserPageIcon";
import Search from "../../atoms/Icons/SearchIcon";
import { Settings } from "../../atoms/Icons/SettingsIcon";


const Navbar = () => {
    const menuItems = [
        { text: 'Home', link: '/homepage', icon: Home },
        { text: 'Search', link: '/search', icon: Search },
        { text: 'Profile', link: '/userpage', icon: UserPage },
        { text: 'Settings', link: '/userpage/settings', icon: Settings},
    ];
    return (
        <List>
            {menuItems.map((item, index) => (
                <ListItemButton component={Link} to={item.link} key={item.text}>
                    <ListItemIcon>{<item.icon />}</ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItemButton>
            ))}
        </List>
    );
};

export default Navbar