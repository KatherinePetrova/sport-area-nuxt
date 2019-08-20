function createTime(from, to) {
  let count = (to - from) * 2 + 1;
  let iterator = { hour: from, minute: 0 };
  let subResult = [];
  let result = [];

  for (let i = 0; i < count; i++) {
    let hour = iterator.hour >= 10 ? iterator.hour : `0${iterator.hour}`;
    let minute =
      iterator.minute >= 10 ? iterator.minute : `0${iterator.minute}`;

    subResult.push(`${hour}:${minute}`);
    iterator.minute += 30;
    if (iterator.minute >= 60) {
      iterator.hour += 1;
      iterator.minute = 0;
    }
  }

  for (let i = 0; i < subResult.length - 1; i++) {
    result.push({
      title: `${subResult[i]} - ${subResult[i + 1]}`,
      from: subResult[i],
      to: subResult[i + 1]
    });
  }

  return result;
}

function findLimitTimes(array) {
  let intoInt = JSON.parse(JSON.stringify(array));

  let max = { index: 0, value: 0 };
  let min = { index: 0, value: 9999999 };

  for (let i = 0; i < intoInt.length; i++) {
    let sub = intoInt[i].split(":");
    intoInt[i] = parseInt(`${sub[0]}${sub[1]}`);

    if (max.value < intoInt[i]) max = { index: i, value: intoInt[i] };
    if (min.value > intoInt[i]) min = { index: i, value: intoInt[i] };
  }

  return { max: parseInt(array[max.index]), min: parseInt(array[min.index]) };
}

const days = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота"
];

export default (data, times) => {
  let result = [];
  let header = [];

  let limits = findLimitTimes(times);

  data.forEach(item => {
    let date = new Date(item.date);

    let day = days[date.getDay()];

    let number = date.getDate();
    number = number >= 10 ? number : `0${number}`;

    let month = date.getMonth() + 1;
    month = month >= 10 ? month : `0${month}`;

    header.push({
      title: [day, `${number}.${month}`],
      timestamp: date.getTime(),
      date: item.date
    });
  });

  header.sort((a, b) => {
    if (a.timestamp < b.timestamp) return -1;
  });

  header.unshift({ title: "Назад", button: true });
  header.push({ title: "Далее", button: true });

  let time = createTime(limits.min, limits.max);

  for (let i = 0; i < time.length; i++) {
    let subArray = [];
    for (let j = 0; j < header.length; j++) {
      if (header[j].button) {
        subArray.push({ title: time[i].title });
      } else {
        let day = data.find(item => item.date == header[j].date);
        let window = day.windows.find(item => item.from_time == time[i].from);

        if (window && window.price > 0) {
          window.title = window.price + " т";
          window.active = false;
          window.date = day.date;
          window.arrayCoor = { x: i, y: j };

          subArray.push(window);
        } else if (window && window.price == 1) {
          subArray.push({
            title: "занято",
            from_time: window.from_time,
            to_time: window.to_time
          });
        } else {
          subArray.push({
            title: "закрыто",
            from_time: window.from_time,
            to_time: window.to_time
          });
        }
      }
    }

    result.push(subArray);
  }

  return { header, result };
};
