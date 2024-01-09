import { getProfile_api, getSummaryList_api, updateTimesheet_api } from "../services/apiServices";
import actionTypes from "./actionTypes";

export const getProfile_action = (userId) => async (dispatch) => {
    try {
        await getProfile_api(userId)
            .then(response => {
                dispatch({
                    type: actionTypes.SET_PROFILE,
                    payload: response.data
                });
                // console.log("successfully fetched user profile", response.data);
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
                    type: actionTypes.SET_SUMMARY_LIST,
                    payload: response.data
                });
                // console.log("successfully fetched summary list", response.data);
            });
    } catch (error) {
        console.log(error.message);
    }
};

export const setSelectedTimesheet_action = (timesheet) => async (dispatch) => {
    try {
        dispatch({
            type: actionTypes.SET_SELECTED_TIMESHEET,
            payload: timesheet
        });
        // console.log("successfully set selected timesheet", timesheet);
    } catch (error) {
        console.log(error.message);
    }
};

export const updateTimesheet_action = (userId, weeklyTimesheet) => async (dispatch) => {
    try {
        await updateTimesheet_api(userId, weeklyTimesheet)
            .then(response => {
                dispatch({
                    type: actionTypes.UPDATE_TIMESHEET,
                    payload: response.data
                });
                // console.log("successfully updated timesheet", response.data);
            });
    } catch (error) {
        console.log(error.message);
    }
};

export const setLogin_action = (isLoggedIn) => async (dispatch) => {
    try {
        dispatch({
            type: actionTypes.SET_LOGIN,
            payload: isLoggedIn
        });
    } catch (error) {
        console.log(error.message);
    }
};