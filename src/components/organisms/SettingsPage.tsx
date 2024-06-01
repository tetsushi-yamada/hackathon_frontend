import LogoutForm from "../molecules/Auth/LogoutForm";
import DeleteUser from '../molecules/Users/DeleteUser';
import { useUser } from "../../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { ArrowBack } from "../atoms/Icons/ArrowBackIcon";
import NormalButton from "../atoms/Buttons/NormalButton";

const UserSettings: React.FC = () => {
    const { userId } = useUser();
    const navigate = useNavigate();

    return (
        <div>
            <IconButton onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                <ArrowBack />
            </IconButton>
            <h1>Settings</h1>
            <Link to="/userpage/settings/profile">
                <NormalButton>Profile Settings</NormalButton>
            </Link>

            <DeleteUser userId={userId}/>
            <LogoutForm />
        </div>
    )
}

export default UserSettings