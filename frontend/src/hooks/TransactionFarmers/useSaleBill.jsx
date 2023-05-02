import { useSelector } from "react-redux";
import { saleBillActions } from "../../store/TransactionFarmers/saleBill";
import useActions from "../global/useActions";

const useSaleBill = () => {
  const saleBill = useSelector((state) => state.saleBillReducer);

  const {
    addAction: addSaleBill,
    updateAction: updateSaleBill,
    deleteAction: deleteSaleBill,
    isLoading,
  } = useActions(saleBill, saleBillActions, {
    mainStorage: "saleBill",
    idField: "bill_id",
  });

  return {
    saleBill,
    controllers: {
      addSaleBill,
      updateSaleBill,
      deleteSaleBill,
    },
    volatileState: {
      isLoading,
    },
  };
};

export default useSaleBill;
