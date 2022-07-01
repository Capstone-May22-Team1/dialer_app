import React, { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';
import Phonecall from './Phonecall';

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

export default Phonecalls;
