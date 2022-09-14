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
import { addDays, format } from "date-fns";
import { salesOrderSchema } from "src/server/routers/salesOrder";
import { SalesOrderItem, SalesOrderService } from "@prisma/client";

type SalesOrderFormValues = z.infer<typeof salesOrderSchema>;

type QueryParams = {
  salesQuoteDocNo?: string;
};

export default function SalesOrderCreate() {
  const router = useRouter();
  const { salesQuoteDocNo } = router.query as QueryParams;

  const { register, watch, setValue, handleSubmit, control, reset } =
    useForm<SalesOrderFormValues>();

  const salesQuote = trpc.useQuery(["salesQuote.find", salesQuoteDocNo!], {
    enabled: !!salesQuoteDocNo,
  });

  const customerList = trpc.useQuery(["customer.findAll"]);
  const currencyList = trpc.useQuery(["currency.findAll"]);
  const portList = trpc.useQuery(["port.findAll"]);
  const taxList = trpc.useQuery(["tax.findAll"]);
  const serviceList = trpc.useQuery(["service.findAll"]);
  const warehouseList = trpc.useQuery(["warehouse.findAll"]);

  const selectedCustomerCode = watch("customerCode");
  const selectedVesselCode = watch("vesselCode");
  const selectedPortCode = watch("portCode");

  const productList = trpc.useQuery(
    [
      "product.findByVesselAndPort",
      { vesselCode: selectedVesselCode, portCode: selectedPortCode },
    ],
    { enabled: !!selectedVesselCode }
  );

  const createSalesOrder = trpc.useMutation(["salesOrder.create"], {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: () => {
      router.push("/sales/orders");
    },
  });

  // const [productItems, setProductItems] = useState<ProductItemOption[]>([]);
  // const [serviceItems, setServiceItems] = useState([]);

  const salesOrderItems = useFieldArray({
    name: "salesOrderItems",
    control: control,
  });

  const salesOrderServices = useFieldArray({
    name: "salesOrderServices",
    control: control,
  });

  useEffect(() => {
    if (salesQuote.data) {
      const { salesQuoteItems, salesQuoteServices, ...fields } =
        salesQuote.data.data!;

      //@ts-ignore
      reset({
        ...fields,
        date: new Date(),
        dueDate: new Date(),
        //@ts-ignore
        salesOrderItems: salesQuoteItems.map((item) => ({
          productCode: item.productCode,
          lineNo: item.lineNo,
          amount: item.amount,
          desc: item.desc,
          packagingCode: item.packagingCode,
          qty: item.qty,
          totalUnitQty: item.totalUnitQty,
          unitCode: item.unitCode,
          unitPrice: item.unitPrice,
          unitQty: item.unitQty,
        })),
        //@ts-ignore
        salesOrderServices: salesQuoteServices.map((item) => ({
          amount: item.amount,
          desc: item.desc,
          serviceCode: item.serviceCode,
          unitPrice: item.unitPrice,
        })),
      });
    }
  }, [salesQuote.data, reset]);

  // const [salesOrderItems, setSalesOrderItems] = useState([]);
  // const [salesOrderServices, setSalesOrderServices] = useState([]);

  const selectedCustomer = trpc.useQuery(
    ["customer.find", selectedCustomerCode],
    { enabled: !!selectedCustomerCode }
  );

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      router.back();
    }
  };

  const onSubmit = (data: SalesOrderFormValues) => {
    createSalesOrder.mutate(data);
  };

  const handleAddMoreProduct = () => {
    salesOrderItems.append({
      lineNo: salesOrderItems.fields.length + 1,
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

  const handleAddMoreService = () => {
    salesOrderServices.append({
      serviceCode: "",
      amount: 0,
      desc: "",
      unitPrice: 0,
    });
  };

  const handleRemoveProduct = (index: number) => {
    salesOrderItems.remove(index);
    calculateProductSubtotal();
  };

  const handleRemoveService = (index: number) => {
    salesOrderServices.remove(index);
    calculateServiceSubtotal();
  };

  const handleProductQtyChange = (index: number) => (value: number) => {
    const unitQty = watch(`salesOrderItems.${index}.unitQty`);
    setValue(`salesOrderItems.${index}.qty`, value);
    setValue(`salesOrderItems.${index}.totalUnitQty`, value * unitQty);
    calculateProductAmount(index);
  };

  const calculateProductsAmount = () => {
    salesOrderItems.fields.forEach((_, index) => {
      calculateProductAmount(index);
    });
  };

  const calculateServicesAmount = () => {
    salesOrderServices.fields.forEach((_, index) => {
      calculateServiceAmount(index);
    });
    calculateServiceSubtotal();
  };

  const calculateServiceSubtotal = () => {
    const servicesSubtotal = _.sumBy(
      watch("salesOrderServices"),
      (o) => o.amount
    );
    setValue("totalService", servicesSubtotal);
    calculateTotalAmount();
  };

  const calculateProductSubtotal = () => {
    const productSubtotal = _.sumBy(watch("salesOrderItems"), (o) => o.amount);
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
    const totalUnitQty = watch(`salesOrderItems.${index}.totalUnitQty`);
    const unitPrice = watch(`salesOrderItems.${index}.unitPrice`);
    const exchangeRate = watch("exchangeRate");
    setValue(
      `salesOrderItems.${index}.amount`,
      totalUnitQty * unitPrice * exchangeRate
    );
    calculateProductSubtotal();
  };

  const calculateServiceAmount = (index: number) => {
    const unitPrice = watch(`salesOrderServices.${index}.unitPrice`);
    const exchangeRate = watch("exchangeRate");
    setValue(`salesOrderServices.${index}.amount`, unitPrice * exchangeRate);
    calculateServiceSubtotal();
  };

  const calculateTotalUnitQty = (index: number) => {
    const qty = watch(`salesOrderItems.${index}.qty`);
    const unitQty = watch(`salesOrderItems.${index}.unitQty`);
    setValue(`salesOrderItems.${index}.totalUnitQty`, qty * unitQty);
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
        {salesQuoteDocNo ? (
          <TextField
            disabled
            InputLabelProps={{
              shrink: true,
            }}
            label="Sales Quote No"
            {...register("salesQuoteDocNo", {
              value: salesQuoteDocNo,
            })}
          />
        ) : null}
        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <Autocomplete
              {...register("customerCode")}
              options={(customerList.data?.data || []).map((item) =>
                pick(item, ["customerCode", "name"])
              )}
              onChange={(_, value) => {
                setValue("customerCode", value.customerCode, {
                  shouldDirty: true,
                  shouldValidate: true,
                  shouldTouch: true,
                });
              }}
              disableClearable
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(opt, value) =>
                opt.customerCode === value.customerCode
              }
              renderInput={(params) => (
                <TextField {...params} label="Customer" />
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
          <Grid item md={2} xs={6}>
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
          </Grid>
        </Grid>

        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={3} xs={6}>
            <TextField
              {...register("poNumber")}
              label="Customer PO No."
              fullWidth
            />
          </Grid>
          <Grid item md={2} xs={6}>
            <TextField
              {...register("poDate", { valueAsDate: true })}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              defaultValue={format(new Date(), "yyyy-MM-dd")}
              label="PO Date"
            ></TextField>
          </Grid>

          <Grid item md={2} xs={6}>
            <TextField
              fullWidth
              label="PO Notes"
              multiline
              rows={2}
              {...register("poNotes")}
              value={watch("poNotes")}
            ></TextField>
          </Grid>
        </Grid>
      </Paper>

      {watch("customerCode") ? (
        <>
          <Grid container gap={2} sx={{ pt: 3 }}>
            <Grid item md={4} xs={12}>
              <TextField
                {...register("date", { valueAsDate: true })}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                defaultValue={format(new Date(), "yyyy-MM-dd")}
                label="Transaction Date"
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("dueDate", { valueAsDate: true })}
                fullWidth
                defaultValue={format(
                  addDays(new Date(), selectedCustomer.data?.data?.top || 30),
                  "yyyy-MM-dd"
                )}
                label="Delivery Date"
              ></TextField>
            </Grid>
          </Grid>
          <Grid container gap={2} sx={{ pt: 2 }}>
            <Grid item md={4} xs={12}>
              <Autocomplete
                options={(portList.data?.data || []).map((item) => ({
                  id: item.portCode,
                  label: item.name,
                }))}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                disableClearable
                onChange={(_, value) => {
                  setValue("portCode", value.id, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                  setValue("shipTo", value.label, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Ship to Port" />
                )}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <Autocomplete
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
              />
            </Grid>
          </Grid>
          <Grid container gap={2} sx={{ pt: 2 }}>
            <Grid item md={4} xs={12}>
              <Autocomplete
                disablePortal
                options={(warehouseList.data?.data || []).map((item) =>
                  pick(item, ["warehouseCode", "name"])
                )}
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
                  <TextField {...params} label="Ship From Warehouse" />
                )}
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
                  {salesOrderItems.fields.map((item, index) => (
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
                          getOptionLabel={(option) => option.name}
                          onChange={(_, value) => {
                            // setProductItems((state) => {
                            //   const newState = [...state];
                            //   newState[index] = {
                            //     ...newState[index],
                            //     packagings: value.packagings,
                            //   };
                            //   return newState;
                            // });

                            salesOrderItems.update(index, {
                              ...salesOrderItems.fields[index],
                              productCode: value.productCode,
                              unitPrice: value.productPrices[0]?.unitPrice || 0,
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
                          {...register(`salesOrderItems.${index}.desc`)}
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
                            value={watch(`salesOrderItems.${index}.qty`)}
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
                            productList.data?.data.find(
                              (item) =>
                                item.productCode ===
                                salesOrderItems.fields[index].productCode
                            )?.packagings!
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.packagingCode === value.packagingCode
                          }
                          getOptionLabel={(option) => {
                            return option.packagingCode;
                          }}
                          placeholder="Packaging"
                          onChange={(_, value) => {
                            setValue(
                              `salesOrderItems.${index}.packagingCode`,
                              value.packagingCode
                            );
                            setValue(
                              `salesOrderItems.${index}.unitCode`,
                              value.unitCode
                            );
                            setValue(
                              `salesOrderItems.${index}.unitQty`,
                              value.unitQty
                            );
                            setValue(
                              `salesOrderItems.${index}.unitQty`,
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
                          value={watch(`salesOrderItems.${index}.unitPrice`)}
                          placeholder="Unit Price"
                          onValueChange={(value) => {
                            setValue(
                              `salesOrderItems.${index}.unitPrice`,
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
                          value={watch(`salesOrderItems.${index}.totalUnitQty`)}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}>
                        <TextField
                          disabled
                          fullWidth
                          placeholder="Unit"
                          contentEditable={false}
                          size="small"
                          value={watch(`salesOrderItems.${index}.unitCode`)}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}>
                        <TextFieldNumber
                          fullWidth
                          size="small"
                          placeholder="Amount"
                          contentEditable={false}
                          value={watch(`salesOrderItems.${index}.amount`)}
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
          <Grid container sx={{ my: 2 }}>
            <Typography sx={{ py: 2 }} variant="h3">
              Services
            </Typography>
            <TableContainer sx={{ width: "100%" }}>
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
                  {salesOrderServices.fields.map((item, index) => (
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
                              `salesOrderServices.${index}.serviceCode`,
                              value.serviceCode
                            );
                            setValue(
                              `salesOrderServices.${index}.unitPrice`,
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
                          {...register(`salesOrderServices.${index}.desc`)}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}>
                        <TextFieldNumber
                          fullWidth
                          size="small"
                          value={watch(`salesOrderServices.${index}.unitPrice`)}
                          onValueChange={(value) => {
                            setValue(
                              `salesOrderServices.${index}.unitPrice`,
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
                          value={watch(`salesOrderServices.${index}.amount`)}
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
            </TableContainer>
            <Button
              variant="outlined"
              onClick={handleAddMoreService}
              sx={{ mt: 1 }}
              startIcon={<AddIcon fontSize="small" />}
            >
              Add More
            </Button>
            <Grid item xs={12} mt={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h4">Service Subtotal</Typography>
                <Typography variant="h4">
                  {formatMoney(watch("totalService"))}
                </Typography>
              </Box>
            </Grid>
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
                  <Autocomplete
                    sx={{ ml: 4, width: 200 }}
                    size="small"
                    options={taxList.data?.data || []}
                    onChange={(_, value) => {
                      setValue("taxCode", value.taxCode);
                      setValue("taxRate", value.taxRate);

                      calculateTotalAmount();
                    }}
                    disableClearable
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(opt, value) =>
                      opt.taxCode === value.taxCode
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Select Tax" />
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
                disabled={createSalesOrder.isLoading}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                disabled={createSalesOrder.isLoading}
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
