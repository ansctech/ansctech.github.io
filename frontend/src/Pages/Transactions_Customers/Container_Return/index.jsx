import React from "react";
import { Modal, Table } from "antd";
import AddContainerReturn from "./addContainerReturn";
import TableSearch from "../../../components/Table/tableSearch";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import useContainerReturn from "../../../hooks/TransactionCustomers/useContainerReturn";
import useUnits from "../../../hooks/Masters/useUnits";
import useCustomerGroups from "../../../hooks/Masters/useCustomerGroups";

const ContainerReturn = () => {
  const { confirm } = Modal;

  const {
    containerReturn: { containerReturn, isModal },
    controllers,
    volatileState: { isLoading },
  } = useContainerReturn();

  const {
    customerGroups: { customerGroups },
  } = useCustomerGroups();

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
          {customerGroups.find((cust) => {
            return cust.cust_group_id === Number(e?.entity_id);
          })?.cust_group_name_eng || e.entity_id}
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
    {
      title: "Qty Issued",
      dataIndex: "qty_issued",
      sorter: (a, b) => a.qyt_received - b.qyt_received,
      ...TableSearch("qyt_received"),
    },
    {
      title: "Qty Received",
      dataIndex: "qty_received",
      sorter: (a, b) => a.qty_received - b.qty_received,
      ...TableSearch("qty_received"),
    },
    {
      title: "Delete",
      width: 100,
      fixed: "right",
      render: (record) => (
        <div className={"table-action justify-content-center"}>
          <DeleteOutlined onClick={() => deleteItem(record?.cont_txn_id)} />
        </div>
      ),
    },
  ];

  const tableHeader = (
    <div className="table-headers">
      <h4>Container Return</h4>
      <AddContainerReturn
        modal={isModal}
        isLoading={isLoading}
        units={units}
        customerGroups={customerGroups}
        {...controllers}
      />
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
      dataSource={containerReturn}
    />
  );
};

export default ContainerReturn;
