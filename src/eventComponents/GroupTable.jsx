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

function GroupTable() {
    const { eventKey } = useParams();
    const [startTime, setStartTime] = useState(-1);
    const [endTime, setEndTime] = useState(-1);
    const [dates, setDates] = useState([]);
    const [tableContent, setTableContent] = useState('');
    const [peopleData, setPeopleData] = useState(null);
    const [hoveredCell, setHoveredCell] = useState(null);
    const [totalPeople, setTotalPeople] = useState(0);
    const [transparencyBar, setTransparencyBar] = useState('')

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
                        setDates(JSON.parse(event.dates));
                        setTotalPeople(event.userCount);
                    }
                }

                const { data: people, error: peopleError } = await Database
                .from('people')
                .select('user, availability')
                .eq('id', eventKey)
                .neq('availability', 'null');
                if (peopleError) {
                    console.error('Error fetching people:', peopleError);
                    return;
                }
                const formattedPeople = people.map(person => ({
                    user: person.user,
                    availability: JSON.parse(person.availability)
                }));
                setPeopleData(formattedPeople);
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        };

        fetchData();
    }, [eventKey]);

    useEffect(() => {
        const transparencyBar = () => {
            const bar = [];
            if (totalPeople == 0) {
                setTransparencyBar(bar)
                return;
            }
            bar.push(<span key='span1'>0/{totalPeople}&nbsp;&nbsp;</span>)
            for (let i = 0; i <= totalPeople; i++) {
                const color = `rgba(125, 122, 191, ${i / totalPeople})`;
                bar.push(
                    <div
                        key={`transparency-${i}`}
                        style={{ backgroundColor: color,
                                height: '15px',
                                width: '25px',
                                display: 'inline-block',
                                border: '0.5px solid #5C51A6',
                            }}
                    ></div>
                );
            }
            bar.push(<span key='span2'>&nbsp;&nbsp;{totalPeople}/{totalPeople}</span>)
            setTransparencyBar(bar)
        }
        transparencyBar();
    }, [totalPeople])

    useEffect(() => {
        const generateTableContent = () => {
            const headers = [<th key='date/time'>Date/Time</th>];
            for (let i = startTime; i <= endTime - 1; i++) {
                headers.push(<th key={i}>{`${times[i]}`}</th>);
            }
            const headerRow = <tr>{headers}</tr>;

            const rows = dates.map(date => (
                <tr key={date}>
                    <td>{date}</td>
                    {headers.slice(1).map(header => {
                        const index = `${date}-${header.key}`;
                        const peopleAtTime = peopleData.filter(person => person.availability.includes(index)).length;
                        const transparency = (peopleAtTime / totalPeople);
                        const cellStyle = {
                            backgroundColor: `rgba(125, 122, 191, ${transparency})`
                        };
                        return (
                            <td
                                key={index}
                                onMouseEnter={() => handleCellHover(index)}
                                onMouseLeave={() => handleCellHover(null)}
                                style={cellStyle}
                            ></td>
                        )
                    })}
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
    }, [peopleData]);

    const handleCellHover = (key) => {
        if (key === null) {
            setHoveredCell(null);
            return;
        }

        const peopleAtTime = peopleData.filter(person => person.availability.includes(key));
        setHoveredCell({
            key: key,
            people: peopleAtTime,
            count: peopleAtTime.length
        });
    };

    return (
        <div>
            <div id='bar'>
                {transparencyBar}
            </div>
            {hoveredCell ? (
                <p>{hoveredCell.count}/{totalPeople} : {hoveredCell.people.map(person => person.user).join(',  ')}</p>
            ) : (
                <p>&nbsp;</p>
            )}
            {tableContent}
        </div>
    );
}

export default GroupTable;
