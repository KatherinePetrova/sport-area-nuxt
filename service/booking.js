function createTime(from, to) {
  let count = (to - from) * 2 + 1;
  let iterator = { hour: 9, minute: 0 };
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

const days = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота"
];

export default data => {
  let result = [];
  let header = [];

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

  let time = createTime(9, 21);

  for (let i = 0; i < time.length; i++) {
    let subArray = [];
    for (let j = 0; j < header.length; j++) {
      if (header[j].button) {
        subArray.push({ title: time[i].title });
      } else {
        let day = data.find(item => item.date == header[j].date);
        let window = day.windows.find(item => item.from_time == time[i].from);

        if (window) {
          window.title = window.price + " т";
          window.active = false;
          window.date = day.date;
          window.arrayCoor = { x: i, y: j };

          subArray.push(window);
        } else {
          subArray.push({ title: "-" });
        }
      }
    }

    result.push(subArray);
  }

  return { header, result };
};
