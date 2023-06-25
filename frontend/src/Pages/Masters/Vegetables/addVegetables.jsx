import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Form, Input, Select, Upload, Image } from "antd";
import { vegetablesActions } from "../../../store/Masters/vegetables";
import { ExclamationCircleFilled, UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const AddVegetables = ({
  editItem,
  modal,
  isLoading,
  addVegetables,
  update,
  units,
}) => {
  const [form] = Form.useForm();

  const { t } = useTranslation();

  const [uploadBase64Format, setUploadBase64Format] = useState(null);
  const dispatch = useDispatch();

  const { confirm } = Modal;

  const onFinish = (values) => {
    confirm({
      title: "Are you sure you want to save this Vegetable?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        if (uploadBase64Format) {
          values.photo = uploadBase64Format;
        }
        if (editItem) {
          update({ values, id: editItem?.item_id });
        } else {
          addVegetables({ values });
        }
      },
    });
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
    if (!modal) {
      form.resetFields();
      setUploadBase64Format();
    }
  }, [modal]);

  useEffect(() => {
    if (editItem) {
      form.setFieldsValue(editItem);
      setUploadBase64Format(editItem.photo);
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
        okText="Save"
        confirmLoading={isLoading}
        onCancel={() => {
          confirm({
            title: "Do you want to close this entry without saving?",
            icon: <ExclamationCircleFilled />,
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
              dispatch(vegetablesActions.update({ isModal: false }));
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
              "table.masters.subHeaders.vegetables.labels.vegetableName.text"
            )}
          >
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
          <Form.Item
            label={t(
              "table.masters.subHeaders.vegetables.labels.vegetableNameLocal.text"
            )}
          >
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
          <Form.Item
            label={t("table.masters.subHeaders.vegetables.labels.unit.text")}
          >
            <Form.Item
              name="primary_container_id"
              rules={[
                {
                  required: true,
                  message: "Unit is required",
                },
              ]}
            >
              <Select
                showSearch={true}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {units?.map((container, index) => (
                  <Select.Option value={container?.container_id} key={index}>
                    {container?.container_name_eng}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form.Item>
          <Form.Item
            label={t(
              "table.masters.subHeaders.vegetables.labels.uploadPhoto.text"
            )}
          >
            <Upload
              name="photo"
              beforeUpload={validateImageSize}
              showUploadList={false}
              onRemove={() => {
                setUploadBase64Format();
              }}
            >
              {uploadBase64Format && (
                <Image src={uploadBase64Format} alt="Uploaded photo" />
              )}
              <Button icon={<UploadOutlined />} />
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddVegetables;
