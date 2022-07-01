import React, { useEffect, useState } from 'react';
import './App.css';
import apiClient from './lib/apiClient';

function App() {
  return (
    <div className="App">
      <Phonecalls />
    </div>
  );
}

const Phonecalls = () => {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    async function initialzeCall() {
      const calls = await apiClient.initializeCalls();
      setCalls(calls);
    }
    initialzeCall();
  }, []);

  return (
    <div>
      <ul>
        {calls.map((call) => (
          <Phonecall key={call.id} call={call} />
        ))}
      </ul>
    </div>
  );
};

const Phonecall = ({ call }) => {
  return (
    <li>
      <p>
        Number: {call.number}, Status: {call.status}
      </p>
    </li>
  );
};

export default App;

/*
Phonecalls [calls]
  Phonecall [call]
Button to initialize call

*/
