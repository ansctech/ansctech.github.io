const useDate = () => {
  const convertDateToNormalFormat = (givenDate) => {
    const date = new Date(givenDate);
    return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
      "0" + date.getDate()
    ).slice(-2)}`;
  };

  return {
    convertDateToNormalFormat,
  };
};

export default useDate;
