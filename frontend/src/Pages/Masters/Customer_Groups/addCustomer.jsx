import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Form, Input } from "antd";
import { customerGroupsActions } from "../../../store/Masters/customerGroups";

const AddCustomer = ({
  editItem,
  modal,
  isLoading,
  addCustomerGroup,
  updateCustomerGroup,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    if (editItem) {
      updateCustomerGroup({
        id: editItem.cust_group_id,
        values,
      });
    } else {
      addCustomerGroup({ values });
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
        onClick={() =>
          dispatch(customerGroupsActions.update({ isModal: true }))
        }
      >
        + Customer Group Master
      </Button>
      <Modal
        title={`${editItem ? "Edit" : "Add New"} Customer Group Master`}
        open={modal}
        onOk={() => form.submit()}
        confirmLoading={isLoading}
        onCancel={() =>
          dispatch(customerGroupsActions.update({ isModal: false }))
        }
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          className={"mt-4"}
        >
          <Form.Item label="Customer Group Name (English)">
            <Form.Item
              name="cust_group_name_eng"
              rules={[
                {
                  required: true,
                  message: "Customer Group Name (Russian) is required",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Customer Group Local Language">
            <Form.Item
              name="cust_group_name_local_lang"
              rules={[
                {
                  required: true,
                  message: "Customer Group Name (Russian) is required",
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

export default AddCustomer;
