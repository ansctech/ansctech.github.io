import { useSelector } from "react-redux";
import { saleRecordActions } from "../../store/TransactionCustomers/saleRecord";
import useActions from "../global/useActions";

const useSaleRecord = () => {
  const saleRecord = useSelector((state) => state.saleRecordReducer);

  const {
    addAction: addSaleRecord,
    updateAction: updateSaleRecord,
    deleteAction: deleteSaleRecord,
    selectAction: selectSaleRecord,
    isLoading,
  } = useActions(saleRecord, saleRecordActions, {
    mainStorage: "saleRecord",
    idField: "entry_id",
  });

  return {
    saleRecord,
    controllers: {
      addSaleRecord,
      updateSaleRecord,
      selectSaleRecord,
      deleteSaleRecord,
    },
    volatileState: {
      isLoading,
    },
  };
};

export default useSaleRecord;
