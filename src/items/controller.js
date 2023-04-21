const pool = require("../../db");
const {
  generateInsertQuery,
  generateUpdateQuery,
  generateRetrieveQuery,
  generateDeleteQuery,
} = require("../utils/general");
const queries = require("./queries");

const tableName = "item_master";
const clauseKey = "item_id";

const getItems = (req, res) => {
  let client_id = req.headers.client_id || 643;
  pool.query(
    generateRetrieveQuery(tableName, "client_id", client_id),
    (err, results) => {
      if (err) console.log(err);
      //   console.log(results.rows);
      res.status(200).json(results.rows);
    }
  );
};

const getItemById = (req, res) => {
  const itemId = parseInt(req.params.id);
  pool.query(
    generateRetrieveQuery(tableName, clauseKey, itemId),
    (err, results) => {
      if (err) console.log(err);
      let noItemFound = !results.rows.length;
      if (noItemFound) {
        res.send(" Item does not exist in Database");
      }
      res.status(200).json(results.rows);
    }
  );
};

const addItem = (req, res) => {
  pool.query(generateInsertQuery(req.body, tableName), (err, results) => {
    if (err) console.log(err);
    res.status(201).send("Item Added Successfully");
  });
};

const deleteItemById = (req, res) => {
  const itemId = parseInt(req.params.id);
  let client_id = req.headers.client_id || 643;
  pool.query(
    `DELETE FROM comm_schm.${tableName} WHERE client_id=${client_id} AND ${clauseKey}=${itemId};`,
    (err, results) => {
      if (err) console.log(err);

      let noItemFound = !results.rowCount;
      if (noItemFound) {
        res.send(" Item does not exist in Database");
      } else {
        res.status(200).send("Item Deleted Successfully");
      }
    }
  );
};

const updateItemById = (req, res) => {
  const itemId = parseInt(req.params.id);

  pool.query(
    generateUpdateQuery(req.body, tableName, clauseKey, itemId),
    (err, results) => {
      if (err) console.log(err);

      let noItemFound = !results.rowCount;
      if (noItemFound) {
        res.send(" Item does not exist in Database");
      } else {
        res.status(200).send("Item Updated Successfully");
      }
    }
  );
};

module.exports = {
  getItems,
  getItemById,
  addItem,
  deleteItemById,
  updateItemById,
};
