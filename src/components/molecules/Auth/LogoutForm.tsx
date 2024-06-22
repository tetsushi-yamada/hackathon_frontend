import React, { useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import NormalButton from '../../atoms/Buttons/NormalButton';
import ConfirmationModal from '../../atoms/confirmation/ConfirmationModal';

const LogoutForm: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(auth);
      alert("you logout successfully");
      navigate("/auth/signin");
    } catch (error) {
      if (error instanceof Error) {
        console.error("you failed to logout:", error.message);
      }
    }
  };

  const handleConfirm = () => {
    setModalOpen(false);
    handleLogout();
  };

  return (
    <div>
      <NormalButton onClick={() => setModalOpen(true)} color="red">LOG OUT</NormalButton>
      <ConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        title="Confirm Logout"
        description="Are you sure you want to logout?"
      />
    </div>
  );
};

const LogoutFunction = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    alert("you logout successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("you failed to logout:", error.message);
    }
  }
}

export default LogoutForm;
export { LogoutFunction };
