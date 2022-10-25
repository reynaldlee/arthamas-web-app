import { useMemo } from "react";
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

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { pick } from "lodash";
import { stockTransferSchema } from "src/server/routers/stockTransfer";
import { DatePicker } from "@mui/x-date-pickers";

type StockTransferFormValues = z.infer<typeof stockTransferSchema>;

export default function SalesTransferCreate() {
  const router = useRouter();

  const stockTransferForm = useForm<StockTransferFormValues>();

  const stockTransferItems = useFieldArray({
    name: "stockTransferItems",
    control: stockTransferForm.control,
  });

  const createStockTransfer = trpc.stockTransfer.create.useMutation();

  const truckList = trpc.truck.findAll.useQuery();
  const warehouseList = trpc.warehouse.findAll.useQuery();
  const productList = trpc.product.findAll.useQuery();

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      router.back();
    }
  };

  const onSubmit = (data: StockTransferFormValues) => {
    createStockTransfer.mutate(data);
  };

  const handleAddMoreProduct = () => {
    stockTransferItems.append({
      lineNo: stockTransferItems.fields.length + 1,
      productCode: "",
      packagingCode: "",
      totalUnitQty: 0,
      unitCode: "",
      unitQty: 0,
      qty: 0,
    });
  };

  const handleRemoveProduct = (index: number) => {
    stockTransferItems.remove(index);
  };

  return (
    <MainLayout>
      <Paper sx={{ p: 2 }}>
        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <Autocomplete
              //   {...register("customerCode")}
              options={(warehouseList.data?.data || []).map((item) =>
                pick(item, ["warehouseCode", "name"])
              )}
              onChange={(_, value) => {
                stockTransferForm.setValue(
                  "fromWarehouseCode",
                  value.warehouseCode
                );
              }}
              disableClearable
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(opt, value) =>
                opt.warehouseCode === value.warehouseCode
              }
              renderInput={(params) => (
                <TextField {...params} label="From Warehouse" />
              )}
            />
          </Grid>

          <Grid item md={4} xs={6}>
            <Autocomplete
              //   {...register("customerCode")}
              options={(warehouseList.data?.data || []).map((item) =>
                pick(item, ["warehouseCode", "name"])
              )}
              onChange={(_, value) => {
                stockTransferForm.setValue(
                  "toWarehouseCode",
                  value.warehouseCode
                );
              }}
              disableClearable
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(opt, value) =>
                opt.warehouseCode === value.warehouseCode
              }
              renderInput={(params) => (
                <TextField {...params} label="To Warehouse" />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {stockTransferForm.watch("fromWarehouseCode") &&
      stockTransferForm.watch("toWarehouseCode") ? (
        <>
          <Grid container gap={2} sx={{ pt: 3 }}>
            <Grid item md={2} xs={12}>
              <DatePicker
                onChange={(value) => {
                  stockTransferForm.setValue("date", value!);
                }}
                minDate={new Date()}
                label="Transfer Date"
                value={stockTransferForm.watch("date")}
                renderInput={(params) => <TextField {...params} required />}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <Autocomplete
                options={(truckList.data?.data || []).map((item) =>
                  pick(item, ["truckCode", "policeNumber"])
                )}
                onChange={(_, value) => {
                  stockTransferForm.setValue("truckCode", value.truckCode);
                }}
                disableClearable
                getOptionLabel={(option) => option.policeNumber}
                isOptionEqualToValue={(opt, value) =>
                  opt.truckCode === value.truckCode
                }
                renderInput={(params) => (
                  <TextField {...params} label="Truck" />
                )}
              />
            </Grid>
          </Grid>
          <Grid container gap={2} sx={{ pt: 3 }}>
            <Grid item md={4} xs={12}>
              <TextField
                {...stockTransferForm.register("driverName")}
                value={stockTransferForm.watch("driverName")}
                InputLabelProps={{
                  shrink: true,
                }}
                label="Driver Name"
                fullWidth
              />
            </Grid>
          </Grid>

          <Grid container gap={2} sx={{ pt: 3 }}>
            <Grid item md={4} xs={12}>
              <TextField
                {...stockTransferForm.register("notes")}
                value={stockTransferForm.watch("notes")}
                InputLabelProps={{
                  shrink: true,
                }}
                label="Notes"
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
                    <TableCell sx={{ width: 25 }}>Qty</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Packaging</TableCell>
                    <TableCell sx={{ width: 100 }}>Volume</TableCell>
                    <TableCell sx={{ width: 70 }}>Unit</TableCell>
                    <TableCell sx={{ minWidth: 20 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockTransferItems.fields.map((item, index) => (
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
                            stockTransferItems.update(index, {
                              ...stockTransferItems.fields[index],
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

                      <TableCell padding="none">
                        <Box
                          display="flex"
                          flexDirection={"row"}
                          alignItems={"center"}
                        >
                          <TextFieldNumber
                            fullWidth
                            size="small"
                            placeholder="Qty"
                            onValueChange={(value) => {
                              stockTransferForm.setValue(
                                `stockTransferItems.${index}.totalUnitQty`,
                                value *
                                  stockTransferForm.watch(
                                    `stockTransferItems.${index}.unitQty`
                                  )
                              );
                            }}
                            value={stockTransferForm.watch(
                              `stockTransferItems.${index}.qty`
                            )}
                          />
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
                                stockTransferItems.fields[index].productCode
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
                            stockTransferForm.setValue(
                              `stockTransferItems.${index}.packagingCode`,
                              value.packagingCode
                            );
                            stockTransferForm.setValue(
                              `stockTransferItems.${index}.unitCode`,
                              value.unitCode
                            );
                            stockTransferForm.setValue(
                              `stockTransferItems.${index}.unitQty`,
                              value.unitQty
                            );
                            stockTransferForm.setValue(
                              `stockTransferItems.${index}.totalUnitQty`,
                              value.unitQty *
                                stockTransferForm.watch(
                                  `stockTransferItems.${index}.qty`
                                )
                            );
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
                          fullWidth
                          contentEditable={false}
                          size="small"
                          placeholder="Volume"
                          readOnly
                          value={stockTransferForm.watch(
                            `stockTransferItems.${index}.totalUnitQty`
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
                          value={stockTransferForm.watch(
                            `stockTransferItems.${index}.unitCode`
                          )}
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
              Add Product
            </Button>
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
                disabled={createStockTransfer.isLoading}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                disabled={createStockTransfer.isLoading}
                startIcon={<SaveAltOutlinedIcon />}
                onClick={stockTransferForm.handleSubmit(onSubmit)}
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
