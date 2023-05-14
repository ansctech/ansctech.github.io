import { useSelector } from "react-redux";
import { containerBalanceActions } from "../../store/TransactionCustomers/containerBalance";
import useActions from "../global/useActions";

const useContainerBalance = () => {
  const containerBalance = useSelector(
    (state) => state.containerBalanceReducer
  );

  useActions(containerBalance, containerBalanceActions, {
    mainStorage: "containerBalance",
    idField: "cont_rec_id",
  });

  return {
    containerBalance,
  };
};

export default useContainerBalance;
