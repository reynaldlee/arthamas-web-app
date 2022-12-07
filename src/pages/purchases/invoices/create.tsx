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

import { addDays, format } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers";
import { getWithholdingTaxRate } from "@/utils/tax";
import { purchaseInvoiceSchema } from "src/server/routers/purchaseInvoice";

type PurchaseInvoiceFormValues = z.infer<typeof purchaseInvoiceSchema>;

type QueryParams = {
  salesReceiptDocNo?: string;
};

export default function PurchaseInvoiceCreate() {
  const router = useRouter();
  const { salesReceiptDocNo } = router.query as QueryParams;

  const { register, watch, setValue, handleSubmit, control, reset } =
    useForm<PurchaseInvoiceFormValues>();

  const purchaseInvoiceItems = useFieldArray({
    control,
    name: "purchaseInvoiceItems",
  });

  const purchaseDeliveryList = trpc.purchaseReceipt.findOpenStatus.useQuery();
  const purchaseReceiptDocNo = watch("purchaseReceiptDocNo");

  const purchaseReceipt = trpc.purchaseReceipt.find.useQuery(
    purchaseReceiptDocNo,
    {
      enabled: !!purchaseReceiptDocNo,
      onSuccess(data) {
        const receipt = data.data;
        const { purchaseOrder } = receipt;
        const exchangeRate = purchaseOrder.exchangeRate;

        const totalBeforeTax = _.sumBy(
          purchaseInvoiceItems.fields,
          (o) => o.amount
        );
        const taxRate = receipt.purchaseOrder.taxRate || 0;
        const taxAmount = totalBeforeTax * taxRate;
        const otherFees = 0;
        const totalAmount = totalBeforeTax + otherFees + taxAmount;

        reset({
          currencyCode: receipt.purchaseOrder.currencyCode,
          customerCode: receipt.purchaseOrder.supplierCode,
          date: new Date(),
          totalBeforeTax: totalBeforeTax,
          taxAmount: taxAmount,
          taxRate: taxRate,
          totalAmount: totalAmount,
          dueDate: addDays(new Date(), receipt.purchaseOrder.supplier.top),
          exchangeRate: exchangeRate,
          otherFees: 0,
          supplierCode: receipt.purchaseOrder.supplierCode,
          withholdingTaxRate: 0,
          withholdingTaxAmount: 0,
          purchaseReceiptDocNo: receipt.docNo,
          purchaseInvoiceItems: receipt.purchaseReceiptItems.map((item) => ({
            lineNo: item.lineNo,
            packagingCode: item.packagingCode,
            productCode: item.productCode,
            purchaseReceiptDocNo: item.docNo,
            qty: item.qty,
            unitPrice: item.purchaseOrderItem.unitPrice,
            unitCode: item.unitCode,
            totalUnitQty: item.totalUnitQty,
            unitQty: item.unitQty,
            amount: item.totalUnitQty * item.purchaseOrderItem.unitPrice,
          })),
        });
        calculateTotalAmount();
      },
    }
  );

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      router.back();
    }
  };

  const createPurchaseInvoice = trpc.purchaseInvoice.create.useMutation();

  const onSubmit: SubmitHandler<PurchaseInvoiceFormValues> = (data) => {
    createPurchaseInvoice.mutate(data, {
      onError: (err) => {
        console.log(err);
      },
      onSuccess: (err) => {
        router.push("/purchases/invoices");
      },
    });
  };

  const calculateTotalAmount = () => {
    const withholdingTaxRate = watch("withholdingTaxRate", 0);

    const taxRate = watch("taxRate") || 0;
    const totalBeforeTax = _.sumBy(
      watch("purchaseInvoiceItems"),
      (o) => o.amount
    );
    const otherFees = watch("otherFees");
    const taxAmount = totalBeforeTax * taxRate;
    const withholdingTaxAmount = totalBeforeTax * withholdingTaxRate;
    setValue("totalBeforeTax", totalBeforeTax);
    setValue("taxAmount", taxAmount);
    setValue("withholdingTaxAmount", withholdingTaxAmount);
    setValue(
      "totalAmount",
      totalBeforeTax + otherFees + taxAmount - withholdingTaxAmount
    );
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3">Create Purchase Invoice</Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <Autocomplete
              options={(purchaseDeliveryList.data?.data || []).map(
                (item) => item
              )}
              getOptionLabel={(option) =>
                `${option.deliveryNoteNo} [${option.docNo}]`
              }
              onChange={(_, value) => {
                setValue("purchaseReceiptDocNo", value.docNo);
              }}
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Delivery Note No [ Purchase Receipt No ]"
                />
              )}
            />
          </Grid>

          <Grid item md={2} xs={6}>
            <Box>
              <Typography variant="h4">Currency</Typography>
              <Typography>
                {purchaseReceipt.data?.data?.purchaseOrder.currencyCode}
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
                setValue("exchangeRate", value);
                calculateTotalAmount();
              }}
            ></TextFieldNumber>
          </Grid>
        </Grid>

        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={3} xs={6}>
            <Typography variant="h4">PO No</Typography>
            <Typography>
              {purchaseReceipt.data?.data?.purchaseOrder.docNo}
            </Typography>
          </Grid>
          <Grid item md={2} xs={6}>
            <Typography variant="h4">PO Date</Typography>
            <Typography>
              {formatDate(purchaseReceipt.data?.data?.purchaseOrder.date!)}
            </Typography>
          </Grid>
        </Grid>

        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={3} xs={6}>
            <Typography variant="h4">Supplier</Typography>
            <Typography>
              {purchaseReceipt.data?.data?.purchaseOrder.supplier.name}
            </Typography>
            <Typography>
              {purchaseReceipt.data?.data?.purchaseOrder.supplier.address}
            </Typography>
          </Grid>

          <Grid item md={3} xs={6}>
            <Typography variant="h4">Ship To</Typography>
            <Typography>
              {purchaseReceipt.data?.data?.warehouse.name}
            </Typography>
          </Grid>
        </Grid>

        {/* <Grid container gap={2} sx={{ pt: 2 }}> */}

        {/* </Grid> */}
      </Paper>

      {watch("purchaseReceiptDocNo") ? (
        <>
          <Grid container sx={{ pt: 3 }} gap={2}>
            <Grid item md={3} xs={12}>
              <DatePicker
                label="Invoice Date"
                onChange={(value) => {
                  setValue("date", value!);
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
                  setValue("dueDate", value!);
                }}
                value={watch("dueDate")}
                renderInput={(params) => (
                  <TextField {...params} fullWidth>
                    {" "}
                  </TextField>
                )}
              ></DatePicker>
            </Grid>
          </Grid>
          <Grid container gap={2} sx={{ pt: 2 }}>
            <Grid item md={4} xs={12}></Grid>
            <Grid item md={4} xs={12}></Grid>
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
                  {(purchaseReceipt.data?.data?.purchaseReceiptItems || []).map(
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

                        <TableCell sx={{ padding: 0.5 }} align="right">
                          <TextField
                            disabled
                            value={formatMoney(
                              item.purchaseOrderItem.unitPrice
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
                            value={watch(
                              `purchaseInvoiceItems.${index}.totalUnitQty`
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
                            value={watch(
                              `purchaseInvoiceItems.${index}.unitCode`
                            )}
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
                            placeholder="Amount"
                            value={watch(
                              `purchaseInvoiceItems.${index}.amount`
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* <Grid item xs={12} mt={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h4">Subtotal</Typography>
                <Typography variant="h4">
                  {formatMoney(watch("totalBeforeTax"))}
                </Typography>
              </Box>
            </Grid> */}
          </Grid>
          <Divider sx={{ mt: 2 }} />
          <Grid container sx={{ my: 2 }}></Grid>
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
                  <Typography variant="h6">Other Fees</Typography>
                </Box>

                <TextFieldNumber
                  size="small"
                  value={watch("otherFees")}
                  onValueChange={(value) => {
                    setValue("otherFees", value);
                    calculateTotalAmount();
                  }}
                ></TextFieldNumber>
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
                  <TextFieldNumber
                    size="small"
                    sx={{
                      mx: 2,
                      width: 100,
                    }}
                    value={watch("taxRate") * 100}
                    onValueChange={(value) => {
                      setValue("taxRate", value / 100);
                      calculateTotalAmount();
                    }}
                  ></TextFieldNumber>
                  <Typography variant="h6">%</Typography>
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
                disabled={createPurchaseInvoice.isLoading}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                disabled={createPurchaseInvoice.isLoading}
                startIcon={<SaveAltOutlinedIcon />}
                onClick={handleSubmit(onSubmit)}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </>
      ) : null}

      {createPurchaseInvoice.error ? (
        <FormHelperText error sx={{ whiteSpace: "pre-wrap" }}>
          {createPurchaseInvoice.error.message}
        </FormHelperText>
      ) : null}
    </MainLayout>
  );
}
