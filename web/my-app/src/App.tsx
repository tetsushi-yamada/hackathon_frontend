import React from 'react';
import TweetForm from './TweetForm';
import TweetList from './TweetList';
import './App.css'; // スタイリング用のCSSファイル

const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Mini Twitter</h1>
            </header>
            <TweetForm />
            <TweetList />
        </div>
    );
};

export default App;
