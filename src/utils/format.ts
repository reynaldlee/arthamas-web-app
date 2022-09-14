import { format } from "date-fns";
import numeral from "numeral";

export const formatDate = (date?: Date) => {
  if (date) {
    return format(date, "dd MMM yyyy");
  }

  return "";
};

export const formatMoney = (number: number) => {
  return numeral(number).format("0,00.00");
};
