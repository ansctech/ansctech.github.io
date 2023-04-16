import React, {useEffect, useState} from 'react';
import {Table, Modal} from 'antd';
import AddVegetables from "./addVegetables";
import {useDispatch, useSelector} from 'react-redux';
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled} from "@ant-design/icons";
import TableSearch from '../../../components/Table/tableSearch';
import {getVegetables, deleteVegetables, updateStateVegetables} from "../../../redux/actions/Masters/Vegetables";


const Vegetables = () => {
    const {vegetable, isModal, tableLoader, isLoading} = useSelector(state => state.vegetables);
    const [editItem, setEditItem] = useState("");
    const {confirm} = Modal;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getVegetables());
    }, []);

    useEffect(() => {
        !isModal && setEditItem("");
    }, [isModal])

    const editVegetable = item => {
        setEditItem(item);
        dispatch(updateStateVegetables({isModal: true}));
    }

    const deleteItem = id => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleFilled/>,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteVegetables(id));
            }
        });
    }

    const columns = [
        {
            title: 'Name (English)',
            dataIndex: 'nameEn',
            sorter: (a, b) => a.nameEn.localeCompare(b.nameEn),
            ...TableSearch('nameEn')
        },
        {
            title: 'Name (Russian)',
            dataIndex: 'nameRu',
            sorter: (a, b) => a.nameRu.localeCompare(b.nameRu),
            ...TableSearch('nameRu')
        },
        {
            title: "Action", width: 100, fixed: 'right', render: (record) => <div className={'table-action'}>
                <EditOutlined onClick={() => editVegetable(record)}/>
                <DeleteOutlined onClick={() => deleteItem(record?.id)}/>
            </div>
        }
    ]

    const tableHeader = (
        <div className='table-headers'>
            <h4>Vegetables</h4>
            <AddVegetables editItem={editItem} modal={isModal} isLoading={isLoading}/> 
        </div>
    )


    return(
        <Table 
            bordered
            rowKey={'id'} 
            columns={columns} 
            scroll={{x: 550}}
            loading={tableLoader} 
            dataSource={vegetable} 
            title={() => tableHeader}
        />
    )
}

export default Vegetables;