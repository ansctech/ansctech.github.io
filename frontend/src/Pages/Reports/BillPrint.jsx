import { Button, DatePicker, Select } from "antd";
import Form from "antd/es/form/Form";
import dayjs from "dayjs";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Table, Checkbox } from "antd";

import useBusinessEntity from "../../hooks/Masters/useBusinessEntity";
import useCustomerGroups from "../../hooks/Masters/useCustomerGroups";
import {
  Document,
  pdf,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  PDFViewer,
} from "@react-pdf/renderer";
import useSaleRecord from "../../hooks/TransactionCustomers/useSaleRecord";
import useDate from "../../hooks/global/useDate";
import { useSelector } from "react-redux";
import useVegetables from "../../hooks/Masters/useVegetables";
import useUnits from "../../hooks/Masters/useUnits";
import useContainerBalance from "../../hooks/TransactionCustomers/useContainerBalance";
import useSaleBill from "../../hooks/TransactionFarmers/useSaleBill";

import useFetch from "../../hooks/global/useFetch";
import { useTranslation } from "react-i18next";
import hinFont from '../../assets/fonts/TiroDevanagariHindi-Regular.ttf';

Font.register({
  family: 'Tiro Devanagari',
  fonts:[{
    src: hinFont
  }]
})

function BillPrint() {
  const [form] = Form.useForm();

  const [showPDF, setShowPDF] = useState();
  const [date, setDate] = useState();
  const [currentCustomerGroup, setCurrentCustomerGroup] = useState();
  const [currentCustomer, setCurrentCustomer] = useState();
  const [billContent, setBillContent] = useState({});
  const [showWhatsappBillSelection, setShowWhatsappBillSelection] =
    useState(false);
  const [whatsappCustomers, setWhatsappCustomers] = useState([]);
  const client = useSelector((state) => state.clientReducer);

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const onSelectChange = (selectedCustomer) => {
    if (
      selectedCustomers.some(
        (cust) => cust.entity_id === selectedCustomer.entity_id
      )
    ) {
      setSelectedCustomers((prevState) =>
        prevState.filter((e) => e.entity_id !== selectedCustomer.entity_id)
      );
    } else {
      setSelectedCustomers((prevState) => [...prevState, selectedCustomer]);
    }
  };

  const { reqFn } = useFetch();

  const { t } = useTranslation();

  const {
    customerGroups: { customerGroups },
    volatileState: { isLoading: isLoadingGroup },
  } = useCustomerGroups();

  const {
    businessEntity: { businessEntity },
    volatileState: { isLoading: isLoadingEntity },
  } = useBusinessEntity();

  const {
    vegetables: { vegetables },
    volatileState: { isLoading: isLoadingVegetables },
  } = useVegetables();

  const {
    saleRecord: { saleRecord },
    volatileState: { isLoading: isLoadingRecords },
  } = useSaleRecord();

  const {
    saleBill: { saleBill },
    volatileState: { isLoading: isLoadingSaleBill },
  } = useSaleBill();

  const {
    units: { units },
    volatileState: { isLoading: isLoadingUnits },
  } = useUnits();

  const {
    containerBalance: { containerBalance },
    volatileState: { isLoading: isLoadingContainerBalance },
  } = useContainerBalance();

  const { convertDateToNormalFormat } = useDate();

  // Set date to today
  useEffect(() => {
    const today = new Date(Date.now());
    setDate(
      `${today.getFullYear()}-${("0" + (today.getMonth() + 1)).slice(-2)}-${(
        "0" + today.getDate()
      ).slice(-2)}`
    );
    form.setFieldsValue({ selected_date: dayjs(today.toISOString()) });
  }, []);

  //   Set bill content
  useEffect(() => {
    if (
      !isLoadingEntity &&
      !isLoadingGroup &&
      !isLoadingRecords &&
      !isLoadingVegetables &&
      !isLoadingUnits &&
      !isLoadingContainerBalance &&
      !isLoadingSaleBill
    ) {
      let result = [];

      // Filter by date
      result = saleRecord.filter(
        (record) => convertDateToNormalFormat(record.sale_date) === date
      );

      // populate results with necessary details
      result = result.map((res) => {
        const container = units.find(
          (cont) => cont.container_id == res.unit_container_id
        );

        return {
          ...res,
          vegDetails: vegetables.find((veg) => veg.item_id == res.item_id),
          contDetails: {
            // Get container name
            name: container?.container_name_eng,
            charge: container?.container_charge,

            // Get container balance
            balance: containerBalance.find(
              (cont) =>
                cont.container_id == res.unit_container_id &&
                cont.entity_id == res.entity_id_cust
            )?.curr_bal,
          },
          entityDetails: businessEntity.find(
            (ent) => ent.entity_id == res.entity_id_cust
          ),
        };
      });

      // Check for customer groups
      result = result.filter(
        (res) =>
          res.entityDetails.cust_grp_id == currentCustomerGroup ||
          !currentCustomerGroup
      );

      // Check for customer name
      result = result.filter(
        (res) =>
          res.entityDetails.entity_id == currentCustomer || !currentCustomer
      );

      // Arrange results based on customer name
      const accumulation = {};

      result.forEach((res) => {
        const address = accumulation[res.entityDetails.entityname_eng];

        const newItem = {
          itemName: res.vegDetails.item_name_eng,
          quantity: res.sale_qty,
          rate: res.item_rate,
          amount: res.sale_amount,
          container: res.contDetails.name,
          containerBal: res.contDetails.balance,
          weight: res.kg_per_container,
          entityId: res.entity_id_cust,
          entityDetails: res.entityDetails,
        };

        if (address) {
          address.push(newItem);
        } else {
          accumulation[res.entityDetails.entityname_eng] = [newItem];
        }
      });

      setBillContent(accumulation);

      // Set whatsapp details
      const whatsappDetails = Object.keys(accumulation).map(
        (acc) => accumulation[acc][0].entityDetails
      );

      setWhatsappCustomers(whatsappDetails);
    }
  }, [
    date,
    currentCustomer,
    currentCustomerGroup,
    isLoadingEntity,
    isLoadingGroup,
    isLoadingRecords,
    isLoadingVegetables,
    isLoadingUnits,
    isLoadingContainerBalance,
  ]);

  const styles = StyleSheet.create({
    page: {
      fontFamily: "Tiro Devanagari",
    },
    section: {
      marginVertical: 5,
      paddingHorizontal: 170,
      fontSize: 12,
      marginBottom: 50,
    },
    title: {
      fontSize: 15,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 13,
      textAlign: "center",
    },
  });

  // Whatsapp bill selection
  const columns = [
    {
      title: t("table.reports.subHeaders.billPrint.labels.sendBill.text"),
      render: (_, record) => (
        <Checkbox
          checked={selectedCustomers.some(
            (cust) => cust.entity_id === record.entity_id
          )}
          onChange={() => onSelectChange(record)}
        />
      ),
    },
    {
      title: t("table.reports.subHeaders.billPrint.labels.customerName.text"),
      dataIndex: "entityname_eng",
    },
    {
      title: t("table.reports.subHeaders.billPrint.labels.whatsappNumber.text"),
      dataIndex: "phone",
    },
  ];

  // Send bill to each customer
  const shareBills = async () => {
    for (let customer of selectedCustomers) {
      // Get customer own bill
      const bill = billContent[customer.entityname_eng];
      const billDetail = saleBill.find((rec) => {
        return (
          rec.entity_id_cust == bill[0].entityId &&
          convertDateToNormalFormat(rec.bill_date) == date
        );
      });

      // Create bill pdf
      const IndividualBillPdf = () => (
        <Document>
          <Page>
            <View key={bill.entry_id} style={styles.section}>
              {/* Title */}
              <Text style={styles.title}>{client.client_name_eng}</Text>
              {/* Tagline */}
              <Text style={styles.subtitle}>{client.tagline}</Text>
              {/* Customer details */}
              <View
                style={{
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {/* Customer name */}
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ fontWeight: 600, marginRight: 5 }}>
                    {t(
                      "table.reports.subHeaders.billPrint.labels.customer.text"
                    )}
                    :
                  </Text>
                  <Text>{customer.entityname_eng}</Text>
                </View>
                {/* Date */}
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ fontWeight: 600, marginRight: 5 }}>
                    {t("table.reports.subHeaders.billPrint.labels.date.text")}:
                  </Text>
                  <Text>{date}</Text>
                </View>
              </View>
              {/* Table */}
              <View>
                {/* Header */}
                <View
                  style={{
                    borderBottom: "1px solid black",
                    borderTop: "1px solid black",
                    paddingVertical: "5px",
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  <Text style={{ flexBasis: 110 }}>
                    {t(
                      "table.reports.subHeaders.billPrint.labels.itemName.text"
                    )}
                  </Text>
                  <Text style={{ flexBasis: 40, textAlign: "right" }}>
                    {t("table.reports.subHeaders.billPrint.labels.weight.text")}
                  </Text>
                  <Text style={{ flexBasis: 40, textAlign: "right" }}>
                    {t("table.reports.subHeaders.billPrint.labels.rate.text")}
                  </Text>
                  <Text style={{ flexBasis: 40, textAlign: "right" }}>
                    {t("table.reports.subHeaders.billPrint.labels.amount.text")}
                  </Text>
                </View>
                {/* Content */}
                <View
                  style={{
                    borderBottom: "1px solid black",
                    borderTop: "1px solid black",
                    paddingVertical: "5px",
                    display: "flex",
                    gap: 5,
                    marginTop: 5,
                    paddingBottom: 20,
                  }}
                >
                  {bill.map((entry) => (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        marginTop: 5,
                      }}
                    >
                      <Text style={{ flexBasis: 110 }}>
                        {entry.itemName} {entry.quantity} {entry.container}
                      </Text>
                      <Text style={{ flexBasis: 40, textAlign: "right" }}>
                        {entry.weight}
                      </Text>
                      <Text style={{ flexBasis: 40, textAlign: "right" }}>
                        {entry.rate}
                      </Text>
                      <Text style={{ flexBasis: 40, textAlign: "right" }}>
                        {Number(entry.amount).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
                {/* Summary */}
                <View
                  style={{
                    borderBottom: "1px solid black",
                    display: "flex",
                    gap: 5,
                  }}
                >
                  <View
                    style={{
                      paddingLeft: 100,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 20,
                    }}
                  >
                    <Text>
                      {t(
                        "table.reports.subHeaders.billPrint.labels.additionalCharge.text"
                      )}
                    </Text>
                    <Text>
                      {Number(billDetail?.total_container_amount).toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingLeft: 100,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 20,
                    }}
                  >
                    <Text>
                      {t(
                        "table.reports.subHeaders.billPrint.labels.totalAmount.text"
                      )}
                    </Text>
                    <Text>{Number(billDetail?.bill_amount).toFixed(2)}</Text>
                  </View>
                  <View
                    style={{
                      paddingLeft: 100,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 20,
                    }}
                  >
                    <Text>
                      {t(
                        "table.reports.subHeaders.billPrint.labels.previousBalance.text"
                      )}
                    </Text>
                    <Text>{Number(billDetail?.prev_balance).toFixed(2)}</Text>
                  </View>
                </View>
                {/* Net */}
                <View
                  style={{
                    borderBottom: "1px solid black",
                    paddingLeft: 100,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 20,
                  }}
                >
                  <Text>
                    {t(
                      "table.reports.subHeaders.billPrint.labels.netBalance.text"
                    )}
                  </Text>
                  <Text>
                    {(
                      Number(billDetail?.total_container_amount) +
                      Number(billDetail?.bill_amount) +
                      Number(billDetail?.prev_balance)
                    ).toFixed(2)}
                  </Text>
                </View>
                {/* Container balance*/}
                <View
                  style={{
                    borderBottom: "1px solid black",
                    borderTop: "1px solid black",
                    marginTop: 5,
                    padding: 5,
                    paddingBottom: 10,
                    paddingRight: 100,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      {t(
                        "table.reports.subHeaders.billPrint.labels.containerType.text"
                      )}
                    </Text>
                    <Text>
                      {t(
                        "table.reports.subHeaders.billPrint.labels.balance.text"
                      )}
                    </Text>
                  </View>
                  {bill.map(
                    (entry, index) =>
                      entry.containerBal &&
                      bill.findIndex(
                        (ent) => ent.container === entry.container
                      ) === index && (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ fontWeight: "bold" }}>
                            {entry.container}
                          </Text>
                          <Text>{entry.containerBal}</Text>
                        </View>
                      )
                  )}
                </View>
              </View>
            </View>
          </Page>
        </Document>
      );

      // Convert to Blob
      const blob = await pdf(<IndividualBillPdf />).toBlob();

      // Convert to binary
      const reader = new FileReader();

      reader.readAsArrayBuffer(blob);

      reader.onload = (event) => {
        const binaryFormat = event.target.result;

        // Send message
        reqFn({
          method: "POST",
          url: "message-bird",
          values: {
            pdfFile: binaryFormat,
            phone: customer.phone,
            name: customer.entityname_eng,
            client,
            date,
          },
          successFn: () => {
            alert(`Bill has been sent to ${customer.entityname_eng}`);
          },
          errorFn: () => {
            alert(`Bill failed to be sent to ${customer.entityname_eng}`);
          },
        });
      };
    }
  };

  return (
    <div>
      {/* Header */}
      <h2 className="">{t("table.reports.subHeaders.billPrint.text")}</h2>
      <div
        style={{
          marginBottom: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 30,
        }}
      >
        {/* Controls */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {/* Date */}
          <div className="">
            <Form form={form}>
              <Form.Item label="Bill Date" name="selected_date">
                <DatePicker
                  onChange={(date, dateString) => {
                    setDate(dateString);
                  }}
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Form>
          </div>

          {/* Customer Groups */}
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
          </div>

          {/* Customers */}
          <div>
            <span style={{ marginRight: 10 }}>Customer Name: </span>
            <Select
              showSearch={true}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              defaultValue="All Customers"
              onChange={(value) => {
                setCurrentCustomer(value);
              }}
            >
              <Select.Option value="">All Customers</Select.Option>
              {businessEntity.map((entity) => (
                <Select.Option key={entity.entity_id} value={entity.entity_id}>
                  {entity.entityname_eng}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <Button
            type="primary"
            onClick={() => {
              setShowPDF(true);
            }}
            disabled={
              isLoadingEntity &&
              isLoadingGroup &&
              isLoadingRecords &&
              isLoadingVegetables &&
              isLoadingUnits &&
              isLoadingContainerBalance &&
              isLoadingSaleBill
            }
          >
            Show Bill
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setShowWhatsappBillSelection(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: "#1BD741",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M414.73 97.1A222.14 222.14 0 0 0 256.94 32C134 32 33.92 131.58 33.87 254a220.61 220.61 0 0 0 29.78 111L32 480l118.25-30.87a223.63 223.63 0 0 0 106.6 27h.09c122.93 0 223-99.59 223.06-222A220.18 220.18 0 0 0 414.73 97.1ZM256.94 438.66h-.08a185.75 185.75 0 0 1-94.36-25.72l-6.77-4l-70.17 18.32l18.73-68.09l-4.41-7A183.46 183.46 0 0 1 71.53 254c0-101.73 83.21-184.5 185.48-184.5a185 185 0 0 1 185.33 184.64c-.04 101.74-83.21 184.52-185.4 184.52Zm101.69-138.19c-5.57-2.78-33-16.2-38.08-18.05s-8.83-2.78-12.54 2.78s-14.4 18-17.65 21.75s-6.5 4.16-12.07 1.38s-23.54-8.63-44.83-27.53c-16.57-14.71-27.75-32.87-31-38.42s-.35-8.56 2.44-11.32c2.51-2.49 5.57-6.48 8.36-9.72s3.72-5.56 5.57-9.26s.93-6.94-.46-9.71s-12.54-30.08-17.18-41.19c-4.53-10.82-9.12-9.35-12.54-9.52c-3.25-.16-7-.2-10.69-.2a20.53 20.53 0 0 0-14.86 6.94c-5.11 5.56-19.51 19-19.51 46.28s20 53.68 22.76 57.38s39.3 59.73 95.21 83.76a323.11 323.11 0 0 0 31.78 11.68c13.35 4.22 25.5 3.63 35.1 2.2c10.71-1.59 33-13.42 37.63-26.38s4.64-24.06 3.25-26.37s-5.11-3.71-10.69-6.48Z"
              />
            </svg>
            Whatsapp Bills
          </Button>

          <Button
            type="primary"
            typeof=""
            onClick={() => {
              setShowPDF(false);
            }}
            style={{
              backgroundColor: "#d51a1a",
            }}
          >
            Close Bill
          </Button>
        </div>
      </div>

      {/* Whatsapp bill selection */}
      {showWhatsappBillSelection && (
        <>
          <Table dataSource={whatsappCustomers} columns={columns} />
          <div
            style={{
              marginTop: 20,
              marginBottom: 20,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              type="primary"
              disabled={!whatsappCustomers.length}
              style={{ backgroundColor: "#1BD741" }}
              onClick={() => shareBills()}
            >
              Send Bill Through Whatsapp
            </Button>
          </div>
        </>
      )}

      {showPDF && (
        <PDFViewer width={"100%"} height={600}>
          <Document>
            <Page size="A4" style={styles.page}>
              {Object.keys(billContent).map((key) => {
                const bill = billContent[key];

                const billDetail = saleBill.find((rec) => {
                  return (
                    rec.entity_id_cust == bill[0].entityId &&
                    convertDateToNormalFormat(rec.bill_date) == date
                  );
                });

                return (
                  <View key={bill.entry_id} style={styles.section}>
                    {/* Title */}
                    <Text style={styles.title}>{client.client_name_eng}</Text>
                    {/* Tagline */}
                    <Text style={styles.subtitle}>{client.tagline}</Text>

                    {/* Customer details */}
                    <View
                      style={{
                        marginTop: 20,
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* Customer name */}
                      <View
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <Text style={{ fontWeight: 600, marginRight: 5 }}>
                          {t(
                            "table.reports.subHeaders.billPrint.labels.customer.text"
                          )}
                          :
                        </Text>
                        <Text>{key}</Text>
                      </View>

                      {/* Date */}
                      <View
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <Text style={{ fontWeight: 600, marginRight: 5 }}>
                          {t(
                            "table.reports.subHeaders.billPrint.labels.date.text"
                          )}
                          :
                        </Text>
                        <Text>{date}</Text>
                      </View>
                    </View>

                    {/* Table */}
                    <View>
                      {/* Header */}
                      <View
                        style={{
                          borderBottom: "1px solid black",
                          borderTop: "1px solid black",
                          paddingVertical: "5px",
                          display: "flex",
                          flexDirection: "row",
                          gap: 10,
                          marginTop: 10,
                        }}
                      >
                        <Text style={{ flexBasis: 110 }}>
                          {t(
                            "table.reports.subHeaders.billPrint.labels.itemName.text"
                          )}
                        </Text>
                        <Text style={{ flexBasis: 40, textAlign: "right" }}>
                          {t(
                            "table.reports.subHeaders.billPrint.labels.weight.text"
                          )}
                        </Text>
                        <Text style={{ flexBasis: 40, textAlign: "right" }}>
                          {t(
                            "table.reports.subHeaders.billPrint.labels.rate.text"
                          )}
                        </Text>
                        <Text style={{ flexBasis: 40, textAlign: "right" }}>
                          {t(
                            "table.reports.subHeaders.billPrint.labels.amount.text"
                          )}
                        </Text>
                      </View>
                      {/* Content */}
                      <View
                        style={{
                          borderBottom: "1px solid black",
                          borderTop: "1px solid black",
                          paddingVertical: "5px",
                          display: "flex",
                          gap: 5,
                          marginTop: 5,
                          paddingBottom: 20,
                        }}
                      >
                        {bill.map((entry) => (
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: 10,
                              marginTop: 5,
                            }}
                          >
                            <Text style={{ flexBasis: 110 }}>
                              {entry.itemName} {entry.quantity}{" "}
                              {entry.container}
                            </Text>
                            <Text style={{ flexBasis: 40, textAlign: "right" }}>
                              {entry.weight}
                            </Text>
                            <Text style={{ flexBasis: 40, textAlign: "right" }}>
                              {entry.rate}
                            </Text>
                            <Text style={{ flexBasis: 40, textAlign: "right" }}>
                              {Number(entry.amount).toFixed(2)}
                            </Text>
                          </View>
                        ))}
                      </View>
                      {/* Summary */}
                      <View
                        style={{
                          borderBottom: "1px solid black",
                          display: "flex",
                          gap: 5,
                        }}
                      >
                        <View
                          style={{
                            paddingLeft: 100,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 20,
                          }}
                        >
                          <Text>
                            {t(
                              "table.reports.subHeaders.billPrint.labels.additionalCharge.text"
                            )}
                          </Text>
                          <Text>
                            {Number(billDetail?.total_container_amount).toFixed(
                              2
                            )}
                          </Text>
                        </View>
                        <View
                          style={{
                            paddingLeft: 100,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 20,
                          }}
                        >
                          <Text>
                            {t(
                              "table.reports.subHeaders.billPrint.labels.totalAmount.text"
                            )}
                          </Text>
                          <Text>
                            {Number(billDetail?.bill_amount).toFixed(2)}
                          </Text>
                        </View>
                        <View
                          style={{
                            paddingLeft: 100,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 20,
                          }}
                        >
                          <Text>
                            {t(
                              "table.reports.subHeaders.billPrint.labels.previousBalance.text"
                            )}
                          </Text>
                          <Text>
                            {Number(billDetail?.prev_balance).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                      {/* Net */}
                      <View
                        style={{
                          borderBottom: "1px solid black",
                          paddingLeft: 100,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          gap: 20,
                        }}
                      >
                        <Text>
                          {t(
                            "table.reports.subHeaders.billPrint.labels.netBalance.text"
                          )}
                        </Text>
                        <Text>
                          {(
                            Number(billDetail?.total_container_amount) +
                            Number(billDetail?.bill_amount) +
                            Number(billDetail?.prev_balance)
                          ).toFixed(2)}
                        </Text>
                      </View>
                      {/* Container balance*/}
                      <View
                        style={{
                          borderBottom: "1px solid black",
                          borderTop: "1px solid black",
                          marginTop: 5,
                          padding: 5,
                          paddingBottom: 10,
                          paddingRight: 100,
                        }}
                      >
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 10,
                          }}
                        >
                          <Text style={{ fontWeight: "bold" }}>
                            {t(
                              "table.reports.subHeaders.billPrint.labels.containerType.text"
                            )}
                          </Text>
                          <Text>
                            {t(
                              "table.reports.subHeaders.billPrint.labels.balance.text"
                            )}
                          </Text>
                        </View>
                        {bill.map(
                          (entry, index) =>
                            entry.containerBal &&
                            bill.findIndex(
                              (ent) => ent.container === entry.container
                            ) === index && (
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text style={{ fontWeight: "bold" }}>
                                  {entry.container}
                                </Text>
                                <Text>{entry.containerBal}</Text>
                              </View>
                            )
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </Page>
          </Document>
        </PDFViewer>
      )}
    </div>
  );
}

export default BillPrint;
