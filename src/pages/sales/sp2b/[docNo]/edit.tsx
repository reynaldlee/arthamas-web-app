import { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import _ from "lodash";
import { trpc } from "@/utils/trpc";
import {
  Autocomplete,
  Button,
  Divider,
  Grid,
  IconButton,
  MenuItem,
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

import { format } from "date-fns";
import { goodsReleaseOrderSchema } from "src/server/routers/goodsRelease";
import { DatePicker } from "@mui/x-date-pickers";

type GoodsReleaseOrderFormValues = z.infer<typeof goodsReleaseOrderSchema>;

type QueryParams = {
  docNo: string;
};

export default function Sp2bEdit() {
  const router = useRouter();
  const { docNo } = router.query as QueryParams;

  const goodsReleaseOrder = trpc.useQuery(["goodsReleaseOrder.find", docNo]);

  const salesOrder = trpc.useQuery(
    ["salesOrder.find", goodsReleaseOrder.data?.data?.salesOrderDocNo],
    { enabled: !!goodsReleaseOrder.data }
  );

  const salesOrderDocNo = salesOrder.data?.data?.docNo;

  const { register, watch, setValue, getValues, handleSubmit, control, reset } =
    useForm<GoodsReleaseOrderFormValues>();

  const goodsReleaseOrderItems = useFieldArray({
    control: control,
    name: "goodsReleaseOrderItems",
  });

  const warehouseList = trpc.useQuery(["warehouse.findAll"]);

  const [selectedWarehouse, setSelectedWarehouse] = useState<{
    id: string;
    label: string;
  }>({ id: "", label: "" });

  const updateGoodsReleaseOrder = trpc.useMutation(
    ["goodsReleaseOrder.update"],
    {
      onError: (err) => {
        console.log(err);
      },
      onSuccess: () => {
        router.push("/sales/sp2b");
      },
    }
  );

  useEffect(() => {
    if (goodsReleaseOrder.data) {
      setSelectedWarehouse({
        id: salesOrder.data?.data?.warehouse.warehouseCode!,
        label: salesOrder.data?.data?.warehouse.name!,
      });

      goodsReleaseOrderItems.replace(
        goodsReleaseOrder.data?.data?.goodsReleaseOrderItems.map((item) => ({
          lineNo: item.lineNo,
          packagingCode: item.packagingCode,
          productCode: item.productCode,
          qty: item.qty,
          unitCode: item.unitCode,
          totalUnitQty: item.totalUnitQty,
          unitQty: item.unitQty,
          salesOrderItemLineNo: item.salesOrderItemLineNo,
          salesOrderItemDocNo: item.salesOrderItemDocNo,
        }))
      );

      reset({
        ...getValues(),
        ...goodsReleaseOrder.data.data,
        warehouseCode: salesOrder.data?.data?.warehouseCode,
      });
    }
  }, [salesOrder.data, reset, getValues]);

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      router.back();
    }
  };

  const onSubmit = (data: GoodsReleaseOrderFormValues) => {
    updateGoodsReleaseOrder.mutate({
      docNo: docNo,
      fields: data,
    });
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3">Edit SP2B</Typography>
        {docNo}
      </Box>

      <Paper sx={{ p: 2 }}>
        {salesOrderDocNo ? (
          <TextField
            disabled
            InputLabelProps={{
              shrink: true,
            }}
            label="Sales Order No"
            {...register("salesOrderDocNo", {
              value: salesOrderDocNo,
            })}
          />
        ) : null}
        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <Box>
              <Typography variant="h6">Customer</Typography>
              <Typography>{salesOrder.data?.data?.customer.name}</Typography>
            </Box>
          </Grid>

          <Grid item md={2} xs={6}>
            <DatePicker
              onChange={(value) => {
                setValue("deliveryDate", value!);
              }}
              label="Delivery Date"
              value={watch("deliveryDate")}
              renderInput={(params) => <TextField {...params} required />}
            />
          </Grid>
        </Grid>

        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <Box>
              <Typography variant="h6">Ship To</Typography>
              <Typography>{salesOrder.data?.data?.shipTo}</Typography>
            </Box>
          </Grid>

          <Grid item md={4} xs={12}>
            <Autocomplete
              options={(warehouseList.data?.data || []).map((item) => ({
                id: item.warehouseCode,
                label: item.name,
              }))}
              disabled
              value={selectedWarehouse}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              disableClearable
              onChange={(_, value) => {
                setValue("warehouseCode", value.id, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Warehouse" />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      <>
        <Grid container>
          <Typography sx={{ py: 2 }} variant="h3">
            Product List
          </Typography>
          <TableContainer sx={{ width: "100%" }}>
            <Table size="small" stickyHeader sx={{ overflowX: "scroll" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 250 }}>Product</TableCell>
                  <TableCell sx={{ minWidth: 70 }}>Qty</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Qty Deliver</TableCell>
                  <TableCell sx={{ minWidth: 50 }}>Packaging</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Volume</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Volume Deliver</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesOrder.data?.data?.salesOrderItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ padding: 0.5 }}>
                      <Typography>{item.product.name}</Typography>
                    </TableCell>

                    <TableCell sx={{ padding: 0.5 }} align="center">
                      <Typography>{item.qty.toString()}</Typography>
                    </TableCell>
                    <TableCell sx={{ padding: 0.5 }}>
                      <TextFieldNumber
                        fullWidth
                        size="small"
                        placeholder="Delivery Qty"
                        onValueChange={(value) => {
                          goodsReleaseOrderItems.update(index, {
                            ...item,
                            salesOrderItemLineNo: item.lineNo,
                            salesOrderItemDocNo: item.docNo,
                            qty: value,
                          });
                        }}
                        value={
                          watch(`goodsReleaseOrderItems.${index}.qty`) || 0
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ padding: 0.5 }}>
                      <Typography>{item.packagingCode}</Typography>
                    </TableCell>

                    <TableCell sx={{ padding: 0.5 }}>
                      <Typography>
                        {item.totalUnitQty.toString()} {item.unitCode}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ padding: 0.5 }}>
                      <Typography fullWidth size="small" disabled>
                        {watch(`goodsReleaseOrderItems.${index}.qty`) ||
                          0 * item.unitQty + " " + item.unitCode}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Divider sx={{ mt: 2 }} />

        <Grid container sx={{ py: 3 }} spacing={4}>
          <Grid item md={6} xs={12}>
            <TextField
              label="Memo"
              multiline
              rows={4}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              {...register("memo")}
            ></TextField>
          </Grid>
        </Grid>
        <Grid container></Grid>
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
              disabled={updateGoodsReleaseOrder.isLoading}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              disabled={updateGoodsReleaseOrder.isLoading}
              startIcon={<SaveAltOutlinedIcon />}
              onClick={handleSubmit(onSubmit)}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </>
    </MainLayout>
  );
}
