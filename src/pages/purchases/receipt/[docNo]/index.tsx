import { useEffect, useMemo } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import _ from "lodash";
import { trpc } from "@/utils/trpc";
import {
  Autocomplete,
  Button,
  FormHelperText,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import TextFieldNumber from "@/components/TextField/TextFieldNumber";

import { useRouter } from "next/router";

import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { pick } from "lodash";
import { DatePicker } from "@mui/x-date-pickers";
import { purchaseReceiptSchema } from "src/server/routers/purchaseReceipt";

export default function PurchaseReceiptDetail() {
  const router = useRouter();
  const docNo = router.query.docNo as string;

  const { data } = trpc.useQuery(["purchaseReceipt.find", docNo]);

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      router.back();
    }
  };

  //   const onSubmit = (data: PurchaseReceiptFormValues) => {
  //     createPurchaseReceipt.mutate(data);
  //   };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3">Penerimaan Pembelian</Typography>
        <Typography variant="h3">No. {docNo}</Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              disabled
              value={data?.data?.purchaseOrderDocNo}
            ></TextField>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2} sx={{ pt: 3 }}>
        <Grid item md={3}>
          <DatePicker
            disabled
            label="Tanggal Penerimaan"
            value={data?.data?.date}
            renderInput={(params) => (
              <TextField fullWidth {...params} required />
            )}
          />
        </Grid>

        <Grid item md={3}>
          <TextField
            disabled
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
            value={data?.data?.deliveryNoteNo}
            label="Nomor Surat Jalan"
          ></TextField>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ pt: 3 }}>
        <Grid item md={3}>
          <TextField
            label="Warehouse"
            disabled
            value={data?.data?.warehouse.name}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>

      <Typography sx={{ py: 2 }} variant="h3">
        Product List
      </Typography>
      <TableContainer sx={{ width: "100%" }}>
        <Table size="small" stickyHeader sx={{ overflowX: "scroll" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 150 }}>Product</TableCell>
              <TableCell sx={{ width: 50 }}>Packaging</TableCell>
              <TableCell sx={{ width: 25 }}>BatchNo</TableCell>
              <TableCell sx={{ width: 25 }}>Qty Received</TableCell>

              <TableCell sx={{ width: 25 }}>Volume Received</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data?.purchaseReceiptItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ padding: 0.5 }}>
                  <Typography>{item.product.name}</Typography>
                </TableCell>
                <TableCell sx={{ padding: 0.5 }}>
                  <Typography>{item.packagingCode}</Typography>
                </TableCell>

                <TableCell sx={{ padding: 0.5, textAlign: "center" }}>
                  <Typography>{item.batchNo}</Typography>
                </TableCell>
                <TableCell sx={{ padding: 0.5, textAlign: "center" }}>
                  <Typography>{item.qty}</Typography>
                </TableCell>

                <TableCell sx={{ padding: 0.5, textAlign: "center" }}>
                  <Typography>
                    {item.totalUnitQty + " " + item.unitCode}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container sx={{ py: 3 }} spacing={4}>
        <Grid item md={6} xs={12}>
          <TextField
            label="Memo"
            multiline
            InputLabelProps={{
              shrink: true,
            }}
            rows={4}
            fullWidth
            value={data?.data?.memo}
            disabled
          ></TextField>
        </Grid>
      </Grid>

      <Grid container sx={{ py: 3 }} spacing={4}>
        <Grid item md={6} xs={12}>
          <Button
            variant="outlined"
            onClick={() => {
              router.push(`/purchases/receipt/${docNo}/print-barcode`);
            }}
          >
            Print Barcode
          </Button>
        </Grid>
      </Grid>
    </MainLayout>
  );
}
