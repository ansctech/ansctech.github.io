import React, { useEffect, useState } from "react";

export default function Table({ data, totals, bringRowIndex, tableLangDate, setAlertMessage }) {
  const [delIndex, setDelIndex] = useState("");
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    bringRowIndex(delIndex);
    setIsDelete(false);
  }, [isDelete]);
  return (
    <div className="mt-3">
      <table style={{ fontSize: "18px" }} className="table table-bordered table-responsive">
        <thead>
          <tr className="table table-dark">
            {tableLangDate?.columns?.map((column, index) => (
              <th className="header" key={index} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td scope="row">{index + 1}</td>
              <td>{item.customerName?.name}</td>
              <td>{item.vegetableName?.name}</td>
              <td className="text-end">{Number(item.qtyNumber).toFixed(2)}</td>
              <td>{item.firstUnit?.name}</td>
              <td className="text-end">{Number(item.rateNumber).toFixed(2)}</td>
              <td className="text-end">{Number(item.kgOrUnit).toFixed(2)}</td>
              <td className="text-end">
                {item.multiply
                  ? Number(
                      Math.round(
                        Number(item.qtyNumber) * Number(item.rateNumber) * Number(item.kgOrUnit) +
                          "e6"
                      ) + "e-6"
                    )
                  : Number(
                      Math.round(Number(item.qtyNumber) * Number(item.rateNumber) + "e6") + "e-6"
                    )}
              </td>
              <td>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#alertModal"
                  onClick={() => {
                    setDelIndex(index);
                    setAlertMessage(tableLangDate?.deleteMsg);
                    setIsDelete(true);
                  }}
                  className="btn btn-danger"
                >
                  {tableLangDate?.delBtn}
                </button>
              </td>
            </tr>
          ))}

          <tr>
            <th className="text-center" colSpan="3" scope="row">
              {tableLangDate?.totalCol}
            </th>
            <td className="text-end">{totals?.qtys.reduce((a, b) => a + b, 0).toFixed(2)}</td>
            <td className="text-center">-</td>
            <td className="text-end">{totals?.rates.reduce((a, b) => a + b, 0).toFixed(2)}</td>
            <td className="text-end">{totals?.kgOrUnits.reduce((a, b) => a + b, 0).toFixed(2)}</td>
            <td className="text-end">
              {Number(Math.round(totals?.amounts.reduce((a, b) => a + b, 0) + "e6") + "e-6")}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
