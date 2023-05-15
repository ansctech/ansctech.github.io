import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form, InputNumber, Select, DatePicker } from "antd";
import { containerReturnActions } from "../../../store/TransactionCustomers/containerReturn";
import moment from "moment";
import { ExclamationCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import useContainerBalance from "../../../hooks/TransactionCustomers/useContainerBalance";
import { containerBalanceActions } from "../../../store/TransactionCustomers/containerBalance";

const AddContainerReturn = ({
  editItem,
  modal,
  isLoading,
  units,
  businessEntity,
  addContainerReturn,
  updateContainerReturn,
}) => {
  const [date, setDate] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { confirm } = Modal;

  const {
    containerBalance: { containerBalance },
  } = useContainerBalance();

  const [contBal, setContBal] = useState({});
  const [currBal, setCurrBal] = useState(0);

  useEffect(() => {
    const curr_bal = containerBalance.find(
      (item) =>
        item.entity_id == contBal.entity_id &&
        item.container_id == contBal.container_id
    )?.curr_bal;

    setCurrBal(curr_bal);
  }, [JSON.stringify(contBal)]);

  useEffect(() => {
    if (!modal) {
      form.resetFields();
      setCurrBal();
      setContBal({});
    }
  }, [modal]);

  const selectDate = (date, dateString) => {
    setDate(dateString);
  };

  const onFinish = (values) => {
    values.cont_txn_date = date;

    confirm({
      title: "Are you sure you want to save these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        if (editItem) {
          await updateContainerReturn({
            id: editItem.cont_txn_id,
            values,
          });
        } else {
          values.qty_issued = 0;
          await addContainerReturn({ values });
        }

        dispatch(containerBalanceActions.update({ loaded: false }));
      },
    });
  };

  useEffect(() => {
    let date;

    if (editItem) {
      const contBal = {
        entity_id: editItem.entity_id,
        container_id: editItem.container_id,
      };

      const curr_bal = containerBalance.find(
        (item) =>
          item.entity_id == contBal.entity_id &&
          item.container_id == contBal.container_id
      )?.curr_bal;

      form.setFieldsValue({
        ...editItem,
        cont_txn_date: dayjs(editItem.cont_txn_date),
      });

      date = new Date(editItem.cont_txn_date);

      setContBal(contBal);
      setCurrBal(curr_bal);
    } else {
      date = new Date(Date.now());
      form.resetFields();
      form.setFieldsValue({ cont_txn_date: dayjs(date.toISOString()) });
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
        okText="Save"
        onCancel={() => {
          confirm({
            title: "Do you want to close this entry without saving?",
            icon: <ExclamationCircleFilled />,
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
              dispatch(containerReturnActions.update({ isModal: false }));
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
              <Select
                placeholder={"Select Customer"}
                onChange={(e) =>
                  setContBal((prev) => ({ ...prev, entity_id: e }))
                }
              >
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
          <Form.Item label="Container Type">
            <Form.Item
              name="container_id"
              rules={[
                { required: true, message: "Container Type is required" },
              ]}
            >
              <Select
                placeholder={"Select Container Type"}
                onChange={(e) =>
                  setContBal((prev) => ({ ...prev, container_id: e }))
                }
              >
                {units?.map(
                  ({ container_name_eng, container_id, maintain_inventory }) =>
                    maintain_inventory === "YES" && (
                      <Select.Option key={container_id} value={container_id}>
                        {container_name_eng}
                      </Select.Option>
                    )
                )}
              </Select>
            </Form.Item>
          </Form.Item>
          <Form.Item
            label={
              <>
                Qty{" "}
                {currBal && (
                  <span style={{ color: "maroon", marginLeft: 15 }}>
                    {" ( Current balance: "}
                    {currBal}
                    {" )"}
                  </span>
                )}
              </>
            }
          >
            <Form.Item
              name="qty_received"
              dependencies={[currBal]}
              rules={[
                { required: true, message: "Qty is required" },
                {
                  type: "number",
                  min: 1,
                  message: "Quantity must be greater than 0",
                },
                () => ({
                  validator: (_, value) => {
                    if (!currBal) {
                      return Promise.reject(
                        new Error("Container does not exist")
                      );
                    }
                    if (value > currBal) {
                      return Promise.reject(
                        new Error("Container limit exceeded")
                      );
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
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
