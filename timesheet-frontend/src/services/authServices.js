import axios from "axios";

const gateWayApi = axios.create({
    baseURL: 'http://localhost:9000/auth'
});

export const login_api = async (username, password) => {
    try {
        const response = await gateWayApi.post('/login', {
            username: username,
            password: password
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
    }
};