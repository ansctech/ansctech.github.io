import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { useDispatch } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";
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

const AddSaleRecord = ({
  modal,
  isLoading,
  editItem,
  customers,
  vegetable,
  units,
  addSaleRecord,
  updateSaleRecord,
}) => {
  const [date, setDate] = useState("");
  const [multepule, setMultepule] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectFramer, setSelectFramer] = useState("");
  const [selectUnit, setSelectUnit] = useState("");
  const [form] = Form.useForm();
  const { Item } = Form;
  const { Option } = Select;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!modal) {
      form.resetFields();
      setTableData([]);
    }
  }, [modal]);

  const selectDate = (date, dateString) => {
    setDate(dateString);
  };

  const onFinish = (values) => {
    values.sale_date = date;
    values.multiply_kg_qty = multepule;
    values.entity_id_trader = selectFramer;
    values.unit_container_id = selectUnit.container_id;

    let obj = {
      id: v4(),
      item_rate: values?.item_rate,
      kg_per_container: values?.kg_per_container,
      unit_container_id: values?.unit_container_id,
      sale_qty: values?.sale_qty,
      entity_id_cust: values?.entity_id_cust,
      entity_id_trader: values?.entity_id_trader,
      multiply_kg_qty: values?.multiply_kg_qty,
      sale_date: values?.sale_date,
      item_id: values?.item_id,
      sale_amount:
        Number(values?.sale_qty) *
        (values?.multiply_kg_qty === "YES"
          ? Number(values?.kg_per_container)
          : 1) *
        Number(values?.item_rate),
    };
    setTableData((prevArr) => [...prevArr, obj]);
    form.setFieldsValue({
      sale_qty: "",
      multiply_kg_qty: "NO",
      entity_id_cust: "",
    });
  };

  const deleteItem = (id) => {
    setTableData(tableData.filter((e) => e.id !== id));
  };

  const columns = [
    {
      title: "SI#",
      align: "center",
      render: (a, b, index) => <b>{index + 1}</b>,
    },
    { title: "Customer of Name", dataIndex: "entity_id_cust" },
    { title: "Vegetable", dataIndex: "item_id" },
    { title: "Qty", align: "right", dataIndex: "sale_qty" },
    { title: "Unit", dataIndex: "unit_container_id" },
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

    tableData.forEach((data) => delete data.id);

    addSaleRecord({ values: tableData });
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => dispatch(saleRecordActions.update({ isModal: true }))}
      >
        + Add Sale Record
      </Button>
      <Modal
        centered
        open={modal}
        width={"75%"}
        onOk={submit}
        okText="Submit"
        title="Add New Sale Record"
        confirmLoading={isLoading}
        onCancel={() => dispatch(saleRecordActions.update({ isModal: false }))}
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
              <Item label="Name of Framer/Trader">
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
                    <Option value="1"> Framer 1 </Option>
                    <Option value="2"> Framer 2 </Option>
                    <Option value="3"> Framer 3 </Option>
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
                    Frist Unit{" "}
                    {
                      units.find(
                        (e) => e.container_id === selectUnit?.container_id
                      )?.container_charge
                    }
                  </>
                }
              >
                <Item
                  name="unit_container_id"
                  rules={[
                    { required: true, message: "Frist Unit is required" },
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
                    {customers?.map(
                      ({ cust_group_name_eng, cust_group_id }) => (
                        <Option key={cust_group_id} value={cust_group_id}>
                          {cust_group_name_eng}
                        </Option>
                      )
                    )}
                  </Select>
                </Item>
              </Item>
            </Col>
            <Col span={4}>
              <Item label="Kg/Unit">
                <Item
                  name="kg_per_container"
                  rules={[{ required: true, message: "Kg/Unit is required" }]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Item>
              </Item>
            </Col>
            <Col span={4}>
              <Item label="Qty">
                <Item
                  name="sale_qty"
                  rules={[{ required: true, message: "Qty is required" }]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Item>
              </Item>
            </Col>
            <Col span={4}>
              <Item label="Multepule">
                <Item name="multiply_kg_qty">
                  <Checkbox
                    checked={multepule}
                    onChange={(e) =>
                      setMultepule(e.target.checked ? "YES" : "NO")
                    }
                  />
                </Item>
              </Item>
            </Col>
            <Col span={4}>
              <Item label={<span style={{ color: "transparent" }}>.</span>}>
                <Item>
                  <Button
                    onClick={() => form.submit()}
                    className="bg-secondary text-light"
                    block
                  >
                    {" "}
                    Add{" "}
                  </Button>
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
