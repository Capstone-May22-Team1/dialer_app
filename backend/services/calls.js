const axios = require('axios');
const apiURL = 'http://localhost:4830';

const makeCall = async (body) => {
  const { data } = await axios.post(`${apiURL}/call`, body);
  console.log('in the services', data);
  return data.id;
};

module.exports = {
  makeCall,
};
