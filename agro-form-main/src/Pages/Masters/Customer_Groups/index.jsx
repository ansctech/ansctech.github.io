import React, {useEffect, useState} from 'react';
import {Modal, Table} from "antd";
import AddCustomer from "./addCustomer";
import {useDispatch, useSelector} from "react-redux";
import TableSearch from '../../../components/Table/tableSearch';
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled} from "@ant-design/icons";
import {getCustomerGroups, deleteCustomerGroups, updateStateCustomerGroups} from "../../../redux/actions/Masters/Customer_Groups";


const CustomerGroups = () => {
    const {customerGroups, isModal, tableLoader, isLoading} = useSelector(state => state.customerGroups);
    const [editItem, setEditItem] = useState("");
    const {confirm} = Modal;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCustomerGroups());
    }, []);

    useEffect(() => {
        !isModal && setEditItem("");
    }, [isModal]);

    const editCustomerItem = item => {
        setEditItem(item);
        dispatch(updateStateCustomerGroups({isModal: true}));
    }

    const deleteCustomerItem = id => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleFilled/>,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteCustomerGroups(id));
            }
        });
    }

    const columns = [
        {
            title: "Name (English)",
            dataIndex: "nameEn",
            sorter: (a, b) => a.nameEn.localeCompare(b.nameEn),
            ...TableSearch('nameEn')
        },
        {
            title: "Name (Russian)",
            dataIndex: "nameRu",
            sorter: (a, b) => a.nameRu.localeCompare(b.nameRu),
            ...TableSearch('nameRu')
        },
        {title: "Action", width: 100, fixed: 'right', render: (record) => <div className={'table-action'}>
                <EditOutlined onClick={() => editCustomerItem(record)}/>
                <DeleteOutlined onClick={() => deleteCustomerItem(record?.id)}/>
            </div>
        }
    ]

    const tableHeader = (
        <div className='table-headers'>
            <h4>Customer Groups</h4>
            <AddCustomer modal={isModal} editItem={editItem} isLoading={isLoading}/>
        </div>
    )

    return(
        <Table 
            bordered
            rowKey={'id'} 
            columns={columns} 
            scroll={{x: 500}}
            loading={tableLoader} 
            title={() => tableHeader}
            dataSource={customerGroups} 
        />
    )
}

export default CustomerGroups;