import { useSelector } from "react-redux";
import { businessEntityActions } from "../../store/Masters/businessEntity";
import useActions from "../global/useActions";

const useBusinessEntity = () => {
  const businessEntity = useSelector((state) => state.businessEntityReducer);

  const {
    addAction: addBusinessEntity,
    updateAction: updateBusinessEntity,
    deleteAction: deleteBusinessEntity,
    isLoading,
  } = useActions(businessEntity, businessEntityActions, {
    mainStorage: "businessEntity",
    idField: "entity_id",
  });

  return {
    businessEntity,
    controllers: {
      addBusinessEntity,
      updateBusinessEntity,
      deleteBusinessEntity,
    },
    volatileState: {
      isLoading,
    },
  };
};

export default useBusinessEntity;
