import { useSelector } from "react-redux";
import { customerGroupsActions } from "../../store/Masters/customerGroups";
import useActions from "../global/useActions";

const useCustomerGroups = () => {
  const customerGroups = useSelector((state) => state.customerGroupsReducer);

  const {
    addAction: addCustomerGroup,
    updateAction: updateCustomerGroup,
    deleteAction: deleteCustomerGroup,
    isLoading,
  } = useActions(customerGroups, customerGroupsActions, {
    mainStorage: "customerGroups",
    idField: "cust_group_id",
  });

  return {
    customerGroups,
    controllers: {
      addCustomerGroup,
      updateCustomerGroup,
      deleteCustomerGroup,
    },
    volatileState: {
      isLoading,
    },
  };
};

export default useCustomerGroups;
