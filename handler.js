'use strict';
const { v4: uuidv4 } = require('uuid');
const connectToDatabase = require("./db");
const Order = require('./model/Order');

module.exports.listChats = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.saveBets = async event => {
  let payload_body = JSON.parse(event.body);
  try {
    await connectToDatabase();
    for (const iterator of payload_body) {
      let hash = `${iterator.action}${iterator.odds}${iterator.market}${iterator.teams}${iterator.bet}${iterator.returned}`;
      hash = hash.replace(/\s/g, '');
      let payload = {
        uuid: uuidv4(),
        hash,
        action: iterator.action,
        odds: parseFloat(iterator.odds),
        market: iterator.market,
        teams: iterator.teams,
        bet: parseFloat(iterator.bet.replace('R$', '').replace(',', '.')),
        returned: parseFloat(iterator.returned.replace(',', '.'))
      }
      await Order.findOneAndUpdate({ hash: hash }, payload, { upsert: true });
      console.log('payload: ', payload);
      console.log('\n');
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Your function executed successfully!', data: event.body } ),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error!', data: event.body }),
    };
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};