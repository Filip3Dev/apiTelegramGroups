'use strict';
const { v4: uuidv4 } = require('uuid');
const connectToDatabase = require("./db");
const Order = require('./models/Order');
const GroupsList = require('./models/Teste');
const Messages = require('./models/Messages');
const Monitor = require('./models/Monitor');
const { endOfDay, startOfDay } = require('date-fns');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};

module.exports.listChats = async () => {
  await connectToDatabase();
  let list_orders = await GroupsList.find({}).lean();
  return { statusCode: 200, headers, body: JSON.stringify(list_orders) };
};

module.exports.listSent = async event => {
  const start = event?.queryStringParameters?.start ? new Date(event.queryStringParameters.start) : new Date();
  const end = event?.queryStringParameters?.end ? new Date(event.queryStringParameters.end) : null;
  try {
    await connectToDatabase();
    // let list_orders = await Messages.find().lean();
    // for await (const iterator of list_orders) {
    //   console.log('iterator: ', iterator.date);
    //   console.log('date: ', new Date(iterator.date));
    //   console.log('start: ', start);
    //   console.log('\n');
    // }
    // if (start && end) {
    //   let list_orders = await Messages.find({ date: { $gte: start, $lt: end } }).lean();
    //   return { statusCode: 200, headers, body: JSON.stringify(list_orders) };
    // }
    let stt = startOfDay(start);
    let edd = endOfDay(new Date(start));
    console.log('stt: ', stt);
    console.log('edd: ', edd);
    let list_orders = await Messages.find({ date: { $gte: stt } }).lean();
    return { statusCode: 200, headers, body: JSON.stringify(list_orders) };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: true }) };
  }
};

module.exports.saveMonitor = async event => {
  try {
    const { chat } = event.queryStringParameters;
    await connectToDatabase();
    let item = await GroupsList.findOne({ _id: chat }).lean();
    item.chat = item._id;
    delete item._id;
    let list_orders = new Monitor(item);
    await list_orders.save();
    return { statusCode: 200, headers, body: JSON.stringify(list_orders) };
  } catch (error) {
    console.log(error);
    return { statusCode: 200, headers, body: JSON.stringify({ error: true }) };
  }
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