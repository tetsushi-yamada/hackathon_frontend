import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';

const Search: React.FC = () => {
    return (
        <IconButton aria-label="search">
            <SearchIcon />
        </IconButton>
    );
};

export default Search;