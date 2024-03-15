import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Database from '../Database';
import '../Event.css';

const times = [
    "12:00am", "01:00am", "02:00am", "03:00am", "04:00am", "05:00am", "06:00am",
    "07:00am", "08:00am", "09:00am", "10:00am", "11:00am", "12:00pm", "01:00pm",
    "02:00pm", "03:00pm", "04:00pm", "05:00pm", "06:00pm", "07:00pm", "08:00pm",
    "09:00pm", "10:00pm", "11:00pm", "12:00am"
];

function UserTable(user) {
    const { eventKey } = useParams();
    const [startTime, setStartTime] = useState(-1);
    const [endTime, setEndTime] = useState(-1);
    const [dates, setDates] = useState([]);
    const [selectedCells, setSelectedCells] = useState([]);
    const [tableContent, setTableContent] = useState('');

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
                    console.log('Event:', event);
                    if (event) {
                        setStartTime(event.startTime);
                        setEndTime(event.endTime);
                        setDates(JSON.parse(event.dates))
                    }
                }
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        };

        fetchData();
    }, [eventKey]);

    useEffect(() => {
        const generateTableContent = () => {
            function handleCellClick(cellKey) {
                setSelectedCells(prevSelectedCells => {
                    if (prevSelectedCells.includes(cellKey)) {
                        return prevSelectedCells.filter(key => key !== cellKey);
                    } else {
                        return [...prevSelectedCells, cellKey];
                    }
                });
            }

            const headers = [<th key='date/time'>Date/Time</th>];
            for (let i = startTime; i <= endTime - 1; i++) {
                headers.push(<th key={i}>{`${times[i]}`}</th>);
            }
            const headerRow = <tr>{headers}</tr>;

            const rows = dates.map(date => (
                <tr key={date}>
                    <td>{date}</td>
                    {headers.slice(1).map(header => (
                        <td key={`${date}-${header.key}`}>
                            <button
                                className= {`cellButton ${selectedCells.includes(`${date}-${header.key}`) ? 'selected' : ''}`}
                                type='button'
                                onClick={() => handleCellClick(`${date}-${header.key}`)}
                            >&nbsp;</button>
                        </td>
                    ))}
                </tr>
            ));

            setTableContent(
                <div className='tableContainer'>
                    <table>
                        <thead>{headerRow}</thead>
                        <tbody>{rows}</tbody>
                    </table>
                </div>
            );
        };

        generateTableContent();
    }, [dates, startTime, endTime, selectedCells]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { updateError } = await Database
                .from('people')
                .update({ availability: JSON.stringify(selectedCells) })
                .eq('id', eventKey)
                .eq('user', user.user)
                .select();
            if (updateError) {
                console.error('Error updating availability :', updateError);
                return;
            }
            console.log('Availability updated successfully:', JSON.stringify(selectedCells));
            window.location.reload();
        } catch (error) {
            console.error('Error updating availability:', error);
        }
    };

    return (
        <form id='userTable' onSubmit={handleSubmit}>
            {tableContent}
            <br></br>
            <button type='submit' id='tableButton'>Submit</button>
        </form>
    );
}

export default UserTable;
