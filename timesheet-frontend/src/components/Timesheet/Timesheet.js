import React from 'react';

import { useSelector } from 'react-redux';

const Timesheet = () => {

    const selected_timesheet = useSelector(state => state.selected_timesheet);

    return (
        <div>
            <h1>Timesheet</h1>
            <p>{JSON.stringify(selected_timesheet)}</p>
        </div>
    )
};

export default Timesheet;