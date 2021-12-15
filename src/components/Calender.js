function CalenderJs(y, m, d, row) {
  const daysInMonth = (year, monthNumber) => {
    const kabisat = new Date(`${year}`).getFullYear();
    let february;

    if (kabisat % 4 === 0) {
      february = 29;
    } else {
      february = 28;
    }

    const days = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    return days[monthNumber];
  };

  const calender = (year, month, day) => {
    const formatCalender = row * 7;
    const arrInMonth = [];
    let arrInDay = [];

    let firstDay = new Date(`${year}-${month}`).getDay();
    let lastDayInLastMonth = firstDay;

    if (firstDay === 0) {
      lastDayInLastMonth = 6;
    } else {
      lastDayInLastMonth--;
    }

    let getMonth = new Date(`${year}-${month}`).getMonth();
    let lastMonth = getMonth;

    if (getMonth === 0) {
      lastMonth = 11;
    } else {
      lastMonth--;
    }

    let firstDayInMonth = daysInMonth(year, lastMonth) - lastDayInLastMonth;

    let thisMonth = daysInMonth(year, month - 1);

    for (let i = 1; i <= formatCalender; i++) {
      let restDay = i;

      if (i === 1) {
        for (let ii = 0; ii < firstDay; ii++) {
          arrInDay.push(firstDayInMonth++);
        }
      }

      if (i > thisMonth) {
        restDay %= thisMonth;
      }

      arrInDay.push(restDay);

      if (arrInDay.length === 7) {
        arrInMonth.push(arrInDay);
        arrInDay = [];
      }
    }

    return arrInMonth;
  };

  return calender(y, m, d);
}

export default CalenderJs;
