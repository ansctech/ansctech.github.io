import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {useDispatch} from "react-redux";
import {Button, Modal, Form, Input, InputNumber,Select, DatePicker} from 'antd';
import {postMoneyRecepit, updateMoneyRecepit, putMoneyRecepit} from '../../../redux/actions/Transactions_Customers/Money_Recepit'


const AddMoneyRecepit = ({editItem, modal, isLoading, customers}) => {
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
        values.date = date;
        if (editItem) {
            dispatch(putMoneyRecepit({...values, id: editItem.id}))
        } else {
            dispatch(postMoneyRecepit(values));
        }
    }

    useEffect(() => {
        if (editItem) {
            form.setFieldsValue({...editItem, date: moment(editItem.date)});
        } else {
            form.resetFields();
        }
    }, [editItem]);

    return (
        <>
            <Button type="primary" onClick={() => dispatch(updateMoneyRecepit({isModal: true}))}>
                + Add Money Recepit
            </Button>
            <Modal
                title="Add New Money Recepit"
                open={modal}
                onOk={() => form.submit()}
                confirmLoading={isLoading}
                onCancel={() => dispatch(updateMoneyRecepit({isModal: false}))}
            >
                <Form form={form} name="basic" layout="vertical" onFinish={onFinish} className={'mt-4'}>
                <Form.Item label="Date">
                        <Form.Item name="date" rules={[{required: true, message: 'Date is required'}]}>
                            <DatePicker onChange={selectDate} format="YYYY-MM-DD"/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Name of Customer">
                        <Form.Item name="customer" rules={[{required: true, message: 'Name of Customer is required'}]}>
                            <Select placeholder={'Select Customer'}>
                                {customers?.map(({nameEn, id}) =>
                                    <Select.Option key={id} value={nameEn}>{nameEn}</Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Amount">
                        <Form.Item name="amount" rules={[{required: true, message: 'Amount is required'}]}>
                            <InputNumber style={{width: '100%'}}/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Remarks">
                        <Form.Item name="remarks" rules={[{required: true, message: 'Remarks is required'}]}>
                            <Input/>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddMoneyRecepit;