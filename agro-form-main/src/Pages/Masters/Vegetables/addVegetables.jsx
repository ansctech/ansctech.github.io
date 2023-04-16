import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {Button, Modal, Form, Input} from 'antd';
import {postVegetables, putVegetables, updateStateVegetables} from "../../../redux/actions/Masters/Vegetables";


const AddVegetables = ({editItem, modal, isLoading}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const onFinish = (values) => {
        if (editItem) {
            dispatch(putVegetables({...values, id: editItem?.id}));
        } else {
            dispatch(postVegetables(values));
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
            <Button type="primary" onClick={() => dispatch(updateStateVegetables({isModal: true}))}>
                + Add New Vegetables
            </Button>
            <Modal
                title="Add New Vegetables"
                open={modal}
                onOk={() => form.submit()}
                confirmLoading={isLoading}
                onCancel={() => dispatch(updateStateVegetables({isModal: false}))}
            >
                <Form form={form} name="basic" layout="vertical" onFinish={onFinish} className={'mt-4'}>
                    <Form.Item label="Vegetable Name (English)">
                        <Form.Item name="nameEn" rules={[{required: true, message: 'Vegetable Name (English) is required'}]}>
                            <Input/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Vegetable Name (Russian)">
                        <Form.Item name="nameRu" rules={[{required: true, message: 'Vegetable Name (Russian) is required'}]}>
                            <Input/>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddVegetables;