const { Types } = require("mongoose");

const isValidId = (id) => {
  return Types.ObjectId.isValid(id);
};

const RequestTypes = {
  Get: "get",
  Post: "post",
  Put: "put",
  Delete: "delete",
};

module.exports = { RequestTypes, isValidId };
