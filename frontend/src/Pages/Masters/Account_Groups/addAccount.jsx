import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {Button, Modal, Form, Input} from 'antd';
import {postAccountGroups, putAccountGroups, updateStateAccountGroups} from "../../../redux/actions/Masters/Account_Groups";


const AddAccount = ({editItem, modal, isLoading}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const onFinish = (values) => {
        if (editItem) {
            dispatch(putAccountGroups({...values, id: editItem.id}));
        } else {
            dispatch(postAccountGroups(values));
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
            <Button type="primary" onClick={() => dispatch(updateStateAccountGroups({isModal: true}))}>
                + Account Group Master
            </Button>
            <Modal
                title="Add New Account Group Master"
                open={modal}
                onOk={() => form.submit()}
                confirmLoading={isLoading}
                onCancel={() => dispatch(updateStateAccountGroups({isModal: false}))}
            >
                <Form form={form} name="basic" layout="vertical" onFinish={onFinish} className={'mt-4'}>
                    <Form.Item label="Account Group Name (English)">
                        <Form.Item name="nameEn" rules={[{required: true, message: 'Account Group Name (English) is required'}]}>
                            <Input/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Account Group Name (Russian)">
                        <Form.Item name="nameRu" rules={[{required: true, message: 'Account Group Name (Russian) is required'}]}>
                            <Input/>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddAccount;