import { format } from "date-fns";

export const generateDocNo = (prefix: string) => {
  const no = format(new Date(), "yyyyMMddHHmmss");
  return `${prefix}${no}`;
};
