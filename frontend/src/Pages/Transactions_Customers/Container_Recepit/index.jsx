import React, { useEffect } from 'react';
import {Modal, Table} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import AddContainerRecepit from './addContainerRecepit';
import {getUnits} from '../../../redux/actions/Masters/Units';
import TableSearch from '../../../components/Table/tableSearch';
import {DeleteOutlined, ExclamationCircleFilled} from '@ant-design/icons';
import {getCustomerGroups} from '../../../redux/actions/Masters/Customer_Groups';
import {getContainerRecepit, deleteContainerRecepit} from '../../../redux/actions/Transactions_Customers/container-recepit';




const ContainerRecepit = () => {
    const {containerRecepit: {containerRecepit, tableLoader, isLoading, isModal}, units: {units}, customerGroups: {customerGroups}} = useSelector(state => state);

    const dispatch = useDispatch();
    const {confirm} = Modal;

    useEffect(() => {
        dispatch(getContainerRecepit());
        dispatch(getCustomerGroups());
        dispatch(getUnits());
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
                dispatch(deleteContainerRecepit(id));
            }
        });
    }

    const columns = [
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
            title: 'Container Type', 
            dataIndex: 'containerType',
            sorter: (a, b) => a.containerType.localeCompare(b.containerType),
            ...TableSearch('containerType')
        },
        {
            title: 'Qty', 
            dataIndex: 'quantity',
            sorter: (a, b) => a.quantity - b.quantity,
            ...TableSearch('quantity')
        },
        {
            title: "Delete", width: 100, fixed: 'right', render: (record) => <div className={'table-action justify-content-center'}>
                <DeleteOutlined onClick={() => deleteItem(record?.id)}/>
            </div>
        }
    ]

    const tableHeader = (
        <div className='table-headers'>
            <h4>Container Recepit</h4>
            <AddContainerRecepit modal={isModal} isLoading={isLoading} units={units} customerGroups={customerGroups}/>
        </div>
    )

    return (
        <Table
            bordered
            rowKey={'id'}
            scroll={{x: 768}}
            columns={columns}
            loading={tableLoader}
            title={() => tableHeader}
            dataSource={containerRecepit}
        />
    )
}


export default ContainerRecepit;