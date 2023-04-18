import { useSelector } from "react-redux";
import { accountGroupsActions } from "../../store/Masters/accountGroups";
import useActions from "../global/useActions";

const useAccountGroups = () => {
  const accountGroups = useSelector((state) => state.accountGroupsReducer);

  const {
    addAction: addAccountGroup,
    updateAction: updateAccountGroup,
    deleteAction: deleteAccountGroup,
    isLoading,
  } = useActions(accountGroups, accountGroupsActions, {
    mainStorage: "accountGroups",
    idField: "acc_group_id",
  });

  return {
    accountGroups,
    controllers: {
      addAccountGroup,
      updateAccountGroup,
      deleteAccountGroup,
    },
    volatileState: {
      isLoading,
    },
  };
};

export default useAccountGroups;
