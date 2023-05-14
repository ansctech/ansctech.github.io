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
      const { maintain_inventory, ...saleRecord } = req.body[i];
      saleRecord.sale_date = new Date(saleRecord.sale_date).toISOString();
      let results = await pool.query(
        generateInsertQuery(saleRecord, tableName, req.user)
      );

      if (maintain_inventory) {
        const {
          rows: [entity_container],
        } = await pool.query(
          `SELECT * FROM comm_schm.entity_container_balance WHERE entity_id = '${saleRecord.entity_id_cust}' AND container_id = ${saleRecord.unit_container_id} AND client_id = '${req.user.client_id}'`
        );

        // If container doesn't exist, create one
        if (!entity_container) {
          await pool.query(
            generateInsertQuery(
              {
                container_id: saleRecord.unit_container_id,
                entity_id: saleRecord.entity_id_cust,
                curr_bal: saleRecord.sale_qty,
              },
              "entity_container_balance",
              req.user
            )
          );
        } else {
          await pool.query(
            generateUpdateQuery(
              {
                curr_bal:
                  Number(entity_container.curr_bal) +
                  Number(saleRecord.sale_qty),
              },
              "entity_container_balance",
              "cont_rec_id",
              entity_container.cont_rec_id,
              req.user
            )
          );
        }
      }

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
    async (err, results) => {
      if (err) console.log(err);

      let noItemFound = !results.rowCount;
      if (noItemFound) {
        res.send(" Item does not exist in Database");
      } else {
        const {
          rows: [entity_container],
        } = await pool.query(
          `SELECT * FROM comm_schm.entity_container_balance WHERE entity_id = '${req.body.entity_id_cust}' AND container_id = ${req.body.unit_container_id} AND client_id = '${req.user.client_id}'`
        );

        if (entity_container) {
          await pool.query(
            generateUpdateQuery(
              {
                curr_bal:
                  Number(entity_container.curr_bal) - Number(req.body.sale_qty),
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
