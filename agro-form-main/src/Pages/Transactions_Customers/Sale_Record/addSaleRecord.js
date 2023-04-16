import React, {useEffect, useState} from 'react';
import {v4} from 'uuid';
// import Forms from '../../../Form';
import {useDispatch} from "react-redux";
import {DeleteOutlined} from '@ant-design/icons';
import {Button, Modal, Form, InputNumber,Select, DatePicker, Row, Col, Checkbox, Table} from 'antd';
import {postSaleRecord, updateSaleRecordState} from '../../../redux/actions/Transactions_Customers/Sale_Record';


const AddSaleRecord = ({modal, isLoading, editItem, customers, vegetable, units}) => {
    const [date, setDate] = useState('');
    const [multepule, setMultepule] = useState(false);
    const [tableData, setTableData] = useState([]); 
    const [selectFramer, setSelectFramer] = useState("");
    const [selectUnit, setSelectUnit] = useState("");
    const [form] = Form.useForm();
    const {Item} = Form;
    const {Option} = Select;
    const dispatch = useDispatch();

    useEffect(() => {
        if (!modal) {
            form.resetFields();
            setTableData([]);
        }
    }, [modal]);

    const selectDate = (date, dateString) => {
        setDate(dateString);
    }

    const onFinish = (values) => {
        values.date = date;
        values.multepule = multepule;
        let obj = {
            id: v4(),
            rate: values?.rate,
            kgUnit: values?.kgUnit,
            unit: selectUnit?.entityEn,
            quantity: values?.quantity,
            customer: values?.customer,
            quantity: values?.quantity,
            multepule:values?.multepule,
            vegetable: values?.vegetable
        }
        setTableData(prevArr => [...prevArr, obj]);
        form.setFieldsValue({multepule: false, quantity: '', kgUnit: '', customer: ''})
    }

    const deleteItem = id => {
        setTableData(tableData.filter(e => e.id !== id));
    }

    const columns = [
        {title: 'SI#', align: 'center', render: (a, b, index) => <b>{index + 1}</b>},
        {title: 'Customer of Name', dataIndex: 'customer'},
        {title: 'Vegetable', dataIndex: 'vegetable'},
        {title: 'Qty', align: 'right', dataIndex: 'quantity'},
        {title: 'Unit', dataIndex: 'unit'},
        {title: 'Rate', align: 'right', dataIndex: 'rate'},
        {title: 'Kg/Unit', align: 'right', dataIndex: 'kgUnit'},
        {title: 'Amount', align: 'right', render: (item) => <>{Number(item.quantity) * (item.multepule ? Number(item.kgUnit) : 1) * Number(item.rate)}</>},
        {title: 'Delete', align: 'center', render: (item) => <DeleteOutlined onClick={() => deleteItem(item.id)} className='table-btn'/>},
    ]

    const submit = () => {
        if (!tableData.length) return;
        let sendData = {date, frames: selectFramer, saleData: tableData};
        dispatch(postSaleRecord(sendData));
    }


    return (
        <>
            <Button type="primary" onClick={() => dispatch(updateSaleRecordState({isModal: true}))}>
                + Add Sale Record
            </Button>
            <Modal
                centered
                open={modal}
                width={'75%'}
                onOk={submit}
                okText="Submit"
                title="Add New Sale Record"
                confirmLoading={isLoading}
                onCancel={() => dispatch(updateSaleRecordState({isModal: false}))}
            >
                <Form form={form} name="basic" layout="vertical" onFinish={onFinish} className={'mt-4'}>
                    <Row justify={'space-between'}>
                        <Col span={4}>
                            <Item label="Date">
                                <Form.Item name="date" rules={[{required: true, message: 'Date is required'}]}>
                                    <DatePicker onChange={selectDate} format="YYYY-MM-DD" style={{width: '100%'}}/>
                                </Form.Item>
                            </Item>
                        </Col>
                        <Col span={4}>
                            <Item label="Name of Framer/Trader">
                                <Item name="framer" rules={[{required: true, message: 'Name of Framer/Trader is required'}]}>
                                    <Select onChange={(e) => setSelectFramer(e)} style={{width: '100%'}}>
                                        <Option value="Framer 1"> Framer 1 </Option>
                                        <Option value="Framer 2"> Framer 2 </Option>
                                        <Option value="Framer 3"> Framer 3 </Option>
                                    </Select>
                                </Item>
                            </Item>
                        </Col>
                        <Col span={4}>
                            <Item label="Name of Vegetable">
                                <Item name="vegetable" rules={[{required: true, message: 'Name of Vegetable is required'}]}>
                                    <Select>
                                        {vegetable?.map((item, index) => <Option value={item?.nameEn} key={index}>{item?.nameEn}</Option>)}
                                    </Select>
                                </Item>
                            </Item>
                        </Col>
                        <Col span={4}>
                            <Item label="Rate">
                                <Item name="rate" rules={[{required: true, message: 'Rate is required'}]}>
                                    <InputNumber style={{width: '100%'}}/>
                                </Item>
                            </Item>
                        </Col>
                        <Col span={4}>
                            <Item label={<>Frist Unit {units.find(e => e.id === selectUnit?.id)?.unit}</>}>
                                <Item name="unit" rules={[{required: true, message: 'Frist Unit is required'}]}>
                                    <Select onChange={(e) => setSelectUnit(JSON.parse(e))}>
                                        {units?.map((item, index) => <Option value={JSON.stringify(item)} key={index}>{item?.entityEn}</Option>)}
                                    </Select>
                                </Item>
                            </Item>
                        </Col>
                    </Row>
                    <Row justify={'space-between'}>
                        <Col span={4}>
                            <Item label="Name of Customer">
                                <Item name="customer" rules={[{required: true, message: 'Name of Customer is required'}]}>
                                    <Select placeholder={'Select Customer'}>
                                        {customers?.map(({nameEn, id}) => <Option key={id} value={nameEn}>{nameEn}</Option>)}
                                    </Select>
                                </Item>
                            </Item>
                        </Col>
                        <Col span={4}>
                            <Item label="Kg/Unit">
                                <Item name="kgUnit" rules={[{required: true, message: 'Kg/Unit is required'}]}>
                                    <InputNumber style={{width: '100%'}}/>
                                </Item>
                            </Item>
                        </Col>
                        <Col span={4}>
                            <Item label="Qty">
                                <Item name="quantity" rules={[{required: true, message: 'Qty is required'}]}>
                                    <InputNumber style={{width: '100%'}}/>
                                </Item>
                            </Item>
                        </Col>
                        <Col span={4}>
                            <Item label="Multepule">
                                <Item name="multepule">
                                    <Checkbox checked={multepule} onChange={(e) => setMultepule(e.target.checked)}/>   
                                </Item>
                            </Item>
                        </Col>
                        <Col span={4}>
                            <Item label={<span style={{color: 'transparent'}}>.</span>}>
                                <Item>
                                    <Button onClick={() => form.submit()} className='bg-secondary text-light' block> Add </Button>
                                </Item>
                            </Item>
                        </Col>
                    </Row>
                </Form>
                <hr/>
                { tableData.length ?
                    <Table
                        bordered
                        rowKey="id"
                        className='mt-3'
                        columns={columns}
                        pagination={false}
                        dataSource={tableData}
                        summary={(pageData) => {
                            let qty = pageData.reduce((acc, curr) => acc += curr.quantity, 0);
                            let rate = pageData.reduce((acc, curr) => acc += curr.rate, 0);
                            let kgUnit = pageData.reduce((acc, curr) => acc += curr.kgUnit, 0);
                            let amount = pageData.reduce((acc, curr) => acc += curr.quantity * curr.rate * (curr.multepule ? curr.kgUnit : 1), 0);
                            return (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} align="center" colSpan={3}><b>Total</b></Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} align="right"><b>{qty}</b></Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                                    <Table.Summary.Cell index={3} align="right"><b>{rate}</b></Table.Summary.Cell>
                                    <Table.Summary.Cell index={4} align="right"><b>{kgUnit}</b></Table.Summary.Cell>
                                    <Table.Summary.Cell index={5} align="right"><b>{amount}</b></Table.Summary.Cell>
                                    <Table.Summary.Cell index={6} fixed="right"></Table.Summary.Cell>
                                </Table.Summary.Row>
                            )
                        }}
                    /> : ''
                }
            </Modal>
        </>
    );
};

export default AddSaleRecord;