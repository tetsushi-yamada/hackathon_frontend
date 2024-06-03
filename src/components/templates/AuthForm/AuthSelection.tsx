import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const AuthSelection: React.FC = () => {
    return (
        <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Box sx={{ textAlign: 'center' }}>
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
