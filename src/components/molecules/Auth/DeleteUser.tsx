import { getAuth, deleteUser } from "firebase/auth";

export const deleteUserAuth = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No user found');
        }
        await deleteUser(user);
        console.log('User deleted');
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
    }