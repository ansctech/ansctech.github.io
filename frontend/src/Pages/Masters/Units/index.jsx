import React, { useEffect, useState } from "react";
import AddUnits from "./addUnits";
import { Table, Modal, Checkbox } from "antd";
import { useDispatch } from "react-redux";
import TableSearch from "../../../components/Table/tableSearch";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import useUnits from "../../../hooks/Masters/useUnits";
import { unitsActions } from "../../../store/Masters/units";

const Units = () => {
  const [editItem, setEditItem] = useState("");
  const dispatch = useDispatch();
  const { confirm } = Modal;

  const {
    units: { units, isModal, tableLoader },
    controllers,
    volatileState: { isLoading },
  } = useUnits();

  useEffect(() => {
    !isModal && setEditItem("");
  }, [isModal]);

  const editUnitItem = (item) => {
    setEditItem(item);
    dispatch(unitsActions.update({ isModal: true }));
  };

  const removeUnit = (unitId) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        controllers.deleteUnits(unitId);
      },
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "container_name_eng",
      sorter: (a, b) =>
        a.container_name_eng.localeCompare(b.container_name_eng),
      ...TableSearch("container_name_eng"),
    },
    {
      title: "Container Charge",
      dataIndex: "container_charge",
      sorter: (a, b) => a.container_charge - b.container_charge,
      ...TableSearch("container_charge"),
      align: "right",
    },
    {
      title: "Maintain Inventory",
      dataIndex: "maintain_inventory",
      sorter: (a, b) => a.maintain_inventory - b.maintain_inventory,
      render: (record) => <Checkbox checked={record} />,
    },
    {
      title: "Action",
      width: 100,
      fixed: "right",
      render: (record) => (
        <div className={"table-action"}>
          <EditOutlined onClick={() => editUnitItem(record)} />
          <DeleteOutlined onClick={() => removeUnit(record?.container_id)} />
        </div>
      ),
    },
  ];

  const tableHeader = (
    <div className="table-headers">
      <h4>Units</h4>
      <AddUnits
        editItem={editItem}
        modal={isModal}
        isLoading={isLoading}
        {...controllers}
      />
    </div>
  );

  return (
    <Table
      bordered
      rowKey={"id"}
      columns={columns}
      scroll={{ x: 500 }}
      dataSource={units}
      loading={isLoading}
      title={() => tableHeader}
      summary={(record) => {
        let totalContainer = record.reduce(
          (acc, curr) => (acc += Number(curr.container_charge)),
          0
        );
        return (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>
              <b>Total</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="right">
              {" "}
              <b>{totalContainer}</b>{" "}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}></Table.Summary.Cell>
            <Table.Summary.Cell index={3} fixed="right"></Table.Summary.Cell>
          </Table.Summary.Row>
        );
      }}
    />
  );
};

export default Units;
