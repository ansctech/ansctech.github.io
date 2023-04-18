import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Button, Row, Col, DatePicker, Input, Modal } from "antd";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import useSaleRecord from "../../../hooks/TransactionCustomers/useSaleRecord";

const AddedSaleRecord = () => {
  const [date, setDate] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    controllers: { selectSaleRecord },
    volatileState: { isLoading },
  } = useSaleRecord();

  useEffect(() => {
    selectSaleRecord(id);
  }, []);

  const selectDate = (date, dateString) => {
    setDate(dateString);
  };

  //   const calculateAmount = (amount) => {
  //     return (
  //       Number(amount.quantity) *
  //       (amount.multepule ? Number(amount.kgUnit) : 1) *
  //       Number(amount.rate)
  //     );
  //   };

  const deleteItem = (itemId) => {
    Modal.confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        // selectSaleRecord is an object, the filter attribute is undefined
        // let arr = selectSaleRecord.filter((e) => e.entry_id !== itemId);
        // updateSaleRecord({id: itemId, values: {...selectSaleRecord}})
        // dispatch(
        //   putSaleRecord({
        //     data: { ...selectSaleRecord, saleData: arr },
        //     pageId: id,
        //   })
        // );
      },
    });
  };

  const columns = [
    {
      title: "SI#",
      render: (a, b, num) => <>{num + 1}</>,
    },
    {
      title: "Vegetable",
      dataIndex: "item_id",
    },
    {
      title: "Qty",
      dataIndex: "sale_qty",
      align: "right",
    },
    {
      title: "Unit",
      dataIndex: "unit_container_id",
    },
    {
      title: "Rate",
      dataIndex: "item_rate",
      align: "right",
    },
    {
      title: "Kg/Unit",
      dataIndex: "kg_per_container",
      align: "right",
    },
    {
      title: "Amount",
      align: "right",
      dataIndex: "sale_amount",
      //   render: (e) => <>{calculateAmount(e)}</>,
    },
    {
      title: "Delete",
      align: "center",
      render: (e) => (
        <DeleteOutlined
          onClick={() => deleteItem(e.entry_id)}
          className="table-btn"
        />
      ),
    },
  ];

  console.log(selectSaleRecord);

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h4 style={{ fontWeight: 700 }}> Added Sale Record </h4>
        {/* <Button type="primary" onClick={() => navigate('/customers/add-sales')}>Create new record</Button> */}
      </div>
      <Row gutter={[30, 0]} className="mb-3 mt-4">
        <Col span={4}>
          <label htmlFor="">Date</label>
          <div>
            <DatePicker
              disabled
              onChange={selectDate}
              style={{ width: "100%" }}
            />
          </div>
        </Col>
        <Col>
          <label htmlFor="">Name of Customer</label>
          <Input value={selectSaleRecord?.entity_id_trader} />
        </Col>
      </Row>
      <Table
        bordered
        columns={columns}
        loading={isLoading}
        dataSource={[selectSaleRecord]}
      />
    </div>
  );
};

export default AddedSaleRecord;

// <Form/>
