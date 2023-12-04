import axios from 'axios';

export const getProfile_api = async (userId) => {
    return axios.get(`http://localhost:11000/profile/${userId}`)
        .then(res => res.data)
        .catch(err => console.log(err));
};

export const getSummaryList_api = async (userId) => {
    return axios.get(`http://localhost:10000/timesheet/summary/${userId}`)
        .then(res => res.data)
        .catch(err => console.log(err));
};