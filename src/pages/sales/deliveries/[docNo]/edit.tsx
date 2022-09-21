import { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import _ from "lodash";
import { trpc } from "@/utils/trpc";
import {
  Autocomplete,
  Button,
  Divider,
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

import { salesDeliverySchema } from "src/server/routers/salesDelivery";
import { DatePicker } from "@mui/x-date-pickers";

type SalesDeliveryFormValues = z.infer<typeof salesDeliverySchema>;

type QueryParams = {
  docNo: string;
};

export default function SalesDeliveryCreate() {
  const router = useRouter();
  const { docNo } = router.query as QueryParams;

  const { register, watch, setValue, getValues, handleSubmit, control, reset } =
    useForm<SalesDeliveryFormValues>();

  const salesDeliveryItems = useFieldArray({
    control: control,
    name: "salesDeliveryItems",
  });

  const truckList = trpc.useQuery(["truck.findAll"]);
  const salesDelivery = trpc.useQuery(["salesDelivery.find", docNo]);
  const goodsReleaseOrderDocNo =
    salesDelivery.data?.data?.goodsReleaseOrderDocNo;
  const goodsReleaseOrder = trpc.useQuery(
    ["goodsReleaseOrder.find", goodsReleaseOrderDocNo!],
    { enabled: !!goodsReleaseOrderDocNo }
  );

  const [selectedWarehouse, setSelectedWarehouse] = useState<{
    id: string;
    label: string;
  }>({ id: "", label: "" });

  const updateSalesDelivery = trpc.useMutation(["salesDelivery.update"], {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: () => {
      router.push("/sales/deliveries");
    },
  });

  useEffect(() => {
    if (goodsReleaseOrder.data?.data) {
      salesDeliveryItems.replace(
        goodsReleaseOrder.data.data.goodsReleaseOrderItems.map((item) => ({
          lineNo: item.lineNo,
          productCode: item.productCode,
          packagingCode: item.packagingCode,
          qty: item.qty,
          unitCode: item.unitCode,
          totalUnitQty: item.totalUnitQty,
          unitQty: item.unitQty,
          salesOrderItemLineNo: item.salesOrderItemLineNo,
        }))
      );

      reset({
        ...getValues(),
        memo: salesDelivery.data?.data?.memo,
        driverName: salesDelivery.data?.data?.driverName,
        truckCode: salesDelivery.data?.data?.truckCode,
        warehouseCode: goodsReleaseOrder.data.data.warehouseCode,
        date: goodsReleaseOrder.data.data.deliveryDate,
        deliveryDate: goodsReleaseOrder.data.data.deliveryDate,
      });
    }
  }, [goodsReleaseOrder.data, reset, getValues]);

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      router.back();
    }
  };

  const onSubmit = (data: SalesDeliveryFormValues) => {
    updateSalesDelivery.mutate({
      docNo: docNo,
      fields: data,
    });
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3">Edit Delivery</Typography>
        <Typography variant="h4">{docNo}</Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        {goodsReleaseOrderDocNo ? (
          <TextField
            disabled
            InputLabelProps={{
              shrink: true,
            }}
            label="SP2B No"
            {...register("goodsReleaseOrderDocNo", {
              value: goodsReleaseOrderDocNo,
            })}
          />
        ) : null}
        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <Box>
              <Typography variant="h6">Customer</Typography>
              <Typography>
                {goodsReleaseOrder.data?.data?.salesOrder.customer.name}
              </Typography>
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
              <Typography>
                {goodsReleaseOrder.data?.data?.salesOrder.shipTo}
              </Typography>
            </Box>
          </Grid>

          <Grid item md={4} xs={12}>
            <Box>
              <Typography variant="h6">Warehouse</Typography>
              <Typography>
                {goodsReleaseOrder.data?.data?.warehouse.name}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <Autocomplete
              options={(truckList.data?.data || []).map((item) => ({
                id: item.truckCode,
                label: `${item.name} [${item.policeNumber}] `,
              }))}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              disableClearable
              onChange={(_, value) => {
                setValue("truckCode", value.id, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
              renderInput={(params) => (
                <TextField required label="Truck" {...params} />
              )}
            />
          </Grid>

          <Grid item md={4} xs={12}>
            <TextField
              {...register("driverName", {
                required: true,
              })}
              value={watch("driverName")}
              InputLabelProps={{
                shrink: true,
              }}
              required
              fullWidth
              label="Driver Name"
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
                  {/* <TableCell sx={{ minWidth: 50 }}>Description</TableCell> */}
                  <TableCell sx={{ minWidth: 70 }}>Qty Deliver</TableCell>
                  <TableCell sx={{ minWidth: 50 }}>Packaging</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Volume</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Volume Deliver</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {goodsReleaseOrder.data?.data?.goodsReleaseOrderItems.map(
                  (item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ padding: 0.5 }}>
                        <Typography>{item.product.name}</Typography>
                      </TableCell>

                      <TableCell sx={{ padding: 0.5 }} align="center">
                        <Typography>{item.qty.toString()}</Typography>
                      </TableCell>
                      {/* <TableCell sx={{ padding: 0.5 }}>
                        <TextFieldNumber
                          fullWidth
                          size="small"
                          placeholder="Delivery Qty"
                          onValueChange={(value) => {
                            setValue(`salesDeliveryItems.${index}.qty`, value);
                          }}
                          value={watch(`salesDeliveryItems.${index}.qty`)}
                        />
                      </TableCell> */}
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
                          {watch(`salesDeliveryItems.${index}.qty`) *
                            item.unitQty +
                            " " +
                            item.unitCode}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                )}
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
              disabled={updateSalesDelivery.isLoading}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              disabled={updateSalesDelivery.isLoading}
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
