import i18next from "i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clientActions } from "../../store/Authentication/client";
import { userActions } from "../../store/Authentication/user";
import { accountGroupsActions } from "../../store/Masters/accountGroups";
import { businessEntityActions } from "../../store/Masters/businessEntity";
import { customerGroupsActions } from "../../store/Masters/customerGroups";
import { unitsActions } from "../../store/Masters/units";
import { vegetablesActions } from "../../store/Masters/vegetables";
import { containerReturnActions } from "../../store/TransactionCustomers/containerReturn";
import { moneyReceiptActions } from "../../store/TransactionCustomers/moneyReceipt";
import { saleRecordActions } from "../../store/TransactionCustomers/saleRecord";
import { saleBillActions } from "../../store/TransactionFarmers/saleBill";
import useFetch from "../global/useFetch";

const useAuth = () => {
  const { reqFn, isLoading } = useFetch();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginRequest = ({ email, password, errorFn }) => {
    reqFn({
      url: "login",
      method: "POST",
      values: {
        email,
        password,
      },
      successFn: (data) => {
        // Update user data
        dispatch(userActions.update({ ...data.data.user }));

        // update client data
        dispatch(clientActions.update({ ...data.data.client }));

        // Set the language
        i18next.changeLanguage(
          data.data.client.default_lang?.slice(0, 2).toLowerCase()
        );

        // Save data to localstorage
        localStorage.setItem("agroCurrentUser", JSON.stringify(data.data.user));
        localStorage.setItem(
          "agroCurrentClient",
          JSON.stringify(data.data.client)
        );

        // Redirect to main page
        navigate("/", { replace: true });
      },
      errorFn,
    });
  };

  const logoutRequest = () => {
    reqFn({
      url: "logout",
      method: "POST",
      successFn: () => {
        // Clear all data
        dispatch(userActions.clear());
        dispatch(clientActions.clear());
        dispatch(accountGroupsActions.clear());
        dispatch(businessEntityActions.clear());
        dispatch(unitsActions.clear());
        dispatch(customerGroupsActions.clear());
        dispatch(vegetablesActions.clear());
        dispatch(containerReturnActions.clear());
        dispatch(moneyReceiptActions.clear());
        dispatch(saleRecordActions.clear());
        dispatch(saleBillActions.clear());

        // Clear data from localstorage
        localStorage.clear("agroCurrentUser");
        localStorage.clear("agroCurrentClient");

        navigate("/login", { replace: true });
      },
    });
  };

  return { loginRequest, logoutRequest, isLoading };
};

export default useAuth;
