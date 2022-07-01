const callsService = require('../services/calls');
const phoneNumbers = [
  13018040009, 19842068287, 15512459377, 19362072765, 18582210308, 13018040009,
  19842068287, 15512459377, 19362072765,
];

let pendingUpdates = [];
let sseResponse = null;

const phoneCalls = phoneNumbers.map((number) => {
  return { number, id: null, status: 'idle' };
});

const makeCall = async (webhookURL) => {
  if (phoneNumbers.length === 0) {
    sseResponse.end();
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
    sseResponse.write({ data: phoneCall });
  }
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
  sseResponse.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
  });
  sseResponse.flushHeaders();

  for (let i = 0; i < 3; i++) {
    const webhookURL = req.webhookURL;
    makeCall(webhookURL);
  }
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
