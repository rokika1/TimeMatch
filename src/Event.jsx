import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import Database from './Database';
import Auth from './eventComponents/Auth';
import GroupTable from './eventComponents/GroupTable';
import Comments from './eventComponents/Comments';
import './Event.css';

function Form() {
    const [eventName, setEventName] = useState('');
    const [eventDescription, setDescription] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const { eventKey } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await Database
                    .from('events')
                    .select('*')
                    .eq('id', eventKey);
                if (error) {
                    console.error('Error fetching event:', error);
                } else {
                    console.log('Event fetched successfully:', data);
                    const event = data[0];
                    if (event) {
                        setEventName(event.name);
                        setDescription(event.description);
                        setEventTime(event.eventTime);
                        setEventLocation(event.eventLocation);
                    }
                }
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        };

        fetchData();
    }, [eventKey, eventName, eventDescription, eventTime, eventLocation]);

    return (
        <div id='event'>
            <div id="eventHeader">
                <h1>TimeMatch</h1>  
            </div>
            <div id='eventDetails'>
                <h2>{eventName}</h2>
                <p><strong>Time:</strong> {eventTime}</p>
                <p><strong>Location:</strong> {eventLocation}</p>
                <p><strong>Description:</strong> {eventDescription}</p>
                <br></br>
                <p><strong>Share the link!</strong></p>
                <a href={`https://localhost:5173/event/${eventKey}`}>{eventName}</a>
                <h3>Comments:</h3>
                <Comments />
            </div>
            <div id='groupDisplay'>
                <h2>Group Availability</h2>
                <GroupTable />
            </div>
            <div id='personalDisplay'>
                <h2>Personal</h2>
                <Auth />
            </div>
        </div>
    )
}

export default Form;
