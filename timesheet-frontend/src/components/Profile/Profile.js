import React from 'react';

import { useSelector } from 'react-redux';

const Profile = () => {

    const profile = useSelector(state => state.user_profile);

    return (
        <div>
            <h1>Hi, {(profile && profile?.name) ? profile.name : "new user"}</h1>
            <p>The following is the profile json: {JSON.stringify(profile)}</p>
        </div>
    )
};

export default Profile;