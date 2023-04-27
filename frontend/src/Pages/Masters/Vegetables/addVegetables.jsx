import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Form, Input, Select, Upload } from "antd";
import { vegetablesActions } from "../../../store/Masters/vegetables";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

const AddVegetables = ({
  editItem,
  modal,
  isLoading,
  addVegetables,
  update,
  units,
}) => {
  const [form] = Form.useForm();
  const [uploadBase64Format, setUploadBase64Format] = useState(null);
  const dispatch = useDispatch();

  const onFinish = (values) => {
    if (uploadBase64Format) {
      values.photo = uploadBase64Format;
    }
    if (editItem) {
      update({ values, id: editItem?.item_id });
    } else {
      addVegetables({ values });
    }
  };

  // Make sure image is no more than 10kb
  const validateImageSize = (file) => {
    const imageSize = file.size / 1024;
    // Maximum file size in kilobytes
    const maximumSize = 50;

    if (imageSize > maximumSize) {
      alert(`Image too large, image must be less than ${maximumSize}kb`);
      return false;
    }

    if (!file.type.startsWith("image")) {
      alert("Only image upload allowed");
      return false;
    }

    // Convert image to base64 format
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onloadend = () => {
      setUploadBase64Format(fileReader.result);
    };
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
          <Form.Item label="Unit">
            <Form.Item
              name="primary_container_id"
              rules={[
                {
                  required: true,
                  message: "Unit is required",
                },
              ]}
            >
              <Select>
                {units?.map((container, index) => (
                  <Select.Option value={container?.container_id} key={index}>
                    {container?.container_name_eng}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form.Item>
          <Form.Item label="Upload Photo">
            <Upload name="photo" beforeUpload={validateImageSize}>
              <Button icon={<UploadOutlined />} />
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddVegetables;
