import React, {useEffect, useState} from 'react';
import {Table, Modal} from 'antd';
import AddBusiness from "./addBusiness";
import {useDispatch, useSelector} from 'react-redux';
import {getUnits} from "../../../redux/actions/Masters/Units";
import TableSearch from '../../../components/Table/tableSearch';
import {getAccountGroups} from "../../../redux/actions/Masters/Account_Groups";
import {getCustomerGroups} from "../../../redux/actions/Masters/Customer_Groups";
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled} from '@ant-design/icons';
import {getBusinessEntity, deleteBusinessEntity, updateStateBusinessEntity} from "../../../redux/actions/Masters/Business_Entity";


const BusinessEntity = () => {
    const {businessEntity, isModal, tableLoader, isLoading} = useSelector(state => state.businessEntity);
    const [editItem, setEditItem] = useState("");
    const dispatch = useDispatch();
    const {confirm} = Modal;

    useEffect(() => {
        dispatch(getUnits());
        dispatch(getAccountGroups());
        dispatch(getCustomerGroups());
        dispatch(getBusinessEntity());
    }, []);

    useEffect(() => {
        !isModal && setEditItem("");
    }, [isModal]);

    const deleteBusiness = (id) => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleFilled/>,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteBusinessEntity(id));
            }
        });
    }

    const editBusiness = (item) => {
        setEditItem(item);
        dispatch(updateStateBusinessEntity({isModal: true}));
    }

    const columns = [
        {
            title: "Name",
            dataIndex: 'fullNameEn',
            sorter: (a, b) => a.fullNameEn.localeCompare(b.fullNameEn),
            ...TableSearch('fullNameEn'),
            key: 'fullNameEn',
        },
        {
            title: "Entity Type",
            dataIndex: 'entityType',
            sorter: (a, b) => a.entityType.localeCompare(b.entityType),
            ...TableSearch('entityType'),
            key: 'entityType',
        },
        {
            title: "Current Balance",
            dataIndex: 'currentBalance',
            sorter: (a, b) => a.currentBalance - b.currentBalance,
            ...TableSearch('currentBalance'),
            key: 'currentBalance',
            align: 'right',
            render: (record) => <b className="notranslate">{record}</b>
        },
        {
            title: "Phone",
            dataIndex: 'phoneNumber',
            sorter: (a, b) => a.phoneNumber - b.phoneNumber,
            ...TableSearch('phoneNumber'),
            key: 'phoneNumber',
        },
        {title: "Action", width: 100, fixed: 'right', render: (record) => 
            <div className={'table-action'}>
                <EditOutlined onClick={() => editBusiness(record)}/>
                <DeleteOutlined onClick={() => deleteBusiness(record?.id)}/>
            </div>
        }
    ]

    const tableHeader = (
        <div className='table-headers'>
            <h4> Business Entity </h4>
            <AddBusiness editItem={editItem} modal={isModal} isLoading={isLoading}/>
        </div>
    )

    
    return(
        <Table 
            title={() => tableHeader}
            bordered
            rowKey={'id'}
            columns={columns} 
            scroll={{x: 768}}
            loading={tableLoader} 
            dataSource={businessEntity} 
            summary={(pageData) => {
                let totalBalance = pageData.reduce((acc, curr) => acc += curr.currentBalance, 0);
                return (
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><b>Total</b></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={2} align="right"> <b className="notranslate">{totalBalance}</b> </Table.Summary.Cell>
                        <Table.Summary.Cell index={3}></Table.Summary.Cell>
                        <Table.Summary.Cell index={4} fixed="right"></Table.Summary.Cell>
                    </Table.Summary.Row>
                )
            }}
        />
    )
}

export default BusinessEntity;