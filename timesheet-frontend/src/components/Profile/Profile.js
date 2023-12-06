import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, FormControl, InputLabel, OutlinedInput, Button, TextField } from '@mui/material';

import './Profile.scss';
// import {  } from '../../actions/actions';
import { getProfile_api, uploadProfileAvatar_api, updateProfile_api } from '../../services/apiServices';

const Profile = () => {
    const profile_store = useSelector(state => state.user_profile);
    const [profile, setProfile] = useState(profile_store);
    const [document, setDocument] = useState(null);

    useEffect(() => {
        // make sure to get the latest profile from the database
        getProfile_api(profile_store.id)
            .then(response => {
                setProfile(response.data);
            });
    }, []);

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setDocument(e.target.files[0]);
        }
    }

    const uploadAvatar = () => {
        // api service to upload document to amazon s3
        if(document) {
            uploadProfileAvatar_api(profile.id, document)
                .then(response => {
                    setProfile({ ...profile, profileAvatar: response.data });
                    updateProfile_api({ ...profile, profileAvatar: response.data });
                });
        }
    }

    const handleContactChange = (prop) => (event) => {
        setProfile({ 
            ...profile, 
            contact: {
                ...profile.contact,
                [prop]: event.target.value
            }
        });
    }

    const updateProfile = () => {
        updateProfile_api(profile);
    }

    return (
            <Grid
                container
                spacing={2}
            >
                <div className='container'>
                    <form noValidate autoComplete="off">
                        <div className='row'>
                            <h3>User Info</h3>
                            <hr></hr>
                        </div>
                        <div className='row'>
                            <FormControl variant="outlined" disabled>
                                <InputLabel htmlFor="component-outlined">Name</InputLabel>
                                <OutlinedInput id="component-outlined" value={profile?.name}  label="Name" />
                            </FormControl>
                        </div>
                        <div className='row'>
                            <div className='img-row'>
                                <img src={(profile?.profileAvatar)?profile.profileAvatar:"http://www.gravatar.com/avatar/?d=mp"} alt="Avatar" className='avatar'></img>
                            </div>
                            <div className='img-buttons'>
                                <label htmlFor="img">Select Avatar:&nbsp;&nbsp;</label>
                                <input type="file" onChange={handleFileInput} id="img" name="img" accept=".pdf, .doc, .docx, .jpeg, .xlsx, .jpg, .png"></input>
                                <Button variant="contained" color="primary" onClick={uploadAvatar}>
                                    Save
                                </Button>
                            </div>
                        </div>
                        <div className='row'>
                            <h3>Contact</h3>
                            <hr></hr>

                            <div className='row'>
                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="component-outlined">Phone</InputLabel>
                                    <OutlinedInput id="component-outlined" value={profile?.contact?.phone} onChange={handleContactChange('phone')} label="Name" />
                                </FormControl>
                            </div>
                            <div className='row'>
                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="component-outlined">Email</InputLabel>
                                    <OutlinedInput id="component-outlined" value={profile?.contact?.email} onChange={handleContactChange('email')} label="Name" />
                                </FormControl>
                            </div>
                            <div className='row'>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Multiline"
                                    multiline
                                    rows={4}
                                    defaultValue={profile?.contact?.address}
                                    onChange={handleContactChange('address')}
                                    variant="outlined"
                                />
                            </div>
                            <div className='row'>
                                <Button variant="contained" color="primary" onClick={updateProfile} >
                                Save
                                </Button>
                            </div>
                            {profile?.contact?.emergencyContacts?.map((row, index) => (
                                <div key={index}>
                                    <div className='row'>
                                        <h5>
                                            Emergency Contact {index + 1}
                                        </h5>
                                    </div>
                                    <hr></hr>
                                    <div className='row'>
                                        <FormControl variant="outlined" disabled>
                                            <InputLabel htmlFor="component-outlined">Name</InputLabel>
                                            <OutlinedInput id="component-outlined" value={row.firstName + " " + row.lastName} label="Name" />
                                            </FormControl>
                                    </div>
                                    <div className='row'>
                                        <FormControl variant="outlined" disabled>
                                            <InputLabel htmlFor="component-outlined">Phone</InputLabel>
                                            <OutlinedInput id="component-outlined" value={row.phone} label="Name" />
                                        </FormControl>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
            </Grid>
    )
};

export default Profile;