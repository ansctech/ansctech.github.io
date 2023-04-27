import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { businessEntityActions } from "../../store/Masters/businessEntity";
import useActions from "../global/useActions";
import useFetch from "../global/useFetch";

const useBusinessEntity = () => {
  const businessEntity = useSelector((state) => state.businessEntityReducer);
  const dispatch = useDispatch();

  const { reqFn } = useFetch();

  // Get business entity types
  const getEntityTypes = () => {
    reqFn({
      method: "GET",
      url: `/${businessEntity.url}/entity-types`,
      successFn: (data) => {
        dispatch(
          businessEntityActions.update({
            entityTypes: { loaded: true, entityTypes: data },
          })
        );
      },
    });
  };

  useEffect(() => {
    if (!businessEntity.entityTypes.loaded) {
      getEntityTypes();
    }
  }, []);

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
