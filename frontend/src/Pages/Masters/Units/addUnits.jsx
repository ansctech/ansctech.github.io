import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {Button, Modal, Form, Input, InputNumber, Checkbox} from 'antd';
import {postUnits, putUnits, updateStateUnits} from "../../../redux/actions/Masters/Units";


const AddUnits = ({editItem, modal, isLoading}) => {
    const [inventory, setInventory] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const onFinish = (values) => {
        if (editItem) {
            dispatch(putUnits({...values, inventory, id: editItem.id}));
        } else {
            dispatch(postUnits({...values, inventory}));
        }
    }

    useEffect(() => {
        if(!modal) {
            form.resetFields();
            setInventory(false);
        }
    }, [modal]);

    useEffect(() => {
        if (editItem) {
            form.setFieldsValue(editItem);
            setInventory(editItem?.inventory);
        } else {
            form.resetFields();
            setInventory(false);
            form.setFieldsValue({unit: '0.00'});
        }
    }, [editItem]);


    return (
        <>
            <Button type="primary" onClick={() => dispatch(updateStateUnits({isModal: true}))}>
                + Add Unit Master
            </Button>
            <Modal
                title="Add New Unit Master"
                open={modal}
                onOk={() => form.submit()}
                confirmLoading={isLoading}
                onCancel={() => dispatch(updateStateUnits({isModal: false}))}
            >
                <Form form={form} name="basic" layout="vertical" onFinish={onFinish} className={'mt-4'}>
                    <Form.Item label="Unit Name (English)">
                        <Form.Item name="entityEn" rules={[{required: true, message: 'Unit Name (English) is required'}]}>
                            <Input/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Unit Name (Local Language)">
                        <Form.Item name="entityRu" rules={[{required: true, message: 'Unit Name (English) is required'}]}>
                            <Input/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Container Charge">
                        <Form.Item name="unit" rules={[{required: true, message: 'Container Charge is required'}]}>
                            <InputNumber step="0.00"/>
                        </Form.Item>
                    </Form.Item>
                    <Checkbox
                        checked={inventory}
                        onChange={(e) => setInventory(e.target.checked)}
                    >
                        Maintain Inventory
                    </Checkbox>
                </Form>
            </Modal>
        </>
    );
};

export default AddUnits;