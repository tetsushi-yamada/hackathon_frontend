import LogoutForm from "../../../components/molecules/Auth/LogoutForm";
import DeleteUser from '../../../components/molecules/Users/DeleteUser';
import { useUser } from "../../../contexts/UserContext";

const UserSettings: React.FC = () => {
    const { userId } = useUser();

    return (
        <div>
            <h1>Settings</h1>
            <DeleteUser userId={userId}/>
            <LogoutForm />
        </div>
    )
}

export default UserSettings