import { trpc } from "@/utils/trpc";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Head from "next/head";
import { useRouter } from "next/router";
import QRCode from "react-qr-code";

type QueryParams = {
  docNo: string;
};

export default function PrintBarcode() {
  const router = useRouter();
  const { docNo } = router.query as QueryParams;

  const purchaseReceipt = trpc.purchaseReceipt.find.useQuery(docNo);

  return (
    <>
      <Head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @media print {
                @page { margin: 20px; padding: 16px }

                section { 
                    page-break-after: always; 
                }
                section:last-child {
                    page-break-after: auto; 
                }
                .MuiButtonBase-root { 
                    display: none; 
                }
                body {
                    height: 100vw;
                    margin: 0px auto;
                    
                }
            }
        `,
          }}
        ></style>
      </Head>

      <Button
        variant="contained"
        onClick={() => window.print()}
        style={{
          position: "fixed",
          top: 10,
          right: 10,
        }}
      >
        Print
      </Button>

      {/* <Box sx={{ maxHeight: "100vw", overflow: "scroll" }}> */}
      {(purchaseReceipt.data?.data.purchaseReceiptItems || []).map((item) => {
        console.log(new Array(10));

        return new Array(item.qty).fill(0, 0, item.qty).map((_item, _index) => {
          const runningNo = (_index + 1).toString().padStart(4, "0");

          return (
            <section
              key={item.batchNo + runningNo}
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                marginTop: 30,
              }}
            >
              <Typography variant="h1" sx={{ marginBottom: 2 }}>
                {item.product.name}
              </Typography>
              <QRCode
                value={`${item.productCode} ${item.packagingCode} ${item.batchNo} ${runningNo}`}
                size={100}
              />
              <Typography variant="h2" sx={{ marginTop: 2 }}>
                {`${item.productCode} ${item.packagingCode} ${item.batchNo} ${runningNo}`}
              </Typography>
            </section>
          );
        });
      })}
      {/* </Box> */}
    </>
  );
}
