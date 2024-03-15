import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Database from './Database';
import { v4 as uuidv4 } from 'uuid';
import TimeSelect from './formComponents/TimeSelect';
import Calendar from './formComponents/Calendar';
import './App.css';

function Form() {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedDates, setSelectedDates] = useState([]);
    const navigate = useNavigate();

    const sortedDates = selectedDates.sort((a, b) => {
        const dateA = new Date(a.split('-').reverse().join('-'));
        const dateB = new Date(b.split('-').reverse().join('-'));
        return dateA - dateB;
    });
    
    async function handleSubmit(event) {
        event.preventDefault();

        if (Number(startTime) >= Number(endTime)) {
          alert('End time must be after start time');
          return;
        }

        if (selectedDates.length === 0) {
          alert('Please select at least one date');
          return;
        }

        const key = uuidv4();
        try {
            const { data, error } = await Database
            .from('events')
            .insert([{
                id: key,
                name: eventName,
                description: description,
                startTime: startTime,
                endTime: endTime,
                dates: JSON.stringify(sortedDates)
            }])
            .select()
      
            if (error) {
                console.error('Error inserting event:', error);
            } else {
                console.log('Event inserted successfully:', data);
                navigate(`/event/${key}`);
            }
        } catch (error) {
            console.error('Error inserting event:', error);
        }
    }

    return (
        <div className='app'>
            <div id="mainHeader">
                <h1>TimeMatch</h1>
            </div>
            <div id='form'>
                <form id="eventForm" onSubmit={handleSubmit}>
                    <div id='leftForm'>
                        <h2>Create Event</h2>
                        <label htmlFor="eventName">Name:</label>
                        <input type="text" id="eventName" maxLength={50} required value={eventName} onChange={(e) => setEventName(e.target.value)} />
                        <label htmlFor="description" >Description(optional):</label>
                        <textarea id="description" name="description" rows={3} maxLength={300} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        <TimeSelect 
                            label="Start Time"
                            value={startTime}
                            onChange={setStartTime}
                        />
                        <TimeSelect 
                            label="End Time"
                            value={endTime}
                            onChange={setEndTime}
                        />
                    </div>
                    <div id="rightForm">
                        <p>Select Day:</p>
                        <div id="calendarContainer">
                            <Calendar
                                selectedDates={selectedDates}
                                setSelectedDates={setSelectedDates}
                            />
                        </div>
                        <input id="submitButton" type="submit" value="Submit"></input>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Form;
