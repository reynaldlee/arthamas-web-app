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
import { salesQuoteSchema } from "src/server/routers/salesQuote";
import { pick } from "lodash";
import { addDays, format } from "date-fns";
import { Prisma } from "@prisma/client";
import { DatePicker } from "@mui/x-date-pickers";
import Edit from "@mui/icons-material/Edit";

type SalesQuoteFormValues = z.infer<typeof salesQuoteSchema>;

type QueryParam = {
  docNo: string;
};

export default function SalesQuotesDetail() {
  const router = useRouter();
  const { docNo } = router.query as QueryParam;

    const { data: salesQuote } = trpc.salesQuote.find.useQuery(docNo, {
        enabled: !!docNo,
        trpc: {}
    });

  const { register, watch, setValue, handleSubmit, control, reset } =
    useForm<SalesQuoteFormValues>();

  const customerList = trpc.customer.findAll.useQuery();
  const currencyList = trpc.currency.findAll.useQuery();
  const portList = trpc.port.findAll.useQuery();
  const taxList = trpc.tax.findAll.useQuery();
  const serviceList = trpc.service.findAll.useQuery();
  const warehouseList = trpc.warehouse.findAll.useQuery();

  const selectedCustomerCode = watch("customerCode");
  const selectedVesselCode = watch("vesselCode");
  const selectedPortCode = watch("portCode");

  const productList = trpc.product.findByVesselAndPort.useQuery(
    { vesselCode: selectedVesselCode, portCode: selectedPortCode },
      {
          enabled: !!selectedVesselCode,
          trpc: {}
      }
  );

  const createSalesQuote = trpc.salesQuote.update.useMutation({
    onError: (err) => {
      console.log(err);
    },
    onSuccess: () => {
      router.push("/sales/quotes");
    },
  });

  useEffect(() => {
    if (salesQuote?.data) {
      reset(salesQuote.data as any);
    }
  }, [salesQuote, reset]);

  const salesQuoteItems = useFieldArray({
    name: "salesQuoteItems",
    control: control,
  });

  const salesQuoteServices = useFieldArray({
    name: "salesQuoteServices",
    control: control,
  });

  const selectedCustomer = trpc.customer.find.useQuery(
    selectedCustomerCode,
      {
          enabled: !!selectedCustomerCode,
          trpc: {}
      }
  );

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      router.back();
    }
  };

  const onSubmit = (data: SalesQuoteFormValues) => {
    createSalesQuote.mutate({
      docNo: salesQuote?.data?.docNo,
      fields: data,
    });
  };

  // const handleAddMoreProduct = () => {
  //   salesQuoteItems.append({
  //     lineNo: salesQuoteItems.fields.length + 1,
  //     desc: "",
  //     qty: 1,
  //     productCode: "",
  //     amount: 0,
  //     unitCode: "",
  //     unitQty: 0,
  //     totalUnitQty: 0,
  //     unitPrice: 0,
  //     packagingCode: "",
  //   });
  // };

  // const handleAddMoreService = () => {
  //   salesQuoteServices.append({
  //     serviceCode: "",
  //     amount: 0,
  //     desc: "",
  //     unitPrice: 0,
  //   });
  // };

  // const handleRemoveProduct = (index: number) => {
  //   salesQuoteItems.remove(index);
  //   calculateProductSubtotal();
  // };

  // const handleRemoveService = (index: number) => {
  //   salesQuoteServices.remove(index);
  //   calculateServiceSubtotal();
  // };

  const handleProductQtyChange = (index: number) => (value: number) => {
    const unitQty = watch(`salesQuoteItems.${index}.unitQty`);
    setValue(`salesQuoteItems.${index}.qty`, value);
    setValue(`salesQuoteItems.${index}.totalUnitQty`, value * unitQty);
    calculateProductAmount(index);
  };

  const calculateProductsAmount = () => {
    salesQuoteItems.fields.forEach((_, index) => {
      calculateProductAmount(index);
    });
  };

  const calculateServicesAmount = () => {
    salesQuoteServices.fields.forEach((_, index) => {
      calculateServiceAmount(index);
    });
    calculateServiceSubtotal();
  };

  const calculateServiceSubtotal = () => {
    const servicesSubtotal = _.sumBy(
      watch("salesQuoteServices"),
      (o) => o.amount
    );
    setValue("totalService", servicesSubtotal);
    calculateTotalAmount();
  };

  const calculateProductSubtotal = () => {
    const productSubtotal = _.sumBy(watch("salesQuoteItems"), (o) => o.amount);
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
    const totalUnitQty = watch(`salesQuoteItems.${index}.totalUnitQty`);
    const unitPrice = watch(`salesQuoteItems.${index}.unitPrice`);
    const exchangeRate = watch("exchangeRate");
    setValue(
      `salesQuoteItems.${index}.amount`,
      totalUnitQty * unitPrice * exchangeRate
    );
    calculateProductSubtotal();
  };

  const calculateServiceAmount = (index: number) => {
    const unitPrice = watch(`salesQuoteServices.${index}.unitPrice`);
    const exchangeRate = watch("exchangeRate");
    setValue(`salesQuoteServices.${index}.amount`, unitPrice * exchangeRate);
    calculateServiceSubtotal();
  };

  const calculateTotalUnitQty = (index: number) => {
    const qty = watch(`salesQuoteItems.${index}.qty`);
    const unitQty = watch(`salesQuoteItems.${index}.unitQty`);
    setValue(`salesQuoteItems.${index}.totalUnitQty`, qty * unitQty);
    calculateProductsAmount();
  };

  return (
    <MainLayout>
      <Paper sx={{ p: 2 }}>
        {/* <Box sx={{ py: 2 }}>
          <PageHeader title="Create Sales Inquiries"></PageHeader>
        </Box> */}
        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <Autocomplete
              disabled
              {...register("customerCode")}
              options={(customerList.data?.data || []).map((item) =>
                pick(item, ["customerCode", "name"])
              )}
              value={pick(
                customerList.data?.data.find((item) => {
                  return item.customerCode === selectedCustomerCode;
                }),
                ["customerCode", "name"]
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
              disabled
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
              disabled
              value={watch("exchangeRate")}
              onValueChange={(value) => {
                setValue("exchangeRate", value);
                calculateProductsAmount();
                calculateServicesAmount();
              }}
            ></TextFieldNumber>
          </Grid>
        </Grid>
      </Paper>

      {watch("customerCode") ? (
        <>
          <Grid container gap={2} sx={{ pt: 3 }}>
            <Grid item md={4} xs={12}>
              <DatePicker
                disabled
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
                disabled
                onChange={(value) => {
                  setValue("validUntil", value!);
                }}
                label="Quotation Valid Until"
                value={watch("validUntil")}
                renderInput={(params) => <TextField {...params} required />}
              />
            </Grid>
          </Grid>
          <Grid container gap={2} sx={{ pt: 2 }}>
            <Grid item md={4} xs={12}>
              <Autocomplete
                disabled
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
                value={
                  portList.data?.data
                    .filter((item) => item.portCode === selectedPortCode)
                    .map((item) => ({ id: item.portCode, label: item.name }))[0]
                }
                renderInput={(params) => (
                  <TextField {...params} label="Ship to Port" />
                )}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <Autocomplete
                disabled
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
                value={pick(
                  selectedCustomer.data?.data?.vessels.find(
                    (item) => item.vesselCode === selectedVesselCode
                  ),
                  ["vesselCode", "name"]
                )}
              />
            </Grid>
          </Grid>
          <Grid container gap={2} sx={{ pt: 2 }}>
            <Grid item md={4} xs={12}>
              <Autocomplete
                disabled
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
                value={pick(
                  (warehouseList.data?.data || []).find(
                    (item) => item.warehouseCode === watch("warehouseCode")
                  ),
                  ["warehouseCode", "name"]
                )}
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
                  {salesQuoteItems.fields.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ padding: 0.5 }}>
                        <Autocomplete
                          disabled
                          fullWidth
                          disableClearable
                          options={(productList.data?.data || []).map(
                            (item) => item
                          )}
                          isOptionEqualToValue={(opt, value) =>
                            opt.productCode === value.productCode
                          }
                          value={pick(
                            productList.data?.data?.find(
                              (item) =>
                                item.productCode ===
                                watch(`salesQuoteItems.${index}.productCode`)
                            ),
                            ["productCode", "name"]
                          )}
                          getOptionLabel={(option) => option.name}
                          onChange={(_, value) => {
                            salesQuoteItems.update(index, {
                              ...salesQuoteItems.fields[index],
                              productCode: value.productCode,
                              unitPrice: value.productPrices[0]?.unitPrice || 0,
                              qty: new Prisma.Decimal(1),
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
                          disabled
                          fullWidth
                          multiline
                          size="small"
                          placeholder="Description"
                          {...register(`salesQuoteItems.${index}.desc`)}
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
                            disabled
                            size="small"
                            onValueChange={handleProductQtyChange(index)}
                            placeholder="Qty"
                            value={watch(`salesQuoteItems.${index}.qty`)}
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}>
                        <Autocomplete
                          fullWidth
                          size="small"
                          disabled
                          disableClearable
                          options={
                            productList.data?.data.find(
                              (item) =>
                                item.productCode ===
                                salesQuoteItems.fields[index].productCode
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
                              `salesQuoteItems.${index}.packagingCode`,
                              value.packagingCode
                            );
                            setValue(
                              `salesQuoteItems.${index}.unitCode`,
                              value.unitCode
                            );
                            setValue(
                              `salesQuoteItems.${index}.unitQty`,
                              value.unitQty
                            );
                            setValue(
                              `salesQuoteItems.${index}.unitQty`,
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
                          disabled
                          size="small"
                          fullWidth
                          value={watch(`salesQuoteItems.${index}.unitPrice`)}
                          placeholder="Unit Price"
                          onValueChange={(value) => {
                            setValue(
                              `salesQuoteItems.${index}.unitPrice`,
                              value
                            );
                            calculateProductAmount(index);
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ padding: 0.5 }}>
                        <TextFieldNumber
                          fullWidth
                          disabled
                          contentEditable={false}
                          size="small"
                          placeholder="Volume"
                          readOnly
                          value={watch(`salesQuoteItems.${index}.totalUnitQty`)}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}>
                        <TextField
                          disabled
                          fullWidth
                          placeholder="Unit"
                          contentEditable={false}
                          size="small"
                          value={watch(`salesQuoteItems.${index}.unitCode`)}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}>
                        <TextFieldNumber
                          fullWidth
                          disabled
                          size="small"
                          placeholder="Amount"
                          contentEditable={false}
                          value={watch(`salesQuoteItems.${index}.amount`)}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

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
                  {salesQuoteServices.fields.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ padding: 0.5 }}>
                        <Autocomplete
                          fullWidth
                          disabled
                          options={serviceList.data?.data || []}
                          isOptionEqualToValue={(opt, value) =>
                            opt.serviceCode === value.serviceCode
                          }
                          disableClearable
                          getOptionLabel={(option) => option.name}
                          onChange={(_, value) => {
                            setValue(
                              `salesQuoteServices.${index}.serviceCode`,
                              value?.serviceCode!
                            );
                            setValue(
                              `salesQuoteServices.${index}.unitPrice`,
                              value?.unitPrice!
                            );
                            calculateServiceAmount(index);
                          }}
                          value={(serviceList.data?.data || []).find(
                            (item) =>
                              item.serviceCode ===
                              watch(`salesQuoteServices.${index}.serviceCode`)
                          )}
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
                          disabled
                          fullWidth
                          multiline
                          size="small"
                          placeholder="Description"
                          {...register(`salesQuoteServices.${index}.desc`)}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}>
                        <TextFieldNumber
                          fullWidth
                          disabled
                          size="small"
                          value={watch(`salesQuoteServices.${index}.unitPrice`)}
                          onValueChange={(value) => {
                            setValue(
                              `salesQuoteServices.${index}.unitPrice`,
                              value
                            );
                            calculateServiceAmount(index);
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ padding: 0.5 }}>
                        <TextFieldNumber
                          fullWidth
                          disabled
                          contentEditable={false}
                          size="small"
                          name="amount"
                          readOnly
                          value={watch(`salesQuoteServices.${index}.amount`)}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: 0.5 }}></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

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
                disabled
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
                  <Typography variant="h4">Tax</Typography>
                  <Autocomplete
                    disabled
                    sx={{ ml: 4, width: 200 }}
                    size="small"
                    options={taxList.data?.data || []}
                    onChange={(_, value) => {
                      setValue("taxCode", value.taxCode);
                      setValue("taxRate", value.taxRate);
                      calculateTotalAmount();
                    }}
                    value={(taxList.data?.data || []).find(
                      (item) => item.taxCode === watch("taxCode")
                    )}
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
                <Typography variant="h4">
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
                disabled={createSalesQuote.isLoading}
              >
                Back
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                disabled={createSalesQuote.isLoading}
                startIcon={<Edit />}
                onClick={() => {
                  router.push(`/sales/quotes/${docNo}/edit`);
                }}
              >
                Edit
              </Button>
            </Grid>
          </Grid>
        </>
      ) : null}
    </MainLayout>
  );
}
