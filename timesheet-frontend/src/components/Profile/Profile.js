import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, FormControl, InputLabel, OutlinedInput, Button, TextField } from '@mui/material';

import './Profile.scss';
import { getProfile_api, uploadProfileAvatar_api, updateProfile_api } from '../../services/apiServices';
import { logout_api } from '../../services/authServices';
import { setLogin_action } from '../../actions/actions';

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const profile_store = useSelector(state => state.user_profile);
    const isLoggedIn_store = useSelector(state => state.isLoggedIn);
    const [profile, setProfile] = useState(profile_store);
    const [document, setDocument] = useState(null);

    useEffect(() => {
        if(!isLoggedIn_store) {
            navigate('/welcome');
        }
        // make sure to get the latest profile from the database
        if(profile_store?.id) {
            getProfile_api(profile_store.id)
            .then(response => {
                setProfile(response.data);
            });
        }
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

    const handleEmergencyContactChange = (prop, index) => (event) => {
        const newEmergencyContacts = profile.contact.emergencyContacts.map((row, i) => {
            if(i === index) {
                return {
                    ...row,
                    [prop]: event.target.value
                }
            } else {
                return row;
            }
        });
        setProfile({
            ...profile,
            contact: {
                ...profile.contact,
                emergencyContacts: newEmergencyContacts
            }
        });
    }

    const updateProfile = () => {
        updateProfile_api(profile);
    }

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('JWT');
        dispatch(setLogin_action(false));

        navigate('/welcome');
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
                                    <OutlinedInput id="component-outlined" value={profile?.contact?.phone} onChange={handleContactChange('phone')} label="name" />
                                </FormControl>
                            </div>
                            <div className='row'>
                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="component-outlined">Email</InputLabel>
                                    <OutlinedInput id="component-outlined" value={profile?.contact?.email} onChange={handleContactChange('email')} label="email" />
                                </FormControl>
                            </div>
                            <div className='row'>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Address"
                                    multiline
                                    rows={4}
                                    defaultValue=" "
                                    value={profile?.contact?.address}
                                    onChange={handleContactChange('address')}
                                    variant="outlined"
                                />
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
                                        <FormControl variant="outlined">
                                            <InputLabel htmlFor="component-outlined">Name</InputLabel>
                                            <OutlinedInput id="component-outlined" value={row.firstName} label="Name" onChange={handleEmergencyContactChange('firstName', index)}/>
                                            </FormControl>
                                    </div>
                                    <div className='row'>
                                        <FormControl variant="outlined">
                                            <InputLabel htmlFor="component-outlined">Phone</InputLabel>
                                            <OutlinedInput id="component-outlined" value={row.phone} label="Name" onChange={handleEmergencyContactChange('phone', index)}/>
                                        </FormControl>
                                    </div>
                                </div>
                            ))}
                            <div className='row'>
                                <Button variant="contained" color="primary" onClick={updateProfile} >
                                Save
                                </Button>    
                            </div>
                            <div className='row'>
                                <Button variant="contained" color="error" onClick={handleLogout} >
                                Log Out
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </Grid>
    )
};

export default Profile;