const initialState = {
    user_profile: {
        name: 'Yangfei',
        id: '6562a44315353d2dfd584126'
    },
    summary_list: [],
    selected_timesheet: {}
}

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_PROFILE':
            return {
                ...state,
                user_profile: action.payload
            };
        case 'SET_SUMMARY_LIST':
            return {
                ...state,
                summary_list: action.payload
            };
        case 'SET_SELECTED_TIMESHEET':
            return {
                ...state,
                selected_timesheet: action.payload
            };
        default:
            return state;
    }
};