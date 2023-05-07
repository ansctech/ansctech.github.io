import { useSelector } from "react-redux";
import { saleBillActions } from "../../store/TransactionFarmers/saleBill";
import useActions from "../global/useActions";
import useDate from "../global/useDate";

const useSaleBill = () => {
  const saleBill = useSelector((state) => state.saleBillReducer);
  const saleRecord = useSelector((state) => state.saleRecordReducer.saleRecord);
  const units = useSelector((state) => state.unitsReducer.units);
  const { convertDateToNormalFormat } = useDate();

  const {
    addAction: addSaleBill,
    updateAction: updateSaleBill,
    deleteAction: deleteSaleBill,
    isLoading,
  } = useActions(saleBill, saleBillActions, {
    mainStorage: "saleBill",
    idField: "bill_id",
  });

  const accummulateBill = (date, records) => {
    // Accumulate records to customer keys in aggregate object
    const result = records.reduce((curr, record) => {
      // Accumulate bill amount and total container amount if object exist already
      if (curr[record.entity_id_cust]) {
        curr[record.entity_id_cust].bill_amount += Number(record.sale_amount);

        // Get container amount by multiplying sale_qty by container charge
        curr[record.entity_id_cust].total_container_amount +=
          record.sale_qty *
            units.find((unit) => unit.container_id === record.unit_container_id)
              ?.container_charge || record.sale_qty;
      } else {
        // If it's a new customer, create a new object
        curr[record.entity_id_cust] = {
          entity_id_cust: record.entity_id_cust,
          bill_amount: Number(record.sale_amount),
          total_container_amount:
            record.sale_qty *
              units.find(
                (unit) => unit.container_id === record.unit_container_id
              )?.container_charge || record.sale_qty,
          bill_date: new Date(date).toISOString(),
        };
      }

      return curr;
    }, {});

    return result;
  };

  const generateBill = (date) => {
    if (!date) return alert("Date not given");

    // Filter sale records by date
    const currentDateBill = saleRecord.filter(
      (record) => convertDateToNormalFormat(record.sale_date) === date
    );

    if (!currentDateBill.length) return alert("No Sale Record For This Day");

    addSaleBill({ values: { bill_date: date } });
  };

  const updateBill = ({ billId, date, newRecords, customer }) => {
    const result = accummulateBill(date, newRecords);

    updateSaleBill({ values: result[customer], id: billId });
  };

  return {
    saleBill,
    controllers: {
      deleteSaleBill,
      generateBill,
      updateBill,
    },
    volatileState: {
      isLoading,
    },
  };
};

export default useSaleBill;
