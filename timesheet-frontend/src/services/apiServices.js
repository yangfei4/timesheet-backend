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

export const updateTimesheet_api = async (userId, weeklyTimesheet) => {
    return axios.patch(`http://localhost:10000/timesheet/${userId}`, weeklyTimesheet)
        .then(res => res.data)
        .catch(err => console.log(err));
};

export const updateTemplate_api = async (userId, template) => {
    return axios.patch(`http://localhost:10000/timesheet/template/${userId}`, template)
        .then(res => res.data)
        .catch(err => console.log(err));
};

export const uploadDocument_api = async (userId, weekEnding, document) => {
    try {
        const formData = new FormData();
        formData.append('document', document);
        const response = await axios.patch(
            'http://localhost:10000/timesheet/uploadDocument',
            formData,
            {
                params: {
                    profileId: userId,
                    weekEnding: weekEnding,
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*'
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
    }
};

export const uploadProfileAvatar_api = async (userId, document) => {
    try {
        const formData = new FormData();
        formData.append('document', document);
        const response = await axios.post(
            `http://localhost:11000/profile/uploadAvatar`,
            formData,
            {
                params: {
                    profileId: userId,
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*'
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
}

export const updateProfile_api = async (profile) => {
    return axios.patch(`http://localhost:11000/profile/${profile.id}`, profile)
        .then(res => res.data)
        .catch(err => console.log(err));
};