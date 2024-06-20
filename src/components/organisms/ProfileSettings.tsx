import { useNavigate } from "react-router-dom";
import ProfilePictureUploadForm from "../molecules/Users/ProfilePictureUpdate";
import { ArrowBack } from "../atoms/Icons/ArrowBackIcon";
import { IconButton } from "@mui/material";
import UpdateUserDescriptionForm from "../molecules/Users/ProfileDescriptionUpdate";
import UpdateUserNameForm from "../molecules/Users/ProfileUserNameUpdate";
import SetIsPrivateForm from "../molecules/Users/SetIsPrivateForm";
import SetIsSuspendedForm from "../molecules/Users/SetIsSuspendedForm";

export const ProfileSettings: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div>
            <IconButton onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                <ArrowBack />
            </IconButton>
            <h1>Profile Settings</h1>
            <ProfilePictureUploadForm />
            <UpdateUserNameForm />
            <UpdateUserDescriptionForm />
            <SetIsPrivateForm />
            <SetIsSuspendedForm />
        </div>
    );
}