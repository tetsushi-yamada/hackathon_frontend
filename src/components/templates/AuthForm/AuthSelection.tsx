import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const AuthSelection: React.FC = () => {
    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'linear-gradient(to bottom, #2193b0, #6dd5ed)', // 青色のグラデーション
                padding: 2,
                boxShadow: 3,
                borderRadius: 2,
            }}
        >
            <Box sx={{ textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 2, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Please choose an option
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <Button
                        component={RouterLink}
                        to="/signin"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Button
                        component={RouterLink}
                        to="/signup"
                        variant="outlined"
                        color="primary"
                        fullWidth
                    >
                        Sign Up
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default AuthSelection;
