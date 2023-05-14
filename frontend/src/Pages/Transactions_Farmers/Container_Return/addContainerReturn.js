import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
} from "antd";
import {
  postContainerReturn,
  updateContainerReturnState,
} from "../../../redux/actions/Transactions_Farmers/container-return";
import { ExclamationCircleFilled } from "@ant-design/icons";

const AddContainerReturn = ({ modal, isLoading, units, customerGroups }) => {
  const [date, setDate] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { confirm } = Modal;

  useEffect(() => {
    !modal && form.resetFields();
  }, [modal]);

  const selectDate = (date, dateString) => {
    setDate(dateString);
  };

  const onFinish = (values) => {
    values.date = date;
    dispatch(postContainerReturn(values));
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => dispatch(updateContainerReturnState({ isModal: true }))}
      >
        + Add Container Return
      </Button>
      <Modal
        title="Add New Container Return"
        open={modal}
        onOk={() => form.submit()}
        confirmLoading={isLoading}
        onCancel={() => {
          confirm({
            title: "Do you want to close this entry without saving?",
            icon: <ExclamationCircleFilled />,
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
              dispatch(updateContainerReturnState({ isModal: false }));
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
          <Form.Item label="Date">
            <Form.Item
              name="date"
              rules={[{ required: true, message: "Date is required" }]}
            >
              <DatePicker onChange={selectDate} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Name of Customer">
            <Form.Item
              name="customer"
              rules={[
                { required: true, message: "Name of Customer is required" },
              ]}
            >
              <Select placeholder={"Select Customer"}>
                {customerGroups?.map(({ nameEn, id }) => (
                  <Select.Option key={id} value={nameEn}>
                    {nameEn}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form.Item>
          <Form.Item label="Container Type">
            <Form.Item
              name="containerType"
              rules={[
                { required: true, message: "Container Type is required" },
              ]}
            >
              <Select placeholder={"Select Container Type"}>
                {units?.map(({ entityEn, id }) => (
                  <Select.Option key={id} value={entityEn}>
                    {entityEn}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form.Item>
          <Form.Item label="Qty">
            <Form.Item
              name="quantity"
              rules={[{ required: true, message: "Qty is required" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddContainerReturn;
