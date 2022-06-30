const routes = require('express').Router();
const callControllers = require('../controllers/callControllers');

const phoneNumbers = [
  13018040009, 19842068287, 15512459377, 19362072765, 18582210308, 13018040009,
  19842068287, 15512459377, 19362072765,
];

const phoneCalls = phoneNumbers.map((number) => {
  return { number, id: null, status: 'idle' };
});

routes.get('/calls', callControllers.getCalls);

module.exports = routes;
