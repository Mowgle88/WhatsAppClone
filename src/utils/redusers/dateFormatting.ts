export const formatAmPm = (dateString: string) => {
  const date = new Date(dateString);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? +"0" + minutes : minutes;
  return hours + ":" + minutes + " " + ampm;
};
