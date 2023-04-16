import React, {useEffect, useState} from 'react';
import AddUnits from "./addUnits";
import {Table, Modal, Checkbox} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import TableSearch from '../../../components/Table/tableSearch';
import {getUnits, updateStateUnits, deleteUnits} from "../../../redux/actions/Masters/Units";
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled} from "@ant-design/icons";


const Units = () => {
    const {units, isModal, tableLoader, isLoading} = useSelector(state => state.units);
    const [editItem, setEditItem] = useState("");
    const dispatch = useDispatch();
    const {confirm} = Modal;

    useEffect(() => {
        dispatch(getUnits());
    }, []);

    useEffect(() => {
        !isModal && setEditItem("");
    }, [isModal]);

    const editUnitItem = item => {
        setEditItem(item);
        dispatch(updateStateUnits({isModal: true}));
    }

    const removeUnit = id => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleFilled/>,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteUnits(id));
            }
        });
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "entityEn",
            sorter: (a, b) => a.entityEn.localeCompare(b.entityEn),
            ...TableSearch('entityEn')
        },
        {
            title: "Container Charge",
            dataIndex: "unit",
            sorter: (a, b) => a.unit - b.unit,
            ...TableSearch('unit'),
            align: 'right'
        },
        {
            title: "Maintain Inventory",
            dataIndex: "inventory",
            sorter: (a, b) => a.inventory - b.inventory,
            render: (record) => <Checkbox checked={record}/>
        },
        {
            title: "Action", width: 100, fixed: 'right', render: (record) => <div className={'table-action'}>
                <EditOutlined onClick={() => editUnitItem(record)}/>
                <DeleteOutlined onClick={() => removeUnit(record?.id)}/>
            </div>
        }
    ];

    const tableHeader = (
        <div className='table-headers'>
            <h4>Units</h4>
            <AddUnits editItem={editItem} modal={isModal} isLoading={isLoading}/>
        </div>
    )

    return(
        <Table 
            bordered
            rowKey={'id'}
            columns={columns} 
            scroll={{x: 500}}
            dataSource={units} 
            loading={tableLoader} 
            title={() => tableHeader}
            summary={(record) => {
                let totalContainer = record.reduce((acc, curr) => acc += curr.unit, 0);
                return (
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><b>Total</b></Table.Summary.Cell>
                        <Table.Summary.Cell index={1} align="right"> <b>{totalContainer}</b> </Table.Summary.Cell>
                        <Table.Summary.Cell index={2}></Table.Summary.Cell>
                        <Table.Summary.Cell index={3} fixed="right"></Table.Summary.Cell>
                    </Table.Summary.Row>
                )
            }}
        />
    )
}

export default Units;