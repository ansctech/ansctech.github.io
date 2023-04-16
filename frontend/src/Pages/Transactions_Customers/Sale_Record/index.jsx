import React, {useEffect, useState} from 'react';
import {Button, Modal, Table} from 'antd';
import AddSaleRecord from './addSaleRecord';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {getUnits} from '../../../redux/actions/Masters/Units';
import TableSearch from '../../../components/Table/tableSearch';
import {getVegetables} from '../../../redux/actions/Masters/Vegetables';
import {getCustomerGroups} from '../../../redux/actions/Masters/Customer_Groups';
import {EditOutlined, DeleteOutlined, ExclamationCircleFilled} from '@ant-design/icons';
import {getSaleRecord, deleteSaleRecord, updateSaleRecordState} from '../../../redux/actions/Transactions_Customers/Sale_Record';


const SaleRecord = () => {
    const {
        units: {units},
        vegetables: {vegetable},
        customerGroups: {customerGroups},
        saleRecord: {saleRecord, tableLoader, isLoading, isModal}, 
    } = useSelector(state => state);

    const [editItem, setEditItem] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {confirm} = Modal;

    useEffect(() => {
        dispatch(getUnits());
        dispatch(getSaleRecord());
        dispatch(getVegetables());
        dispatch(getCustomerGroups());
    }, []);

    useEffect(() => {
        !isModal && setEditItem("");
    }, [isModal]);

    const editAccountItem = (item) => {
        navigate('/customers/added-sale-record/' + item.id);
    }

    const deleteAccountItem = (id) => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleFilled/>,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteSaleRecord(id));
            }
        });
    }

    const calcAmount = (amount) => {
        return amount?.reduce((acc, curr) => acc += curr.quantity * curr.rate * (curr.multepule ? curr.kgUnit : 1), 0);
    } 

    const columns = [
        {
            title: 'Date of Sale',
            dataIndex: 'date',
            sorter: (a, b) => a.date.localeCompare(b.date),
            ...TableSearch('date')
        },
        {
            title: 'Customer Name',
            dataIndex: 'frames',
            sorter: (a, b) => a.customer.localeCompare(b.customer),
            ...TableSearch('customer')
        },
        {
            title: 'Amount',
            align: 'right',
            sorter: (a, b) => calcAmount(a.saleData) - calcAmount(b.saleData),
            render: (e) => calcAmount(e.saleData)
        },
        {
            title: 'Total Items',
            align: 'right',
            sorter: (a, b) => a.saleData.length - b.saleData.length,
            render: (e) => <>{e.saleData.length}</>
        },
        {
            title: "Action", width: 100, align: 'center', fixed: 'right', render: (record) => <div className={'table-action'}>
                <EditOutlined onClick={() => editAccountItem(record)}/>
                <DeleteOutlined onClick={() => deleteAccountItem(record?.id)}/>
            </div>
        }
    ]

    const tableHeader = (
        <div className='table-headers'>
            <h4>Sale Record</h4>
            <AddSaleRecord 
                units={units}
                modal={isModal} 
                editItem={editItem} 
                isLoading={isLoading} 
                vegetable={vegetable}
                customers={customerGroups}
            />
        </div>
    );

    return (
        <Table
            bordered
            rowKey={'id'}
            scroll={{x: 800}}
            columns={columns}
            loading={tableLoader}
            dataSource={saleRecord}
            title={() => tableHeader}
        />
    )
}


export default SaleRecord;