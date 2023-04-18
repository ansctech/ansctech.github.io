import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import AddAccount from "./addAccount";
import { useDispatch } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import TableSearch from "../../../components/Table/tableSearch";
import useAccountGroups from "../../../hooks/Masters/useAccountGroups";
import { accountGroupsActions } from "../../../store/Masters/accountGroups";

const AccountGroups = () => {
  const [editItem, setEditItem] = useState("");
  const { confirm } = Modal;
  const dispatch = useDispatch();

  // Account Groups Hook
  const {
    accountGroups: { accountGroups, isModal },
    controllers: { addAccountGroup, updateAccountGroup, deleteAccountGroup },
    volatileState: { isLoading },
  } = useAccountGroups();

  useEffect(() => {
    !isModal && setEditItem("");
  }, [isModal]);

  const editAccountItem = (item) => {
    setEditItem(item);
    dispatch(accountGroupsActions.update({ isModal: true }));
  };

  const deleteAccountItem = (accountId) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteAccountGroup(accountId);
      },
    });
  };

  // Schema
  const columns = [
    {
      title: "Name (English)",
      dataIndex: "acc_group_name_eng",
      sorter: (a, b) => a.nameEn.localeCompare(b.nameEn),
      ...TableSearch("nameEn"),
    },
    {
      title: "Name (Russian)",
      dataIndex: "nameRu",
      sorter: (a, b) => a.nameRu.localeCompare(b.nameRu),
      ...TableSearch("nameRu"),
    },
    {
      title: "Action",
      width: 100,
      fixed: "right",
      render: (record) => (
        <div className={"table-action"}>
          <EditOutlined onClick={() => editAccountItem(record)} />
          <DeleteOutlined
            onClick={() => deleteAccountItem(record?.acc_group_id)}
          />
        </div>
      ),
    },
  ];

  const tableHeader = (
    <div className="table-headers">
      <h4>Account Groups</h4>
      <AddAccount
        modal={isModal}
        editItem={editItem}
        {...{
          addAccountGroup,
          updateAccountGroup,
          deleteAccountGroup,
          isLoading,
        }}
      />
    </div>
  );

  return (
    <Table
      columns={columns}
      dataSource={accountGroups}
      bordered
      scroll={{ x: 500 }}
      //   Set back to isLoading in order to allow DOM updates
      loading={isLoading}
      title={() => tableHeader}
      rowKey={"acc_group_id"}
    />
  );
};

export default AccountGroups;
