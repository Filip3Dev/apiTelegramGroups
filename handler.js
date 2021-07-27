"use strict";
const connectToDatabase = require('./db');
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
