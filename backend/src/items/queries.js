const getItems = "SELECT * FROM comm_schm.item_master";
const getItemById = "SELECT * FROM comm_schm.item_master WHERE item_id = $1";
const addItem = "INSERT INTO comm_schm.item_master (item_name_eng,item_name_local_lang,primary_container_id,photo,client_id,created_by,created_date,last_modified_by,last_modified_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)"
const removeItemById ="DELETE FROM comm_schm.item_master WHERE item_id = $1"

const updateItemById ="UPDATE comm_schm.item_master SET created_by = $1 WHERE item_id = $2"

module.exports ={getItems,getItemById,addItem,removeItemById,updateItemById}