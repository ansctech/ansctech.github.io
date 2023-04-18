import { useSelector } from "react-redux";
import { vegetablesActions } from "../../store/Masters/vegetables";
import useActions from "../global/useActions";

const useVegetables = () => {
  const vegetables = useSelector((state) => state.vegetablesReducer);

  const {
    addAction: addVegetables,
    updateAction: update,
    deleteAction: deleteVegetables,
    isLoading,
  } = useActions(vegetables, vegetablesActions, {
    mainStorage: "vegetables",
    idField: "item_id",
  });

  return {
    vegetables,
    controllers: {
      addVegetables,
      update,
      deleteVegetables,
    },
    volatileState: {
      isLoading,
    },
  };
};

export default useVegetables;
