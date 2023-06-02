import { useDispatch, useSelector } from "react-redux";
import { saleBillActions } from "../../store/TransactionFarmers/saleBill";
import { businessEntityActions } from "../../store/Masters/businessEntity";
import useActions from "../global/useActions";
import { containerBalanceActions } from "../../store/TransactionCustomers/containerBalance";

const useSaleBill = () => {
  const saleBill = useSelector((state) => state.saleBillReducer);
  const dispatch = useDispatch();

  const {
    addAction: addSaleBill,
    updateAction: updateSaleBill,
    deleteAction: deleteSaleBill,
    isLoading,
  } = useActions(saleBill, saleBillActions, {
    mainStorage: "saleBill",
    idField: "bill_id",
  });

  const generateBill = async (date) => {
    if (!date) return alert("Date not given");

    await addSaleBill({ values: { bill_date: date } });

    dispatch(businessEntityActions.update({ loaded: false }));

    dispatch(containerBalanceActions.update({ loaded: false }));
  };

  return {
    saleBill,
    controllers: {
      deleteSaleBill,
      generateBill,
    },
    volatileState: {
      isLoading,
    },
  };
};

export default useSaleBill;
