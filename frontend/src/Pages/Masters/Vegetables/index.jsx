import React, { useEffect, useState } from "react";
import { Table, Modal } from "antd";
import AddVegetables from "./addVegetables";
import { useDispatch } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import TableSearch from "../../../components/Table/tableSearch";
import useVegetables from "../../../hooks/Masters/useVegetables";
import useUnits from "../../../hooks/Masters/useUnits";
import { vegetablesActions } from "../../../store/Masters/vegetables";
import { useTranslation } from "react-i18next";

const Vegetables = () => {
  const [editItem, setEditItem] = useState("");
  const { confirm } = Modal;
  const dispatch = useDispatch();

  const { t } = useTranslation();

  // Items Hook
  const {
    vegetables: { vegetables, isModal },
    controllers,
    volatileState: { isLoading },
  } = useVegetables();
  const {
    units: { units },
  } = useUnits();

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
      title: t("table.masters.subHeaders.vegetables.labels.name.text"),
      dataIndex: "item_name_eng",
      sorter: (a, b) => a.item_name_eng.localeCompare(b.item_name_eng),
      ...TableSearch("item_name_eng"),
    },
    {
      title: t("table.masters.subHeaders.vegetables.labels.nameLocalLang.text"),
      dataIndex: "item_name_local_lang",
      sorter: (a, b) =>
        a.item_name_local_lang.localeCompare(b.item_name_local_lang),
      ...TableSearch("item_name_local_lang"),
    },
    {
      title: t("table.masters.subHeaders.vegetables.labels.action.text"),
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
      <h4>{t("table.masters.subHeaders.vegetables.text")}</h4>
      <AddVegetables
        editItem={editItem}
        modal={isModal}
        isLoading={isLoading}
        units={units}
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
