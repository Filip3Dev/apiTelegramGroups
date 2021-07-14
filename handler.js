"use strict";
const connectToDatabase = require('./db');
const GroupsList = require('./models/Teste');
const Monitor = require('./models/Monitor');

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
