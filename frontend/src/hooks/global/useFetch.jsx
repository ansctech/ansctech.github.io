import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useFetch = () => {
  const [isLoading, setIsLoading] = useState();
  const navigate = useNavigate();

  // Request timeout in seconds
  const globalRequestTimeout = 30;

  // Network timeout function
  const networkTimeout = function (timeout) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error("Timeout exceeded"));
      }, timeout * 1000);
    });
  };

  const reqFn = async ({ method, url, successFn, errorFn, values }) => {
    // Convert method to upper case
    const methodUpper = method.toUpperCase();

    // Design fetch attributes only when it's not a GET request
    const fetchOptions =
      methodUpper !== "GET"
        ? {
            method: methodUpper,
            headers: {
              "Content-Type": "application/json",
            },
            body: values && JSON.stringify(values),
          }
        : {};

    try {
      // Initialize loading attribute
      setIsLoading(true);

      // Construct request
      const response = await Promise.race([
        fetch(`/api/v1/${url}`, fetchOptions),
        networkTimeout(globalRequestTimeout),
      ]);

      const data = await response.json();

      // If user gets a forbidden response, redirect to login
      if (response.status === 403) {
        navigate("/login");
        throw new Error(data.message);
      }

      // If payment is required due to customer subscription expiration
      if (response.status === 402) {
        alert(data.message);

        throw new Error(data.message);
      }

      // If any error occurs return the error message
      if (!response.ok) {
        throw new Error(data.message);
      }

      //   Call success function since request is successful
      successFn && successFn(data);

      //   Set loading to done
      setIsLoading(false);
    } catch (error) {
      // If there's an error, call error function
      errorFn && errorFn(error);
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    reqFn,
  };
};

export default useFetch;
