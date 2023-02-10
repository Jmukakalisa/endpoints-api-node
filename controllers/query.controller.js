import queryModel from '../models/Queries.model.js';

const getAllQueries = async (req, res) => {
  const queries = await queryModel.find();
  res.send(queries);
};

const sendQuery = async (req, res) => {
  const query = new queryModel({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });
  await query.save();
  res.send(query);
};

export { getAllQueries, sendQuery };
