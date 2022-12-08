import { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import _ from "lodash";
import { trpc } from "@/utils/trpc";
import {
  Autocomplete,
  Button,
  Checkbox,
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

import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";

import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { DatePicker } from "@mui/x-date-pickers";
import { purchasePaymentSchema } from "src/server/routers/purchasePayment";
import { getWithholdingTaxRate } from "@/utils/tax";

type PurchasePaymentFormValues = z.infer<typeof purchasePaymentSchema>;

type QueryParams = {
  purchaseInvoiceDocNo: string;
};

export default function PurchasePaymentCreate() {
  const router = useRouter();
  const { purchaseInvoiceDocNo } = router.query as QueryParams;

  const { register, watch, setValue, handleSubmit, control, reset } =
    useForm<PurchasePaymentFormValues>({
      defaultValues: {
        exchangeRate: 1,
        date: new Date(),
        withholdingTaxRate: 0,
      },
    });

  const purchasePaymentDetails = useFieldArray({
    control: control,
    name: "purchasePaymentDetails",
  });

  // const salesInvoice = trpc.purchaseInvoice.find.useQuery(salesInvoiceDocNo, {
  //   onSuccess: (data) => {
  //     setValue("currencyCode", data.data?.currencyCode!);
  //   },
  //   trpc: {},
  // });

  const currencyList = trpc.currency.findAll.useQuery();
  const supplierList = trpc.supplier.findAll.useQuery();
  // const taxList = trpc.tax.findAll.useQuery();
  const selectedCurrencyCode = watch("currencyCode");
  const createPurchasePayment = trpc.purchasePayment.create.useMutation();

  const purchaseInvoices = trpc.purchaseInvoice.findOpenStatus.useQuery(
    {
      supplierCode: watch("supplierCode"),
    },
    {
      enabled: !!watch("supplierCode") && !!selectedCurrencyCode,
      onSuccess: (invs) => {
        purchasePaymentDetails.replace(
          invs.data.map((item) => ({
            purchaseInvoiceDocNo: item.docNo,
            amount: 0,
          }))
        );
        calculateTotalAmount();
      },
    }
  );

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      router.back();
    }
  };

  const onSubmit: SubmitHandler<PurchasePaymentFormValues> = (data) => {
    createPurchasePayment.mutate(data, {
      onError: (err) => {
        console.log(err);
      },
      onSuccess: (err) => {
        router.push("/purchases/payments");
      },
    });
  };

  const calculateTotalAmount = () => {
    const totalBeforeTax = _.sumBy(
      watch(`purchasePaymentDetails`),
      (i) => i.amount || 0
    );
    const withholdingTaxAmount =
      totalBeforeTax * (watch("withholdingTaxRate") || 0);
    const totalAmount = totalBeforeTax - withholdingTaxAmount;
    setValue("totalBeforeTax", totalBeforeTax);
    setValue("withholdingTaxAmount", withholdingTaxAmount);
    setValue("totalAmount", totalAmount);
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3">Purchase Payment</Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <Autocomplete
              options={supplierList.data?.data || []}
              getOptionLabel={(option) => option.name}
              onChange={(_, value) => {
                setValue("supplierCode", value.supplierCode, {
                  shouldDirty: true,
                  shouldValidate: true,
                  shouldTouch: true,
                });
              }}
              isOptionEqualToValue={(opt, value) =>
                opt.supplierCode === value.supplierCode
              }
              disableClearable
              renderInput={(params) => (
                <TextField {...params} label="Supplier" />
              )}
            />
          </Grid>

          <Grid item md={2} xs={6}>
            <Autocomplete
              options={currencyList.data?.data || []}
              getOptionLabel={(option) => option.name}
              onChange={(_, value) => {
                setValue("currencyCode", value.currencyCode, {
                  shouldDirty: true,
                  shouldValidate: true,
                  shouldTouch: true,
                });
              }}
              isOptionEqualToValue={(opt, value) =>
                opt.currencyCode === value.currencyCode
              }
              disableClearable
              renderInput={(params) => (
                <TextField {...params} label="Currency" />
              )}
            />
          </Grid>

          <Grid item md={2} xs={6}>
            <TextFieldNumber
              label="Exchange Rate"
              value={watch("exchangeRate")}
              onValueChange={(value) => {
                setValue("exchangeRate", value);
              }}
            ></TextFieldNumber>
          </Grid>
        </Grid>
      </Paper>

      {purchaseInvoices.data ? (
        <>
          <Grid container gap={2} sx={{ pt: 3 }}>
            <Grid item md={4} xs={12}>
              <DatePicker
                label="Payment Date"
                onChange={(value) => {
                  setValue("date", value!);
                }}
                value={watch("date")}
                renderInput={(params) => <TextField {...params} fullWidth />}
              ></DatePicker>
            </Grid>
          </Grid>
          <Grid container gap={2} sx={{ pt: 2 }}>
            <Grid item md={4} xs={12}>
              <TextField
                label="Payment Ref. No"
                value={watch("refNo")}
                required
                onChange={(e) => {
                  setValue("refNo", e.target.value);
                }}
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}></Grid>
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
                    <TableCell>Due Date</TableCell>
                    <TableCell>Total Invoice</TableCell>
                    <TableCell>Unpaid</TableCell>
                    <TableCell>Payment Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(purchaseInvoices.data?.data || []).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ padding: 0.5 }}>
                        <Typography variant="h5">{item.docNo}</Typography>
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
                          onValueChange={(value) => {
                            setValue(
                              `purchasePaymentDetails.${index}.amount`,
                              value
                            );
                            calculateTotalAmount();
                          }}
                          value={watch(
                            `purchasePaymentDetails.${index}.amount`
                          )}
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
                  <Typography variant="h6">PPH 22 (0.3%)</Typography>

                  <Checkbox
                    checked={!!watch("withholdingTaxRate")}
                    onChange={(e) => {
                      const checked = e.target.checked;

                      setValue(
                        "withholdingTaxRate",
                        checked ? getWithholdingTaxRate() : 0
                      );
                      calculateTotalAmount();
                    }}
                  ></Checkbox>
                </Box>
                <Typography variant="h6">
                  {formatMoney(watch("withholdingTaxAmount"))}
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
                disabled={createPurchasePayment.isLoading}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                disabled={createPurchasePayment.isLoading}
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
