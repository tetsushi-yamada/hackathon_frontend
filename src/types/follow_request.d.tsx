export interface FollowRequest {
    user_id: string;
    follow_id: string;
    created_at: string;
}

export interface FollowRequests {
    follow_requests: FollowRequest[];
    count: number;
}

export interface FollowRequestWithUserNameAndPicture extends FollowRequest {
    user_name: string;
    profile_picture: string;
}