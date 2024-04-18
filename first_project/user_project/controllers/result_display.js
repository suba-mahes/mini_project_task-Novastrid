module.exports.end_result = (res, res_status, result) => {
  res.format({
    "application/json"() {
      res.status(res_status);
      res.json(result);
    },
  });
};
