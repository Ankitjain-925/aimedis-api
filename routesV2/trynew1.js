import PushNotificationIOS from "@react-native-community/push-notification-ios";
import axios from "axios";
import urls from "../../config/endPoints";
import AsyncStorage from "@react-native-community/async-storage";
import PushNotification from "react-native-push-notification";
import { dates, getTodayDate, dateReturn } from "../../lib/methods";
import SQLite from "react-native-sqlite-storage";
export const notificationConfig = () => {};
const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const _timeCovert = (time = "00:00") => {
  let hr = parseInt(time.split(":")[0]);
  let mint = parseInt(time.split(":")[1]);
  let hrs = hr > 12 ? hr - 12 : hr;
  let tm = `${hrs < 10 ? "0" + hrs : hrs}:${mint < 10 ? "0" + mint : mint}  ${
    hr > 12 ? "PM" : "AM"
  }`;
  return tm;
};
export const SheduledNotificationInit = (medication = [], vaccination = []) => {
  try {
    if (medication) {
      getMedicationTrackList().then(({ arr, setdet }) => {
        if (arr) {
          let tracklistl = new Set();

          medication?.map((obj) => {
            let k = arr.indexOf(obj.track_id);
            tracklistl.add(obj.track_id);
            if (k == -1 || getTodayDate()[1] !== setdet) {
              sheduled_notification_for_medication(obj);
            }
          });
          setmedicationTrack([...tracklistl]);
        } else {
          let tracklistl = new Set();
          medication.map((obj) => {
            tracklistl.add(obj.track_id);
            sheduled_notification_for_medication(obj);
          });
          setmedicationTrack([...tracklistl]);
        }
      });
    }
    if (vaccination) {
      getVaccinationTrackList().then(({ arr, setdet }) => {
        if (arr) {
          let tracklist = new Set();
          vaccination.map((obj) => {
            let k = arr.indexOf(obj.track_id);
            tracklist.add(obj.track_id);
            if (k == -1 || getTodayDate()[1] !== setdet) {
              sheduled_notification_for_vaccination(obj);
            }
          });
          setVaccinationTrack([...tracklist]);
        } else {
          let tracklist = new Set();
          vaccination.map((obj) => {
            let k = e.indexOf(obj.track_id);
            tracklist.add(obj.track_id);
            sheduled_notification_for_vaccination(obj);
          });
          setVaccinationTrack([...tracklist]);
        }
      });
    }
  } catch (e) {
    console.log(e, "error in sheduling");
  }
};

const sheduled_notification_for_medication = (track) => {
  try {
    if (track) {
      let today = new Date();
      let todayDate = `${today.getFullYear()}-${
        today.getMonth() + 1 < 10
          ? "0" + (today.getMonth() + 1)
          : today.getMonth() + 1
      }-${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`;
      let todayDay = days[today.getDay()];
      let prescribed_on = track.prescribed_on;
      let until = track.until;
      let prescribeDay = "";
      let prescribeDayNum = 0;
      if (prescribed_on) {
        prescribeDayNum = new Date(prescribed_on).getDay();
        prescribeDay = days[prescribeDayNum];
      }

      if (
        prescribed_on &&
        until &&
        (dates.inRange(todayDate, prescribed_on, until) ||
          (prescribed_on == until && todayDate == prescribed_on))
      ) {
        _startSheduler_forMedication(
          track,
          todayDay,
          prescribeDay,
          prescribeDayNum
        );
      } else if (
        ((todayDate &&
          prescribed_on &&
          dates.compare(todayDate, prescribed_on) == 1) ||
          prescribed_on == todayDate) &&
        !until
      ) {
        _startSheduler_forMedication(
          track,
          todayDay,
          prescribeDay,
          prescribeDayNum
        );
      } else {
      }
    }
  } catch (e) {
    console.log(e, "error in shaduling init");
  }
};
const _startSheduler_forMedication = (
  track,
  todayDay,
  prescribeDay,
  prescribeDayNum
) => {
  try {
    let {
      track_id,
      reminder_time_taken,
      time_taken,
      remarks,
      reminders,
      trade_name,
      interval,
      lifelong,
      substance,
      dosage,
      user,
    } = track;
    let today = new Date();
    let message = "";

    if (reminders && reminders.length > 0) {
      reminders.map((itm) => {
        if (itm.toLowerCase() == "weekly" && todayDay == prescribeDay) {
          reminder_time_taken.map((it) => {
            message = `Hello ${user}. This is a gentle reminder to take your medication: ${substance} at ${
              getTodayDate()[0]
            } and ${_timeCovert(it)}. Your Aimedis team `;

            _SheduledNotification({ track_id, message, it });
          });
        } else if (
          itm == "third_day" &&
          (todayDay ==
            days[
              prescribeDayNum + 3 <= 6
                ? prescribeDayNum + 3
                : prescribeDayNum + 3 - 6
            ] ||
            prescribeDay == todayDay)
        ) {
          reminder_time_taken.map((it) => {
            message = `Hello ${user}. This is a gentle reminder to take your medication: ${substance} at ${
              getTodayDate()[0]
            } and ${_timeCovert(it)}. Your Aimedis team `;

            _SheduledNotification({ track_id, message, it });
          });
        } else if (
          itm == "second_day" &&
          (todayDay ==
            days[
              prescribeDayNum + 2 <= 6
                ? prescribeDayNum + 2
                : prescribeDayNum + 2 - 6
            ] ||
            prescribeDay == todayDay)
        ) {
          reminder_time_taken.map((it) => {
            message = `Hello ${user}. This is a gentle reminder to take your medication: ${substance} at ${
              getTodayDate()[0]
            } and ${_timeCovert(it)}. Your Aimedis team `;

            _SheduledNotification({ track_id, message, it });
          });
        } else if (itm == todayDay) {
          console.log(todayDay, prescribeDay, "2");
          reminder_time_taken.map((it) => {
            message = `Hello ${user}. This is a gentle reminder to take your medication: ${substance} at ${
              getTodayDate()[0]
            } and ${_timeCovert(it)}}. Your Aimedis team `;

            _SheduledNotification({ track_id, message, it });
          });
        }
      });
    }
    if (interval && interval.length > 0) {
      interval.map((itm) => {
        if (itm.toLowerCase() == "weekly" && todayDay == prescribeDay) {
          time_taken.map((it) => {
            message = `Hello ${user}. This is a gentle reminder to take your medication: ${substance} at ${
              getTodayDate()[0]
            } and ${_timeCovert(it)}}. Your Aimedis team `;
            _SheduledNotification({ track_id, message, it });
          });
        } else if (
          itm == "third_day" &&
          (todayDay ==
            days[
              prescribeDayNum + 3 <= 6
                ? prescribeDayNum + 3
                : prescribeDayNum + 3 - 6
            ] ||
            prescribeDay == todayDay)
        ) {
          time_taken.map((it) => {
            message = `Hello ${user}. This is a gentle reminder to take your medication: ${substance} at ${
              getTodayDate()[0]
            } and ${_timeCovert(it)}. Your Aimedis team `;
            _SheduledNotification({ track_id, message, it });
          });
        } else if (
          itm == "second_day" &&
          (todayDay ==
            days[
              prescribeDayNum + 2 <= 6
                ? prescribeDayNum + 2
                : prescribeDayNum + 2 - 6
            ] ||
            prescribeDay == todayDay)
        ) {
          time_taken.map((it) => {
            message = `Hello ${user}. This is a gentle reminder to take your medication: ${substance} at ${
              getTodayDate()[0]
            } and ${_timeCovert(it)}. Your Aimedis team `;
            _SheduledNotification({ track_id, message, it });
          });
        } else if (itm == todayDay) {
          time_taken.map((it) => {
            message = `Hello ${user}. This is a gentle reminder to take your medication: ${substance} at ${
              getTodayDate()[0]
            } and ${_timeCovert(it)}. Your Aimedis team `;
            _SheduledNotification({ track_id, message, it });
          });
        } else {
        }
      });
    }
  } catch (e) {
    console.log(e, "error in medication sheduling");
  }
};

const sheduled_notification_for_vaccination = (track) => {
  try {
    let {
      track_id,
      vaccination,
      vaccinated_by,
      reminders,
      reminder_time_taken,
      created_on,
      trade_name,
      remarks,
      user,
    } = track;
    let today = new Date();
    message = "";
    let todayDate = `${today.getFullYear()}-${
      today.getMonth() + 1 < 10
        ? "0" + (today.getMonth() + 1)
        : today.getMonth() + 1
    }-${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`;
    let todayDay = days[today.getDay()];
    let createDayNum = new Date(created_on).getDay();
    let createDay = days[createDayNum];
    if (reminders && reminders.length > 0) {
      reminders.map((itm) => {
        if (itm.toLowerCase() == "weekly" && todayDay == createDay) {
          reminder_time_taken.map((it) => {
            message = `Hello ${user} This is a gentle reminder to get your vaccination: ${vaccination} at ${
              getTodayDate()[0]
            } and ${_timeCovert(it)}. Your Aimedis team`;
            _SheduledNotification({ track_id, message, it });
          });
        } else if (
          itm == "third_day" &&
          (todayDay ==
            days[
              createDayNum + 3 <= 6 ? createDayNum + 3 : createDayNum + 3 - 6
            ] ||
            createDay == todayDay)
        ) {
          reminder_time_taken.map((it) => {
            message = `Hello ${user} This is a gentle reminder to get your vaccination: ${vaccination} at ${
              getTodayDate()[0]
            } and ${_timeCovert(it)}. Your Aimedis team`;
            _SheduledNotification({
              track_id,
              message,
              it,
            });
          });
        } else if (
          itm == "second_day" &&
          (todayDay ==
            days[
              createDayNum + 2 <= 6 ? createDayNum + 2 : createDayNum + 2 - 6
            ] ||
            createDay == todayDay)
        ) {
          reminder_time_taken.map((it) => {
            message = `Hello ${user} This is a gentle reminder to get your vaccination: ${vaccination} at $${
              getTodayDate()[0]
            } and ${_timeCovert(it)}. Your Aimedis team`;
            _SheduledNotification({
              track_id,
              message,
              it,
            });
          });
        } else if (itm == todayDay) {
          reminder_time_taken.map((it) => {
            message = `Hello ${user} This is a gentle reminder to get your vaccination: ${vaccination} at ${
              getTodayDate()[0]
            } and ${_timeCovert(it)}. Your Aimedis team`;
            _SheduledNotification({
              track_id,
              message,
              it,
            });
          });
        } else {
        }
      });
    }
  } catch (e) {
    console.log(e, "error in vaccination sheduling");
  }
};
const setVaccinationTrack = (track) => {
  try {
    if (track) {
      let trackl = track.toString();
      AsyncStorage.setItem("setdateForVaccination", getTodayDate()[1]);
      AsyncStorage.setItem("vaccination", trackl);
    }
  } catch (e) {
    console.log(e, "error in storing Async storage");
  }
};
const getVaccinationTrackList = async () => {
  try {
    let trackl = await AsyncStorage.getItem("vaccination");
    let date = await AsyncStorage.getItem("setdateForVaccination");
    if (trackl) {
      return { arr: trackl.split(","), setdet: date };
    } else {
      return { arr: [], setdet: "" };
    }
  } catch (e) {
    console.log(e, "error in geting async");
  }
};
const setmedicationTrack = (track) => {
  let trackl = track.toString();
  AsyncStorage.setItem("setdateFormedication", getTodayDate()[1]);
  AsyncStorage.setItem("medication", trackl);
};
const getMedicationTrackList = async () => {
  let trackl = await AsyncStorage.getItem("medication");
  let date = await AsyncStorage.getItem("setdateFormedication");
  if (trackl) {
    return { arr: trackl.split(","), setdet: date };
  } else {
    return { arr: [], setdet: "" };
  }
};

const _SheduledNotification = async (obj) => {
  try {
    console.log(obj, "___");
    if (obj.it) {
      let date = new Date(Date.now());
      date.setHours(obj.it.split(":")[0]);
      date.setMinutes(obj.it.split(":")[1]);
      try {
        PushNotification.localNotificationSchedule({
          message: obj.message, // (required)
          date: date, // in 60 secs
        });
      } catch (e) {
        console.log(e, "P");
      }
    }
  } catch (e) {
    console.log(e, "error in  sheduling push notification");
  }
};
const _setAppointmentlist = (trackl) => {
  AsyncStorage.setItem("setdateforappointment", getTodayDate()[1]);
  AsyncStorage.setItem("appointments", trackl.toString());
};
const getAppointmentslist = async () => {
  let trackl = await AsyncStorage.getItem("appointments");
  let date = await AsyncStorage.getItem("setdateforappointment");
  if (trackl) {
    return { arr: trackl.split(","), setdet: date };
  } else {
    return { arr: [], setdet: "" };
  }
};
/// appointment sheduler
export const _appointmentSheduler = (appointments, user) => {
  if (!appointments) return;
  try {
    let today = new Date();
    let day, month, year;
    day = today.getDate();
    month = today.getMonth() + 1;
    year = today.getFullYear();
    let appointmentsArr = [];
    appointments.map((obj) => {
      let date = obj.date;
      let d, m, y;
      if (date) {
        d = date?.split("-")[1];
        m = date?.split("-")[0];
        y = date?.split("-")[2];
      }
      if (day == parseInt(d) && parseInt(m) == month && parseInt(y) == year) {
        appointmentsArr.push({
          id: obj._id,
          it: obj.start_time,
          message: ` Hello ${user}. This is a gentle reminder that your have an appontment  :  at ${
            getTodayDate()[0]
          } and ${_timeCovert(obj.start_time)}. Your Aimedis team `,
        });
      }
    });
    _SheduledTodayAppointment(appointmentsArr);
  } catch (error) {
    console.log(error, "error in appointment 1 sheduling");
  }
};
const _SheduledTodayAppointment = async (appointment = []) => {
  try {
    let setdate = (await getAppointmentslist()).setdet;
    let arr = (await getAppointmentslist()).arr;
    if (arr) {
      let tracklistl = new Set();

      appointment?.map((obj) => {
        let k = arr.indexOf(obj.id);
        tracklistl.add(obj.id);
        if (k == -1 || getTodayDate()[1] !== setdate) {
          _SheduledNotification(obj);
        }
      });
      _setAppointmentlist([...tracklistl]);
    } else {
      let tracklistl = new Set();
      medication.map((obj) => {
        tracklistl.add(obj.id);
        _SheduledNotification(obj);
      });
      _setAppointmentlist([...tracklistl]);
    }
  } catch (error) {
    console.log(error, "error in appointment sheduling");
  }
};