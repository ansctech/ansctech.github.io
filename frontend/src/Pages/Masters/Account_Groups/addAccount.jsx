import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Form, Input } from "antd";
import { accountGroupsActions } from "../../../store/Masters/accountGroups";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const AddAccount = ({
  editItem,
  modal,
  isLoading,
  addAccountGroup,
  updateAccountGroup,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { confirm } = Modal;

  const { t } = useTranslation();

  const onFinish = (values) => {
    confirm({
      title: "Are you sure you want to save this Account Group?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        if (editItem) {
          updateAccountGroup({
            id: editItem.acc_group_id,
            values,
          });
        } else {
          addAccountGroup({ values });
        }
      },
    });
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
        okText="Save"
        onOk={() => form.submit()}
        confirmLoading={isLoading}
        onCancel={() =>
          confirm({
            title: "Do you want to close this entry without saving?",
            icon: <ExclamationCircleFilled />,
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
              dispatch(accountGroupsActions.update({ isModal: false }));
              Modal.destroyAll();
            },
          })
        }
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
              "table.masters.subHeaders.accountGroups.labels.acctGroupNameEng.text"
            )}
          >
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
          <Form.Item
            label={t(
              "table.masters.subHeaders.accountGroups.labels.acctGroupNameLocalLang.text"
            )}
          >
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
