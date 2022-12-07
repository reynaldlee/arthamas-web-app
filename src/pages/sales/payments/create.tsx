import { useEffect } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import _ from "lodash";
import { trpc } from "@/utils/trpc";
import {
  Button,
  Checkbox,
  Divider,
  FormHelperText,
  Grid,
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
import { getWithholdingTaxRate } from "@/utils/tax";
import { salesPaymentSchema } from "src/server/routers/salesPayment";

type SalesPaymentFormValues = z.infer<typeof salesPaymentSchema>;

type QueryParams = {
  salesInvoiceDocNo: string;
};

export default function SalesPaymentCreate() {
  const router = useRouter();
  const { salesInvoiceDocNo } = router.query as QueryParams;

  const { register, watch, setValue, handleSubmit, reset, control, getValues } =
    useForm<SalesPaymentFormValues>();

  const salesPaymentDetails = useFieldArray({
    control: control,
    name: "salesPaymentDetails",
  });

  const createPayment = trpc.salesPayment.create.useMutation();

  const salesInvoice = trpc.salesInvoice.find.useQuery(salesInvoiceDocNo, {
    onSuccess: (data) => {
      reset({
        currencyCode: data.data?.currencyCode,
        customerCode: data.data?.customerCode,
        exchangeRate: data.data?.exchangeRate,
        totalBeforeTax: data.data?.unpaidAmount,
        totalAmount: data.data?.unpaidAmount,
        withholdingTaxAmount: 0,
        withholdingTaxRate: 0,
        paymentMethod: "Bank Transfer",
        date: new Date(),
      });
    },
  });

  const selectedCurrencyCode = watch("currencyCode");

  const calculateTotalAmount = () => {
    const totalBeforeTax = _.sumBy(
      watch(`salesPaymentDetails`),
      (i) => i.amount || 0
    );
    const withholdingTaxAmount =
      totalBeforeTax * (watch("withholdingTaxRate") || 0);
    const totalAmount = totalBeforeTax - withholdingTaxAmount;
    setValue("totalBeforeTax", totalBeforeTax);
    setValue("withholdingTaxAmount", withholdingTaxAmount);
    setValue("totalAmount", totalAmount);
  };

  const salesInvoices = trpc.salesInvoice.findAll.useQuery(
    {
      filters: {
        currencyCode: selectedCurrencyCode,
        customerCode: salesInvoice.data?.data?.customerCode,
      },
    },
    {
      onSuccess: (data) => {
        data.data.forEach((item, index) => {
          salesPaymentDetails.insert(index, {
            amount: item.docNo === salesInvoiceDocNo ? item.unpaidAmount : 0,
            salesInvoiceDocNo: item.docNo,
          });
        });
        calculateTotalAmount();
      },
      enabled:
        !!salesInvoice.data?.data?.customerCode && !!selectedCurrencyCode,
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
      onSuccess: (err) => {
        router.push("/sales/payments");
      },
    });
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
              value={salesInvoice.data?.data?.customer.name!}
              disabled
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              label={"Customer"}
            />
          </Grid>

          <Grid item md={2} xs={6}>
            <TextField
              value={selectedCurrencyCode}
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              fullWidth
              label="Currency"
            />
          </Grid>
          <Grid item md={2} xs={6}>
            <TextField
              value={watch("exchangeRate")}
              disabled
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              label="Exchange Rate"
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
                  setValue("date", value!);
                }}
                value={watch("date")}
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                select
                InputLabelProps={{
                  shrink: true,
                }}
                value={watch("paymentMethod") || ""}
                onChange={(e) => {
                  setValue("paymentMethod", e.target.value);
                }}
                required
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
              <TextField
                label="Payment Ref. No"
                value={watch("refNo")}
                onChange={(e) => {
                  setValue("refNo", e.target.value);
                }}
                fullWidth
                required
              ></TextField>
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
                    <TableCell>Due Date</TableCell>
                    <TableCell align="center">Currency</TableCell>
                    <TableCell align="right">Invoice Amount</TableCell>
                    <TableCell align="right">Unpaid</TableCell>
                    <TableCell align="right">Payment Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(salesInvoices.data?.data || []).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ padding: 0.5 }}>
                        <Typography variant="h5">{item.docNo}</Typography>
                      </TableCell>

                      <TableCell sx={{ padding: 0.5 }}>
                        <Typography variant="h5">
                          {formatDate(item.dueDate)}
                        </Typography>
                      </TableCell>

                      <TableCell align="center" sx={{ padding: 0.5 }}>
                        <Typography variant="h5">
                          {item.currencyCode}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ padding: 0.5 }} align="right">
                        <Typography variant="h5">
                          {formatMoney(item.totalAmount)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ padding: 0.5 }} align="right">
                        <Typography variant="h5">
                          {formatMoney(item.unpaidAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }} align="right">
                        <TextFieldNumber
                          placeholder="Payment Amount"
                          onValueChange={(value) => {
                            setValue(
                              `salesPaymentDetails.${index}.amount`,
                              value
                            );
                            calculateTotalAmount();
                          }}
                          value={watch(`salesPaymentDetails.${index}.amount`)}
                        ></TextFieldNumber>
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}></TableCell>
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
                <Typography variant="h4">Total Payment</Typography>
                <Typography variant="h4">
                  {formatMoney(watch("totalAmount"))}
                </Typography>
              </Box>
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
                disabled={createPayment.isLoading}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                disabled={createPayment.isLoading}
                startIcon={<SaveAltOutlinedIcon />}
                onClick={handleSubmit(onSubmit)}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </>
      ) : null}

      <FormHelperText error>{createSalesPayment.error?.message}</FormHelperText>
    </MainLayout>
  );
}
