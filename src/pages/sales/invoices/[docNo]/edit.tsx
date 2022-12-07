import { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import _ from "lodash";
import { trpc } from "@/utils/trpc";
import {
  Autocomplete,
  Button,
  Checkbox,
  Divider,
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

import { formatDate, formatMoney } from "@/utils/format";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";

import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { pick } from "lodash";
import { addDays, format } from "date-fns";
import { salesOrderSchema } from "src/server/routers/salesOrder";
import { salesInvoiceSchema } from "src/server/routers/salesInvoice";
import { SalesDelivery, Tax } from "@prisma/client";
import { DatePicker } from "@mui/x-date-pickers";
import { getWithholdingTaxRate } from "@/utils/tax";

type SalesInvoiceFormValues = z.infer<typeof salesInvoiceSchema>;

type QueryParams = {
  docNo: string;
};

export default function SalesInvoiceCreate() {
  const router = useRouter();
  const { docNo } = router.query as QueryParams;

  const { register, watch, setValue, handleSubmit, control, reset } =
    useForm<SalesInvoiceFormValues>();

  const salesInvoiceQuery = trpc.salesInvoice.find.useQuery(docNo, {
    onSuccess(data) {
      const salesInvoice = data.data;
      const exchangeRate = salesInvoice?.exchangeRate;
      const salesInvoiceItems = salesInvoice?.salesInvoiceItems.map(
        (item, index) => ({
          lineNo: index + 1,
          qty: item.qty,
          unitQty: item.unitQty,
          totalUnitQty: item.totalUnitQty,
          unitCode: item.unitCode,
          packagingCode: item.packagingCode,
          unitPrice: item.unitPrice,
          desc: item.desc,
          productCode: item.productCode,
          amount: item.qty * item.unitQty * item.unitPrice * exchangeRate,
        })
      );

      const totalProduct = _.sumBy(salesInvoiceItems, (o) => o.amount);

      reset({
        exchangeRate: exchangeRate,
        currencyCode: salesInvoice?.currencyCode,
        customerCode: salesInvoice?.customerCode,
        date: new Date(salesInvoice?.date!),
        dueDate: new Date(salesInvoice?.dueDate!),
        taxCode: salesInvoice?.taxCode,
        totalProduct: totalProduct,
        salesDeliveryDocNo: salesInvoice?.salesDeliveryDocNo,
        withholdingTaxAmount: salesInvoice?.withholdingTaxAmount,
        withholdingTaxRate: salesInvoice?.withholdingTaxRate,
        totalService: 0,
        totalBeforeTax: salesInvoice?.totalBeforeTax,
        taxAmount: salesInvoice?.taxAmount,
        taxRate: salesInvoice?.taxRate,
        totalAmount: salesInvoice?.totalAmount,
        salesInvoiceItems: salesInvoiceItems,
        bankAccountCode: salesInvoice?.bankAccountCode,
      });
    },
  });

  const bankAccountList = trpc.bankAccount.findAll.useQuery();

  // const taxList = trpc.tax.findAll.useQuery();
  // const serviceList = trpc.useQuery(["service.findAll"]);
  // const warehouseList = trpc.useQuery(["warehouse.findAll"]);

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      router.back();
    }
  };

  const updateSalesInvoice = trpc.salesInvoice.update.useMutation();

  const onSubmit: SubmitHandler<SalesInvoiceFormValues> = (data) => {
    updateSalesInvoice.mutate(
      {
        docNo: docNo,
        fields: data,
      },
      {
        onError: (err) => {
          console.log(err);
        },
        onSuccess: (err) => {
          router.push("/sales/invoices");
        },
      }
    );
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
    const productSubtotal = _.sumBy(
      watch("salesInvoiceItems"),
      (o) => o.amount
    );
    setValue("totalProduct", productSubtotal);
    calculateTotalAmount();
  };

  const calculateTotalAmount = () => {
    const totalProduct = watch("totalProduct", 0);
    const totalService = watch("totalService", 0);
    const withholdingTaxAmount = watch("withholdingTaxAmount", 0);
    const taxRate = watch("taxRate") || 0;
    const totalBeforeTax = totalProduct + totalService;
    const taxAmount = totalBeforeTax * taxRate;
    setValue("totalBeforeTax", totalBeforeTax);
    setValue("taxAmount", taxAmount);
    setValue(
      "totalAmount",
      totalProduct + totalService + taxAmount - withholdingTaxAmount!
    );
  };

  const calculateProductAmount = (index: number) => {
    const totalUnitQty = watch(`salesInvoiceItems.${index}.totalUnitQty`);
    const unitPrice = watch(`salesInvoiceItems.${index}.unitPrice`);
    const exchangeRate = watch("exchangeRate");
    setValue(
      `salesInvoiceItems.${index}.amount`,
      totalUnitQty * unitPrice * exchangeRate
    );
    calculateProductSubtotal();
  };

  const calculateServiceAmount = (index: number) => {
    const unitPrice = watch(`salesInvoiceServices.${index}.unitPrice`);
    const exchangeRate = watch("exchangeRate");
    setValue(`salesInvoiceService.${index}.amount`, unitPrice * exchangeRate);
    calculateServiceSubtotal();
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
        <Typography variant="h3">Edit Sales Invoice</Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <Typography variant="h2">{docNo}</Typography>
          </Grid>

          <Grid item md={2} xs={6}>
            <Box>
              <Typography variant="h4">Currency</Typography>
              <Typography>
                {salesInvoiceQuery.data?.data?.currencyCode}
              </Typography>
            </Box>
          </Grid>
          <Grid item md={2} xs={6}>
            <TextFieldNumber
              fullWidth
              label="Exchange Rate"
              required
              disabled
              value={watch("exchangeRate")}
              onValueChange={(value) => {
                // setValue("exchangeRate", value);
                // calculateProductsAmount();
                // calculateServicesAmount();
              }}
            ></TextFieldNumber>
            <Box>
              <a href="#">
                <strong>Get Rate from Bank Indonesia</strong>
              </a>
            </Box>
          </Grid>
        </Grid>

        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={3} xs={6}>
            <Typography variant="h4">Customer PO No</Typography>
            <Typography>
              {salesInvoiceQuery.data?.data?.salesOrder.poNumber}
            </Typography>
          </Grid>
          <Grid item md={2} xs={6}>
            <Typography variant="h4">Customer PO Date</Typography>
            <Typography>
              {formatDate(salesInvoiceQuery.data?.data?.salesOrder.poDate!)}
            </Typography>
          </Grid>
        </Grid>

        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={3} xs={6}>
            <Typography variant="h4">Customer</Typography>
            <Typography>
              {salesInvoiceQuery.data?.data?.customer.name}
            </Typography>
            <Typography>
              {salesInvoiceQuery.data?.data?.customer.address}
            </Typography>
          </Grid>
          <Grid item md={2} xs={6}>
            <Typography variant="h4">Vessel</Typography>
            <Typography>
              {salesInvoiceQuery.data?.data?.salesOrder.vessel.name}
            </Typography>
          </Grid>
        </Grid>

        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={3} xs={6}>
            <Typography variant="h4">Ship To</Typography>
            <Typography>
              {salesInvoiceQuery.data?.data?.salesOrder.shipTo}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {watch("customerCode") ? (
        <>
          <Grid container sx={{ pt: 3 }} gap={2}>
            <Grid item md={3} xs={12}>
              <DatePicker
                label="Invoice Date"
                onChange={(value) => {
                  setValue("date", value);
                }}
                value={watch("date")}
                renderInput={(params) => (
                  <TextField {...params} fullWidth></TextField>
                )}
              ></DatePicker>
            </Grid>
            <Grid item md={3} xs={12}>
              <DatePicker
                label="Due Date"
                onChange={(value) => {
                  setValue("dueDate", value);
                }}
                value={watch("dueDate")}
                renderInput={(params) => (
                  <TextField {...params} fullWidth>
                    {" "}
                  </TextField>
                )}
              ></DatePicker>
            </Grid>
            <Grid item md={3} xs={12}>
              <Autocomplete
                disableClearable
                fullWidth
                options={(bankAccountList.data?.data || []).map((item) => ({
                  id: item.bankAccountCode,
                  label: item.bankName + `(${item.bankAccountNumber})`,
                }))}
                onChange={(_, value) => {
                  setValue("bankAccountCode", value.id, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Bank Account" />
                )}
              />
            </Grid>
          </Grid>
          <Grid container gap={2} sx={{ pt: 2 }}>
            <Grid item md={4} xs={12}></Grid>
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
              Product List
            </Typography>
            <TableContainer sx={{ width: "100%" }}>
              <Table size="small" stickyHeader sx={{ overflowX: "scroll" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Packaging</TableCell>
                    <TableCell>Unit Price</TableCell>
                    <TableCell>Volume</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(salesInvoiceQuery?.data.data?.salesInvoiceItems || []).map(
                    (item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ padding: 0.5 }}>
                          <TextField
                            disabled
                            value={item.product.name}
                            size="small"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            placeholder="Product"
                          />
                        </TableCell>

                        <TableCell padding="none">
                          <Box
                            display="flex"
                            flexDirection={"row"}
                            alignItems={"center"}
                          >
                            <TextFieldNumber
                              fullWidth
                              size="small"
                              disabled
                              // onValueChange={handleProductQtyChange(index)}
                              placeholder="Qty"
                              value={item.qty}
                            />
                          </Box>
                        </TableCell>
                        <TableCell sx={{ padding: 0.5 }}>
                          <TextField
                            disabled
                            value={item.packagingCode}
                            size="small"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ padding: 0.5 }}>
                          <TextField
                            disabled
                            value={item.unitPrice}
                            size="small"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ padding: 0.5 }}>
                          <TextField
                            disabled
                            value={watch(
                              `salesInvoiceItems.${index}.totalUnitQty`
                            )}
                            size="small"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ padding: 0.5 }}>
                          <TextField
                            disabled
                            value={watch(`salesInvoiceItems.${index}.unitCode`)}
                            size="small"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ padding: 0.5 }}>
                          <TextFieldNumber
                            fullWidth
                            size="small"
                            disabled
                            // onValueChange={handleProductQtyChange(index)}
                            placeholder="Qty"
                            value={watch(`salesInvoiceItems.${index}.amount`)}
                          />
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
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* <Button
              variant="outlined"
              onClick={handleAddMoreProduct}
              sx={{ mt: 1 }}
              startIcon={<AddIcon fontSize="small" />}
            >
              Add More
            </Button> */}

            <Grid item xs={12} mt={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h4">Product Subtotal</Typography>
                <Typography variant="h4">
                  {formatMoney(watch("totalProduct"))}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 2 }} />
          <Grid container sx={{ my: 2 }}>
            {/* <Typography sx={{ py: 2 }} variant="h3">
              Services
            </Typography> */}
            {/* <TableContainer sx={{ width: "100%" }}>
              <Table size="small" stickyHeader sx={{ overflowX: "scroll" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 250 }}>Service</TableCell>
                    <TableCell sx={{ minWidth: 200 }}>Description</TableCell>
                    <TableCell sx={{ minWidth: 120 }}>Price</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Amount</TableCell>
                    <TableCell sx={{ minWidth: 20 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesInvoiceService.fields.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ padding: 0.5 }}>
                        <Autocomplete
                          fullWidth
                          options={serviceList.data?.data || []}
                          isOptionEqualToValue={(opt, value) =>
                            opt.serviceCode === value.serviceCode
                          }
                          disableClearable
                          getOptionLabel={(option) => option.name}
                          onChange={(_, value) => {
                            setValue(
                              `salesInvoiceService.${index}.serviceCode`,
                              value.serviceCode
                            );
                            setValue(
                              `salesInvoiceService.${index}.unitPrice`,
                              value.unitPrice
                            );
                            calculateServiceAmount(index);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Select Service"
                            />
                          )}
                        />
                      </TableCell>

                      <TableCell sx={{ padding: 0.5 }}>
                        <TextField
                          fullWidth
                          multiline
                          size="small"
                          placeholder="Description"
                          {...register(`salesInvoiceService.${index}.desc`)}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}>
                        <TextFieldNumber
                          fullWidth
                          size="small"
                          value={watch(`salesInvoiceService.${index}.unitPrice`)}
                          onValueChange={(value) => {
                            setValue(
                              `salesInvoiceService.${index}.unitPrice`,
                              value
                            );
                            calculateServiceAmount(index);
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ padding: 0.5 }}>
                        <TextFieldNumber
                          fullWidth
                          contentEditable={false}
                          size="small"
                          name="amount"
                          readOnly
                          value={watch(`salesInvoiceService.${index}.amount`)}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}>
                        <IconButton
                          color="error"
                          size="medium"
                          onClick={() => handleRemoveService(index)}
                        >
                          <DeleteIcon fontSize="small"></DeleteIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer> */}
            {/* <Button
              variant="outlined"
              onClick={handleAddMoreService}
              sx={{ mt: 1 }}
              startIcon={<AddIcon fontSize="small" />}
            >
              Add More
            </Button> */}
            {/* <Grid item xs={12} mt={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h4">Service Subtotal</Typography>
                <Typography variant="h4">
                  {formatMoney(watch("totalService"))}
                </Typography>
              </Box>
            </Grid> */}
          </Grid>
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
                  <Typography variant="h6">Tax</Typography>
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
                      setValue(
                        "withholdingTaxAmount",
                        checked
                          ? getWithholdingTaxRate() * watch("totalBeforeTax", 0)
                          : 0
                      );
                      calculateTotalAmount();
                    }}
                  ></Checkbox>
                </Box>
                <Typography variant="h6">
                  {formatMoney(watch("withholdingTaxAmount", 0))}
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
                disabled={updateSalesInvoice.isLoading}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                disabled={updateSalesInvoice.isLoading}
                startIcon={<SaveAltOutlinedIcon />}
                onClick={handleSubmit(onSubmit)}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </>
      ) : null}

      {updateSalesInvoice.error ? (
        <FormHelperText error sx={{ py: 10 }}>
          {updateSalesInvoice.error.message}
        </FormHelperText>
      ) : null}
    </MainLayout>
  );
}
