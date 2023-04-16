import React, {useEffect, useState} from 'react';
import {Table, Modal} from 'antd';
import AddMoneyRecepit from './addMoneyRecepit';
import {useDispatch, useSelector} from 'react-redux';
import TableSearch from '../../../components/Table/tableSearch';
import {getCustomerGroups} from '../../../redux/actions/Masters/Customer_Groups';
import {DeleteOutlined, ExclamationCircleFilled, EditOutlined} from '@ant-design/icons';
import {getMoneyRecepit, deleteMoneyRecepit, updateMoneyRecepit} from '../../../redux/actions/Transactions_Customers/Money_Recepit';
 

const MoneyRecepit = () => {
    const {moneyRecepit: {moneyRecepit, tableLoader, isLoading, isModal}, customerGroups: {customerGroups}} = useSelector(state => state);
    const [editItem, setEditItem] = useState("");
    const {confirm} = Modal;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMoneyRecepit());
        dispatch(getCustomerGroups());
    }, []);

    const deleteItem = id => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleFilled/>,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteMoneyRecepit(id));
            }
        });
    }

    const editMoneyRecepit = (item) => {
        setEditItem(item);
        dispatch(updateMoneyRecepit({isModal: true}));
    }

    const colums = [
        {
            title: 'Date of Receipt', 
            dataIndex: 'date',
            sorter: (a, b) => a.date.localeCompare(b.date),
            ...TableSearch('date')
        },
        {
            title: 'Customer Name', 
            dataIndex: 'customer',
            sorter: (a, b) => a.customer.localeCompare(b.customer),
            ...TableSearch('customer')
        },
        {
            title: 'Amount', 
            dataIndex: 'amount',
            align: 'right',
            sorter: (a, b) => a.amount - b.amount,
            ...TableSearch('amount')
        },
        {
            title: 'Remarks', 
            dataIndex: 'remarks',
            sorter: (a, b) => a.remarks.localeCompare(b.remarks),
            ...TableSearch('remarks')
        },
        {
            title: "Action", width: 100, align: 'center', fixed: 'right', render: (record) => <div className={'table-action'}>
                <EditOutlined onClick={() => editMoneyRecepit(record)}/>
                <DeleteOutlined onClick={() => deleteItem(record?.id)}/>
            </div>
        }
    ]

    const tableHeader = (
        <div className='table-headers'>
            <h4>Money Recepit</h4>
            <AddMoneyRecepit editItem={editItem} isLoading={isLoading} modal={isModal} customers={customerGroups}/>
        </div>
    )


    return (
        <Table
            bordered
            columns={colums}
            title={() => tableHeader}
            dataSource={moneyRecepit}
            loading={tableLoader}
            rowKey={'id'}
            scroll={{x: 768}}
        />
    )
}


export default MoneyRecepit;