import React, {useState} from 'react';
import LogoutForm from "../../components/Auth/LogoutForm";
import DeleteUser from '../Users/DeleteUser';
import { useUser } from '../../contexts/UserContext';

interface UserPageProps {
    // Define the props for the UserPage component here
}

const UserPageComponent: React.FC = () => {
    const { userId } = useUser(); // Get the user ID

    return (
        <div>
            <h1>User Page</h1>
            <DeleteUser userId={userId}/>
            <LogoutForm />
        </div>
    );
}

export default UserPageComponent;