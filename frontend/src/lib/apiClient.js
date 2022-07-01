import axios from 'axios';

const apiClient = {
  initializeCalls: async () => {
    try {
      const { data } = await axios.get('/api/calls');
      return data.payload;
    } catch (e) {
      console.log(e);
    }
  },
};

export default apiClient;
