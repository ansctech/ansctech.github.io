const express = require('express');
const accGroupRouter = require('./src/acc_group/accGroupRoutes');
const containerRouter = require('./src/container/containerRoutes');
const custGroupRouter = require('./src/cust_group/custGroupRoutes');
const entityRouter = require('./src/entity/entityRoutes');
const app=express();
const itemRoutes = require('./src/items/routes');
const saleBillRouter = require('./src/sale_bill/salebillRouter');
const saleRecordRouter = require('./src/sale_record/salerecordRoutes');


app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Welcome");
})

app.use("/api/v1/items",itemRoutes);

app.use("/api/v1/entity",entityRouter);

app.use("/api/v1/custgroup",custGroupRouter);

app.use("/api/v1/accgroup",accGroupRouter);

app.use("/api/v1/container",containerRouter);

app.use("/api/v1/salerecord",saleRecordRouter);

app.use("/api/v1/salebill",saleBillRouter);

app.listen(4000,()=>{
    console.log(`Server running on 3000 `);
})