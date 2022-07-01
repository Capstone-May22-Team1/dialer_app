import axios from 'axios';
const baseUrl = 'http://localhost:3001';

const apiClient = {
  initializeCalls: async () => {
    try {
      const { data } = await axios.get(baseUrl + '/api/calls');
      return data.payload;
    } catch (e) {
      console.log(e);
    }
  },
};

export default apiClient;
