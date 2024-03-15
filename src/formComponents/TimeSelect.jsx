import React from 'react';

function TimeSelect({ label, value, onChange }) {
    function generateOptions() {
        const options = [];
        for (let hour = 0; hour <= 24; hour++) {
            let amPm = hour < 12 || hour === 24 ? 'AM' : 'PM';
            let formattedHour = hour % 12;
            formattedHour = formattedHour === 0 ? 12 : formattedHour;
            formattedHour = formattedHour.toString().padStart(2, '0');
            options.push(
                <option key={hour} value={hour}>
                    {`${formattedHour}:00 ${amPm}`}
                </option>
            );
        }
        return options;
    }

    return (
        <div>
            <label htmlFor={label}>{label}:</label>
            <select id={label} name={label} required value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">--:--</option>
                {generateOptions()}
            </select>
        </div>
    );
}

export default TimeSelect;