const callsService = require('../services/calls');
const phoneNumbers = [
  13018040009, 19842068287, 15512459377, 19362072765, 18582210308, 13018040009,
  19842068287, 15512459377, 19362072765,
];

let pendingUpdates = [];

const phoneCalls = phoneNumbers.map((number) => {
  return { number, id: null, status: 'idle' };
});

const makeCall = async (webhookURL) => {
  if (phoneNumbers.length === 0) {
    return;
  }
  const phoneNumber = phoneNumbers.shift();
  const body = { phone: String(phoneNumber), webhookURL };
  const id = await callsService.makeCall(body);
  updatePhoneCallId(phoneNumber, id);
  makeCallHelper(webhookURL);
};

const makeCallHelper = (webhookURL) => {
  if (pendingUpdates.length > 0) {
    pendingUpdates.forEach((update) => {
      console.log(phoneCalls);
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
  for (let i = 0; i < 3; i++) {
    const webhookURL = req.webhookURL;
    makeCall(webhookURL);
  }
  return res.json({ message: 'Calls initialized' });
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
