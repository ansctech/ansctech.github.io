const { Router } = require("express");
const {
  generateRetrieveQuery,
  generateDeleteQuery,
} = require("../utils/general");
const contBalRouter = Router();
const pool = require("../../db");

const tableName = "entity_container_balance";

contBalRouter.get("/", async (req, res) => {
  const client_id = req.user.client_id;
  pool.query(
    generateRetrieveQuery(tableName, "client_id", client_id),
    (err, results) => {
      if (err) console.log(err);
      res.status(200).json(results.rows);
    }
  );
});

module.exports = contBalRouter;
