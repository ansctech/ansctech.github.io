import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  InputNumber,
  Select,
} from "antd";
import { useDispatch } from "react-redux";
import { businessEntityActions } from "../../../store/Masters/businessEntity";

const AddBusiness = ({
  editItem,
  modal,
  isLoading,
  accountGroups,
  entityTypes: { entityTypes },
  customerGroups,
  addBusinessEntity,
  updateBusinessEntity,
}) => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    if (editItem) {
      updateBusinessEntity({ values, id: editItem?.entity_id });
    } else {
      // Client_id is a temporary value till user authentiction takes place
      addBusinessEntity({ values: { ...values, client_id: 2 } });
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
      form.setFieldsValue({
        open_bal: "0.00",
        curr_bal: "0.00",
      });
    }
  }, [editItem]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowSize(window.innerWidth);
    });
  }, [windowSize]);

  return (
    <>
      <Button
        type="primary"
        onClick={() =>
          dispatch(businessEntityActions.update({ isModal: true }))
        }
      >
        + Business Entity Master
      </Button>
      <Modal
        title={`${editItem ? "Edit" : "Add New"} Business Entity Master`}
        open={modal}
        width={windowSize > 762 ? "50%" : "100%"}
        centered
        onOk={() => form.submit()}
        confirmLoading={isLoading}
        onCancel={() =>
          dispatch(businessEntityActions.update({ isModal: false }))
        }
      >
        <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
          <Row gutter={[40, 0]}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Full Name (English)">
                <Form.Item
                  name="entityname_eng"
                  rules={[
                    {
                      required: true,
                      message: "Full Name (English) is required",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Full Name (Local Language)">
                <Form.Item
                  name="entityname_local_lang"
                  rules={[
                    {
                      required: true,
                      message: "Full Name (Local Language) is required",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[40, 0]}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Email">
                <Form.Item name="email">
                  <Input allowClear />
                </Form.Item>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Address">
                <Form.Item
                  name="address"
                  rules={[{ required: true, message: "Address is required" }]}
                >
                  <Input allowClear />
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[40, 0]}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Phone Number">
                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: "Phone Number is required" },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Entity Type">
                <Form.Item
                  name="entity_type_id"
                  rules={[
                    { required: true, message: "Entity Type is required" },
                  ]}
                >
                  <Select placeholder={"Select Entity Type"}>
                    {entityTypes?.map(({ entity_type_eng, entity_type_id }) => (
                      <Select.Option
                        key={entity_type_id}
                        value={entity_type_id}
                      >
                        {entity_type_eng}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[40, 0]}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Account Group">
                <Form.Item
                  name="account_grp_id"
                  rules={[
                    { required: true, message: "Account Group is required" },
                  ]}
                >
                  <Select placeholder={"Select Account Group"}>
                    {accountGroups?.map(
                      ({ acc_group_name_eng, acc_group_id }) => (
                        <Select.Option key={acc_group_id} value={acc_group_id}>
                          {acc_group_name_eng}
                        </Select.Option>
                      )
                    )}
                  </Select>
                </Form.Item>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Customer Group">
                <Form.Item
                  name="cust_grp_id"
                  rules={[
                    { required: true, message: "Customer Group is required" },
                  ]}
                >
                  <Select placeholder={"Select Customer Group"}>
                    {customerGroups?.map(
                      ({ cust_group_name_eng, cust_group_id }) => (
                        <Select.Option
                          key={cust_group_id}
                          value={cust_group_id}
                        >
                          {cust_group_name_eng}
                        </Select.Option>
                      )
                    )}
                  </Select>
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[40, 0]}>
            <Col span={12}>
              <Form.Item label="Opening Balance">
                <Form.Item
                  name="open_bal"
                  rules={[
                    { required: true, message: "Opening Balance is required" },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} step="0.00" />
                </Form.Item>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Current Balance">
                <Form.Item
                  name="curr_bal"
                  rules={[
                    { required: true, message: "Current Balance is required" },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} step="0.00" />
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default AddBusiness;
