const { Router } = require("express");

const {
  generateInsertQuery,
  generateUpdateQuery,
  generateRetrieveQuery,
  generateDeleteQuery,
} = require("../utils/general");

const containerReturnRouter = Router();

const pool = require("../../db");

const tableName = "container_in_out";
const clauseKey = "cont_txn_id";

containerReturnRouter.get("/", async (req, res) => {
  const client_id = req.user.clientid;
  pool.query(
    generateRetrieveQuery(tableName, "client_id", client_id),
    (err, results) => {
      if (err) console.log(err);
      res.status(200).json(results.rows);
    }
  );
});

containerReturnRouter.get("/:id", (req, res) => {
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

containerReturnRouter.post("/", (req, res) => {
  pool.query(
    generateInsertQuery(req.body, tableName, req.user),
    (err, results) => {
      if (err) console.log(err);
      res
        .status(201)
        .json({ status: "success", message: "Item added successfully" });
    }
  );
});

containerReturnRouter.delete("/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const client_id = req.user.clientid;
  pool.query(
    `DELETE FROM comm_schm.${tableName} WHERE client_id=${client_id} AND ${clauseKey}=${itemId};`,
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

containerReturnRouter.put("/:id", (req, res) => {
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

module.exports = containerReturnRouter;
