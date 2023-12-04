import { getProfile_api, getSummaryList_api } from "../services/apiServices";

export const getProfile_action = (userId) => async (dispatch) => {
    try {
        await getProfile_api(userId)
            .then(response => {
                dispatch({
                    type: 'SET_PROFILE',
                    payload: response.data
                });
                console.log("successfully fetched user profile", response.data);
            });
    } catch (error) {
        console.log(error.message);
    }
};

export const getSummaryList_action = (userId) => async (dispatch) => {
    try {
        await getSummaryList_api(userId)
            .then(response => {
                dispatch({
                    type: 'SET_SUMMARY_LIST',
                    payload: response.data
                });
                console.log("successfully fetched summary list", response.data);
            });
    } catch (error) {
        console.log(error.message);
    }
};