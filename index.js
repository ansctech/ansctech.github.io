const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const accGroupRouter = require("./src/acc_group/accGroupRoutes");
const containerRouter = require("./src/container/containerRoutes");
const custGroupRouter = require("./src/cust_group/custGroupRoutes");
const entityRouter = require("./src/entity/entityRoutes");
const app = express();
const itemRoutes = require("./src/items/routes");
const saleBillRouter = require("./src/sale_bill/salebillRouter");
const saleRecordRouter = require("./src/sale_record/salerecordRoutes");
const moneyReceiptRouter = require("./src/moneyReceipt/moneyReceiptRoutes");
const containerReturnRouter = require("./src/containerReturn/containerReturnRoutes");
const {
  protect,
  login,
  signup,
  logout,
} = require("./src/authentication/authRoutes");
const contBalRouter = require("./src/container_balance/container_balance");

app.use(express.json());
app.use(cookieParser());

app.post("/api/v1/signup", signup);

app.post("/api/v1/login", login);

app.post("/api/v1/logout", logout);

// Check for client authentication here
app.use("/api/v1/*", protect);

app.use("/api/v1/salebill", saleBillRouter);

app.use("/api/v1/items", itemRoutes);

app.use("/api/v1/entity", entityRouter);

app.use("/api/v1/custgroup", custGroupRouter);

app.use("/api/v1/accgroup", accGroupRouter);

app.use("/api/v1/container", containerRouter);

app.use("/api/v1/salerecord", saleRecordRouter);

app.use("/api/v1/money-receipt", moneyReceiptRouter);

app.use("/api/v1/container-return", containerReturnRouter);

app.use("/api/v1/container-balance", contBalRouter);

// Serve frontend folder
app.use(express.static(path.join(__dirname, "frontend", "build")));
// On other request paths, render static files
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

app.listen(4000, () => {
  console.log(`Server running on port 4000 `);
});
