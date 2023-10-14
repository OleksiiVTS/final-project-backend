const getCurrentDate = () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;
  const currentDay = date.getDate();

  const fullDate = `${currentYear}-${currentMonth}-${currentDay}`;

  return fullDate;
};

export default getCurrentDate;
