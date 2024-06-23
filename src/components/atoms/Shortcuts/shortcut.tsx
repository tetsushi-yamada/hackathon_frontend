import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShortcutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.shiftKey) {
                switch (event.key.toLowerCase()) {
                    case 'h':
                        event.preventDefault();
                        navigate('/homepage'); // 'homepage'を目的のルートに変更
                        break;
                    case 'p':
                        event.preventDefault();
                        navigate('/userpage'); // 'userpage'を目的のルートに変更
                        break;
                    case 's':
                        event.preventDefault();
                        navigate('/search'); // 'search'を目的のルートに変更
                        break;
                    default:
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [navigate]);

    return <>{children}</>;
};

export default ShortcutsProvider;
