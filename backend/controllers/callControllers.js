const callsService = require('../services/calls');
const phoneNumbers = [
  13018040009, 19842068287, 15512459377, 19362072765, 18582210308, 13018040009,
  19842068287, 15512459377, 19362072765,
];

let currentId = null;
let pendingUpdates = []; // [{ id: 1234, status: "ringing" }, { id: 2345, status: "ringing"} ]

const phoneCalls = phoneNumbers.map((number) => {
  return { number, id: null, status: 'idle' };
});

// {id: 1234 }
const makeCall = async (webhookURL) => {
  if (phoneNumbers.length === 0) {
    console.log(phoneCalls);
    console.log('All calls have completed');
    return;
  }
  const phone = phoneNumbers.shift();
  const body = { phone: String(phone), webhookURL };
  const id = await callsService.makeCall(body);
  console.log(phoneCalls);
  console.log(pendingUpdates);
  // update phonecall id
  const updateCallId = phoneCalls.find(
    (phoneCall) => phoneCall.number === phone && !phoneCall.id
  );
  if (updateCallId) {
    updateCallId.id = id;
  }
  // update phoncall status
  if (pendingUpdates.length > 0) {
    pendingUpdates.forEach((update) => {
      console.log(phoneCalls);
      const phoneCall = phoneCalls.find(
        (phoneCall) => phoneCall.id === update.id
      );
      updateCallStatus(phoneCall, update.status, webhookURL);
    });
    pendingUpdates = [];
  }
};

const updateCallStatus = (phoneCall, status, webhookURL) => {
  if (phoneCall.status !== 'completed') {
    phoneCall.status = status;
  }
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
    updateCallStatus(updateCall, status, req.webhookURL);
  }

  return res.json({ message: 'received' });
};

module.exports = {
  getCalls,
  initializeCalls,
  receiveWebhook,
};
