import actionTypes from '../actions/actionTypes';
import { ifJwtExpired } from '../utils/jwtParser';

const initialState = {
    user_profile: {
        name: '',
        id: ''
    },
    summary_list: [],
    selected_timesheet: null,
    isLoggedIn: localStorage.getItem('JWT') && !ifJwtExpired(localStorage.getItem('JWT')) && localStorage.getItem('userId')
}

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_PROFILE:
            return {
                ...state,
                user_profile: action.payload
            };
        case actionTypes.SET_SUMMARY_LIST:
            return {
                ...state,
                summary_list: action.payload
            };
        case actionTypes.SET_SELECTED_TIMESHEET:
            return {
                ...state,
                selected_timesheet: action.payload
            };
        case actionTypes.UPDATE_TIMESHEET:
            return {
                ...state,
                selected_timesheet: {
                    ...state.selected_timesheet,
                    weeklyTimesheet: {
                        ...action.payload
                    }
                },
                summary_list: state.summary_list.map((summary) => {
                    if (summary.weeklyTimesheet.weekEnding === action.payload.weekEnding) {
                        return {
                            ...summary,
                            weeklyTimesheet: {
                                ...action.payload
                            }
                        }
                    } else {
                        return summary;
                    }
                })
            };
        case actionTypes.SET_LOGIN:
            return {
                ...state,
                isLoggedIn: action.payload
            };
        default:
            return state;
    }
};