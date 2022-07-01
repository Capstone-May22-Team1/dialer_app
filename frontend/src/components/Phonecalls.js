import React, { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';
import Phonecall from './Phonecall';
const baseUrl = 'http://localhost:3001';
let source;

const Phonecalls = () => {
  const [calls, setCalls] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleInitialCalls = (e) => {
    setButtonDisabled(true);
    source = new EventSource(`${baseUrl}/api/initializeCalls`);
    source.addEventListener('open', () => {
      console.log('Listening for server events');
    });

    source.addEventListener('message', (e) => {
      setCalls((prevState) => {
        const updatedCall = JSON.parse(e.data);

        const newState = prevState.map((p) => {
          return p.idx === updatedCall.idx ? updatedCall : p;
        });

        if (newState.every((call) => call.status === 'completed')) {
          source.close();
          console.log('All calls finished, stop listening to server events');
        }
        return newState;
      });
    });

    source.addEventListener('error', () => {
      console.log('Something wrong with server or server closed');
      source.close();
    });
  };

  useEffect(() => {
    async function initialzeCall() {
      const calls = await apiClient.initializeCalls();
      setCalls(calls);
    }
    initialzeCall();
  }, []);

  if (!calls) {
    return null;
  }

  return (
    <div>
      <ul>
        {calls.map((call, index) => (
          <Phonecall key={call.idx} call={call} />
        ))}
      </ul>
      <button onClick={handleInitialCalls} disabled={buttonDisabled}>
        Make Calls
      </button>
    </div>
  );
};

export default Phonecalls;
