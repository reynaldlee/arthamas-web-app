import path from "path";
// import fs from "fs";
import createReport from "docx-templates";

import libre from "libreoffice-convert";
import util from "util";

// libre.convertAsync = require("util").promisify(libre.convert);
import { GetServerSideProps } from "next";

export default function SalesDeliveryPrint() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const docNo = ctx.params.docNo;
  //   const template = fs.readFileSync(
  //     "../../../../../assets/sales-delivery-note.docx"
  //   );

  //   const buffer = await createReport({
  //     template,
  //     cmdDelimiter: ["${", "}"],
  //     processLineBreaks: true,
  //     data: {
  //       name: "John",
  //       surname: "Appleseed",
  //     },
  //   });

  //   console.log(buffer);

  ctx.res.end(`Print Preview Invoice ${docNo}`);
};
