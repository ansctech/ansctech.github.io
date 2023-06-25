import React, { useState } from "react";
import { Button, Select, Table } from "antd";
import useCustomerGroups from "../../hooks/Masters/useCustomerGroups";
import useBusinessEntity from "../../hooks/Masters/useBusinessEntity";
import TableSearch from "../../components/Table/tableSearch";
import useUnits from "../../hooks/Masters/useUnits";
import useContainerBalance from "../../hooks/TransactionCustomers/useContainerBalance";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function ContainerBalanceReport() {
  const { t } = useTranslation();

  const [currentContainer, setCurrentContainer] = useState();
  const client = useSelector((state) => state.clientReducer);
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
      title: t(
        "table.reports.subHeaders.containerBalanceReport.labels.SI.text"
      ),
      align: "left",
      render: (a, b, index) => <b>{index + 1}</b>,
    },
    {
      title: t(
        "table.reports.subHeaders.containerBalanceReport.labels.customerName.text"
      ),
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
      title: t(
        "table.reports.subHeaders.containerBalanceReport.labels.quantity.text"
      ),
      sorter: (a, b) => a.curr_bal - b.curr_bal,
      ...TableSearch("curr_bal"),
      key: "curr_bal",
      align: "right",
      render: (record) => (
        <b className="notranslate">{Number(record.curr_bal).toFixed(2)}</b>
      ),
    },
  ];

  const PDFFile = () => {
    const filteredBalance = containerBalance.filter(
      (container) =>
        // Check container type of container balance
        (container.container_id == currentContainer || !currentContainer) &&
        //   Get customer details and check if they belong to the same customer group as needed
        (businessEntity.find(
          ({ entity_id }) => entity_id == container.entity_id
        )?.cust_grp_id == currentCustomerGroup ||
          !currentCustomerGroup)
    );

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Title */}
          <Text style={styles.title}>{client.client_name_eng}</Text>
          {/* Tagline */}
          <Text style={styles.subtitle}>{client.tagline}</Text>
          <View
            style={{
              width: "45%",
              marginHorizontal: "auto",
              marginTop: 20,
              ...styles.section,
            }}
          >
            {/* Table Header */}
            <View style={{ display: "flex", flexDirection: "row" }}>
              {/* SI */}
              <Text style={{ width: 30 }}>SI</Text>
              {/* Customer Name */}
              <Text style={{ marginRight: "auto" }}>
                {t(
                  "table.reports.subHeaders.containerBalanceReport.labels.customerName.text"
                )}
              </Text>
              {/* Quantity */}
              <Text style={{}}>
                {t(
                  "table.reports.subHeaders.containerBalanceReport.labels.quantity.text"
                )}
              </Text>
            </View>
            {/* Divider */}
            <View
              style={{
                width: "100%",
                backgroundColor: "black",
                height: 2,
                marginVertical: 5,
              }}
            ></View>
            {/* Content */}
            {filteredBalance.map((ent, index) => (
              <View style={{ display: "flex", flexDirection: "row" }}>
                {/* SI */}
                <Text style={{ width: 30 }}>{index + 1}</Text>;
                {/* Customer Name */}
                <Text style={{ marginRight: "auto" }}>
                  {businessEntity.find((entity) => {
                    return Number(entity.entity_id) === Number(ent?.entity_id);
                  })?.entityname_eng || ent.entity_id}
                </Text>
                ;{/* Amount */}
                <Text style={{}}>{Number(ent.curr_bal).toFixed(2)}</Text>
              </View>
            ))}
            {/* Divider */}
            <View
              style={{
                width: "100%",
                backgroundColor: "black",
                height: 2,
                marginVertical: 5,
              }}
            ></View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 40,
              }}
            >
              <Text>Total amount</Text>
              <Text>
                {filteredBalance
                  .reduce((acc, curr) => acc + Number(curr.curr_bal), 0)
                  .toFixed(2)}
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  };

  const tableHeader = (
    <div className="table-headers">
      <h4>{t("table.reports.subHeaders.containerBalanceReport.text")}</h4>
      <div>
        <span style={{ marginRight: 10 }}>Customer Group: </span>
        <Select
          showSearch={true}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
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
          showSearch={true}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          defaultValue="All Types"
          onChange={(value) => {
            setCurrentContainer(value);
          }}
          style={{ marginRight: 20 }}
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

        <PDFDownloadLink document={<PDFFile />} fileName="containerbalance.pdf">
          {({ blob, url, loading, error }) => (
            <Button type="primary" disabled={loading}>
              Download PDF
            </Button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );

  const styles = StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
    },
    section: {
      marginVertical: 20,
      fontSize: 12,
      marginBottom: 50,
    },
    title: {
      fontSize: 15,
      textAlign: "center",
      marginTop: 10,
    },
    subtitle: {
      fontSize: 13,
      textAlign: "center",
    },
  });

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
