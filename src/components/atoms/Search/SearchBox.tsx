import React, { useState, useEffect } from 'react';
import { InputBase, List, ListItem, CircularProgress, Typography, Grid } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ProfilePicture from '../../molecules/Users/ProfilePictureGet';
import { Link } from 'react-router-dom';
import { User } from '../../../types/user.d';
import { searchUser } from '../../../backend_routes/api/users';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const SearchAppBar: React.FC = () => {
    const [searchWord, setSearchWord] = useState<string>('');
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchUsers = async () => {
            if (searchWord.trim() === '') {
                setResults([]);
                setError('');
                return;
            }

            setLoading(true);
            setError('');
            try {
                const fetchedUsers = await searchUser(searchWord);
                setResults(fetchedUsers.users.slice(0, 10)); // 最初の10件のみ取得
            } catch (error) {
                setError('No Users Found');
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 300); // 300msのデバウンス

        return () => clearTimeout(delayDebounceFn);
    }, [searchWord]);

    return (
        <div>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                />
            </Search>
            {loading ? (
                <CircularProgress />
            ) : (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {results.map((user) => (
                        <ListItem key={user.user_id} sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                            <Link to={`/userpage/${user.user_id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%' }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        <ProfilePicture user_id={user.user_id} radius={20} />
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="body1" fontWeight="bold">
                                            {user.user_name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            @{user.user_id}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Link>
                        </ListItem>
                    ))}
                </List>
            )}
            {error && <Typography color="error">{error}</Typography>}
        </div>
    );
};

export default SearchAppBar;
