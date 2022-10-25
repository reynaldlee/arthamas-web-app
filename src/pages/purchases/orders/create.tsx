import { useEffect, useMemo } from "react";
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

import { formatMoney } from "@/utils/format";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { pick } from "lodash";
import { DatePicker } from "@mui/x-date-pickers";
import { purchaseOrderSchema } from "src/server/routers/purchaseOrder";

type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;

export default function PurchaseOrderCreate() {
  const router = useRouter();

  const { register, watch, setValue, handleSubmit, control, reset } =
    useForm<PurchaseOrderFormValues>({
      defaultValues: {
        dueDate: new Date(),
        date: new Date(),
      },
    });

  const supplierList = trpc.useQuery(["supplier.findAll"]);
  const currencyList = trpc.useQuery(["currency.findAll"]);
  // const serviceList = trpc.useQuery(["service.findAll"]);
  const warehouseList = trpc.useQuery(["warehouse.findAll"]);

  const selectedWarehouseCode = watch("warehouseCode");
  const selectedSupplierCode = watch("supplierCode");

  trpc.useQuery(["warehouse.find", selectedWarehouseCode], {
    enabled: !!selectedWarehouseCode,
    onSuccess: (data) => {
      setValue("shipTo", data.data?.address);
    },
  });

  const productList = trpc.useQuery(["product.findAll"]);

  const createPurchaseOrder = trpc.useMutation(["purchaseOrder.create"], {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: () => {
      router.push("/purchases/orders");
    },
  });

  const purchaseOrderItems = useFieldArray({
    name: "purchaseOrderItems",
    control: control,
  });

  const purchaseOrderServices = useFieldArray({
    name: "purchaseOrderServices",
    control: control,
  });

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      router.back();
    }
  };

  const onSubmit = (data: PurchaseOrderFormValues) => {
    console.log(data);
    createPurchaseOrder.mutate(data);
  };

  const handleAddMoreProduct = () => {
    purchaseOrderItems.append({
      lineNo: purchaseOrderItems.fields.length + 1,
      desc: "",
      qty: 1,
      productCode: "",
      amount: 0,
      unitCode: "",
      unitQty: 0,
      totalUnitQty: 0,
      unitPrice: 0,
      packagingCode: "",
    });
  };

  const handleRemoveProduct = (index: number) => {
    purchaseOrderItems.remove(index);
    calculateProductSubtotal();
  };

  const handleRemoveService = (index: number) => {
    purchaseOrderServices.remove(index);
    calculateServiceSubtotal();
  };

  const handleProductQtyChange = (index: number) => (value: number) => {
    const unitQty = watch(`purchaseOrderItems.${index}.unitQty`);
    setValue(`purchaseOrderItems.${index}.qty`, value);
    setValue(`purchaseOrderItems.${index}.totalUnitQty`, value * unitQty);
    calculateProductAmount(index);
  };

  const calculateProductsAmount = () => {
    purchaseOrderItems.fields.forEach((_, index) => {
      calculateProductAmount(index);
    });
  };

  const calculateServicesAmount = () => {
    purchaseOrderServices.fields.forEach((_, index) => {
      calculateServiceAmount(index);
    });
    calculateServiceSubtotal();
  };

  const calculateServiceSubtotal = () => {
    const servicesSubtotal = _.sumBy(
      watch("purchaseOrderServices"),
      (o) => o.amount
    );
    setValue("totalService", servicesSubtotal);
    calculateTotalAmount();
  };

  const calculateProductSubtotal = () => {
    const productSubtotal = _.sumBy(
      watch("purchaseOrderItems"),
      (o) => o.amount
    );
    setValue("totalProduct", productSubtotal);
    calculateTotalAmount();
  };

  const calculateTotalAmount = () => {
    const totalProduct = watch("totalProduct") || 0;
    const totalService = watch("totalService") || 0;
    const taxRate = watch("taxRate") || 0;

    const totalBeforeTax = totalProduct + totalService;
    const taxAmount = totalBeforeTax * taxRate;
    setValue("totalBeforeTax", totalBeforeTax);
    setValue("taxAmount", taxAmount);
    setValue("totalAmount", totalProduct + totalService + taxAmount);
  };

  const calculateProductAmount = (index: number) => {
    const totalUnitQty = watch(`purchaseOrderItems.${index}.totalUnitQty`);
    const unitPrice = watch(`purchaseOrderItems.${index}.unitPrice`);
    const exchangeRate = watch("exchangeRate");

    setValue(
      `purchaseOrderItems.${index}.amount`,
      totalUnitQty * unitPrice * exchangeRate
    );
    calculateProductSubtotal();
  };

  const calculateServiceAmount = (index: number) => {
    const unitPrice = watch(`purchaseOrderServices.${index}.unitPrice`);
    const exchangeRate = watch("exchangeRate");
    setValue(`purchaseOrderServices.${index}.amount`, unitPrice * exchangeRate);
    calculateServiceSubtotal();
  };

  const calculateTotalUnitQty = (index: number) => {
    const qty = watch(`purchaseOrderItems.${index}.qty`);
    const unitQty = watch(`purchaseOrderItems.${index}.unitQty`);
    setValue(`purchaseOrderItems.${index}.totalUnitQty`, qty * unitQty);
    calculateProductsAmount();
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3">Create Sales Order</Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        {/* <Box sx={{ py: 2 }}>
          <PageHeader title="Create Sales Inquiries"></PageHeader>
        </Box> */}

        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <Autocomplete
              options={(supplierList.data?.data || []).map((item) =>
                pick(item, ["supplierCode", "name"])
              )}
              onChange={(_, value) => {
                setValue("supplierCode", value.supplierCode, {
                  shouldDirty: true,
                  shouldValidate: true,
                  shouldTouch: true,
                });
              }}
              // value={pick(
              //   supplierList.data?.data.find((item) => {
              //     return item.supplierCode === selectedSupplierCode;
              //   }),
              //   ["supplierCode", "name"]
              // )}
              disableClearable
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(opt, value) =>
                opt.supplierCode === value.supplierCode
              }
              renderInput={(params) => (
                <TextField {...params} label="Supplier" />
              )}
            />
          </Grid>

          <Grid item md={2} xs={6}>
            <TextField
              defaultValue={"IDR"}
              select
              fullWidth
              label="Currency"
              {...register("currencyCode")}
            >
              {(currencyList.data?.data || []).map((item) => (
                <MenuItem key={item.currencyCode} value={item.currencyCode}>
                  {item.currencyCode}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item md={3} xs={6}>
            <TextFieldNumber
              fullWidth
              label="Exchange Rate"
              required
              value={watch("exchangeRate")}
              onValueChange={(value) => {
                setValue("exchangeRate", value);
                calculateProductsAmount();
                calculateServicesAmount();
              }}
            ></TextFieldNumber>
            <Box>
              <a href="#">
                <strong>Get Rate from Bank Indonesia</strong>
              </a>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {watch("supplierCode") ? (
        <>
          <Grid container gap={2} sx={{ pt: 3 }}>
            <Grid item md={4} xs={12}>
              <DatePicker
                onChange={(value) => {
                  setValue("date", value!);
                }}
                label="Transaction Date"
                value={watch("date")}
                renderInput={(params) => <TextField {...params} required />}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <DatePicker
                onChange={(value) => {
                  setValue("dueDate", value!);
                }}
                label="Delivery Date"
                value={watch("dueDate")}
                renderInput={(params) => <TextField {...params} required />}
              />
            </Grid>
          </Grid>
          <Grid container gap={2} sx={{ pt: 2 }}>
            <Grid item md={4} xs={12}></Grid>
            <Grid item md={4} xs={12}></Grid>
          </Grid>
          <Grid container gap={2} sx={{ pt: 2 }}>
            <Grid item md={4} xs={12}>
              <Autocomplete
                disablePortal
                options={(warehouseList.data?.data || []).map((item) =>
                  pick(item, ["warehouseCode", "name", "address"])
                )}
                // value={pick(
                //   (warehouseList.data?.data || []).find(
                //     (item) => item.warehouseCode === watch("warehouseCode")
                //   ),
                //   ["warehouseCode", "name"]
                // )}
                onChange={(_, value) => {
                  setValue("warehouseCode", value?.warehouseCode!, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(opt, value) =>
                  opt.warehouseCode === value.warehouseCode
                }
                renderInput={(params) => (
                  <TextField {...params} label="Warehouse" />
                )}
              />
            </Grid>
          </Grid>
          <Grid container gap={2} sx={{ pt: 2 }}>
            <Grid item md={4} xs={12}>
              <TextField
                {...register("shipTo")}
                value={watch("shipTo")}
                InputLabelProps={{
                  shrink: true,
                }}
                label="Shipping Address"
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
                    <TableCell sx={{ minWidth: 200 }}>Description</TableCell>
                    <TableCell sx={{ width: 25 }}>Qty</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Packaging</TableCell>
                    <TableCell sx={{ minWidth: 120 }}>Unit Price</TableCell>
                    <TableCell sx={{ width: 100 }}>Volume</TableCell>
                    <TableCell sx={{ width: 70 }}>Unit</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Amount</TableCell>
                    <TableCell sx={{ minWidth: 20 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseOrderItems.fields.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ padding: 0.5 }}>
                        <Autocomplete
                          fullWidth
                          disableClearable
                          options={(productList.data?.data || []).map(
                            (item) => item
                          )}
                          isOptionEqualToValue={(opt, value) =>
                            opt.productCode === value.productCode
                          }
                          // value={pick(
                          //   productList.data?.data?.find(
                          //     (item) =>
                          //       item.productCode ===
                          //       watch(
                          //         `purtchaseOrderItems.${index}.productCode`
                          //       )
                          //   ),
                          //   ["productCode", "name"]
                          // )}
                          getOptionLabel={(option) => option.name}
                          onChange={(_, value) => {
                            purchaseOrderItems.update(index, {
                              ...purchaseOrderItems.fields[index],
                              productCode: value.productCode,
                              qty: 1,
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Select Product"
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
                          {...register(`purchaseOrderItems.${index}.desc`)}
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
                            onValueChange={handleProductQtyChange(index)}
                            placeholder="Qty"
                            value={watch(`purchaseOrderItems.${index}.qty`)}
                          />
                          {/* <Tooltip
                            color={
                              item.quantity > item.stock ? "error" : "info"
                            }
                            title={`Stock: ${item.stock}`}
                            sx={{
                              visibility: item.id ? "visible" : "hidden",
                            }}
                          >
                            <InfoTwoTone></InfoTwoTone>
                          </Tooltip> */}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}>
                        <Autocomplete
                          fullWidth
                          size="small"
                          disableClearable
                          options={
                            (productList.data?.data || []).find(
                              (item) =>
                                item.productCode ===
                                purchaseOrderItems.fields[index].productCode
                            )?.packagings
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.packagingCode === value.packagingCode
                          }
                          getOptionLabel={(option) => {
                            return option.packagingCode;
                          }}
                          // value={productList.data?.data
                          //   .find(
                          //     (item) =>
                          //       item.productCode ===
                          //       purchaseOrderItems.fields[index].productCode
                          //   )
                          //   ?.packagings.find(
                          //     (item) =>
                          //       item.packagingCode ===
                          //       watch(
                          //         `purchaseOrderItems.${index}.packagingCode`
                          //       )
                          //   )}
                          placeholder="Packaging"
                          onChange={(_, value) => {
                            setValue(
                              `purchaseOrderItems.${index}.packagingCode`,
                              value.packagingCode
                            );
                            setValue(
                              `purchaseOrderItems.${index}.unitCode`,
                              value.unitCode
                            );
                            setValue(
                              `purchaseOrderItems.${index}.unitQty`,
                              value.unitQty
                            );

                            calculateTotalUnitQty(index);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Packaging"
                            />
                          )}
                        />
                      </TableCell>

                      <TableCell sx={{ padding: 0.5 }}>
                        <TextFieldNumber
                          size="small"
                          fullWidth
                          value={watch(`purchaseOrderItems.${index}.unitPrice`)}
                          placeholder="Unit Price"
                          onValueChange={(value) => {
                            setValue(
                              `purchaseOrderItems.${index}.unitPrice`,
                              value
                            );
                            calculateProductAmount(index);
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ padding: 0.5 }}>
                        <TextFieldNumber
                          fullWidth
                          contentEditable={false}
                          size="small"
                          placeholder="Volume"
                          readOnly
                          disabled
                          value={watch(
                            `purchaseOrderItems.${index}.totalUnitQty`
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}>
                        <TextField
                          disabled
                          fullWidth
                          placeholder="Unit"
                          contentEditable={false}
                          size="small"
                          value={watch(`purchaseOrderItems.${index}.unitCode`)}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}>
                        <TextFieldNumber
                          fullWidth
                          size="small"
                          placeholder="Amount"
                          disabled
                          contentEditable={false}
                          value={watch(`purchaseOrderItems.${index}.amount`)}
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
              Add More
            </Button>

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
                  <Typography variant="h6" sx={{ mr: 2 }}>
                    Tax
                  </Typography>
                  <Box width={100} mr={2}>
                    <TextFieldNumber
                      label="Tax Rate"
                      size="small"
                      type="number"
                      onValueChange={(value) => {
                        setValue("taxRate", value / 100);
                        calculateTotalAmount();
                      }}
                    ></TextFieldNumber>
                  </Box>
                  <Typography variant="h6" sx={{ mr: 2 }}>
                    %
                  </Typography>
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
                disabled={createPurchaseOrder.isLoading}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                disabled={createPurchaseOrder.isLoading}
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
