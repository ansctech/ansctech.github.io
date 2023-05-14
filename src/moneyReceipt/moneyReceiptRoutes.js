const { Router } = require("express");

const {
  generateInsertQuery,
  generateUpdateQuery,
  generateRetrieveQuery,
  generateDeleteQuery,
} = require("../utils/general");

const moneyReceiptRouter = Router();

const pool = require("../../db");

const tableName = "receipt_master";
const clauseKey = "receipt_id";

moneyReceiptRouter.get("/", async (req, res) => {
  const client_id = req.user.client_id;
  pool.query(
    generateRetrieveQuery(tableName, "client_id", client_id),
    (err, results) => {
      if (err) console.log(err);
      res.status(200).json(results.rows);
    }
  );
});

moneyReceiptRouter.get("/:id", (req, res) => {
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

moneyReceiptRouter.post("/", (req, res) => {
  pool.query(
    generateInsertQuery(req.body, tableName, req.user),
    async (err, results) => {
      if (err) console.log(err);

      const {
        rows: [entity],
      } = await pool.query(
        generateRetrieveQuery("entity_master", "entity_id", req.body.entity_id)
      );

      await pool.query(
        generateUpdateQuery(
          {
            curr_bal: Number(entity.curr_bal) - Number(req.body.amount),
          },
          "entity_master",
          "entity_id",
          req.body.entity_id,
          req.user
        )
      );

      res
        .status(201)
        .json({ status: "success", message: "Item added successfully" });
    }
  );
});

moneyReceiptRouter.delete("/:id", async (req, res) => {
  const itemId = parseInt(req.params.id);
  const client_id = req.user.client_id;

  const {
    rows: [moneyReceipt],
  } = await pool.query(generateRetrieveQuery(tableName, "receipt_id", itemId));

  pool.query(
    `DELETE FROM comm_schm.${tableName} WHERE client_id=${client_id} AND ${clauseKey}=${itemId};`,
    async (err, results) => {
      if (err) console.log(err);

      let noItemFound = !results.rowCount;
      if (noItemFound) {
        res.send(" Item does not exist in Database");
      } else {
        const {
          rows: [entity],
        } = await pool.query(
          generateRetrieveQuery(
            "entity_master",
            "entity_id",
            moneyReceipt.entity_id
          )
        );

        await pool.query(
          generateUpdateQuery(
            {
              curr_bal: Number(entity.curr_bal) + Number(moneyReceipt.amount),
            },
            "entity_master",
            "entity_id",
            moneyReceipt.entity_id,
            req.user
          )
        );

        res
          .status(200)
          .json({ status: "success", message: "Item deleted successfully" });
      }
    }
  );
});

moneyReceiptRouter.put("/:id", async (req, res) => {
  const itemId = parseInt(req.params.id);

  const {
    rows: [moneyReceipt],
  } = await pool.query(generateRetrieveQuery(tableName, "receipt_id", itemId));

  pool.query(
    generateUpdateQuery(req.body, tableName, clauseKey, itemId, req.user),
    async (err, results) => {
      if (err) console.log(err);

      let noItemFound = !results.rowCount;
      if (noItemFound) {
        res.send(" Item does not exist in Database");
      } else {
        const {
          rows: [entity],
        } = await pool.query(
          generateRetrieveQuery(
            "entity_master",
            "entity_id",
            moneyReceipt.entity_id
          )
        );

        await pool.query(
          generateUpdateQuery(
            {
              curr_bal:
                Number(entity.curr_bal) -
                (req.body.amount
                  ? Number(req.body.amount) - Number(moneyReceipt.amount)
                  : 0),
            },
            "entity_master",
            "entity_id",
            moneyReceipt.entity_id,
            req.user
          )
        );
        res
          .status(200)
          .json({ status: "success", message: "Item updated successfully" });
      }
    }
  );
});

module.exports = moneyReceiptRouter;
