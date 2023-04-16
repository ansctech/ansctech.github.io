const { Router }= require('express');
const { generateInsertQuery, generateUpdateQuery, generateRetrieveQuery, generateDeleteQuery } = require('../utils/general');
const containerRouter = Router();
const pool = require('../../db');


const tableName = "container_master";
const clauseKey ="container_id";

containerRouter.get("/", async (req,res)=>{
    let { client_id }=req.headers;
    pool.query(generateRetrieveQuery(tableName,"client_id",client_id),(err,results)=>{
    if(err)console.log(err);
          res.status(200).json(results.rows);
    });

})

containerRouter.get("/:id", ( req,res )=>{
    const itemId = parseInt(req.params.id);
    pool.query(generateRetrieveQuery(tableName,clauseKey,itemId),(err,results)=>{
        if(err)console.log(err);
        let noItemFound =!results.rows.length;
        if(noItemFound){
            res.send(" Item does not exist in Database");
        }
        res.status(200).json(results.rows);
    })
})

containerRouter.post("/",(req,res)=>{

    pool.query(generateInsertQuery(req.body,tableName),(err,results)=>{
        if(err)console.log(err);
       res.status(201).send({"message":"Item Added Successfully","row":results.rows[0]});
    })
});

containerRouter.delete("/:id",( req,res )=>{
    const itemId = parseInt(req.params.id);
    let { client_id }=req.headers;
    pool.query(`DELETE FROM comm_schm.${tableName} WHERE client_id=${client_id} AND ${clauseKey}=${itemId};`,(err,results)=>{
        if(err)console.log(err);
      
        let noItemFound =!results.rowCount;
        if(noItemFound){
            res.send(" Item does not exist in Database");
        }
        else{
            res.status(200).send("Item Deleted Successfully")
        }
    })
});

containerRouter.put("/:id",(req,res)=>{
    const itemId = parseInt(req.params.id);

    pool.query(generateUpdateQuery(req.body,tableName,clauseKey,itemId),(err,results)=>{
        if(err)console.log(err);
      
        let noItemFound =!results.rowCount;
        if(noItemFound){
            res.send(" Item does not exist in Database");
        }
        else{
            res.status(200).send("Item Updated Successfully")
        }
    })
});

module.exports = containerRouter;