import { getItem } from "./index";
import { useTranslation } from "react-i18next";

const useItems = () => {
  const { t } = useTranslation();

  return [
    getItem(t("table.masters.text"), "/masters", "", [
      getItem(
        t("table.masters.subHeaders.businessEntity.text"),
        "/business-entity"
      ),
      getItem(t("table.masters.subHeaders.vegetables.text"), "/vegetables"),
      getItem(t("table.masters.subHeaders.units.text"), "/units"),
      getItem(
        t("table.masters.subHeaders.customerGroups.text"),
        "/customer-groups"
      ),
      getItem(
        t("table.masters.subHeaders.accountGroups.text"),
        "/account-groups"
      ),
    ]),
    getItem("Transactions (Customers)", "/customers", "", [
      getItem(t("table.masters.subHeaders.saleRecord.text"), "/sale-record"),
      // getItem('Sale Bill', '/sale-bill'),
      getItem("Money Receipt", "/money-receipt"),
      getItem("Container Return", "/container-return"),
    ]),
    getItem("Transactions (Farmers)", "/farmers", "", [
      getItem("Sale Bill", "9"),
      getItem("Payment", "10"),
      getItem("Container Return", "/container-receipt"),
    ]),
    getItem("Reports", "/reports", "", [
      getItem("Bill Print", "11"),
      getItem("Receipts", "12"),
      getItem("Balance Report", "13"),
      getItem("Container Balance Report", "14"),
      getItem("Accounting Report", "15"),
    ]),
  ];
};

export default useItems;
