import React from "react";
import { DatePicker, Form, Modal, Table } from "antd";
import AddContainerReturn from "./addContainerReturn";
import TableSearch from "../../../components/Table/tableSearch";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import useContainerReturn from "../../../hooks/TransactionCustomers/useContainerReturn";
import useUnits from "../../../hooks/Masters/useUnits";
import useBusinessEntity from "../../../hooks/Masters/useBusinessEntity";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { containerReturnActions } from "../../../store/TransactionCustomers/containerReturn";

const ContainerReturn = () => {
  const { confirm } = Modal;

  const {
    containerReturn: { containerReturn, isModal },
    controllers,
    volatileState: { isLoading },
  } = useContainerReturn();

  const [editItem, setEditItem] = useState();
  const dispatch = useDispatch();

  const [duplicateData, setDuplicateData] = useState();
  const [form] = Form.useForm();
  const [date, setDate] = useState();

  const {
    businessEntity: { businessEntity },
  } = useBusinessEntity();

  const {
    units: { units },
  } = useUnits();

  const deleteItem = (id) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        controllers.deleteContainerReturn(id);
      },
    });
  };

  useEffect(() => {
    !isModal && setEditItem("");
  }, [isModal]);

  useEffect(() => {
    // Set date to today
    const today = new Date(Date.now());
    form.setFieldsValue({ selected_date: moment(today.toISOString()) });
    setDate(
      `${today.getFullYear()}-${("0" + (today.getMonth() + 1)).slice(-2)}-${(
        "0" + today.getDate()
      ).slice(-2)}`
    );
  }, []);

  useEffect(() => {
    setDuplicateData(
      containerReturn.filter(({ cont_txn_date }) => {
        if (!date) return true;

        let dataDate = new Date(cont_txn_date);
        dataDate = `${dataDate.getFullYear()}-${(
          "0" +
          (dataDate.getMonth() + 1)
        ).slice(-2)}-${("0" + dataDate.getDate()).slice(-2)}`;

        return dataDate === date;
      })
    );
  }, [date, containerReturn]);

  const editContainerReturnItem = (item) => {
    setEditItem(item);
    dispatch(containerReturnActions.update({ isModal: true }));
  };

  const columns = [
    {
      title: "Date of Receipt",
      render: (e) => (
        <>
          {new Date(e.cont_txn_date).toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
            day: "numeric",
          })}
        </>
      ),
      sorter: (a, b) => a.cont_txn_date.localeCompare(b.cont_txn_date),
      ...TableSearch("cont_txn_date"),
    },
    {
      title: "Customer Name",
      render: (e) => (
        <>
          {businessEntity.find((entity) => {
            return Number(entity.entity_id) === Number(e?.entity_id);
          })?.entityname_eng || e.entity_id}
        </>
      ),
      sorter: (a, b) => a.customer.localeCompare(b.customer),
      ...TableSearch("customer"),
    },
    {
      title: "Container Type",
      render: (e) => (
        <>
          {units.find((unit) => {
            return unit.container_id === Number(e?.container_id);
          })?.container_name_eng || e.container_id}
        </>
      ),
      sorter: (a, b) => a.container_id.localeCompare(b.container_id),
      ...TableSearch("container_id"),
    },
    // {
    //   title: "Qty Issued",
    //   dataIndex: "qty_issued",
    //   sorter: (a, b) => a.qyt_received - b.qyt_received,
    //   ...TableSearch("qyt_received"),
    // },
    {
      title: "Quantity",
      dataIndex: "qty_received",
      sorter: (a, b) => a.qty_received - b.qty_received,
      ...TableSearch("qty_received"),
    },
    {
      title: "Action",
      width: 100,
      fixed: "right",
      render: (record) => (
        <div className={"table-action"}>
          <EditOutlined onClick={() => editContainerReturnItem(record)} />
          <DeleteOutlined onClick={() => deleteItem(record?.cont_txn_id)} />
        </div>
      ),
    },
  ];

  const tableHeader = (
    <div className="table-headers">
      <h4>Container Return</h4>
      <div className="" style={{ display: "flex", gap: "30px" }}>
        <Form form={form}>
          <Form.Item name="selected_date">
            <DatePicker
              onChange={(_, dateString) => setDate(dateString)}
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
        <AddContainerReturn
          modal={isModal}
          editItem={editItem}
          isLoading={isLoading}
          units={units}
          businessEntity={businessEntity}
          {...controllers}
        />
      </div>
    </div>
  );

  return (
    <Table
      bordered
      rowKey={"id"}
      scroll={{ x: 768 }}
      columns={columns}
      loading={isLoading}
      title={() => tableHeader}
      dataSource={duplicateData?.filter((data) => data.qty_received)}
    />
  );
};

export default ContainerReturn;
