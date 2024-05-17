import LoginForm from "../../../components/molecules/Auth/LoginForm";
import SignupForm from "../../../components/molecules/Auth/SignupForm";
import ResetPasswordForm from "../../../components/molecules/Auth/PasswordResetForm";

const Auth  = () => {
    return (
        <>
        <LoginForm />
        <SignupForm />
        <ResetPasswordForm />
        </>
    );
}

export default Auth;