import axios from 'axios';

const jwt = localStorage.getItem('JWT');
const gateWayApi = axios.create({
    baseURL: 'http://localhost:9000',
    headers: {
        'Authorization': `Bearer ${jwt}`,
    }
});


export const getProfile_api = async (userId) => {
    try {
        const response = await gateWayApi.get(`/profile/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
};

export const getSummaryList_api = async (userId) => {
    
    try {
        const response = await gateWayApi.get(`/timesheet/summary/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching summary list:', error);
    }
};

export const updateTimesheet_api = async (userId, weeklyTimesheet) => {

    try {
        const response = await gateWayApi.patch(`/timesheet/${userId}`, weeklyTimesheet);
        return response.data;
    } catch (error) {
        console.error('Error updating timesheet:', error);
    }
};

export const updateTemplate_api = async (userId, template) => {
    try {
        const response = await gateWayApi.patch(`/timesheet/template/${userId}`, template);
        return response.data;
    } catch (error) {
        console.error('Error updating template:', error);
    }
};

export const uploadDocument_api = async (userId, weekEnding, document) => {
    try {
        const formData = new FormData();
        formData.append('document', document);
        const response = await gateWayApi.patch(
            '/timesheet/uploadDocument',
            formData,
            {
                params: {
                    profileId: userId,
                    weekEnding: weekEnding,
                },
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error uploading document:', error);
    }
};

export const uploadProfileAvatar_api = async (userId, document) => {
    try {
        const formData = new FormData();
        formData.append('document', document);
        const response = await gateWayApi.post(
            `/profile/uploadAvatar`,
            formData,
            {
                params: {
                    profileId: userId,
                },
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error uploading avatar:', error);
    }
}

export const updateProfile_api = async (profile) => {
    try {
        const response = await gateWayApi.patch(`/profile/${profile.id}`, profile);
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
    }
};