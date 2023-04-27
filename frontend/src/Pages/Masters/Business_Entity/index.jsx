import React, { useEffect, useState } from "react";
import { Table, Modal } from "antd";
import AddBusiness from "./addBusiness";
import { useDispatch } from "react-redux";
import TableSearch from "../../../components/Table/tableSearch";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import useBusinessEntity from "../../../hooks/Masters/useBusinessEntity";
import useAccountGroups from "../../../hooks/Masters/useAccountGroups";
import useCustomerGroups from "../../../hooks/Masters/useCustomerGroups";
import { businessEntityActions } from "../../../store/Masters/businessEntity";
import { useTranslation } from "react-i18next";

const BusinessEntity = () => {
  const [editItem, setEditItem] = useState("");
  const dispatch = useDispatch();
  const { confirm } = Modal;
  const { t } = useTranslation();

  //   Business Entity Hook
  const {
    businessEntity: { businessEntity, isModal, entityTypes },
    controllers,
    volatileState: { isLoading },
  } = useBusinessEntity();

  // Account groups hook
  const {
    accountGroups: { accountGroups },
  } = useAccountGroups();

  const {
    customerGroups: { customerGroups },
  } = useCustomerGroups();

  useEffect(() => {
    !isModal && setEditItem("");
  }, [isModal]);

  const deleteBusiness = (entityId) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        controllers.deleteBusinessEntity(entityId);
      },
    });
  };

  const editBusiness = (item) => {
    setEditItem(item);
    dispatch(businessEntityActions.update({ isModal: true }));
  };

  //   Schema
  const columns = [
    {
      title: t("table.masters.subHeaders.businessEntity.labels.name.text"),
      dataIndex: "entityname_eng",
      sorter: (a, b) => a.entityname_eng.localeCompare(b.entityname_eng),
      ...TableSearch("entityname_eng"),
      key: "entityname_eng",
    },
    {
      title: t(
        "table.masters.subHeaders.businessEntity.labels.entityType.text"
      ),
      dataIndex: "entity_type_id",
      sorter: (a, b) => a.entity_type_id.localeCompare(b.entity_type_id),
      ...TableSearch("entity_type_id"),
      key: "entity_type_id",
    },
    {
      title: t(
        "table.masters.subHeaders.businessEntity.labels.currentBalance.text"
      ),
      dataIndex: "curr_bal",
      sorter: (a, b) => a.curr_bal - b.curr_bal,
      ...TableSearch("curr_bal"),
      key: "curr_bal",
      align: "right",
      render: (record) => <b className="notranslate">{record}</b>,
    },
    {
      title: t("table.masters.subHeaders.businessEntity.labels.phone.text"),
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
      ...TableSearch("phone"),
      key: "phone",
    },
    {
      title: t("table.masters.subHeaders.businessEntity.labels.action.text"),
      width: 100,
      fixed: "right",
      render: (record) => (
        <div className={"table-action"}>
          <EditOutlined onClick={() => editBusiness(record)} />
          <DeleteOutlined onClick={() => deleteBusiness(record?.entity_id)} />
        </div>
      ),
    },
  ];

  const tableHeader = (
    <div className="table-headers">
      <h4>{t("table.masters.subHeaders.businessEntity.text")}</h4>
      <AddBusiness
        editItem={editItem}
        modal={isModal}
        isLoading={isLoading}
        {...{
          ...controllers,
          customerGroups,
          accountGroups,
          entityTypes,
        }}
      />
    </div>
  );

  return (
    <Table
      title={() => tableHeader}
      bordered
      rowKey={"id"}
      columns={columns}
      scroll={{ x: 768 }}
      loading={isLoading}
      dataSource={businessEntity}
      summary={(pageData) => {
        let totalBalance = pageData.reduce(
          (acc, curr) => (acc += Number(curr.curr_bal)),
          0
        );
        return (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>
              <b>Total</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}></Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="right">
              {" "}
              <b className="notranslate">{totalBalance}</b>{" "}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3}></Table.Summary.Cell>
            <Table.Summary.Cell index={4} fixed="right"></Table.Summary.Cell>
          </Table.Summary.Row>
        );
      }}
    />
  );
};

export default BusinessEntity;
