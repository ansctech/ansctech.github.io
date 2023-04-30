import React, { useEffect, useState } from "react";
import moment from "moment";
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
import { moneyReceiptActions } from "../../../store/TransactionCustomers/moneyReceipt";

const AddMoneyReceipt = ({
  editItem,
  modal,
  isLoading,
  businessEntity,
  updateMoneyReceipt,
  addMoneyReceipt,
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
    values.receipt_date = new Date(date).toISOString();
    values.remarks = values.remarks || "";

    if (editItem) {
      updateMoneyReceipt({ values, id: editItem.receipt_id });
    } else {
      addMoneyReceipt({ values });
    }
  };

  useEffect(() => {
    let date;

    if (editItem) {
      form.setFieldsValue({
        ...editItem,
        receipt_date: moment(editItem.receipt_date),
      });

      date = new Date(editItem.receipt_date);
    } else {
      date = new Date(Date.now());
      form.resetFields();
      form.setFieldsValue({ receipt_date: moment(date.toISOString()) });
    }

    setDate(
      new Date(
        `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
          "0" + date.getDate()
        ).slice(-2)}`
      )
    );
  }, [editItem]);

  return (
    <>
      <Button
        type="primary"
        onClick={() => dispatch(moneyReceiptActions.update({ isModal: true }))}
      >
        + Add Money Receipt
      </Button>
      <Modal
        title={`${editItem ? "Edit" : "Add New"} Money Receipt`}
        open={modal}
        onOk={() => form.submit()}
        confirmLoading={isLoading}
        onCancel={() =>
          dispatch(moneyReceiptActions.update({ isModal: false }))
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
              name="receipt_date"
              rules={[{ required: true, message: "Date is required" }]}
            >
              <DatePicker onChange={selectDate} format="YYYY-MM-DD" />
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
            </Form.Item>
          </Form.Item>
          <Form.Item label="Amount">
            <Form.Item
              name="amount"
              rules={[{ required: true, message: "Amount is required" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Remarks">
            <Form.Item name="remarks">
              <Input />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddMoneyReceipt;
