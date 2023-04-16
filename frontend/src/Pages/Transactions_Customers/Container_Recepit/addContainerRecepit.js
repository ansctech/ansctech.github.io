import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {Button, Modal, Form, InputNumber,Select, DatePicker} from 'antd';
import {postContainerRecepit, updateContainerRecepitState} from '../../../redux/actions/Transactions_Customers/container-recepit';


const AddContainerReturn = ({modal, isLoading, units, customerGroups}) => {
    const [date, setDate] = useState('');
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    useEffect(() => {
        !modal && form.resetFields();
    }, [modal]);

    const selectDate = (date, dateString) => {
        setDate(dateString);
    }

    const onFinish = (values) => {
        values.date = date
        dispatch(postContainerRecepit(values));
    }


    return (
        <>
            <Button type="primary" onClick={() => dispatch(updateContainerRecepitState({isModal: true}))}>
                + Add Container Recepit
            </Button>
            <Modal
                title="Add New Container Recepit"
                open={modal}
                onOk={() => form.submit()}
                confirmLoading={isLoading}
                onCancel={() => dispatch(updateContainerRecepitState({isModal: false}))}
            >
                <Form form={form} name="basic" layout="vertical" onFinish={onFinish} className={'mt-4'}>
                    <Form.Item label="Date">
                        <Form.Item name="date" rules={[{required: true, message: 'Date is required'}]}>
                            <DatePicker onChange={selectDate}/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Name of Customer">
                        <Form.Item name="customer" rules={[{required: true, message: 'Name of Customer is required'}]}>
                            <Select placeholder={'Select Customer'}>
                                {customerGroups?.map(({nameEn, id}) =>
                                    <Select.Option key={id} value={nameEn}>{nameEn}</Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Container Type">
                        <Form.Item name="containerType" rules={[{required: true, message: 'Container Type is required'}]}>
                            <Select placeholder={'Select Container Type'}>
                                {units?.map(({entityEn, id}) =>
                                    <Select.Option key={id} value={entityEn}>{entityEn}</Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Qty">
                        <Form.Item name="quantity" rules={[{required: true, message: 'Qty is required'}]}>
                            <InputNumber style={{width: '100%'}}/>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddContainerReturn;