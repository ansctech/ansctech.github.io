import React from "react";
import { Routes, Route } from "react-router-dom";

import Units from "../../Pages/Masters/Units";
import Vegetables from "../../Pages/Masters/Vegetables";
import AccountGroups from "../../Pages/Masters/Account_Groups";
import CustomerGroups from "../../Pages/Masters/Customer_Groups";
import BusinessEntity from "../../Pages/Masters/Business_Entity";
import SaleBill from "../../Pages/Transactions_Customers/Sale_Bill";
import MoneyReceipt from "../../Pages/Transactions_Customers/Money_Receipt";
import ContainerReturn from "../../Pages/Transactions_Customers/Container_Return";
import Login from "../../Pages/Auth/Login";
import SaleRecord from "../../Pages/Transactions_Customers/Sale_Bill/saleRecord";

const Content = () => {
  return (
    <Routes>
      <Route path={"/"} element={<BusinessEntity />} />
      <Route path={"/login"} element={<Login />} />

      {/* Masters */}
      <Route path={"/masters/units"} element={<Units />} />
      <Route path={"/masters/vegetables"} element={<Vegetables />} />
      <Route path={"/masters/account-groups"} element={<AccountGroups />} />
      <Route path={"/masters/customer-groups"} element={<CustomerGroups />} />
      <Route path={"/masters/business-entity"} element={<BusinessEntity />} />

      {/* Customers */}
      <Route path={"/customers/money-receipt"} element={<MoneyReceipt />} />
      <Route path={"/customers/sale-bill"} element={<SaleBill />} />
      <Route
        path={"/customers/sale-bill/:billId/:date/:customer"}
        element={<SaleRecord />}
      />
      <Route
        path={"/customers/container-return"}
        element={<ContainerReturn />}
      />

      {/* Farmers */}
      {/* <Route path={"/farmers/container-return"} element={<ContainerReturn />} /> */}
    </Routes>
  );
};

export default Content;
