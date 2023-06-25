import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Form, Input, Checkbox } from "antd";
import { unitsActions } from "../../../store/Masters/units";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const AddUnits = ({ editItem, modal, isLoading, addUnits, update }) => {
  const [inventory, setInventory] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { confirm } = Modal;

  const { t } = useTranslation();

  const onFinish = (values) => {
    confirm({
      title: "Are you sure you want to save this Unit?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
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
      },
    });
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
      setInventory(editItem?.maintain_inventory === "YES" ? true : false);
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
        okText="Save"
        confirmLoading={isLoading}
        onCancel={() => {
          confirm({
            title: "Do you want to close this entry without saving?",
            icon: <ExclamationCircleFilled />,
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
              dispatch(unitsActions.update({ isModal: false }));
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
            label={t("table.masters.subHeaders.units.labels.unitNameEng.text")}
          >
            <Form.Item
              name="container_name_eng"
              rules={[
                { required: true, message: "Unit Name (English) is required" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form.Item>
          <Form.Item
            label={t(
              "table.masters.subHeaders.units.labels.unitNameLocal.text"
            )}
          >
            <Form.Item
              name="container_name_local_lang"
              rules={[
                { required: true, message: "Unit Name (English) is required" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form.Item>
          <Form.Item
            label={t(
              "table.masters.subHeaders.units.labels.containerCharge.text"
            )}
          >
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
            {t("table.masters.subHeaders.units.labels.maintainInventory.text")}
          </Checkbox>
        </Form>
      </Modal>
    </>
  );
};

export default AddUnits;
