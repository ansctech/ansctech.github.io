const { Router } = require("express");
const {
  generateInsertQuery,
  generateUpdateQuery,
  generateRetrieveQuery,
  generateDeleteQuery,
} = require("../utils/general");
const saleBillRouter = Router();
const pool = require("../../db");

const tableName = "sale_bill";
const clauseKey = "bill_id";

saleBillRouter.get("/", async (req, res) => {
  const client_id = req.user.client_id;

  pool.query(
    generateRetrieveQuery(tableName, "client_id", client_id),
    (err, results) => {
      if (err) console.log(err);
      res.status(200).json(results.rows);
    }
  );
});

saleBillRouter.get("/:id", (req, res) => {
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

saleBillRouter.post("/", async (req, res) => {
  let { bill_date } = req.body;
  const client_id = req.user.client_id;

  let existingRecord = await pool.query(
    `SELECT * FROM comm_schm.sale_bill WHERE bill_date = '${bill_date}' AND client_id = '${client_id}'`
  );

  const acc = {};

  existingRecord.rows.forEach((curr) => {
    acc[curr.entity_id_cust] = curr;
  });

  existingRecord = acc;

  // Delete the records from sale bill on the existing date
  await pool.query(
    `DELETE FROM comm_schm.sale_bill WHERE bill_date = '${bill_date}' AND client_id = '${client_id}'`
  );

  await pool.query(
    `DELETE FROM comm_schm.container_issue_register WHERE issue_date = '${bill_date}' AND client_id = '${client_id}'`
  );

  let sale_bill_query = `select
    sr.sale_date as bill_date,
    sr.entity_id_cust,
    sum(sr.sale_amount) as bill_amount,
    sum(sr.sale_qty*cm.container_charge) as container_charge,
    sr.client_id
    from comm_schm.sale_record sr full outer join comm_schm.container_master cm
    on cm.container_id=sr.unit_container_id
    where sale_date='${bill_date}' AND sr.client_id='${client_id}'
    group by sr.sale_date, sr.entity_id_cust, sr.client_id;`;

  let container_issue_register_query = `select
    sr.sale_date as issue_date,
    sr.entity_id_cust,
    sr.entity_id_trader,
    sr.unit_container_id,
    sum(sr.sale_qty) as issue_qty,
    sr.client_id
    from comm_schm.sale_record sr, comm_schm.container_master cm
    where cm.container_id=sr.unit_container_id and cm.maintain_inventory='YES'
    and sale_date= '${bill_date}' AND sr.client_id='${client_id}'
    group by sr.sale_date, sr.entity_id_cust, sr.entity_id_trader, sr.client_id, sr.unit_container_id`;

  try {
    const obj = {};
    const conObj = {};

    const results = await pool.query(sale_bill_query);
    processRetrievedData(results, obj, tableName);

    const results1 = await pool.query(container_issue_register_query);
    processRetrievedData(results1, conObj, "container_issue_register");

    const rec = await insertData(obj, tableName, req);
    const con = await insertData(conObj, "container_issue_register", req);

    // Update customers balance
    await Object.keys(obj).forEach(async (ob) => {
      const entity = await pool.query(
        generateRetrieveQuery("entity_master", "entity_id", ob)
      );

      await pool.query(
        generateUpdateQuery(
          {
            curr_bal:
              Number(entity.rows[0].curr_bal) +
              Number(obj[ob].bill_amount) -
              (Number(existingRecord[ob]?.bill_amount) || 0),
          },
          "entity_master",
          "entity_id",
          ob,
          req.user
        )
      );

      // Update container balance
      // cont = await pool.query(
      //   `SELECT * FROM comm_schm.entity_container_balance WHERE entity_id = '${entity.rows[0].entity_id}' AND container_id = '${client_id}'`
      // );
    });

    //Send response
    res.status(201).json({
      message: "Successfully Retrieved data",
      sale_bill_rows: rec,
      caontainer_issue_register_rows: con,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to Retrieve Info");
  }
});

async function insertData(obj, tableName, req) {
  const rec = [];

  for (const ele of Object.keys(obj)) {
    if (ele) {
      const result = await pool.query(
        generateInsertQuery(obj[ele], tableName, req.user)
      );
      rec.push(...result.rows);
    }
  }

  return rec;
}

function processRetrievedData(results, obj, tableName) {
  const len = results.rows.length;
  let rows;

  if (len === 0) {
    return null;
  } else {
    rows = results.rows;
  }
  if (tableName == "sale_bill") {
    for (let i = 0; i < len; i++) {
      const row = rows[i];
      let dt = new Date(row.bill_date).toLocaleDateString();

      if (!obj[row.entity_id_cust]) {
        obj[row.entity_id_cust] = {
          bill_date: dt,
          entity_id_cust: row.entity_id_cust,
          bill_amount: row.bill_amount,
          total_container_amount: row.container_charge,
          client_id: row.client_id,
          created_by: "adodla",
          created_date: new Date().toISOString(),
          last_modified_by: "akhi",
          last_modified_date: new Date().toISOString(),
        };
      }
    }
  } else {
    for (let i = 0; i < len; i++) {
      const row = rows[i];

      if (!obj[row.entity_id_cust]) {
        obj[row.entity_id_cust] = {
          issue_date: new Date(row.issue_date).toISOString(),
          entity_id_cust: row.entity_id_cust,
          entity_id_trader: row.entity_id_trader,
          container_id: row.unit_container_id,
          issue_qty: row.issue_qty,
          client_id: row.client_id,
          created_by: "adodla",
          created_date: new Date().toISOString(),
          last_modified_by: "akhi",
          last_modified_date: new Date().toISOString(),
        };
      }
    }
  }

  return obj;
}

saleBillRouter.delete("/:id", async (req, res) => {
  const itemId = parseInt(req.params.id);

  const {
    rows: [bill],
  } = await pool.query(generateRetrieveQuery(tableName, clauseKey, itemId));

  const {
    rows: [entity],
  } = await pool.query(
    generateRetrieveQuery("entity_master", "entity_id", bill.entity_id_cust)
  );

  await pool.query(
    generateUpdateQuery(
      {
        curr_bal: Number(entity.curr_bal) - Number(bill.bill_amount),
      },
      "entity_master",
      "entity_id",
      bill.entity_id_cust,
      req.user
    )
  );

  pool.query(
    generateDeleteQuery(tableName, clauseKey, itemId),
    async (err, results) => {
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

saleBillRouter.put("/:id", (req, res) => {
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

module.exports = saleBillRouter;
