import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getSummaryList_action } from '../../actions/actions';

const Summary = () => {
    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        dispatch(getSummaryList_action(userId));
    }, []);

    const summaryList = useSelector(state => state.summary_list);

    return (
        <div>
            <h1>Summary</h1>
            <p>The following is the summary list:</p>
            {summaryList.map((summary, index) => 
                <div key={index}>
                    <p>WeekEnding: {summary.weeklyTimesheet.weekEnding}</p>
                </div>
            )
            }
        </div>
    )
};

export default Summary;