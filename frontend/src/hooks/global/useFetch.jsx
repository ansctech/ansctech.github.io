import { useState } from "react";

const useFetch = () => {
  const [isLoading, setIsLoading] = useState();

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

      let data;

      if (methodUpper === "GET") {
        data = await response.json();
      }

      //   Call success function
      successFn && successFn(data);

      //   Set loading to done
      setIsLoading(false);

      // return data
      return data;
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
