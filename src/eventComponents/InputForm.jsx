import React from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Database from '../Database';
import '../Event.css';

function InputForm(user) {
    const { eventKey } = useParams();

    const handleAllocation = async (event, type) => {
        event.preventDefault();
        const value = type === 'time' ? document.getElementById('timeChosen').value : document.getElementById('locationChosen').value;
        const field = type === 'time' ? 'eventTime' : 'eventLocation';
        try {
            const { updateError } = await Database
                .from('events')
                .update({ [field]: `'${value}' chosen by ${user.user}` })
                .eq('id', eventKey)
                .select();
            if (updateError) {
                console.error(`Error updating ${type}:`, updateError);
                return;
            }
            console.log(`${type} updated successfully:`, value);
            window.location.reload();
        } catch (error) {
            console.error(`Error updating ${type}:`, error);
        }
    }

    const handleCommentInsertion = async (event) => {
        event.preventDefault();
        const timestamp = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
        const commentWritten = document.getElementById('commentWritten').value;
        try {
            const { insertionError } = await Database
                .from('comments')
                .insert([
                    { id: eventKey, comment: commentWritten, user: user.user, time: timestamp}
                ])
                .select();
            if (insertionError) {
                console.error('Error adding comment:', insertionError);
                return;
            }
            console.log('Comment added successfully:', commentWritten);
            window.location.reload();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }

    return (
        <div id='inputForms'>
            <form id="timeForm"  onSubmit={(event) => handleAllocation(event, 'time')}>
                <label htmlFor='timeChosen'>Set a time: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </label>
                <input type='text' id='timeChosen'  maxLength={50} placeholder='E.g. 10am to 3pm'required ></input>
                <button type="submit" className="submitButton">Submit</button>
            </form>
            <form id="locationForm" onSubmit={(event) => handleAllocation(event, 'location')}>
                <label htmlFor='locationChosen'>Set a location: &nbsp;&nbsp;</label>
                <input type='text' id='locationChosen' maxLength={50} placeholder='E.g. 2nd Street'required ></input>
                <button type="submit" className="submitButton">Submit</button>
            </form>
            <form id="commentForm" onSubmit={handleCommentInsertion}>
                <label htmlFor='commentWritten'>Write a comment: &nbsp;&nbsp;</label>
                <br></br>
                <textarea id="commentWritten" name="commentWritten" rows={2} maxLength={300} required ></textarea>
                <br></br>
                <button type="submit" className="submitButton">Submit</button>
            </form>
        </div>
    );
}

export default InputForm;
