import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Form, Input } from "antd";
import { accountGroupsActions } from "../../../store/Masters/accountGroups";

const AddAccount = ({
  editItem,
  modal,
  isLoading,
  addAccountGroup,
  updateAccountGroup,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    if (editItem) {
      updateAccountGroup({
        id: editItem.acc_group_id,
        values,
      });
    } else {
      addAccountGroup({ values });
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
        onClick={() => dispatch(accountGroupsActions.update({ isModal: true }))}
      >
        + Account Group Master
      </Button>
      <Modal
        title={
          editItem
            ? "Edit Account Group Master"
            : "Add New Account Group Master"
        }
        open={modal}
        onOk={() => form.submit()}
        confirmLoading={isLoading}
        onCancel={() =>
          dispatch(accountGroupsActions.update({ isModal: false }))
        }
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          className={"mt-4"}
        >
          <Form.Item label="Account Group Name (English)">
            <Form.Item
              name="acc_group_name_eng"
              rules={[
                {
                  required: true,
                  message: "Account Group Name (English) is required",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form.Item>
          {/* Previous value: Account Group Name (Russian) */}
          <Form.Item label="Account Group Local Language">
            <Form.Item
              name="acc_group_name_local_lang"
              rules={[
                {
                  required: true,
                  message: "Account Group Name (Russian) is required",
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

export default AddAccount;
