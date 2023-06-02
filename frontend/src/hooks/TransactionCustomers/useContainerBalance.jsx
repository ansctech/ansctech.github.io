import { useSelector } from "react-redux";
import { containerBalanceActions } from "../../store/TransactionCustomers/containerBalance";
import useActions from "../global/useActions";

const useContainerBalance = () => {
  const containerBalance = useSelector(
    (state) => state.containerBalanceReducer
  );

  const { isLoading } = useActions(containerBalance, containerBalanceActions, {
    mainStorage: "containerBalance",
    idField: "cont_rec_id",
  });

  return {
    containerBalance,
    volatileState: { isLoading },
  };
};

export default useContainerBalance;
