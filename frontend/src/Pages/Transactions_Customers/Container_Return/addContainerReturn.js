import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Form, InputNumber, Select, DatePicker } from "antd";
import { containerReturnActions } from "../../../store/TransactionCustomers/containerReturn";

const AddContainerReturn = ({
  modal,
  isLoading,
  units,
  customerGroups,
  addContainerReturn,
  updateContainerReturn,
}) => {
  const [date, setDate] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    !modal && form.resetFields();
  }, [modal]);

  const selectDate = (date, dateString) => {
    setDate(dateString);
  };

  const onFinish = (values) => {
    values.cont_txn_date = date;
    values.qty_issued = 0;
    addContainerReturn({ values });
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() =>
          dispatch(containerReturnActions.update({ isModal: true }))
        }
      >
        + Add Container Return
      </Button>
      <Modal
        title="Add New Container Return"
        open={modal}
        onOk={() => form.submit()}
        confirmLoading={isLoading}
        onCancel={() =>
          dispatch(containerReturnActions.update({ isModal: false }))
        }
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
              name="cont_txn_date"
              rules={[{ required: true, message: "Date is required" }]}
            >
              <DatePicker onChange={selectDate} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Name of Customer">
            <Form.Item
              name="entity_id"
              rules={[
                { required: true, message: "Name of Customer is required" },
              ]}
            >
              <Select placeholder={"Select Customer"}>
                {customerGroups?.map(
                  ({ cust_group_name_eng, cust_group_id }) => (
                    <Select.Option key={cust_group_id} value={cust_group_id}>
                      {cust_group_name_eng}
                    </Select.Option>
                  )
                )}
              </Select>
            </Form.Item>
          </Form.Item>
          <Form.Item label="Container Type">
            <Form.Item
              name="container_id"
              rules={[
                { required: true, message: "Container Type is required" },
              ]}
            >
              <Select placeholder={"Select Container Type"}>
                {units?.map(({ container_name_eng, container_id }) => (
                  <Select.Option key={container_id} value={container_id}>
                    {container_name_eng}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form.Item>
          <Form.Item label="Qty">
            <Form.Item
              name="qty_received"
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
