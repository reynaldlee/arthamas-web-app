import path from "path";
import fs from "fs";
import createReport from "docx-templates";
import { format } from "date-fns";
import libre, { convert } from "libreoffice-convert";
import util from "util";

const convertAsync = util.promisify(libre.convert);

import { GetServerSideProps } from "next";

export default function SalesDeliveryPrint() {
  return null;
}

type QueryParams = {
  docNo: string;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const docNo = (ctx.params as QueryParams).docNo;

  const template = fs.readFileSync(
    path.resolve("src/assets/print-templates/sales-delivery-note.docx")
  );

  const buffer = await createReport({
    template,
    cmdDelimiter: ["${", "}"],
    processLineBreaks: true,
    data: {
      docNo: "Test",
      poNo: "PO-1293918231",
      salesname: "",
      date: "11-10-2022",
      customer: {
        name: "Test",
      },
      shipTo: `TESt\n\rTest`,
      port: {
        name: "Port",
        address: "Port Address",
      },
      vessel: "MERATUS PAYAKUMBUH",
      pic: {
        name: "Test",
        phone: "0812312312",
      },
      no: 1,
      productName: "Test",
      qty: 5,
      unitQty: 205,
      unitCode: "LTR",
      packagingCode: "DRUM",
      totalUnitQty: 1025,
    },
  });

  const result = await convertAsync(buffer as Buffer, "html", undefined);

  fs.writeFileSync(path.resolve("./result.pdf"), result);

  ctx.res.setHeader("Content-Type", "text/html");
  ctx.res.write(result);
  ctx.res.end(`Print Preview Surat Jalan ${docNo}`);

  return {
    props: {},
  };
};
