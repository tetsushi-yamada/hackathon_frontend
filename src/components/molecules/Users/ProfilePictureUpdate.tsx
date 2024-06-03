import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { uploadProfilePicture } from '../../../backend_routes/api/profile_picture';
import { useUser } from '../../../contexts/UserContext';
import ProfilePicture from "./ProfilePictureGet";

import { Box, Button, Container, Grid, Typography } from "@mui/material";

const ProfilePictureUploadForm: React.FC = () => {
    const { userId } = useUser();
    const [fileData, setFileData] = useState<File | undefined>();
    const [objectUrl, setObjectUrl] = useState<string | undefined>();
    const imageRef = useRef<HTMLImageElement | null>(null);

    // プロフィールイメージ
    const [profileImg, setProfileImg] = useState<string>("");
    const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

    // Crop
    const [crop, setCrop] = useState<Crop>({
        unit: "px",
        x: 0,
        y: 0,
        width: 200,
        height: 200,
    });

    // アップロードした画像のObjectUrlをステイトに保存する
    useEffect(() => {
        if (fileData instanceof File) {
            objectUrl && URL.revokeObjectURL(objectUrl);
            setObjectUrl(URL.createObjectURL(fileData));
        } else {
            setObjectUrl(undefined);
        }
    }, [fileData]);

    // 画像のロードが完了したときの処理
    const handleImageLoaded = (image: HTMLImageElement) => {
        imageRef.current = image;
        console.log(`Loaded image with width: ${image.width}, height: ${image.height}`);
        return false; // ReactCrop が独自に画像を再ロードしないようにするため
    };

    // 切り取った画像のObjectUrlを作成し、ステイトに保存する
    const makeProfileImgObjectUrl = async () => {
        if (objectUrl && crop.width && crop.height && imageRef.current) {
            const canvas = document.createElement("canvas");
            const img = await loadImage(objectUrl);

            // ReactCropコンポーネントで表示される画像の実際のサイズ
            const displayedWidth = imageRef.current.clientWidth;
            const displayedHeight = imageRef.current.clientHeight;

            // 画像の自然なサイズ
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;

            // スケーリング比率を計算
            const scaleX = naturalWidth / displayedWidth;
            const scaleY = naturalHeight / displayedHeight;

            // 固定サイズにリサイズ
            const targetDiameter = 150; // px
            canvas.width = targetDiameter;
            canvas.height = targetDiameter;

            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

            // 円形にクリップ
            ctx.beginPath();
            ctx.arc(
                targetDiameter / 2,
                targetDiameter / 2,
                targetDiameter / 2,
                0,
                2 * Math.PI,
                false
            );
            ctx.clip();

            // 画像の描画
            ctx.drawImage(
                img,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                targetDiameter,
                targetDiameter
            );

            // トリミングされた画像をBlobとして保存
            canvas.toBlob((result) => {
                if (result instanceof Blob) {
                    const croppedImageUrl = URL.createObjectURL(result);
                    setProfileImg(croppedImageUrl);
                    setCroppedBlob(result);
                }
            });
        }
    };

    // 画像をアップロードする関数
    const handleUpload = async () => {
        if (croppedBlob && fileData) {
            const croppedImageFile = new File([croppedBlob], fileData.name, { type: croppedBlob.type });
            uploadProfilePicture(croppedImageFile, userId)
                .then(() => {
                    console.log('Profile picture uploaded successfully');
                    setUploadSuccess(true);
                    setFileData(undefined);
                    setObjectUrl(undefined);
                    setCroppedBlob(null);
                    setProfileImg("");
                })
                .catch((error) => {
                    console.error('Error uploading profile picture:', error);
                });
        }
    };

    // canvasで画像を扱うため
    // アップロードした画像のObjectUrlをもとに、imgのHTMLElementを作る
    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
        });
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h5" gutterBottom>
                    Update User Picture
                </Typography>
                <Grid container spacing={3} alignItems="center">
                    <Grid item>
                        <ProfilePicture user_id={userId} radius={50} />
                    </Grid>
                    <Grid item>
                        <Box mt={2}>
                            {!uploadSuccess && (
                                <>
                                    <form
                                        onSubmit={(e: FormEvent<HTMLFormElement>) => {
                                            e.preventDefault();
                                            makeProfileImgObjectUrl();
                                        }}
                                    >
                                        <input
                                            type="file"
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                e.target.files && setFileData(e.target.files[0]);
                                            }}
                                            style={{ display: 'none' }}
                                            id="profile-pic-upload"
                                        />
                                        <label htmlFor="profile-pic-upload">
                                            <Button variant="contained" component="span">
                                                Edit Profile Picture
                                            </Button>
                                        </label>
                                        {fileData && (
                                            <Button type="submit" variant="outlined" sx={{ ml: 2 }}>
                                                切り取り
                                            </Button>
                                        )}
                                    </form>
                                    {objectUrl && (
                                        <Box my={2}>
                                            <ReactCrop
                                                crop={crop}
                                                onChange={(c) => setCrop(c)}
                                                aspect={1}
                                                onComplete={(c, p) => handleImageLoaded(imageRef.current as HTMLImageElement)}
                                            >
                                                <img src={objectUrl} alt="" style={{ width: "100%" }} ref={imageRef} />
                                            </ReactCrop>
                                        </Box>
                                    )}
                                    {croppedBlob && (
                                        <>
                                            <Box my={2} display="flex" justifyContent="center">
                                                <img src={profileImg} alt="トリミングされた画像" style={{ width: "150px", height: "150px", borderRadius: "50%" }} />
                                            </Box>
                                            <Box display="flex" justifyContent="center">
                                                <Button onClick={handleUpload} variant="contained" color="primary">
                                                    upload
                                                </Button>
                                            </Box>
                                        </>
                                    )}
                                </>
                            )}
                            {uploadSuccess && (
                                <>
                                    <Box my={2} display="flex" justifyContent="center">
                                        <Typography>uploaded successfully</Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="center">
                                        <Button onClick={() => setUploadSuccess(false)} variant="contained" color="primary">
                                            新しい画像を選択
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default ProfilePictureUploadForm;
