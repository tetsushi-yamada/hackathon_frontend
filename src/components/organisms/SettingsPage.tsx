import React from 'react';
import LogoutForm from "../molecules/Auth/LogoutForm";
import DeleteUser from '../molecules/Users/DeleteUser';
import { useUser } from "../../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { IconButton, Box, Typography, Button, Container, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UserSettings: React.FC = () => {
    const { userId } = useUser();
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ ml: 2 }}>
                    Settings
                </Typography>
            </Box>

            <Grid container spacing={2} direction="column">
                <Grid item>
                    <Link to="/userpage/settings/profile" style={{ textDecoration: 'none' }}>
                        <Button variant="contained">
                            Profile Settings
                        </Button>
                    </Link>
                </Grid>
                <Grid item>
                    <DeleteUser userId={userId} />
                </Grid>
                <Grid item>
                    <LogoutForm />
                </Grid>
            </Grid>
        </Container>
    );
}

export default UserSettings;
