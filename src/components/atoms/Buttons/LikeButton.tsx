import React, { useState, useEffect } from 'react';
import { fetchGoodsByTweetId, postGood, deleteGood } from '../../../backend_routes/api/goods'; 
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface LikeButtonProps {
  tweetId: string;
  userId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ tweetId, userId }) => {
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    // コンポーネントのマウント時にローカルストレージから初期値を読み込む
    const storedIsLiked = localStorage.getItem(`isLiked_${tweetId}_${userId}`);
    return storedIsLiked !== null ? JSON.parse(storedIsLiked) : false;
  });

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const goods = await fetchGoodsByTweetId(tweetId);
        const isCurrentlyLiked = goods.goods.some(good => good.user_id === userId);
        setIsLiked(isCurrentlyLiked);
        // 状態をローカルストレージに保存
        localStorage.setItem(`isLiked_${tweetId}_${userId}`, JSON.stringify(isCurrentlyLiked));
      } catch (error) {
        console.log('No likes:', error);
      }
    };

    checkIfLiked();
  }, [tweetId, userId]);

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        await deleteGood(tweetId, userId);
      } else {
        await postGood(tweetId, userId);
      }
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      // 状態をローカルストレージに保存
      localStorage.setItem(`isLiked_${tweetId}_${userId}`, JSON.stringify(newIsLiked));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <IconButton onClick={handleLikeToggle} color={isLiked ? 'secondary' : 'default'}>
      {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  );
};

export default LikeButton;
