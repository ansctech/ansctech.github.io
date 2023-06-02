import React, { useState } from "react";
import { Select, Table } from "antd";
import useCustomerGroups from "../../hooks/Masters/useCustomerGroups";
import useBusinessEntity from "../../hooks/Masters/useBusinessEntity";
import TableSearch from "../../components/Table/tableSearch";
import useUnits from "../../hooks/Masters/useUnits";
import useContainerBalance from "../../hooks/TransactionCustomers/useContainerBalance";

function ContainerBalanceReport() {
  const [currentContainer, setCurrentContainer] = useState();
  const [currentCustomerGroup, setCurrentCustomerGroup] = useState();
  const {
    customerGroups: { customerGroups },
    volatileState: { isLoading: isLoadingGroup },
  } = useCustomerGroups();

  const {
    businessEntity: { businessEntity },
    volatileState: { isLoading: isLoadingEntity },
  } = useBusinessEntity();

  // Units
  const {
    units: { units },
    volatileState: { isLoading: isLoadingUnits },
  } = useUnits();
  // Container balance
  const {
    containerBalance: { containerBalance },
    volatileState: { isLoading: isLoadingContainer },
  } = useContainerBalance();

  // Schema
  const columns = [
    {
      title: "SI#",
      align: "left",
      render: (a, b, index) => <b>{index + 1}</b>,
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
      sorter: (a, b) => a.entityname_eng.localeCompare(b.entityname_eng),
      ...TableSearch("entityname_eng"),
    },
    {
      title: "Quantity",
      sorter: (a, b) => a.curr_bal - b.curr_bal,
      ...TableSearch("curr_bal"),
      key: "curr_bal",
      align: "right",
      render: (record) => (
        <b className="notranslate">{Number(record.curr_bal).toFixed(2)}</b>
      ),
    },
  ];

  const tableHeader = (
    <div className="table-headers">
      <h4>Balance report</h4>
      <div>
        <span style={{ marginRight: 10 }}>Customer Group: </span>
        <Select
          defaultValue="All Groups"
          onChange={(value) => {
            setCurrentCustomerGroup(value);
          }}
        >
          <Select.Option value="">All Groups</Select.Option>
          {customerGroups.map((customer) => (
            <Select.Option
              key={customer.cust_group_id}
              value={customer.cust_group_id}
            >
              {customer.cust_group_name_eng}
            </Select.Option>
          ))}
        </Select>

        <span style={{ marginRight: 10, marginLeft: 30 }}>
          Contianer Type:{" "}
        </span>
        <Select
          defaultValue="All Types"
          onChange={(value) => {
            setCurrentContainer(value);
          }}
        >
          <Select.Option value="">All Types</Select.Option>
          {units.map(
            (unit) =>
              unit.maintain_inventory == "YES" && (
                <Select.Option
                  key={unit.container_id}
                  value={unit.container_id}
                >
                  {unit.container_name_eng}
                </Select.Option>
              )
          )}
        </Select>
      </div>
    </div>
  );

  return (
    <Table
      columns={columns}
      dataSource={containerBalance.filter(
        (container) =>
          // Check container type of container balance
          (container.container_id == currentContainer || !currentContainer) &&
          //   Get customer details and check if they belong to the same customer group as needed
          (businessEntity.find(
            ({ entity_id }) => entity_id == container.entity_id
          )?.cust_grp_id == currentCustomerGroup ||
            !currentCustomerGroup)
      )}
      bordered
      scroll={{ x: 500 }}
      title={() => tableHeader}
      loading={
        isLoadingEntity ||
        isLoadingGroup ||
        isLoadingContainer ||
        isLoadingUnits
      }
      rowKey={"cont_rec_id"}
      summary={(pageData) => {
        let totalBalance = pageData.reduce(
          (acc, curr) => (acc += Number(curr.curr_bal)),
          0
        );
        return (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}></Table.Summary.Cell>
            <Table.Summary.Cell index={1}></Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <b>Total Balance:</b>
                <b className="notranslate">{totalBalance.toFixed(2)}</b>
              </div>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        );
      }}
    />
  );
}

export default ContainerBalanceReport;
