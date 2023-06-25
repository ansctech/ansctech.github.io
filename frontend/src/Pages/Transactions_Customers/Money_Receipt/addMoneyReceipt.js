import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { businessEntityActions } from "../../../store/Masters/businessEntity";
import { ExclamationCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";

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
  const [entity, setEntity] = useState();
  const { confirm } = Modal;

  const { t } = useTranslation();

  useEffect(() => {
    if (!modal) {
      form.resetFields();
      setEntity();
    }
  }, [modal]);

  const selectDate = (date, dateString) => {
    setDate(dateString);
  };

  const onFinish = (values) => {
    values.receipt_date = new Date(date).toISOString();
    values.entity_id = entity.entity_id;
    values.remarks = values.remarks || "";

    confirm({
      title: "Are you sure you want to save these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        if (editItem) {
          await updateMoneyReceipt({ values, id: editItem.receipt_id });
        } else {
          await addMoneyReceipt({ values });
        }

        dispatch(businessEntityActions.update({ loaded: false }));
      },
    });
  };

  useEffect(() => {
    let date;

    if (editItem) {
      const entity = businessEntity.find(
        (entity) => entity.entity_id == editItem.entity_id
      );

      form.setFieldsValue({
        ...editItem,
        receipt_date: dayjs(editItem.receipt_date),
        entity_id: entity.entityname_eng,
      });

      date = new Date(editItem.receipt_date);
      setEntity({
        entity_id: entity.entity_id,
        curr_bal: Number(entity.curr_bal) + Number(editItem.amount),
      });
    } else {
      date = new Date(Date.now());
      form.resetFields();
      form.setFieldsValue({ receipt_date: dayjs(date.toISOString()) });
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
        okText="Save"
        onOk={() => form.submit()}
        confirmLoading={isLoading}
        onCancel={() => {
          confirm({
            title: "Do you want to close this entry without saving?",
            icon: <ExclamationCircleFilled />,
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
              dispatch(moneyReceiptActions.update({ isModal: false }));
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
          <Form.Item
            label={t(
              "table.transaction-customer.subHeaders.moneyReceipt.labels.dateOfReceipt.text"
            )}
          >
            <Form.Item
              name="receipt_date"
              rules={[{ required: true, message: "Date is required" }]}
            >
              <DatePicker onChange={selectDate} format="YYYY-MM-DD" />
            </Form.Item>
          </Form.Item>
          <Form.Item
            label={t(
              "table.transaction-customer.subHeaders.moneyReceipt.labels.customerName.text"
            )}
          >
            <Form.Item
              name="entity_id"
              rules={[
                { required: true, message: "Name of Customer is required" },
              ]}
            >
              <Select
                showSearch={true}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                placeholder={"Select Customer"}
                onChange={(e) => setEntity(JSON.parse(e))}
              >
                {businessEntity?.map(
                  ({ entityname_eng, entity_id, entity_type_id, curr_bal }) => {
                    return (
                      entity_type_id === 1 && (
                        <Select.Option
                          key={entity_id}
                          value={JSON.stringify({ entity_id, curr_bal })}
                        >
                          {entityname_eng}
                        </Select.Option>
                      )
                    );
                  }
                )}
              </Select>
            </Form.Item>
          </Form.Item>
          <Form.Item
            label={
              <>
                {t(
                  "table.transaction-customer.subHeaders.moneyReceipt.labels.amount.text"
                )}{" "}
                {entity && (
                  <span style={{ color: "maroon", marginLeft: 15 }}>
                    {" ( Current balance: "}
                    {entity.curr_bal}
                    {" )"}
                  </span>
                )}
              </>
            }
          >
            <Form.Item
              name="amount"
              dependencies={[entity]}
              rules={[
                { required: true, message: "Amount is required" },
                {
                  type: "number",
                  min: 1,
                  message: "Number must be greater than 0",
                },
                () => ({
                  validator: (_, value) => {
                    if (value > entity.curr_bal) {
                      return Promise.reject(new Error("Amount limit exceeded"));
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Form.Item>
          <Form.Item
            label={t(
              "table.transaction-customer.subHeaders.moneyReceipt.labels.remarks.text"
            )}
          >
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
