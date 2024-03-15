import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Database from '../Database';
import UserTable from './UserTable';
import InputForm from './InputForm';
import '../Event.css';

function Auth() {
    const [name, setName] = useState('');
    const [key, setKey] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const { eventKey } = useParams();

    const handleLogin = async () => {
        try {
            const { data, error } = await Database
                .from('people')
                .select('*')
                .eq('id', eventKey)
                .eq('user', name);
    
            if (error) {
                console.error('Error fetching user:', error);
                return;
            }
    
            if (data.length === 0) {
                alert('User not found');
                return;
            }
    
            const user = data[0];
            if (user.key === key) {
                console.log('Login successful');
                setAuthenticated(true);
            } else {
                alert('Incorrect key');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const handleSignUp = async () => {
        try {
            const { data, fetchError } = await Database
                .from('people')
                .select('*')
                .eq('id', eventKey)
                .eq('user', name);
            if (fetchError) {
                console.error('Error checking existing users:', fetchError);
                return;
            }
            if (data.length > 0) {
                alert('User already exists');
                return;
            }
    
            console.log('Signing up:', name);
            const { insertError } = await Database
                .from('people')
                .insert([{ id: eventKey, user: name, key: key }]);
            if (insertError) {
                console.error('Error inserting new user:', insertError);
                return;
            } else {
                console.log('User created successfully');
                setAuthenticated(true);
            }

            const { data: userData, fetchCountError } = await Database
                .from('events')
                .select('userCount')
                .eq('id', eventKey)
            if (fetchCountError) {
                console.error('Error fetching event:', fetchCountError);
                return;
            }

            const { incrementError } = await Database
                .from('events')
                .update({ userCount: userData[0].userCount + 1 })
                .eq('id', eventKey)
                .select();
            if (incrementError) {
                console.error('Error incrementing user count for event:', incrementError);
                return;
            }

            console.log('User added to event successfully');

        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (event.nativeEvent.submitter.id === 'login') {
            handleLogin();
        } else if (event.nativeEvent.submitter.id === 'signup') {
            handleSignUp();
        }
    };

    if (authenticated) {
        return (
            <div>
                <p>Hi {name}!</p>
                <p>Choose your availabilities:</p>
                <UserTable user={name} />
                <InputForm user={name} />
            </div>
        );
    }

    return (
        <div id='authContainer'>
            <form onSubmit={handleSubmit}>
                <p><strong>Please sign in!</strong></p>
                <br></br>
                <div>
                    <label htmlFor="name">Name:</label>
                    <br></br>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <br></br>
                <div>
                    <label htmlFor="key">Key:</label>
                    <br></br>
                    <input
                        type="password"
                        id="key"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        required
                    />
                </div>
                <br></br>
                <button type="submit" id="login">Login</button>
                <br></br>
                <button type="submit" id="signup">Sign Up</button>
            </form>
        </div>
    );
}

export default Auth;
