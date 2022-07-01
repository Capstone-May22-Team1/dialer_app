const { call } = require('express');
const callsService = require('../services/calls');
// const EventEmitter = require('events');
// const Stream = new EventEmitter();
const phoneNumbers = [
  13018040009, 19842068287, 15512459377, 19362072765, 18582210308, 13018040009,
  19842068287, 15512459377, 19362072765,
];

let pendingUpdates = [];
let sseResponse = null;

const phoneCalls = phoneNumbers.map((number, idx) => {
  return { number, id: null, status: 'idle', idx };
});

const makeCall = async (webhookURL) => {
  if (phoneNumbers.length === 0) {
    if (phoneCalls.every((call) => call.status === 'completed')) {
      sseResponse.end();
    }
    return;
  }
  const phoneNumber = phoneNumbers.shift();
  const body = { phone: String(phoneNumber), webhookURL };
  const id = await callsService.makeCall(body);
  updatePhoneCallId(phoneNumber, id);
  updatePendingCallsStatus(webhookURL);
};

const updatePendingCallsStatus = (webhookURL) => {
  if (pendingUpdates.length > 0) {
    pendingUpdates.forEach((update) => {
      const phoneCall = phoneCalls.find(
        (phoneCall) => phoneCall.id === update.id
      );
      updateCallStatus(phoneCall, update.status);
      continueCall(phoneCall, webhookURL);
    });
    pendingUpdates = [];
  }
};

const updatePhoneCallId = (phoneNumber, id) => {
  const updateCallId = phoneCalls.find(
    (phoneCall) => phoneCall.number === phoneNumber && !phoneCall.id
  );
  if (updateCallId) {
    updateCallId.id = id;
  }
};

const updateCallStatus = (phoneCall, status) => {
  if (phoneCall.status !== 'completed') {
    phoneCall.status = status;
    // console.log('Updating, ', phoneCall);
    console.log(phoneCalls);
    sseResponse.write(stringifyEventStream(phoneCall));
  }
};

const stringifyEventStream = (data) => {
  return 'data: ' + JSON.stringify(data) + '\n\n';
  // 'data: ' + JSON.stringify({ msg : testdata }) + '\n\n'
};

const continueCall = (phoneCall, webhookURL) => {
  if (phoneCall.status === 'completed') {
    makeCall(webhookURL);
  }
};

const getCalls = (req, res, next) => {
  res.json({ payload: phoneCalls });
};

const initializeCalls = (req, res, next) => {
  sseResponse = res;
  sseResponse.writeHead(200, {
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
  sseResponse.flushHeaders();

  for (let i = 0; i < 3; i++) {
    const webhookURL = req.webhookURL;
    makeCall(webhookURL);
  }

  // Stream.on('push', function (event, data) {
  //   res.write(stringifyEventStream(data));
  // });
  // return res.json({ message: 'Starting calls' });
};

const receiveWebhook = (req, res, next) => {
  const { id, status } = req.body;
  const updateCall = phoneCalls.find((phoneCall) => phoneCall.id === id);
  if (!updateCall) {
    pendingUpdates.push(req.body);
  } else {
    updateCallStatus(updateCall, status);
    continueCall(updateCall, req.webhookURL);
  }

  return res.json({ message: 'received' });
};

module.exports = {
  getCalls,
  initializeCalls,
  receiveWebhook,
};
