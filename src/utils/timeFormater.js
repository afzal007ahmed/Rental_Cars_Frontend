export const HOUR_MAP = {
  1: { AM: "01", PM: "13" },
  2: { AM: "02", PM: "14" },
  3: { AM: "03", PM: "15" },
  4: { AM: "04", PM: "16" },
  5: { AM: "05", PM: "17" },
  6: { AM: "06", PM: "18" },
  7: { AM: "07", PM: "19" },
  8: { AM: "08", PM: "20" },
  9: { AM: "09", PM: "21" },
  10: { AM: "10", PM: "22" },
  11: { AM: "11", PM: "23" },
  12: { AM: "00", PM: "12" },
};

export function formatTime(hour, minutes, period) {
  hour = Number(hour);
  minutes = Number(minutes);
  const formattedTime =
    HOUR_MAP[hour][period] + ":" + (minutes < 10 ? `0${minutes}` : minutes);
  return formattedTime;
}
