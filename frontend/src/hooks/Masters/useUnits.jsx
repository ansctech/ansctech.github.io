import { useSelector } from "react-redux";
import { unitsActions } from "../../store/Masters/units";
import useActions from "../global/useActions";

const useUnits = () => {
  const units = useSelector((state) => state.unitsReducer);

  const {
    addAction: addUnits,
    updateAction: update,
    deleteAction: deleteUnits,
    isLoading,
  } = useActions(units, unitsActions, {
    mainStorage: "units",
    idField: "container_id",
  });

  return {
    units,
    controllers: {
      addUnits,
      update,
      deleteUnits,
    },
    volatileState: {
      isLoading,
    },
  };
};

export default useUnits;
