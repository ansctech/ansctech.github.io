import { useSelector } from "react-redux";
import { containerReturnActions } from "../../store/TransactionCustomers/containerReturn";
import useActions from "../global/useActions";

const useContainerReturn = () => {
  const containerReturn = useSelector((state) => state.containerReturnReducer);

  const {
    addAction: addContainerReturn,
    updateAction: updateContainerReturn,
    deleteAction: deleteContainerReturn,
    isLoading,
  } = useActions(containerReturn, containerReturnActions, {
    mainStorage: "containerReturn",
    idField: "cont_txt_id",
  });

  return {
    containerReturn,
    controllers: {
      addContainerReturn,
      updateContainerReturn,
      deleteContainerReturn,
    },
    volatileState: {
      isLoading,
    },
  };
};

export default useContainerReturn;
