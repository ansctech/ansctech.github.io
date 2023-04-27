const { Router } = require("express");
const {
  generateInsertQuery,
  generateUpdateQuery,
  generateRetrieveQuery,
  generateDeleteQuery,
} = require("../utils/general");
const saleBillRouter = Router();
const pool = require("../../db");

const util = require("util");

const tableName = "sale_bill";
const clauseKey = "bill_id";

saleBillRouter.get("/", async (req, res) => {
  pool.query(generateRetrieveQuery(tableName), (err, results) => {
    if (err) console.log(err);
    res.status(200).json(results.rows);
  });
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
  console.log(new Date(bill_date).toISOString());
  let { client_id } = req.headers;

  // Delete the records from sale bill on the existing date
  const deletedrecords = await pool.query(
    `DELETE FROM comm_schm.sale_bill WHERE bill_date = '${bill_date}' AND client_id = '${client_id}'`
  );
  const deletedrecordsContainerIssueRegister = await pool.query(
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

  // try {
  //       // Retrieve data from the database
  //   const results = await pool.query(sale_bill_query);
  //   const len = results.rows.length;
  //   let rows;

  //   if (len === 0) {
  //     await send("No Records exist for the Date");
  //     return;
  //   } else {
  //     rows = results.rows;
  //   }

  //   // Process the retrieved data
  //   for (let i = 0; i < len; i++) {
  //     const row = rows[i];

  //     if (!obj[row.entity_id_cust]) {
  //       obj[row.entity_id_cust] = {
  //         "bill_date": new Date(bill_date).toISOString(),
  //         "entity_id_cust": row.entity_id_cust,
  //         "bill_amount":row.bill_amount,
  //         "total_container_amount": row.container_charge,
  //         "client_id": row.client_id,
  //         "created_by": "adodla",
  //         "created_date": new Date().toISOString(),
  //         "last_modified_by": "akhi",
  //         "last_modified_date": new Date().toISOString()
  //       };
  //     }
  //   }
  //   let rec=[]

  //   // Insert data into the database
  //   for (const ele of Object.keys(obj)) {
  //     if(ele){
  //       const result = await pool.query(generateInsertQuery(obj[ele], tableName));
  //       rec.push(...result.rows);
  //     }
  //   }

  //   const results1 = await pool.query(container_issue_register_query);
  //   const leng = results.rows.length;
  //   let rows1;

  //   if (leng === 0) {
  //     await send("No Records exist for the Date");
  //     return;
  //   } else {
  //     rows1 = results1.rows;
  //   }

  //   // Process the retrieved data
  //   for (let i = 0; i < len; i++) {
  //     const row = rows1[i];

  //     if (!conObj[row.entity_id_cust]) {
  //       conObj[row.entity_id_cust] = {
  //         "issue_date": new Date(bill_date).toISOString(),
  //         "entity_id_cust": row.entity_id_cust,
  //         "entity_id_trader":row.entity_id_trader,
  //         "container_id":row.unit_container_id,
  //         "issue_qty":row.issue_qty,
  //         "client_id": row.client_id,
  //         "created_by": "adodla",
  //         "created_date": new Date().toISOString(),
  //         "last_modified_by": "akhi",
  //         "last_modified_date": new Date().toISOString()
  //       };
  //     }
  //   }
  //   let con=[]

  //   // Insert data into the database
  //   for (const ele of Object.keys(conObj)) {
  //     if(ele){
  //       const result = await pool.query(generateInsertQuery(conObj[ele], "container_issue_register"));
  //       con.push(...result.rows);
  //     }
  //   }

  //   // Send response
  //   await res.send({message:"Successfully Retrieved data","sale_bill_rows":rec,"caontainer_issue_register_rows":con});
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).send("Unable to Retrieve Info");
  // }

  try {
    const obj = {};
    const conObj = {};

    const results = await pool.query(sale_bill_query);
    processRetrievedData(results, obj, tableName);

    const results1 = await pool.query(container_issue_register_query);
    processRetrievedData(results1, conObj, "container_issue_register");

    const rec = await insertData(obj, tableName);
    const con = await insertData(conObj, "container_issue_register");

    //Send response
    res.send({
      message: "Successfully Retrieved data",
      sale_bill_rows: rec,
      caontainer_issue_register_rows: con,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to Retrieve Info");
  }
});

async function insertData(obj, tableName) {
  const rec = [];

  for (const ele of Object.keys(obj)) {
    if (ele) {
      const result = await pool.query(generateInsertQuery(obj[ele], tableName));
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

saleBillRouter.delete("/:id", (req, res) => {
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

saleBillRouter.put("/:id", (req, res) => {
  const itemId = parseInt(req.params.id);

  pool.query(
    generateUpdateQuery(req.body, tableName, clauseKey, itemId),
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
