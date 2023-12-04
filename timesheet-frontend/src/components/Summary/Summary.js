import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

import './Summary.scss';
import { getSummaryList_action, setSelectedTimesheet_action } from '../../actions/actions';
import paginate from '../../utils/paginate';
import Pagination from './Pagination';
// import actionTypes from '../../actions/actionTypes';

const Summary = () => {

    const summaryList = useSelector(state => state.summary_list);
    const [currentPage, setCurrentPage] = useState(1);
    const page_size = 5;

    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        dispatch(getSummaryList_action(userId));
    }, [userId, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const getSubmissionTagText = (timesheet) => {
        const submissionStatus = timesheet.weeklyTimesheet.submissionStatus;
        const fileType = timesheet.weeklyTimesheet.document.type;
        if(submissionStatus !== "Not Started" && fileType !== "approved timesheet") {
            return 'Items due: Proof of Approved TimeSheet';
        }
        return 'Approval denied by Admin, please contact your HR manager';
    }

    const showTag = (text) => {
        return (
            <Tooltip title={text}>
                <IconButton>
                    <InfoIcon color="info" size="small"></InfoIcon>
                </IconButton>
            </Tooltip>
        )
    }

    const showComment = (timesheet) => {
        const floatingDayUsed = timesheet.weeklyTimesheet.floatingDayUsed;
        const vacationDayUsed = timesheet.weeklyTimesheet.vacationDayUsed;
        const holidayDayUsed = timesheet.weeklyTimesheet.holidayUsed;

        return (
            <span>
                {holidayDayUsed>0 ? <span>{holidayDayUsed} holiday day included</span> : null}
                {floatingDayUsed>0 ? <div>{floatingDayUsed} floating day required {showTag(getCommentTagText_floatingDay(timesheet))}</div> : null}
                {vacationDayUsed>0 ? <span>{vacationDayUsed} vacation day required {showTag(getCommentTagText_vacationDay(timesheet))}</span> : null}
            </span>
        )
    }

    const getCommentTagText_floatingDay = (timesheet) => {
        const floatingDayUsed = timesheet.weeklyTimesheet.floatingDayUsed;

        return (
            <span>
                {floatingDayUsed>0 ? <div>Total floating day left in {new Date().getFullYear()}: {timesheet.profile.remainingFloatingDay} days </div> : null}
            </span>
        )
    }

    const getCommentTagText_vacationDay = (timesheet) => {
        const vacationDayUsed = timesheet.weeklyTimesheet.vacationDayUsed;

        return (
            <span>
                {vacationDayUsed>0 ? <div>Total vacation day left in {new Date().getFullYear()}: {timesheet.profile.remainingVacationDay} days </div> : null} <div></div>
            </span>
        )
    }

    const showOption = (timesheet) => {
        let text = timesheet.weeklyTimesheet.approvalStatus === "approved" ? "View" : "Edit";
        return (
            <Link to="/timesheet" onClick={() => dispatch(setSelectedTimesheet_action(timesheet))}>{text}</Link>
        )
    }

    return (
        <div>
            <h1>Summary</h1>
            <table className='table'>
                <thead>
                    <tr>
                        <th>WeekEnding</th>
                        <th>Total Hours</th>
                        <th>Submission Status</th>
                        <th>Approval Status</th>
                        <th>Option</th>
                        <th>Comment</th>
                    </tr>
                </thead>
                <tbody>
                    {paginate(summaryList, currentPage, page_size).map((timesheet) => 
                        <tr key={timesheet._id}>
                            <td>{timesheet.weeklyTimesheet.weekEnding}</td>
                            <td>{timesheet.weeklyTimesheet.totalBillingHours}</td>
                            <td>
                                {timesheet.weeklyTimesheet.submissionStatus}
                                {timesheet.weeklyTimesheet.submissionStatus === "Incomplete" 
                                    ? showTag(getSubmissionTagText(timesheet))
                                    : null
                                }
                            </td>
                            <td>{timesheet.weeklyTimesheet.approvalStatus}</td>
                            <td>{showOption(timesheet)}</td>
                            <td>
                                {showComment(timesheet)}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination
                itemCounts={summaryList.length}
                pageSize={page_size}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
            />
        </div>
    )
};

export default Summary;