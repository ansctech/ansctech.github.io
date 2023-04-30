const { Router } = require("express");
const {
  generateInsertQuery,
  generateUpdateQuery,
  generateRetrieveQuery,
  generateDeleteQuery,
} = require("../utils/general");
const saleRecordRouter = Router();
const pool = require("../../db");

const tableName = "sale_record";
const clauseKey = "entry_id";

saleRecordRouter.get("/", async (req, res) => {
  const client_id = req.user.client_id;
  pool.query(
    generateRetrieveQuery(tableName, "client_id", client_id),
    (err, results) => {
      if (err) console.log(err);
      res.status(200).json(results.rows);
    }
  );
});

saleRecordRouter.get("/:id", (req, res) => {
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
});

saleRecordRouter.post("/", async (req, res) => {
  try {
    let noOfRecords = req.body.length;

    let rec = [];

    for (let i = 0; i < noOfRecords; i++) {
      req.body[i].sale_date = new Date(req.body[i].sale_date).toISOString();
      let results = await pool.query(
        generateInsertQuery(req.body[i], tableName, req.user)
      );
      rec.push(...results.rows);
    }

    if (rec.length == noOfRecords) {
      res
        .status(201)
        .json({ status: "success", message: "Data Inserted Successfully" });
    } else {
      let missedRows = noOfRecords - rec.length;
      res
        .status(500)
        .send(`${missedRows} are not inserted out of ${noOfRecords} records`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to insert the Data");
  }
});

saleRecordRouter.delete("/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  pool.query(
    generateDeleteQuery(tableName, clauseKey, itemId),
    (err, results) => {
      if (err) console.log(err);

      let noItemFound = !results.rowCount;
      if (noItemFound) {
        res.send(" Item does not exist in Database");
      } else {
        res
          .status(200)
          .json({ status: "success", message: "Item deleted successfully" });
      }
    }
  );
});

saleRecordRouter.put("/:id", (req, res) => {
  const itemId = parseInt(req.params.id);

  pool.query(
    generateUpdateQuery(req.body, tableName, clauseKey, itemId, req.user),
    (err, results) => {
      if (err) console.log(err);

      let noItemFound = !results.rowCount;
      if (noItemFound) {
        res.send(" Item does not exist in Database");
      } else {
        res
          .status(200)
          .json({ status: "success", message: "Item updated successfully" });
      }
    }
  );
});

module.exports = saleRecordRouter;
