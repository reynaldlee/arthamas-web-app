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

import { formatDate, formatMoney } from "@/utils/format";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";

import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { addDays } from "date-fns";
import { salesInvoiceSchema } from "src/server/routers/salesInvoice";
import { DatePicker } from "@mui/x-date-pickers";

type SalesPaymentFormValues = z.infer<typeof salesInvoiceSchema>;

type QueryParams = {
  salesInvoiceDocNo: string;
};

export default function SalesPaymentCreate() {
  const router = useRouter();
  const { salesInvoiceDocNo } = router.query as QueryParams;

  const { register, watch, setValue, handleSubmit, control, reset } =
    useForm<SalesPaymentFormValues>();

    const salesInvoice = trpc.salesInvoice.find.useQuery(salesInvoiceDocNo, {
        onSuccess: (data) => {
            setValue("currencyCode", data.data?.currencyCode!);
        },
        trpc: {}
    });

  const selectedCurrencyCode = watch("currencyCode");
  // const currencyList = trpc.useQuery(["currency.findAll"]);
  const taxList = trpc.tax.findAll.useQuery();
  const salesInvoices = trpc.salesInvoice.findAll.useQuery(
    {
              filters: {
                currencyCode: watch("currencyCode"),
                customerCode: salesInvoice.data?.data?.customerCode,
              },
            },
      {
          enabled:
              !!salesInvoice.data?.data?.customerCode && !!selectedCurrencyCode,
          trpc: {}
      }
  );

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      router.back();
    }
  };

  const createSalesPayment = trpc.salesPayment.create.useMutation();

  const onSubmit: SubmitHandler<SalesPaymentFormValues> = (data) => {
    createSalesPayment.mutate(data, {
      onError: (err) => {
        console.log(err);
      },
      onSuccess: (err) => {
        router.push("/sales/payments");
      },
    });
  };

  const handleProductQtyChange = (index: number) => (value: number) => {
    //   const unitQty = watch(`salesOrderItems.${index}.unitQty`);
    //   setValue(`salesOrderItems.${index}.qty`, value);
    //   setValue(`salesOrderItems.${index}.totalUnitQty`, value * unitQty);
    //   calculateProductAmount(index);
    // };
    // const calculateProductsAmount = () => {
    //   salesOrderItems.fields.forEach((_, index) => {
    //     calculateProductAmount(index);
    //   });
  };

  const calculateServicesAmount = () => {
    // salesInvoiceService.fields.forEach((_, index) => {
    //   calculateServiceAmount(index);
    // });
    // calculateServiceSubtotal();
  };

  const calculateServiceSubtotal = () => {
    // const servicesSubtotal = _.sumBy(
    //   watch("salesInvoiceService"),
    //   (o) => o.amount
    // );
    // setValue("totalService", servicesSubtotal);
    // calculateTotalAmount();
  };

  const calculateProductSubtotal = () => {
    // const productSubtotal = _.sumBy(
    //   watch("salesInvoiceItems"),
    //   (o) => o.amount
    // );
    // setValue("totalProduct", productSubtotal);
    // calculateTotalAmount();
  };

  const calculateTotalAmount = () => {
    // const totalProduct = watch("totalProduct") || 0;
    // const totalService = watch("totalService") || 0;
    // const taxRate = watch("taxRate") || 0;
    // const totalBeforeTax = totalProduct + totalService;
    // const taxAmount = totalBeforeTax * taxRate;
    // setValue("totalBeforeTax", totalBeforeTax);
    // setValue("taxAmount", taxAmount);
    // setValue("totalAmount", totalProduct + totalService + taxAmount);
  };

  const calculateProductAmount = (index: number) => {
    // const totalUnitQty = watch(`salesInvoiceItems.${index}.totalUnitQty`);
    // const unitPrice = watch(`salesInvoiceItems.${index}.unitPrice`);
    // const exchangeRate = watch("exchangeRate");
    // setValue(
    //   `salesInvoiceItems.${index}.amount`,
    //   totalUnitQty * unitPrice * exchangeRate
    // );
    // calculateProductSubtotal();
  };

  const calculateServiceAmount = (index: number) => {
    // const unitPrice = watch(`salesInvoiceServices.${index}.unitPrice`);
    // const exchangeRate = watch("exchangeRate");
    // // setValue(`salesInvoiceService.${index}.amount`, unitPrice * exchangeRate);
    // calculateServiceSubtotal();
  };

  const calculateTotalUnitQty = (index: number) => {
    // const qty = watch(`salesOrderItems.${index}.qty`);
    // const unitQty = watch(`salesOrderItems.${index}.unitQty`);
    // setValue(`salesOrderItems.${index}.totalUnitQty`, qty * unitQty);
    // calculateProductsAmount();
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3">Sales Payment</Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <TextField
              value={salesInvoice.data?.data.customer.name!}
              disabled
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              label={"Customer"}
              disableClearable
            />
          </Grid>

          <Grid item md={2} xs={6}>
            <TextField
              value={watch("currencyCode")}
              disabled
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              label="Currency"
              disableClearable
            />
          </Grid>
        </Grid>
      </Paper>

      {salesInvoices.data ? (
        <>
          <Grid container gap={2} sx={{ pt: 3 }}>
            <Grid item md={4} xs={12}>
              <DatePicker
                label="Payment Date"
                onChange={(value) => {
                  setValue("date", value);
                }}
                value={watch("date")}
                renderInput={(params) => <TextField {...params} fullWidth />}
              ></DatePicker>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                select
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                label="Payment Method"
              >
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container gap={2} sx={{ pt: 2 }}>
            <Grid item md={4} xs={12}>
              <TextField label="Payment Ref. No"></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              {/* <Autocomplete
                disableClearable
                options={(selectedCustomer.data?.data?.vessels || []).map(
                  (item) => pick(item, ["vesselCode", "name"])
                )}
                onChange={(_, value) => {
                  setValue("vesselCode", value.vesselCode, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(opt, value) =>
                  opt.vesselCode === value.vesselCode
                }
                renderInput={(params) => (
                  <TextField {...params} label="Vessel" />
                )}
              /> */}
            </Grid>
          </Grid>

          <Grid container>
            <Typography sx={{ py: 2 }} variant="h3">
              Invoices
            </Typography>
            <TableContainer sx={{ width: "100%" }}>
              <Table size="small" stickyHeader sx={{ overflowX: "scroll" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice No</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell>Payment Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(salesInvoices.data?.data || []).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ padding: 0.5 }}>
                        <Typography variant="h5">{item.docNo}</Typography>
                      </TableCell>

                      <TableCell padding="none">
                        <Box
                          display="flex"
                          flexDirection={"row"}
                          alignItems={"center"}
                        >
                          <Typography variant="h5">{item.memo}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}>
                        <Typography variant="h5">
                          {formatDate(item.dueDate)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ padding: 0.5 }}>
                        <Typography variant="h5">
                          {formatMoney(item.totalAmount)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ padding: 0.5 }}>
                        <Typography variant="h5">
                          {formatMoney(item.unpaidAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}>
                        <TextFieldNumber
                          placeholder="Payment Amount"
                          value={
                            item.docNo === salesInvoiceDocNo
                              ? item.unpaidAmount
                              : 0
                          }
                        ></TextFieldNumber>
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}>
                        {/* <TextFieldNumber
                          fullWidth
                          size="small"
                          disabled
                          // onValueChange={handleProductQtyChange(index)}
                          placeholder="Qty"
                          value={watch(`salesInvoiceItems.${index}.amount`)}
                        /> */}
                      </TableCell>
                      {/* <TableCell sx={{ padding: 0.5 }}>
                          <IconButton
                            onClick={() => handleRemoveProduct(index)}
                            color="error"
                            size="medium"
                          >
                            <DeleteIcon fontSize="small"></DeleteIcon>
                          </IconButton>
                        </TableCell> */}
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
                {...register("memo")}
              ></TextField>
            </Grid>

            <Grid item md={6} xs={12}>
              <Box
                display="flex"
                py={1}
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Subtotal</Typography>
                <Typography variant="h6">
                  {formatMoney(watch("totalBeforeTax"))}
                </Typography>
              </Box>

              <Box
                display="flex"
                py={1}
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" flexDirection={"row"} alignItems="center">
                  <Typography variant="h6">Withholding Tax</Typography>

                  <Autocomplete
                    sx={{ ml: 4, width: 200 }}
                    size="small"
                    options={taxList.data?.data || []}
                    onChange={(_, value) => {
                      setValue("taxCode", value.taxCode);
                      setValue("taxRate", value.taxRate);
                    }}
                    disableClearable
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(opt, value) =>
                      opt.taxCode === value.taxCode
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Witholding Tax" />
                    )}
                  />
                </Box>
                <Typography variant="h6">
                  {formatMoney(watch("taxAmount"))}
                </Typography>
              </Box>

              <Box
                display="flex"
                py={1}
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h4">Balance Due</Typography>
                <Typography variant="h4">
                  {formatMoney(watch("totalAmount"))}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid container>
            {/* <Grid item md={5} xs={12}>
              <UploadBox>
                <TypographyPrimary variant="h4" gutterBottom>
                  Upload Files
                </TypographyPrimary>
                <TypographySecondary variant="body1">
                  Add files as attachment
                </TypographySecondary>

                <BoxUploadWrapper {...getRootProps()}>
                  <input {...getInputProps()} />
                  {isDragAccept && (
                    <>
                      <AvatarSuccess variant="rounded">
                        <CheckTwoToneIcon />
                      </AvatarSuccess>
                      <TypographyPrimary sx={{ mt: 2 }}>
                        Drop the files to start uploading
                      </TypographyPrimary>
                    </>
                  )}
                  {isDragReject && (
                    <>
                      <AvatarDanger variant="rounded">
                        <CloseTwoToneIcon />
                      </AvatarDanger>
                      <TypographyPrimary sx={{ mt: 2 }}>
                        You cannot upload these file types
                      </TypographyPrimary>
                    </>
                  )}
                  {!isDragActive && (
                    <>
                      <AvatarWrapper variant="rounded">
                        <CloudUploadTwoToneIcon />
                      </AvatarWrapper>
                      <TypographyPrimary sx={{ mt: 2 }}>
                        Drag & drop files here
                      </TypographyPrimary>
                    </>
                  )}
                </BoxUploadWrapper>
                {files.length > 0 && (
                  <>
                    <Alert sx={{ py: 0, mt: 2 }} severity="success">
                      You have uploaded <b>{files.length}</b> files!
                    </Alert>
                    <DividerContrast sx={{ mt: 2 }} />
                    <List disablePadding component="div">
                      {files}
                    </List>
                  </>
                )}
              </UploadBox> 
            </Grid>*/}
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
                disabled={createSalesPayment.isLoading}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                disabled={createSalesPayment.isLoading}
                startIcon={<SaveAltOutlinedIcon />}
                onClick={handleSubmit(onSubmit)}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </>
      ) : null}
    </MainLayout>
  );
}
