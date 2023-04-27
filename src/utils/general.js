const generateUpdateQuery = (data, tableName, clauseKey, clauseValue, user) => {
  // This is a fake authenticated detail
  data.last_modified_by = user.client_name_eng;
  data.last_modified_date = new Date(Date.now()).toISOString();

  let part1 = `UPDATE comm_schm.${tableName} SET`;
  let part2 = `WHERE ${clauseKey} = ${clauseValue};`; //Add any number of filter clause statements here
  let updateString = "";
  for (let key in data) {
    updateString += `${key} = '${data[key]}',`;
  }
  updateString = updateString.slice(0, -1);
  let query = `${part1} ${updateString} ${part2}`;
  return query;
};

const generateInsertQuery = (data, tableName, user) => {
  // This is a fake authenticated detail
  data.client_id = user.clientid;
  data.created_by = user.client_name_eng;
  data.created_date = new Date(Date.now()).toISOString();
  data.last_modified_by = user.client_name_eng;
  data.last_modified_date = new Date(Date.now()).toISOString();

  let part1 = `INSERT INTO comm_schm.${tableName}`;
  let part2 = "(";
  let part3 = "(";
  Object.keys(data).forEach((key) => {
    part2 = part2 + key + ",";
    part3 += "'" + data[key] + "'" + ",";
  });
  part2 = part2.slice(0, -1);
  part3 = part3.slice(0, -1);
  part2 += ") VALUES";
  part3 += ")";

  let query = `${part1} ${part2} ${part3} RETURNING *`;
  return query;
};

const generateRetrieveQuery = (tableName, clauseKey, clauseValue = null) => {
  let query;
  if (clauseValue) {
    query = `SELECT * FROM comm_schm.${tableName} WHERE ${clauseKey} = ${clauseValue}`;
  } else {
    query = `SELECT * FROM comm_schm.${tableName}`;
  }
  return query;
};

const generateDeleteQuery = (tableName, clauseKey, clauseValue = null) => {
  let query;
  if (clauseValue) {
    query = `DELETE FROM comm_schm.${tableName} WHERE ${clauseKey} = ${clauseValue}`;
  }
  return query;
};

module.exports = {
  generateUpdateQuery,
  generateInsertQuery,
  generateRetrieveQuery,
  generateDeleteQuery,
};
