import React, {useEffect, useState} from 'react';
import {Button, Modal, Form, Input, Row, Col, InputNumber, Select} from 'antd';
import {useSelector, useDispatch} from "react-redux";
import {putBusinessEntity, postBusinessEntity, updateStateBusinessEntity} from "../../../redux/actions/Masters/Business_Entity";

const AddBusiness = ({editItem, modal, isLoading}) => {
    const {units: {units}, customerGroups: {customerGroups}, accountGroups: {accountGroups}} = useSelector(state => state);
    const [windowSize, setWindowSize] = useState(window.innerWidth);
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const onFinish = (values) => {
        const data = {...values, fullName: {nameEn: values?.fullNameEn, nameRu: values?.fullNameRu}}
        if (editItem) {
            dispatch(putBusinessEntity({...data, id: editItem?.id}));
        } else {
            dispatch(postBusinessEntity(data));
        }
    }

    useEffect(() => {
        !modal && form.resetFields();
    }, [modal]);

    useEffect(() => {
        if (editItem) {
            form.setFieldsValue(editItem);
        } else {
            form.resetFields();
            form.setFieldsValue({
                openingBalance: '0.00',
                currentBalance: '0.00'
            });
        }
    }, [editItem]);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowSize(window.innerWidth)
        });
    }, [windowSize]);

    return (
        <>
            <Button type="primary" onClick={() => dispatch(updateStateBusinessEntity({isModal: true}))}>
                + Business Entity Master
            </Button>
            <Modal
                title="Add New Business Entity Master"
                open={modal}
                width={windowSize > 762 ? '50%' : '100%'}
                centered
                onOk={() => form.submit()}
                confirmLoading={isLoading}
                onCancel={() => dispatch(updateStateBusinessEntity({isModal: false}))}
            >
                <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
                    <Row gutter={[40, 0]}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item label="Full Name (English)">
                                <Form.Item name="fullNameEn" rules={[{required: true, message: 'Full Name (English) is required'}]}>
                                    <Input allowClear/>
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item label="Full Name (Local Language)">
                                <Form.Item name="fullNameRu" rules={[{required: true, message: 'Full Name (Local Language) is required'}]}>
                                    <Input allowClear/>
                                </Form.Item>
                            </Form.Item>
                        </Col>                
                    </Row>
                    <Row gutter={[40, 0]}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item label="Email">
                                <Form.Item name="email">
                                    <Input allowClear/>
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item label="Address">
                                <Form.Item name="address" rules={[{required: true, message: 'Address is required'}]}>
                                    <Input allowClear/>
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[40, 0]}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item label="Phone Number">
                                <Form.Item name="phoneNumber" rules={[{required: true, message: 'Phone Number is required'}]}>
                                    <InputNumber style={{width: '100%'}}/>
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item label="Entity Type">
                                <Form.Item name="entityType" rules={[{required: true, message: 'Entity Type is required'}]}>
                                    <Select placeholder={'Select Entity Type'}>
                                        {units?.map(({entityEn, id}) =>
                                            <Select.Option key={id} value={entityEn}>{entityEn}</Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[40, 0]}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item label="Account Group">
                                <Form.Item name="account" rules={[{required: true, message: 'Account Group is required'}]}>
                                    <Select placeholder={'Select Account Group'}>
                                        {accountGroups?.map(({nameEn, id}) =>
                                            <Select.Option key={id} value={nameEn}>{nameEn}</Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item label="Customer Group">
                                <Form.Item name="customerGroup" rules={[{required: true, message: 'Customer Group is required'}]}>
                                    <Select placeholder={'Select Customer Group'}>
                                        {customerGroups?.map(({nameEn, id}) =>
                                            <Select.Option key={id} value={nameEn}>{nameEn}</Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[40, 0]}>
                        <Col span={12}>
                            <Form.Item label="Opening Balance">
                                <Form.Item name="openingBalance" rules={[{required: true, message: 'Opening Balance is required'}]}>
                                    <InputNumber style={{width: '100%'}} step="0.00"/>
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Current Balance">
                                <Form.Item name="currentBalance" rules={[{required: true, message: 'Current Balance is required'}]}>
                                    <InputNumber style={{width: '100%'}} step="0.00"/>
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