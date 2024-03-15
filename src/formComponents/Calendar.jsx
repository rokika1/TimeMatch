import React, { useState, useEffect } from 'react';

const months = ["January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"];

function Calendar({ selectedDates, setSelectedDates }) {
    const [displayMonth, setDisplayMonth] = useState(new Date().getMonth());
    const [displayYear, setDisplayYear] = useState(new Date().getFullYear());

    useEffect(() => {
        generateCalendar();
    }, [displayMonth, displayYear, selectedDates]);

    function navigateMonth(direction) {
        let newMonth = displayMonth + direction;
        let newYear = displayYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        setDisplayMonth(newMonth);
        setDisplayYear(newYear);
    }

    function handleDateClick(dateKey) {
        const newDateKeys = [...selectedDates];
        const dateIndex = newDateKeys.indexOf(dateKey);
        if (dateIndex !== -1) {
            newDateKeys.splice(dateIndex, 1);
        } else {
            newDateKeys.push(dateKey);
        }
        setSelectedDates(newDateKeys);
    }

    function generateCalendar() {
        const monthLength = new Date(displayYear, displayMonth + 1, 0).getDate();
        const firstDay = new Date(displayYear, displayMonth, 1).getDay();

        const calendarRows = [];
        let date = 1;
        for (let row = 0; row < 6; row++) {
            const weekCells = [];
            for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                if (row === 0 && dayOfWeek < firstDay - 1) {
                    weekCells.push(<td key={`${row}-${dayOfWeek}`}></td>);
                } else if (date > monthLength) {
                    weekCells.push(<td key={`${row}-${dayOfWeek}`}></td>);
                } else {
                    const dateKey = `${String(date).padStart(2,'0')}-${String(displayMonth + 1).padStart(2,'0')}-${displayYear}`;
                    weekCells.push(
                        <td key={`${row}-${dayOfWeek}`}>
                            <button
                                className={`dayButton ${selectedDates.includes(dateKey) ? 'selected' : ''}`}
                                type="button"
                                onClick={() => handleDateClick(dateKey)}
                            >
                                {date}
                            </button>
                        </td>
                    );
                    date++;
                }
            }
            calendarRows.push(<tr key={row}>{weekCells}</tr>);
            if (date > monthLength) {
                break;
            }
        }

        return calendarRows;
    }

    return (
        <div>
            <div id="monthNavigator">
                <button id="prevMonth" type="button" onClick={() => navigateMonth(-1)}>&larr;</button>
                <div id="currentMonth">{`${months[displayMonth]} ${displayYear}`}</div>
                <button id="nextMonth" type="button" onClick={() => navigateMonth(1)}>&rarr;</button>
            </div>
            <table id="calendar">
                <thead>
                    <tr>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{generateCalendar()}</tbody>
            </table>
        </div>
    );
}

export default Calendar;
