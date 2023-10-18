const validateStartEndTime = (obj, helpers) => {
  function toMinutes(time) {
    const arrTime = time.split(":");
    return Number(arrTime[0]) * 60 + Number(arrTime[1]);
  }
  const { start, end } = obj;

  if (toMinutes(end) < toMinutes(start)) {
    return helpers.error("any.invalid");
  }
};

export default validateStartEndTime;
