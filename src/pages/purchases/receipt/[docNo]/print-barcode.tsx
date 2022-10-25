import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Head from "next/head";
import { useRouter } from "next/router";
import QRCode from "react-qr-code";

export default function PrintBarcode() {
  const router = useRouter();
  const { docNo } = router.query;

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
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
        return (
          <section
            key={item}
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <Typography variant="h1" sx={{ marginBottom: 2 }}>
              Test
            </Typography>
            <QRCode
              value={`TI4020DR HASHD1923 ${item.toString().padStart(4, "0")}`}
              size={100}
            />
            <Typography variant="h2" sx={{ marginTop: 2 }}>
              {`TI4020DR HASHD1923 ${item.toString().padStart(4, "0")}`}
            </Typography>
          </section>
        );
      })}
      {/* </Box> */}
    </>
  );
}
