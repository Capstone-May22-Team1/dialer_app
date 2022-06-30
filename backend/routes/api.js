const routes = require('express').Router();
const callControllers = require('../controllers/callControllers');
const webhookURL = 'http://localhost:3001/api/webhook';

const setWebhookURL = (req, res, next) => {
  req.webhookURL = webhookURL;
  next();
};

routes.get('/calls', callControllers.getCalls);
routes.post('/calls', setWebhookURL, callControllers.initializeCalls);
routes.post('/webhook', setWebhookURL, callControllers.receiveWebhook);

module.exports = routes;
