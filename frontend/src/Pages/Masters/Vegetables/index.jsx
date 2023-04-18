import React, { useEffect, useState } from "react";
import { Table, Modal } from "antd";
import AddVegetables from "./addVegetables";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import TableSearch from "../../../components/Table/tableSearch";
import useVegetables from "../../../hooks/Masters/useVegetables";
import { vegetablesActions } from "../../../store/Masters/vegetables";

const Vegetables = () => {
  const [editItem, setEditItem] = useState("");
  const { confirm } = Modal;
  const dispatch = useDispatch();

  // Items Hook
  const {
    vegetables: { vegetables, isModal, tableLoader },
    controllers,
    volatileState: { isLoading },
  } = useVegetables();

  useEffect(() => {
    !isModal && setEditItem("");
  }, [isModal]);

  const editVegetable = (item) => {
    setEditItem(item);
    dispatch(vegetablesActions.update({ isModal: true }));
  };

  const deleteItem = (vegetableId) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        controllers.deleteVegetables(vegetableId);
      },
    });
  };

  const columns = [
    {
      title: "Name (English)",
      dataIndex: "item_name_eng",
      sorter: (a, b) => a.item_name_eng.localeCompare(b.item_name_eng),
      ...TableSearch("item_name_eng"),
    },
    {
      title: "Name (Russian)",
      dataIndex: "item_name_local_lang",
      sorter: (a, b) =>
        a.item_name_local_lang.localeCompare(b.item_name_local_lang),
      ...TableSearch("item_name_local_lang"),
    },
    {
      title: "Action",
      width: 100,
      fixed: "right",
      render: (record) => (
        <div className={"table-action"}>
          <EditOutlined onClick={() => editVegetable(record)} />
          <DeleteOutlined onClick={() => deleteItem(record?.item_id)} />
        </div>
      ),
    },
  ];

  const tableHeader = (
    <div className="table-headers">
      <h4>Vegetables</h4>
      <AddVegetables
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
      scroll={{ x: 550 }}
      loading={isLoading}
      dataSource={vegetables}
      title={() => tableHeader}
    />
  );
};

export default Vegetables;
