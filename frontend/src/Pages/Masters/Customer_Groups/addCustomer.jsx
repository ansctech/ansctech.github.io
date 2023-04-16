import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {Button, Modal, Form, Input} from 'antd';
import {postCustomerGroups, putCustomerGroups, updateStateCustomerGroups} from "../../../redux/actions/Masters/Customer_Groups";


const AddCustomer = ({editItem, modal, isLoading}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const onFinish = (values) => {
        if (editItem) {
            dispatch(putCustomerGroups({...values, id: editItem.id}));
        } else {
            dispatch(postCustomerGroups(values));
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
        }
    }, [editItem]);


    return (
        <>
            <Button type="primary" onClick={() => dispatch(updateStateCustomerGroups({isModal: true}))}>
                + Customer Group Master
            </Button>
            <Modal
                title="Add New Customer Group Master"
                open={modal}
                onOk={() => form.submit()}
                confirmLoading={isLoading}
                onCancel={() => dispatch(updateStateCustomerGroups({isModal: false}))}
            >
                <Form form={form} name="basic" layout="vertical" onFinish={onFinish} className={'mt-4'}>
                    <Form.Item label="Customer Group Name (English)">
                        <Form.Item name="nameEn" rules={[{required: true, message: 'Customer Group Name (Russian) is required'}]}>
                            <Input/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Customer Group Name (Russian)">
                        <Form.Item name="nameRu" rules={[{required: true, message: 'Customer Group Name (Russian) is required'}]}>
                            <Input/>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddCustomer;