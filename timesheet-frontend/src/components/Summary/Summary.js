import React, { useEffect, useId, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

import './Summary.scss';
import { setSelectedTimesheet_action } from '../../actions/actions';
import { getProfile_api } from '../../services/apiServices';
import paginate from '../../utils/paginate';
import Pagination from './Pagination';
import context from 'react-bootstrap/esm/AccordionContext';

const Summary = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');
    const isLoggedIn_store = useSelector(state => state.isLoggedIn);
    const summaryList = useSelector(state => state.summary_list);
    const profile_store = useSelector(state => state.user_profile);

    const [profile, setProfile] = useState(profile_store);
    const [currentPage, setCurrentPage] = useState(1);
    const page_size = 5;

    // make sure the profile is the latest
    useEffect(() => {
        if(!isLoggedIn_store) {
            navigate('/welcome');
        }
        if(userId) {
            getProfile_api(userId)
            .then(response => {
                setProfile(response.data);
            });
        }
    }, []);

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
                {floatingDayUsed>0 ? <div>Total floating day left in {new Date().getFullYear()}: {profile.remainingFloatingDay} days </div> : null}
            </span>
        )
    }

    const getCommentTagText_vacationDay = (timesheet) => {
        const vacationDayUsed = timesheet.weeklyTimesheet.vacationDayUsed;

        return (
            <span>
                {vacationDayUsed>0 ? <div>Total vacation day left in {new Date().getFullYear()}: {profile.remainingVacationDay} days </div> : null} <div></div>
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
        <div className='table-container'>
            <h2>Timesheet Summary</h2>
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
                        <tr key={timesheet.id}>
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