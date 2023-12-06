import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, FormControl, InputLabel, Select, MenuItem, styled, TextField, Alert, 
    Button, Tooltip, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Checkbox } from '@mui/material';
import { format, parseISO, set } from 'date-fns';
import InfoIcon from '@mui/icons-material/Info';

import { setSelectedTimesheet_action, updateTimesheet_action, getProfile_action } from '../../actions/actions';
import { getProfile_api } from '../../services/apiServices';

const Timesheet = () => {
    const dispatch = useDispatch();

    const selected_timesheet = useSelector(state => state.selected_timesheet);
    const summaryList = useSelector(state => state.summary_list);
    const user_profile = useSelector(state => state.user_profile);

    const [profile, setProfile] = useState(user_profile);
    const [newTimesheet, setNewTimesheet] = useState(selected_timesheet);
    const [isValid, setValid] = useState(true);
    const [isApproved, setApproved] = useState(false);
    const [floatingDayRemain, setFloatingDayRemain] = useState(profile.remainingFloatingDay);
    const [vacationDayRemain, setVacationDayRemain] = useState(profile.remainingVacationDay);
    const [floatingDayAllowed, setFloatingDayAllowed] = useState(true);
    const [vacationDayAllowed, setVacationDayAllowed] = useState(true);
    const [notify, setNotify] = useState(false);
    const [docType, setDocType] = useState("");
    const [selectedDocument, setSelectedDocument] = useState(null);

    // set default selected timesheet
    useEffect(() => {
        if(!selected_timesheet && summaryList.length>0) {
            const latestTimesheet = summaryList[0];
            dispatch(setSelectedTimesheet_action(latestTimesheet));
            setNewTimesheet(latestTimesheet);
        }
        getProfile_api(user_profile.id).
            then(response => {
                setProfile(response.data);
                setFloatingDayRemain(response.data.remainingFloatingDay);
                setVacationDayRemain(response.data.remainingVacationDay);
            }
        );
    }, [dispatch, summaryList, selected_timesheet]);

    // Update selected timesheet, including its billing, compensated hours, starting time, ending time
    // based on floating, vacation and holiday status for each day
    useEffect(() => {
        if(newTimesheet && newTimesheet.weeklyTimesheet.approvalStatus === "Approved") {
            setApproved(true);
        }

        if(newTimesheet && profile && (profile.remainingFloatingDay <=0 || floatingDayRemain <= 0)) {
            setFloatingDayAllowed(false);
        } else {
            setFloatingDayAllowed(true);
        }

        if(newTimesheet && profile && (profile.remainingVacationDay <=0 || vacationDayRemain <= 0)) {
            setVacationDayAllowed(false);
        } else {
            setVacationDayAllowed(true);
        }

        const calcBillingAndCompensatedHours_updateDayUsed = () => {
            var billingHours = 0;
            var compensatedHours = 0;
            var paidOffDay = 0;
            var floatingDayUsed = 0;
            var holidayUsed = 0;
            var vacationDayUsed = 0;
            newTimesheet && newTimesheet.weeklyTimesheet.dailyTimesheets.forEach(daily => {
                
                if(!(daily.holiday || daily.floatingDay || daily.vacationDay || daily.day === "Saturday" || daily.day === "Sunday")) {
                    let hour_diff = calcTotalHours(daily.startingTime, daily.endingTime);
                    billingHours = billingHours + parseFloat(hour_diff);
                }
                else if(daily.holiday){
                    holidayUsed = holidayUsed + 1;
                }
                else if(daily.floatingDay) {
                    floatingDayUsed = floatingDayUsed + 1;
                }
                else if(daily.vacationDay) {
                    vacationDayUsed = vacationDayUsed + 1;
                }
            });
            paidOffDay = floatingDayUsed + vacationDayUsed + holidayUsed;
            compensatedHours = billingHours + paidOffDay * 8;
            setNewTimesheet({
                ...newTimesheet,
                weeklyTimesheet: {
                    ...newTimesheet.weeklyTimesheet,
                    floatingDayUsed: floatingDayUsed,
                    vacationDayUsed: vacationDayUsed,
                    holidayUsed: holidayUsed,
                    totalBillingHours: parseFloat(billingHours.toFixed(2)),
                    totalCompensatedHours: parseFloat(compensatedHours.toFixed(2))
                }
            })
        }
        newTimesheet && calcBillingAndCompensatedHours_updateDayUsed();

    }, [newTimesheet?.weeklyTimesheet.weekEnding, newTimesheet?.weeklyTimesheet.dailyTimesheets])

    

    useEffect(() => {
        // Set a timeout to automatically close the notification after 10,000 milliseconds (10 seconds)
        const timeoutId = setTimeout(() => {
          setNotify(false);
        }, 10000);
    
        // Clear the timeout when the component unmounts or when notify changes to false
        return () => clearTimeout(timeoutId);
      }, [notify]);


    const StyledFormControl = styled(FormControl)(({ theme }) => ({
        margin: theme.spacing(0),
        minWidth: 220,
    }));

    const handleWeekChange = (e) => {
        const newlySelectedTimesheet = summaryList.filter(obj => {
            return obj.weeklyTimesheet.weekEnding ===e.target.value;
        })

        dispatch(setSelectedTimesheet_action(newlySelectedTimesheet[0]));
        setNewTimesheet(newlySelectedTimesheet[0]);
    }

    const weekEndingFormatter = (weekEnding) => {
        const parsedDate = parseISO(weekEnding);
        return format(parsedDate, 'dd MMMM yyyy');
    }

    const dateFormatter = (date) => {
        //date: 2023-11-27
        const parsedDate = parseISO(date);
        return format(parsedDate, 'MM/dd/yyyy');
    }

    const resetBoxHandler = () => {

        const changedDailyTimesheets = newTimesheet.weeklyTimesheet.dailyTimesheets.map(dailyTimesheet => ({
            ...dailyTimesheet,
            floatingDay: false,
            vacationDay: false
        }));
        setFloatingDayRemain(profile.remainingFloatingDay);
        setVacationDayRemain(profile.remainingVacationDay);

        setNewTimesheet({
            ...newTimesheet,
            weeklyTimesheet: {
                ...newTimesheet.weeklyTimesheet,
                dailyTimesheets: changedDailyTimesheets
            }
        })
    }

    const postTemplate = () => {
        // api service to upload template
        const template = newTimesheet.weeklyTimesheet.dailyTimesheets;
        window.alert("saved as default successfully");
    }

    const handleStartingTimeChange = (index, e) => {
        let dailyTimesheets = [...newTimesheet.weeklyTimesheet.dailyTimesheets];
        let changedDailyTimesheet = {...dailyTimesheets[index]};

        changedDailyTimesheet.startingTime = e.target.value;

        var start =  new Date('01/07/2007 ' + changedDailyTimesheet.startingTime);
        var end = new Date('01/07/2007 ' + changedDailyTimesheet.endingTime);

        (end < start) ? setValid(false) : setValid(true);
        
        dailyTimesheets[index] = changedDailyTimesheet;
        setNewTimesheet({
            ...newTimesheet,
            weeklyTimesheet: {
                ...newTimesheet.weeklyTimesheet,
                dailyTimesheets: dailyTimesheets
            }
        });
    }

    const handleEndingTimeChange = (index, e) => {
        let dailyTimesheets = [...newTimesheet.weeklyTimesheet.dailyTimesheets];
        let changedDailyTimesheet = {...dailyTimesheets[index]};

        changedDailyTimesheet.endingTime = e.target.value;

        var start =  new Date('01/07/2007 ' + changedDailyTimesheet.startingTime);
        var end = new Date('01/07/2007 ' + changedDailyTimesheet.endingTime);

        (end < start) ? setValid(false) : setValid(true);
        
        dailyTimesheets[index] = changedDailyTimesheet;
        setNewTimesheet({
            ...newTimesheet,
            weeklyTimesheet: {
                ...newTimesheet.weeklyTimesheet,
                dailyTimesheets: dailyTimesheets
            }
        });
    }

    const calcTotalHours = (startingTime, endingTime) => {
        const start = new Date('01/07/2007' + ' ' + startingTime);
        const end = new Date('01/07/2007' + ' ' + endingTime);

        var diff = (end - start) / 60 / 60 / 1000;
        diff = diff.toFixed(2);

        return diff;
    }

    const handleFloatingDayChange = (index, e) => {
        let dailyTimesheets = [...newTimesheet.weeklyTimesheet.dailyTimesheets]
        let changedDailyTImesheet = {...dailyTimesheets[index]}

        changedDailyTImesheet.floatingDay = e.target.checked;

        if(e.target.checked === true) {
            setFloatingDayRemain(floatingDayRemain - 1);
        } else {
            setFloatingDayRemain(floatingDayRemain + 1);
        }

        dailyTimesheets[index] = changedDailyTImesheet;
        setNewTimesheet({
            ...newTimesheet,
            weeklyTimesheet: {
                ...newTimesheet.weeklyTimesheet,
                dailyTimesheets: dailyTimesheets                
            }
        })
    }

    const hanldeVacationDayChange = (index, e) => {
        let dailyTimesheets = [...newTimesheet.weeklyTimesheet.dailyTimesheets]
        let changedDailyTimesheet = {...dailyTimesheets[index]}

        changedDailyTimesheet.vacationDay = e.target.checked;

        if(e.target.checked === true) {
            setVacationDayRemain(vacationDayRemain - 1);
        } else {
            setVacationDayRemain(vacationDayRemain + 1);
        }

        dailyTimesheets[index] = changedDailyTimesheet;
        setNewTimesheet({
            ...newTimesheet,
            weeklyTimesheet: {
                ...newTimesheet.weeklyTimesheet,
                dailyTimesheets: dailyTimesheets                
            }
        })
    }

    const handleHolidayChange = (index, e) => {
        let dailyTimesheets = [...newTimesheet.weeklyTimesheet.dailyTimesheets]
        let changedDailyTImesheet = {...dailyTimesheets[index]}

        changedDailyTImesheet.holiday = e.target.checked;

        dailyTimesheets[index] = changedDailyTImesheet;
        setNewTimesheet({
            ...newTimesheet,
            weeklyTimesheet: {
                ...newTimesheet.weeklyTimesheet,
                dailyTimesheets: dailyTimesheets                
            }
        })
    }

    const postWeeklyTimesheet = () => {
        setNotify(true);

        let weeklyTimesheet = {...newTimesheet.weeklyTimesheet}
        let document = {...weeklyTimesheet.document}
        if(docType && selectedDocument) {
            document.type = docType;
        }

        const latestNewTimesheet = {
            ...newTimesheet,
            weeklyTimesheet: {
                ...weeklyTimesheet,
                document: document
            }
        };

        setNewTimesheet(latestNewTimesheet);
        console.log("to be posted", latestNewTimesheet);
        dispatch(updateTimesheet_action(profile.id, latestNewTimesheet.weeklyTimesheet));
        // also re-fetch profile to update remaining floating and vacation days
        dispatch(getProfile_action(profile.id));
    }

    const uploadDocument = () => {
        // api service to upload file to amazonS3

    }

    return (
        (newTimesheet && summaryList.length>0)
        ?
        (<div>
            <Grid
                container
                spacing={2}
                style={{ minWidth: 650 }}
                direction="row"
                // justifyContent="space-between"
                alignItems="flex-start"
            >
                <Grid item>
                    <StyledFormControl variant="filled" >
                        <InputLabel id="demo-simple-select-filled-label" shrink={true}>Week Ending</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            defaultValue={newTimesheet?.weeklyTimesheet?.weekEnding}
                            onChange={(e)=> handleWeekChange(e)}
                            displayEmpty
                            MenuProps={{
                                PaperProps: {
                                sx: {
                                    maxHeight: 250
                                },
                                },
                            }}
                        >
                            {summaryList.length>0 && summaryList.map((timesheet) => (
                                <MenuItem value={timesheet.weeklyTimesheet.weekEnding} key={timesheet.id}>{weekEndingFormatter(timesheet.weeklyTimesheet.weekEnding)}</MenuItem>
                            ))}
                        </Select>
                    </StyledFormControl>
                </Grid>
                <Grid item>
                    <TextField
                        id="filled-disabled"
                        label="Total Billing Hours"
                        type="number"
                        value={newTimesheet.weeklyTimesheet.totalBillingHours.toFixed(2)}
                        InputLabelProps={{
                            shrink: true
                        }}
                        inputProps={{
                            min: 0,
                            style: { textAlign: 'center' , minWidth: 100}
                        }}
                        InputProps={{
                            readOnly: true
                        }}
                        variant="filled"
                    
                    />
                </Grid>
                <Grid item>
                    <TextField
                        id="filled-read-only-input"
                        label="Total Compensated Hours"
                        type="number"
                        value={newTimesheet.weeklyTimesheet.totalCompensatedHours.toFixed(2)}
                        inputProps={{
                            min: 0,
                            style: { textAlign: 'center' , minWidth: 100}
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="filled"
                    />
                </Grid>
            </Grid>
            <br></br>
            <Grid container direction="row" alignItems="center" spacing={2} justifyContent="flex-end">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={resetBoxHandler} disabled={isApproved}>
                        Reset CheckBoxes
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={postTemplate} disabled={!isValid}>
                        Set Default <div>&nbsp;</div>
                        <Tooltip title="Save daily hours as default; future weekly timesheet will show same hours">
                        <span>
                            <InfoIcon />
                        </span> 
                    </Tooltip>
                    </Button>
                </Grid>

            </Grid>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Day</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Starting Time</TableCell>
                            <TableCell align="center">Ending Time</TableCell>
                            <TableCell align="center">Total Hours</TableCell>
                            <TableCell align="center">Floating Day</TableCell>
                            <TableCell align="center">Holiday</TableCell>
                            <TableCell align="center">Vacation Day</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {newTimesheet && newTimesheet.weeklyTimesheet.dailyTimesheets.map((row, index) => (
                            <TableRow key={row.day}>
                                <TableCell component="th" scope="row">{row.day}</TableCell>
                                <TableCell align="center">{dateFormatter(row.date)}</TableCell>
                                <TableCell align="center">{(row.holiday || row.vacationDay || row.floatingDay || row.day === 'Sunday' || row.day === 'Saturday') 
                                    ? <span>N/A</span>
                                    :
                                    <TextField
                                        id="time"
                                        type="time"
                                        value={row.startingTime}
                                        onChange={(e)=>handleStartingTimeChange(index, e)}
                                        InputLabelProps={{
                                        shrink: true,
                                        }}
                                        inputProps={{
                                        step: 1800, // 1800s = 30 min
                                        }}
                                        disabled={isApproved}
                                        size="small"
                                    ></TextField>
                                    }
                                </TableCell>
                                <TableCell align="center">{(row.holiday || row.vacationDay || row.floatingDay || row.day === 'Sunday' || row.day === 'Saturday') 
                                    ? <span>N/A</span>
                                    :
                                    <TextField
                                        id="time"
                                        type="time"
                                        value={row.endingTime}
                                        onChange={(e)=>handleEndingTimeChange(index, e)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            step: 1800, // 1800s = 30 min
                                        }}
                                        disabled={isApproved}
                                        size="small"
                                    ></TextField>
                                    }
                                </TableCell>
                                <TableCell align='center'>
                                    {(row.holiday || row.vacationDay || row.floatingDay || row.day === 'Sunday' || row.day === 'Saturday') 
                                    ? <span>0.00</span>
                                    : ((calcTotalHours(row.startingTime, row.endingTime) > 0) ? <span>{calcTotalHours(row.startingTime, row.endingTime)}</span> : <span>InValid</span> )}
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={row.floatingDay}
                                        onChange={(e)=>handleFloatingDayChange(index, e)}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                        disabled={row.holiday || row.vacationDay || isApproved || (!floatingDayAllowed && !row.floatingDay)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={row.holiday}
                                        onChange={(e)=>handleHolidayChange(index, e)}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                        disabled={row.floatingDay || row.vacationDay || isApproved}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={row.vacationDay}
                                        onChange={(e)=>hanldeVacationDayChange(index, e)}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                        disabled={row.floatingDay || row.holiday || isApproved || (!vacationDayAllowed && !row.vacationDay)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <br></br>

            <div>
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={10}
                >
                    <Grid item>
                        <TextField 
                            select 
                            variant="outlined"
                            sx={{textAlign: 'center' , minWidth: 300}}
                            defaultValue="" 
                            onChange={(e)=>setDocType(e.target.value)} 
                            label="Document Approval Status" 
                        >
                            <MenuItem value="approved timesheet">Approved Timesheet</MenuItem>
                            <MenuItem value="unapproved timesheet">Unapproved Timesheet</MenuItem>
                        </TextField>
                </Grid>
                
                    <Grid item>
                            <input type="file" onChange={(e) => setSelectedDocument(e.target.files[0])} accept=".pdf, .doc, .docx, .jpeg, .xlsx, .jpg"/>
                    </Grid>

                </Grid>
                <Grid 
                    container 
                    direction="row" 
                    alignItems="center" 
                    justifyContent="flex-end"
                >
                    <Button variant="contained" color="primary" onClick={()=>{postWeeklyTimesheet(); uploadDocument();}} disabled={!isValid}>
                        Save
                    </Button>
                </Grid>
            </div>
            <br></br>
            {notify && <Alert onClose={() => {setNotify(false);}}>update saved at {new Date().toLocaleTimeString()}!</Alert>}
        </div>)
        :
        (<div>waiting...</div>)
    )
};

export default Timesheet;