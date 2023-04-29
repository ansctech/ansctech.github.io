import { useSelector } from "react-redux";
import { moneyReceiptActions } from "../../store/TransactionCustomers/moneyReceipt";
import useActions from "../global/useActions";

const useMoneyReceipt = () => {
  const moneyReceipt = useSelector((state) => state.moneyReceiptReducer);

  const {
    addAction: addMoneyReceipt,
    updateAction: updateMoneyReceipt,
    deleteAction: deleteMoneyReceipt,
    isLoading,
  } = useActions(moneyReceipt, moneyReceiptActions, {
    mainStorage: "moneyReceipt",
    idField: "receipt_id",
  });

  return {
    moneyReceipt,
    controllers: {
      addMoneyReceipt,
      updateMoneyReceipt,
      deleteMoneyReceipt,
    },
    volatileState: {
      isLoading,
    },
  };
};

export default useMoneyReceipt;
