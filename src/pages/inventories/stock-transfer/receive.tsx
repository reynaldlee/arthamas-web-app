import { useEffect, useMemo } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import _ from "lodash";
import { trpc } from "@/utils/trpc";
import {
  Autocomplete,
  Button,
  Grid,
  IconButton,
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

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { pick } from "lodash";
import { stockTransferSchema } from "src/server/routers/stockTransfer";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutation } from "react-query";

type StockTransferFormValues = z.infer<typeof stockTransferSchema>;
type QueryParams = {
  docNo: string;
};

export default function StockTransferReceive() {
  const router = useRouter();
  const { docNo } = router.query as QueryParams;

  const stockTransferForm = useForm<StockTransferFormValues>();

  const stockTransferItems = useFieldArray({
    name: "stockTransferItems",
    control: stockTransferForm.control,
  });
  const truckList = trpc.truck.findAll.useQuery();
  const warehouseList = trpc.warehouse.findAll.useQuery();
  const productList = trpc.product.findAll.useQuery();

    const { data } = trpc.stockTransfer.find.useQuery(docNo, {
        enabled: !!docNo,
        onSuccess: (data) => {
            stockTransferForm.reset({
                date: data.data?.date,
                driverName: data.data?.driverName!,
                fromWarehouseCode: data.data?.fromWarehouseCode,
                toWarehouseCode: data.data?.toWarehouseCode,
                notes: data.data?.notes,
                truckCode: data.data?.truckCode,
                stockTransferItems: data.data?.stockTransferItems!,
            });
        },
        trpc: {}
    });

  const createStockTransfer = trpc.stockTransfer.create.useMutation();

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      router.back();
    }
  };

  const onSubmit = (data: StockTransferFormValues) => {
    createStockTransfer.mutate(data);
  };

  const handleAddMoreProduct = () => {
    stockTransferItems.append({
      lineNo: stockTransferItems.fields.length + 1,
      productCode: "",
      packagingCode: "",
      totalUnitQty: 0,
      unitCode: "",
      unitQty: 0,
      qty: 0,
    });
  };

  const handleRemoveProduct = (index: number) => {
    stockTransferItems.remove(index);
  };

  return (
    <MainLayout>
      <Box mb={2}>
        <Typography variant="h2">Penerimaan Stock Transfer</Typography>
        <Typography variant="h4">{docNo}</Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <TextField
              label="From Warehouse"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              value={data?.data?.warehouseFrom.name}
            ></TextField>
          </Grid>

          <Grid item md={4} xs={6}>
            <TextField
              label="To Warehouse"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              value={data?.data?.warehouseTo.name}
            ></TextField>
          </Grid>
        </Grid>
      </Paper>

      <>
        <Grid container gap={2} sx={{ pt: 3 }}>
          <Grid item md={2} xs={12}>
            <DatePicker
              onChange={(value) => {
                stockTransferForm.setValue("date", value!);
              }}
              label="Transfer Date"
              value={stockTransferForm.watch("date")}
              renderInput={(params) => <TextField {...params} required />}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              label="Truck"
              fullWidth
              disabled
              InputLabelProps={{
                shrink: true,
              }}
              value={data?.data?.truck.policeNumber}
            ></TextField>
          </Grid>
        </Grid>
        <Grid container gap={2} sx={{ pt: 3 }}>
          <Grid item md={4} xs={12}>
            <TextField
              value={data?.data?.driverName}
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              label="Driver Name"
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container gap={2} sx={{ pt: 3 }}>
          <Grid item md={4} xs={12}>
            <TextField
              value={data?.data?.notes}
              InputLabelProps={{
                shrink: true,
              }}
              label="Notes"
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        <Grid container>
          <Typography sx={{ py: 2 }} variant="h3">
            Product List
          </Typography>
          <TableContainer sx={{ width: "100%" }}>
            <Table size="small" stickyHeader sx={{ overflowX: "scroll" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 250 }}>Product</TableCell>
                  <TableCell sx={{ width: 25 }}>Qty</TableCell>
                  <TableCell sx={{ width: 25 }}>Received</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Packaging</TableCell>
                  <TableCell sx={{ width: 100 }}>Volume</TableCell>
                  <TableCell sx={{ width: 70 }}>Unit</TableCell>
                  <TableCell sx={{ minWidth: 20 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data?.stockTransferItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ padding: 0.5 }}>
                      <TextField
                        value={item.product.name}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                        disabled
                        fullWidth
                      />
                    </TableCell>

                    <TableCell padding="none">
                      <Box
                        display="flex"
                        flexDirection={"row"}
                        alignItems={"center"}
                      >
                        <TextField
                          size="small"
                          value={item.qty}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ padding: 0.5 }}>
                      <TextFieldNumber
                        fullWidth
                        contentEditable={false}
                        size="small"
                        onValueChange={() => {}}
                        readOnly
                      />
                    </TableCell>
                    <TableCell sx={{ padding: 0.5 }}>
                      <TextField
                        size="small"
                        value={item.packagingCode}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                        fullWidth
                      />
                    </TableCell>

                    <TableCell sx={{ padding: 0.5 }}>
                      <TextFieldNumber
                        fullWidth
                        contentEditable={false}
                        size="small"
                        readOnly
                        value={item.totalUnitQty}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: 0.5 }}>
                      <TextField
                        disabled
                        fullWidth
                        placeholder="Unit"
                        contentEditable={false}
                        size="small"
                        value={item.unitCode}
                      />
                    </TableCell>

                    <TableCell sx={{ padding: 0.5 }}>
                      <IconButton
                        onClick={() => handleRemoveProduct(index)}
                        color="error"
                        size="medium"
                      >
                        <DeleteIcon fontSize="small"></DeleteIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="outlined"
            onClick={handleAddMoreProduct}
            sx={{ mt: 1 }}
            startIcon={<AddIcon fontSize="small" />}
          >
            Add Product
          </Button>
        </Grid>
        <Grid
          container
          spacing={2}
          justifyContent="flex-end"
          sx={{ mt: 4, pb: 4 }}
        >
          <Grid item>
            <Button
              variant="contained"
              color="error"
              onClick={handleCancel}
              disabled={createStockTransfer.isLoading}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              disabled={createStockTransfer.isLoading}
              startIcon={<SaveAltOutlinedIcon />}
              onClick={stockTransferForm.handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </>
    </MainLayout>
  );
}
