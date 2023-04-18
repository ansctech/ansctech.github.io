import { useEffect } from "react";

const { useDispatch } = require("react-redux");
const { default: useFetch } = require("./useFetch");

const useActions = (reducerState, reducerAction, { mainStorage, idField }) => {
  const { reqFn, isLoading } = useFetch();
  const dispatch = useDispatch();

  //   Gets all reducer data from server
  useEffect(() => {
    if (!reducerState.loaded) {
      reqFn({
        method: "GET",
        url: reducerState.url,
        successFn: (newData) => {
          const data = {};
          data[mainStorage] = newData;
          data.loaded = true;

          dispatch(reducerAction.update(data));
        },
      });
    }
  }, []);

  //   Adds data to server and reflects on frontend
  const addAction = ({ values }) => {
    reqFn({
      method: "POST",
      url: reducerState.url,
      successFn: (newData) => {
        // Add new account to account groups
        const data = {};
        data[mainStorage] = [...reducerState[mainStorage], newData];

        dispatch(reducerAction.update(data));
      },
      values,
    });
  };

  //   Updates data in server and reflects on frontend
  const updateAction = ({ id, values }) => {
    reqFn({
      method: "PUT",
      url: `${reducerState.url}/${id}`,
      successFn: (updatedData) => {
        const data = {};
        data[mainStorage] = [
          ...reducerState[mainStorage].filter((acc) => acc[idField] !== id),
          updatedData,
        ];

        dispatch(reducerAction.update(data));
      },
      values,
    });
  };

  //   Deletes data from server and reflects on frontend
  const deleteAction = (id) => {
    reqFn({
      method: "DELETE",
      url: `${reducerState.url}/${id}`,
      successFn: () => {
        const data = {};
        data[mainStorage] = reducerState[mainStorage].filter(
          (acc) => acc[idField] !== id
        );
        dispatch(reducerAction.update(data));
      },
    });
  };

  // Selects data from server
  const selectAction = (id) => {
    reqFn({
      method: "GET",
      url: `${reducerState.url}/${id}`,
      successFn: (newData) => {
        const data = {};
        data[`select${mainStorage[0].toUpperCase()}${mainStorage.slice(1)}`] =
          newData;

        dispatch(reducerAction.update(data));
      },
    });
  };

  return {
    addAction,
    updateAction,
    deleteAction,
    selectAction,
    isLoading,
  };
};

export default useActions;
