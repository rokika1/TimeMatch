import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Database from '../Database';
import '../Event.css';

function Comments() {
    const [comments, setComments] = useState([]);
    const { eventKey } = useParams();

    useEffect(() => {
        const fetchComments = async () => {
            const { data, error } = await Database
                .from('comments')
                .select('comment, user, time')
                .eq('id', eventKey);

            if (error) {
                console.error('Error fetching comments:', error.message);
            } else {
                setComments(data);
            }
        };

        fetchComments();
    }, [eventKey]);

    return (
        <div id='commentBox'>
            {comments.map((comment, index) => (
                <div className='comment' key={index}>
                    <p><strong>{comment.user}</strong></p>
                    <p id='lighter'>{comment.time}</p>
                    <p>Comment: {comment.comment}</p>
                </div>
            ))}
        </div>
    );
}

export default Comments;