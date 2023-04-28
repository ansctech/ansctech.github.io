import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Form, Input, Checkbox } from "antd";
import { unitsActions } from "../../../store/Masters/units";

const AddUnits = ({ editItem, modal, isLoading, addUnits, update }) => {
  const [inventory, setInventory] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    console.log(inventory);
    if (editItem) {
      update({
        values: { ...values, maintain_inventory: inventory ? "YES" : "NO" },
        id: editItem.container_id,
      });
    } else {
      addUnits({
        values: { ...values, maintain_inventory: inventory ? "YES" : "NO" },
      });
    }
  };

  useEffect(() => {
    if (!modal) {
      form.resetFields();
      setInventory(true);
    }
  }, [modal]);

  useEffect(() => {
    if (editItem) {
      form.setFieldsValue(editItem);
      setInventory(editItem?.maintain_inventory);
    } else {
      form.resetFields();
      setInventory(true);
      form.setFieldsValue({ unit: "0" });
    }
  }, [editItem]);

  return (
    <>
      <Button
        type="primary"
        onClick={() => dispatch(unitsActions.update({ isModal: true }))}
      >
        + Add Unit Master
      </Button>
      <Modal
        title={`${editItem ? "Edit" : "Add New"} Unit Master`}
        open={modal}
        onOk={() => form.submit()}
        confirmLoading={isLoading}
        onCancel={() => dispatch(unitsActions.update({ isModal: false }))}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          className={"mt-4"}
        >
          <Form.Item label="Unit Name (English)">
            <Form.Item
              name="container_name_eng"
              rules={[
                { required: true, message: "Unit Name (English) is required" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Unit Name (Local Language)">
            <Form.Item
              name="container_name_local_lang"
              rules={[
                { required: true, message: "Unit Name (English) is required" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Container Charge">
            <Form.Item
              name="container_charge"
              rules={[
                { required: true, message: "Container Charge is required" },
              ]}
            >
              {/* <InputNumber step="0" /> */}
              <Input />
            </Form.Item>
          </Form.Item>
          <Checkbox
            checked={inventory}
            onChange={(e) => {
              setInventory(e.target.checked);
            }}
          >
            Maintain Inventory
          </Checkbox>
        </Form>
      </Modal>
    </>
  );
};

export default AddUnits;
