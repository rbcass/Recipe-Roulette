const axios = require('axios');
require('dotenv').config();

async function makeChatbotRequest() {
  const encodedParams = new URLSearchParams();
  encodedParams.set('in', 'What\'s 2 plus 5?');
  encodedParams.set('op', 'in');
  encodedParams.set('cbot', '1');
  encodedParams.set('SessionID', process.env.SESSION_ID);
  encodedParams.set('cbid', '1');
  encodedParams.set('key', process.env.RAPIDAPI_KEY);
  encodedParams.set('ChatSource', 'RapidAPI');
  encodedParams.set('duration', '1');
  //encodedParams.set('w', '10vh')

  const options = {
    method: 'POST',
    url: 'https://robomatic-ai.p.rapidapi.com/api',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '36af63c37amshec4cb0f65f15a15p167b47jsnccde47ccbbb9',
      'X-RapidAPI-Host': 'robomatic-ai.p.rapidapi.com'
    },
    data: encodedParams,
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data; 
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { makeChatbotRequest };