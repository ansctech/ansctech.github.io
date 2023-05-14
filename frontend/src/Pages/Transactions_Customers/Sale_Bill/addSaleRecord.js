import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import {
  Button,
  Modal,
  Form,
  InputNumber,
  Select,
  DatePicker,
  Row,
  Col,
  Checkbox,
  Table,
} from "antd";
import { saleRecordActions } from "../../../store/TransactionCustomers/saleRecord";
import useContainerReturn from "../../../hooks/TransactionCustomers/useContainerReturn";
import moment from "moment";
import dayjs from "dayjs";
import { containerBalanceActions } from "../../../store/TransactionCustomers/containerBalance";

const AddSaleRecord = ({
  modal,
  isLoading,
  editItem,
  businessEntity,
  vegetable,
  units,
  addSaleRecord,
  updateSaleRecord,
}) => {
  const [date, setDate] = useState("");
  const [multepule, setMultepule] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [selectFramer, setSelectFramer] = useState("");
  const [selectUnit, setSelectUnit] = useState("");
  const [form] = Form.useForm();
  const { Item } = Form;
  const { Option } = Select;
  const { confirm } = Modal;

  const dispatch = useDispatch();

  const { controllers } = useContainerReturn();

  useEffect(() => {
    if (!modal) {
      form.resetFields();
      setSelectUnit(null);
      setSelectFramer(null);
      setTableData([]);
    }
  }, [modal]);

  const selectDate = (date, dateString) => {
    setDate(dateString);
  };

  const onFinish = async (values) => {
    values.sale_date = date;

    values.multiply_kg_qty = multepule ? "YES" : "NO";

    values.entity_id_trader = selectFramer;

    values.unit_container_id = Number(selectUnit.container_id);

    const obj = {
      ...values,
      id: v4(),
      item_rate: Number(values.item_rate),
      kg_per_container: Number(values.kg_per_container),
      sale_amount:
        Number(values?.sale_qty) *
        (values?.multiply_kg_qty === "YES"
          ? Number(values?.kg_per_container)
          : 1) *
        Number(values?.item_rate),
    };

    if (editItem) {
      delete obj.id;

      await updateSaleRecord({ values: obj, id: editItem.entry_id });

      dispatch(containerBalanceActions.update({ loaded: true }));

      return;
    }

    setTableData((prevArr) => [...prevArr, obj]);
    form.setFieldsValue({
      sale_qty: "",
      multiply_kg_qty: false,
      entity_id_cust: "",
      kg_per_container: "",
    });
  };

  useEffect(() => {
    let date;

    if (editItem) {
      form.setFieldsValue({
        ...editItem,
        sale_date: dayjs(editItem.sale_date),
      });

      date = new Date(editItem.sale_date);
      setMultepule(editItem.multiply_kg_qty === "YES");
      setSelectFramer(editItem.entity_id_trader);
      setSelectUnit(
        units.find((unit) => unit.container_id === editItem.unit_container_id)
      );
    } else {
      date = new Date(Date.now());
      form.resetFields();

      form.setFieldsValue({ sale_date: dayjs(date.toISOString()) });
    }

    setDate(
      new Date(
        `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
          "0" + date.getDate()
        ).slice(-2)}`
      )
    );
  }, [editItem]);

  const deleteItem = (id) => {
    setTableData(tableData.filter((e) => e.id !== id));
  };

  const columns = [
    {
      title: "SI#",
      align: "center",
      render: (a, b, index) => <b>{index + 1}</b>,
    },
    {
      title: "Customer of Name",
      render: (e) => (
        <>
          {businessEntity.find((entity) => {
            return Number(entity.entity_id) === Number(e?.entity_id_cust);
          })?.entityname_eng || e.entity_id_cust}
        </>
      ),
    },
    {
      title: "Vegetable",
      render: (e) => (
        <>
          {vegetable.find((veg) => {
            return Number(veg.item_id) === Number(e?.item_id);
          })?.item_name_eng || e.item_id}
        </>
      ),
    },
    { title: "Qty", align: "right", dataIndex: "sale_qty" },
    {
      title: "Unit",
      render: (e) => (
        <>
          {units.find((unit) => {
            return Number(unit.container_id) === Number(e?.unit_container_id);
          })?.container_name_eng || e.unit_container_id}
        </>
      ),
    },
    { title: "Rate", align: "right", dataIndex: "item_rate" },
    { title: "Kg/Unit", align: "right", dataIndex: "kg_per_container" },
    {
      title: "Amount",
      align: "right",
      dataIndex: "sale_amount",
    },
    {
      title: "Delete",
      align: "center",
      render: (item) => (
        <DeleteOutlined
          onClick={() => deleteItem(item.id)}
          className="table-btn"
        />
      ),
    },
  ];

  const submit = () => {
    if (!tableData.length) return;

    confirm({
      title: "Are you sure you want to save these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const maintainInventoryUnits = [];

        tableData.forEach((data) => {
          if (
            units.some(
              (unit) =>
                unit.container_id == data.unit_container_id &&
                unit.maintain_inventory === "YES"
            )
          ) {
            maintainInventoryUnits.push(data);
            data.maintain_inventory = true;
          }
          // Remove temporary id
          delete data.id;
        });

        await addSaleRecord({ values: tableData });

        dispatch(containerBalanceActions.update({ loaded: true }));

        // Add maintain inventory units to container return
        maintainInventoryUnits.forEach((record) => {
          controllers.addContainerReturn({
            values: {
              cont_txn_date: record.sale_date,
              qty_received: 0,
              qty_issued: Number(record.sale_qty),
              entity_id: record.entity_id_cust,
              container_id: record.unit_container_id,
            },
          });
        });
      },
    });
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          dispatch(saleRecordActions.update({ isModal: true }));
        }}
      >
        + Add Sale Record
      </Button>
      <Modal
        centered
        open={modal}
        width={"90%"}
        onOk={() => (editItem ? form.submit() : submit())}
        okText="Submit"
        title={`${editItem ? "Edit" : "Add New"} Sale Record`}
        confirmLoading={isLoading}
        onCancel={() => {
          confirm({
            title: "Do you want to close this entry without saving?",
            icon: <ExclamationCircleFilled />,
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
              dispatch(saleRecordActions.update({ isModal: false }));
              Modal.destroyAll();
            },
          });
        }}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          className={"mt-4"}
        >
          <Row justify={"space-between"}>
            <Col span={4}>
              <Item label="Date">
                <Form.Item
                  name="sale_date"
                  rules={[{ required: true, message: "Date is required" }]}
                >
                  <DatePicker
                    onChange={selectDate}
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Item>
            </Col>
            <Col span={4}>
              <Item label="Name of Farmer/Trader">
                <Item
                  name="entity_id_trader"
                  rules={[
                    {
                      required: true,
                      message: "Name of Framer/Trader is required",
                    },
                  ]}
                >
                  <Select
                    onChange={(e) => setSelectFramer(e)}
                    style={{ width: "100%" }}
                  >
                    {businessEntity?.map(
                      ({ entityname_eng, entity_id, entity_type_id }) => {
                        return (
                          entity_type_id === 2 && (
                            <Select.Option key={entity_id} value={entity_id}>
                              {entityname_eng}
                            </Select.Option>
                          )
                        );
                      }
                    )}
                  </Select>
                </Item>
              </Item>
            </Col>
            <Col span={4}>
              <Item label="Name of Vegetable">
                <Item
                  name="item_id"
                  rules={[
                    {
                      required: true,
                      message: "Name of Vegetable is required",
                    },
                  ]}
                >
                  <Select>
                    {vegetable?.map((item, index) => (
                      <Option value={item?.item_id} key={index}>
                        {item?.item_name_eng}
                      </Option>
                    ))}
                  </Select>
                </Item>
              </Item>
            </Col>
            <Col span={4}>
              <Item label="Rate">
                <Item
                  name="item_rate"
                  rules={[{ required: true, message: "Rate is required" }]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Item>
              </Item>
            </Col>
            <Col span={4}>
              <Item
                label={
                  <>
                    First Unit {" ["}{" "}
                    {
                      units.find(
                        (e) => e.container_id === selectUnit?.container_id
                      )?.container_charge
                    }{" "}
                    {"]"}
                  </>
                }
              >
                <Item
                  name="unit_container_id"
                  rules={[
                    { required: true, message: "First Unit is required" },
                  ]}
                >
                  <Select onChange={(e) => setSelectUnit(JSON.parse(e))}>
                    {units?.map((item, index) => (
                      <Option value={JSON.stringify(item)} key={index}>
                        {item?.container_name_eng}
                      </Option>
                    ))}
                  </Select>
                </Item>
              </Item>
            </Col>
          </Row>
          <Row justify={"space-between"}>
            <Col span={4}>
              <Item label="Name of Customer">
                <Item
                  name="entity_id_cust"
                  rules={[
                    { required: true, message: "Name of Customer is required" },
                  ]}
                >
                  <Select placeholder={"Select Customer"}>
                    {businessEntity?.map(
                      ({ entityname_eng, entity_id, entity_type_id }) => {
                        return (
                          entity_type_id === 1 && (
                            <Select.Option key={entity_id} value={entity_id}>
                              {entityname_eng}
                            </Select.Option>
                          )
                        );
                      }
                    )}
                  </Select>
                </Item>
              </Item>
            </Col>
            <Col span={4}>
              <Item label="Kg/Unit">
                <Item
                  name="kg_per_container"
                  rules={[
                    { required: true, message: "Kg/Unit is required" },
                    {
                      type: "number",
                      min: 1,
                      message: "Number must be greater than 0",
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Item>
              </Item>
            </Col>
            <Col span={4}>
              <Item label="Qty">
                <Item
                  name="sale_qty"
                  rules={[
                    { required: true, message: "Qty is required" },
                    {
                      type: "number",
                      min: 1,
                      message: "Number must be greater than 0",
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Item>
              </Item>
            </Col>
            <Col span={4}>
              <Item label="Multiply">
                <Item name="multiply_kg_qty">
                  <Checkbox
                    checked={multepule}
                    onChange={(e) => setMultepule(e.target.checked)}
                  />
                </Item>
              </Item>
            </Col>
            <Col span={4}>
              <Item label={<span style={{ color: "transparent" }}>.</span>}>
                <Item>
                  {!editItem && (
                    <Button
                      onClick={() => form.submit()}
                      className="bg-secondary text-light"
                      block
                    >
                      {" "}
                      Add{" "}
                    </Button>
                  )}
                </Item>
              </Item>
            </Col>
          </Row>
        </Form>
        <hr />
        {tableData.length ? (
          <Table
            bordered
            rowKey="id"
            className="mt-3"
            columns={columns}
            pagination={false}
            dataSource={tableData}
            summary={(pageData) => {
              let qty = pageData.reduce(
                (acc, curr) => (acc += curr.sale_qty),
                0
              );
              let rate = pageData.reduce(
                (acc, curr) => (acc += curr.item_rate),
                0
              );
              let kgUnit = pageData.reduce(
                (acc, curr) => (acc += curr.kg_per_container),
                0
              );
              let amount = pageData.reduce(
                (acc, curr) =>
                  (acc +=
                    curr.sale_qty *
                    curr.item_rate *
                    (curr.multiply_kg_qty === "YES"
                      ? curr.kg_per_container
                      : 1)),
                0
              );
              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} align="center" colSpan={3}>
                    <b>Total</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={0} align="right">
                    <b>{qty}</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="right">
                    <b>{rate}</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="right">
                    <b>{kgUnit}</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5} align="right">
                    <b>{amount}</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={6}
                    fixed="right"
                  ></Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
          />
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};

export default AddSaleRecord;
