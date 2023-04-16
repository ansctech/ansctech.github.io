import React, {useEffect, useState} from 'react';
import {Modal, Table} from "antd";
import AddAccount from "./addAccount";
import {useDispatch, useSelector} from "react-redux";
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled} from "@ant-design/icons";
import TableSearch from '../../../components/Table/tableSearch';
import {getAccountGroups, updateStateAccountGroups, deleteAccountGroups} from "../../../redux/actions/Masters/Account_Groups";


const AccountGroups = () => {
    const {accountGroups, isModal, tableLoader, isLoading} = useSelector(state => state.accountGroups);
    const [editItem, setEditItem] = useState("");
    const {confirm} = Modal;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAccountGroups());
    }, []);

    useEffect(() => {
        !isModal && setEditItem("");
    }, [isModal]);

    const editAccountItem = item => {
        setEditItem(item);
        dispatch(updateStateAccountGroups({isModal: true}));
    }

    const deleteAccountItem = id => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleFilled/>,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteAccountGroups(id));
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
        {
            title: "Action", width: 100, fixed: 'right', render: (record) => <div className={'table-action'}>
                <EditOutlined onClick={() => editAccountItem(record)}/>
                <DeleteOutlined onClick={() => deleteAccountItem(record?.id)}/>
            </div>
        }
    ];

    const tableHeader = (
        <div className='table-headers'>
            <h4>Account Groups</h4>
            <AddAccount modal={isModal} editItem={editItem} isLoading={isLoading}/>
        </div>
    )

    return(
        <Table 
            columns={columns} 
            dataSource={accountGroups} 
            bordered 
            scroll={{x: 500}}
            loading={tableLoader} 
            title={() => tableHeader}
            rowKey={'id'}
        />
    )
}

export default AccountGroups;