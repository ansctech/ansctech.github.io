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
  const client_id = req.user.client_id;
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
    async (err, results) => {
      if (err) console.log(err);

      const {
        rows: [entity_container],
      } = await pool.query(
        `SELECT * FROM comm_schm.entity_container_balance WHERE entity_id = '${req.body.entity_id}' AND container_id = ${req.body.container_id} AND client_id = '${req.user.client_id}'`
      );

      // If container doesn't exist, create one
      if (entity_container) {
        await pool.query(
          generateUpdateQuery(
            {
              curr_bal:
                Number(entity_container.curr_bal) -
                Number(req.body.qty_received),
            },
            "entity_container_balance",
            "cont_rec_id",
            entity_container.cont_rec_id,
            req.user
          )
        );
      }

      res
        .status(201)
        .json({ status: "success", message: "Item added successfully" });
    }
  );
});

containerReturnRouter.delete("/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const client_id = req.user.client_id;
  pool.query(
    `DELETE FROM comm_schm.${tableName} WHERE client_id=${client_id} AND ${clauseKey}=${itemId};`,
    async (err, results) => {
      if (err) console.log(err);

      let noItemFound = !results.rowCount;
      if (noItemFound) {
        res.send(" Item does not exist in Database");
      } else {
        const {
          rows: [entity_container],
        } = await pool.query(
          `SELECT * FROM comm_schm.entity_container_balance WHERE entity_id = '${req.body.entity_id}' AND container_id = ${req.body.container_id} AND client_id = '${client_id}'`
        );

        if (entity_container) {
          await pool.query(
            generateUpdateQuery(
              {
                curr_bal:
                  Number(entity_container.curr_bal) +
                  Number(req.body.qty_received),
              },
              "entity_container_balance",
              "cont_rec_id",
              entity_container.cont_rec_id,
              req.user
            )
          );
        }

        res
          .status(200)
          .json({ status: "success", message: "Item deleted successfully" });
      }
    }
  );
});

containerReturnRouter.put("/:id", async (req, res) => {
  const itemId = parseInt(req.params.id);
  const {
    rows: [cont],
  } = await pool.query(generateRetrieveQuery(tableName, clauseKey, itemId));

  pool.query(
    generateUpdateQuery(req.body, tableName, clauseKey, itemId, req.user),
    async (err, results) => {
      if (err) console.log(err);

      let noItemFound = !results.rowCount;
      if (noItemFound) {
        res.send(" Item does not exist in Database");
      } else {
        // With the assumption that entity and container were not edited
        const {
          rows: [entity_container],
        } = await pool.query(
          `SELECT * FROM comm_schm.entity_container_balance WHERE entity_id = '${req.body.entity_id}' AND container_id = ${req.body.container_id} AND client_id = '${req.user.client_id}'`
        );

        if (entity_container) {
          await pool.query(
            generateUpdateQuery(
              {
                curr_bal:
                  Number(entity_container.curr_bal) -
                  Number(req.body.qty_received) +
                  Number(cont.qty_received),
              },
              "entity_container_balance",
              "cont_rec_id",
              entity_container.cont_rec_id,
              req.user
            )
          );
        }

        res
          .status(200)
          .json({ status: "success", message: "Item updated successfully" });
      }
    }
  );
});

module.exports = containerReturnRouter;
