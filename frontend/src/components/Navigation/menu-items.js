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
    getItem("table.transaction-customer.text", "/customers", "", [
      getItem(
        t("table.transaction-customer.subHeaders.saleBill.text"),
        "/sale-bill"
      ),
      getItem(
        t("table.transaction-customer.subHeaders.moneyReceipt.text"),
        "/money-receipt"
      ),
      getItem(
        t("table.transaction-customer.subHeaders.containerReturn.text"),
        "/container-return"
      ),
    ]),
    getItem("table.transaction-farmer.text", "/farmers", "", [
      getItem("Payment", "10"),
      getItem("Container Return", "/container-receipt"),
    ]),
    getItem(t("table.reports.text"), "/reports", "", [
      getItem(t("table.reports.subHeaders.billPrint.text"), "/bill-print"),
      getItem("Receipts", "12"),
      getItem(
        t("table.reports.subHeaders.balanceReport.text"),
        "/balance-report"
      ),
      getItem(
        t("table.reports.subHeaders.containerBalanceReport.text"),
        "/container-balance-report"
      ),
      getItem("Accounting Report", "15"),
    ]),
  ];
};

export default useItems;
