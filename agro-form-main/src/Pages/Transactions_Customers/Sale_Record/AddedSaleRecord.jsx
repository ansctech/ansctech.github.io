import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {Table, Button, Row, Col, DatePicker, Input, Modal} from 'antd';
import {DeleteOutlined, ExclamationCircleFilled} from '@ant-design/icons';
import {getSelectSaleRecord, putSaleRecord} from '../../../redux/actions/Transactions_Customers/Sale_Record';


const AddedSaleRecord = () => {
    const {selectSaleRecord, selectTableLoader} = useSelector(state => state.saleRecord);
    const [date, setDate] = useState('');
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getSelectSaleRecord(id));
    }, []);

    const selectDate = (date, dateString) => {
        setDate(dateString);
    }

    const calculateAmount = (amount) => {
        return Number(amount.quantity) * (amount.multepule ? Number(amount.kgUnit) : 1) * Number(amount.rate);
    }

    const deleteItem = itemId => {
        Modal.confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleFilled/>,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                let arr = selectSaleRecord.saleData.filter(e => e.id !== itemId);
                dispatch(putSaleRecord({
                    data: {...selectSaleRecord, saleData: arr},
                    pageId: id
                }));
            }
        });
    }
 
    const columns = [
        {
            title: 'SI#',
            render: (a, b, num) => <>{num + 1}</>
        },
        {
            title: 'Vegetable',
            dataIndex: 'vegetable'
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            align: 'right',
        },
        {
            title: 'Unit',
            dataIndex: 'unit'
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            align: 'right',
        },
        {
            title: 'Kg/Unit',
            dataIndex: 'kgUnit',
            align: 'right',
        },
        {
            title: 'Amount',
            align: 'right',
            render: (e) => <>{calculateAmount(e)}</>
        },
        {
            title: 'Delete',
            align: 'center',
            render: (e) => <DeleteOutlined onClick={() => deleteItem(e.id)} className='table-btn'/>
        }
    ]

    console.log(selectSaleRecord);

    return (
        <div>
            <div className='d-flex justify-content-between'>
                <h4 style={{fontWeight: 700}}> Added Sale Record </h4>
                {/* <Button type="primary" onClick={() => navigate('/customers/add-sales')}>Create new record</Button> */}
            </div>
            <Row gutter={[30, 0]} className='mb-3 mt-4'>
                <Col span={4}>
                    <label htmlFor="">Date</label>
                    <div>
                        <DatePicker disabled onChange={selectDate} style={{width: '100%'}}/>
                    </div>
                </Col>
                <Col>
                <label htmlFor="">Name of Customer</label>
                    <Input value={selectSaleRecord?.frames}/>
                </Col>
            </Row>
            <Table 
                bordered 
                columns={columns} 
                loading={selectTableLoader}
                dataSource={selectSaleRecord?.saleData}
            />
        </div>
    )
}


export default AddedSaleRecord;

// <Form/>