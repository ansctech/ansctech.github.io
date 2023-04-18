import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Form, Input } from "antd";
import { vegetablesActions } from "../../../store/Masters/vegetables";

const AddVegetables = ({
  editItem,
  modal,
  isLoading,
  addVegetables,
  update,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    if (editItem) {
      update({ values, id: editItem?.item_id });
    } else {
      addVegetables({ values });
    }
  };

  useEffect(() => {
    !modal && form.resetFields();
  }, [modal]);

  useEffect(() => {
    if (editItem) {
      form.setFieldsValue(editItem);
    } else {
      form.resetFields();
    }
  }, [editItem]);

  return (
    <>
      <Button
        type="primary"
        onClick={() => dispatch(vegetablesActions.update({ isModal: true }))}
      >
        + Add New Vegetables
      </Button>
      <Modal
        title={`${editItem ? "Edit" : "Add New"} Vegetables`}
        open={modal}
        onOk={() => form.submit()}
        confirmLoading={isLoading}
        onCancel={() => dispatch(vegetablesActions.update({ isModal: false }))}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          className={"mt-4"}
        >
          <Form.Item label="Vegetable Name (English)">
            <Form.Item
              name="item_name_eng"
              rules={[
                {
                  required: true,
                  message: "Vegetable Name (English) is required",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Vegetable Name (Russian)">
            <Form.Item
              name="item_name_local_lang"
              rules={[
                {
                  required: true,
                  message: "Vegetable Name (Russian) is required",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddVegetables;
