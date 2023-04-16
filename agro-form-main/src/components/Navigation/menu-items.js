import {getItem} from './index';


export const items = [
    getItem('Masters', '/masters', "", [
        getItem('Business Entity', '/business-entity'),
        getItem('Vegetables', '/vegetables'),
        getItem('Units', '/units'),
        getItem('Customer Groups', '/customer-groups'),
        getItem('Account Groups', '/account-groups'),
    ]),
    getItem('Transactions (Customers)', '/customers', "", [
        getItem('Sale Record', '/sale-record'),
        // getItem('Sale Bill', '/sale-bill'),
        getItem('Money Recepit', '/money-recepit'),
        getItem('Container Return', '/container-recepit')
    ]),
    getItem('Transactions (Farmers)', '/farmers', "", [
        getItem('Sale Bill', '9'),
        getItem('Payment', '10'),   
        getItem('Container Return', '/container-return')
    ]),
    getItem('Reports', '/reports', "", [
        getItem('Bill Print', '11'),
        getItem('Receipts', '12'),
        getItem('Balance Report', '13'),
        getItem('Container Balance Report', '14'),
        getItem('Accounting Report', '15')
    ]),
];