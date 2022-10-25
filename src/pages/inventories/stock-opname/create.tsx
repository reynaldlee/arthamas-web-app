import { useMemo, useState } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import _, { difference } from "lodash";
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

import QrCodeIcon from "@mui/icons-material/QrCode";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { pick } from "lodash";
import { stockTransferSchema } from "src/server/routers/stockTransfer";
import { DatePicker } from "@mui/x-date-pickers";
import MUIDataTable from "mui-datatables";
import { setDate } from "date-fns/esm";

type StockTransferFormValues = z.infer<typeof stockTransferSchema>;

export default function StockOpnameCreate() {
  const router = useRouter();

  const stockTransferForm = useForm<StockTransferFormValues>();

  const stockTransferItems = useFieldArray({
    name: "stockTransferItems",
    control: stockTransferForm.control,
  });

  const [data, setData] = useState<any>([]);

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

  const handleBarcodeScan = (evt: KeyboardEvent<HTMLInputElement>) => {
    // evt.preventDefault();

    if (evt.key === "Enter" || evt.keyCode === 13) {
      // Do something

      if (evt.currentTarget.value === "11111") {
        const currentDataIndex = data.findIndex(
          (item) => item.barcode === evt.target.value
        );
        console.log("currentDataIndex", currentDataIndex);

        if (currentDataIndex === -1) {
          setData((state) => [
            ...state,
            {
              barcode: "11111",
              productName: "ATLANTA MARINE D 3005",
              packagingCode: "DRUM",
              qtyCounted: 1,
              qtyOnHand: 10,
              difference: -9,
            },
          ]);
        } else {
          setData((state) => {
            console.log("currentState", state);
            console.log("aaa", state[currentDataIndex]);

            const newData = {
              ...state[currentDataIndex],
              qtyCounted: (state[currentDataIndex].qtyCounted || 0) + 1,
              qtyOnHand: 10,
              difference: (state[currentDataIndex].qtyCounted || 0) + 1 - 10,
            };

            const newState = [...state];
            return newState.map((item) => {
              if (newData.productName === item.productName) {
                return newData;
              } else {
                return item;
              }
            });
          });
        }

        evt.currentTarget.value = "";
      } else if (evt.currentTarget.value === "00000") {
        const currentDataIndex = data.findIndex(
          (item) => item.barcode === evt.target.value
        );

        if (currentDataIndex === -1) {
          setData((state) => [
            ...state,
            {
              barcode: "00000",
              productName: "AURELIA TI 3030",
              packagingCode: "DRUM",
              qtyCounted: 1,
              qtyOnHand: 5,
              difference: -4,
            },
          ]);
        } else {
          setData((state) => {
            const newData = {
              ...state[currentDataIndex],
              qtyCounted: (state[currentDataIndex].qtyCounted || 0) + 1,
              qtyOnHand: 5,
              difference: (state[currentDataIndex].qtyCounted || 0) + 1 - 5,
            };

            const newState = [...state];
            return newState.map((item) => {
              if (newData.productName === item.productName) {
                return newData;
              } else {
                return item;
              }
            });
          });
        }

        evt.currentTarget.value = "";
      } else {
        alert("Barcode tidak ditemukan atau salah");
      }
    }
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
      <Box>
        <Typography variant="h2">New Stock Opname</Typography>
      </Box>
      <Paper sx={{ p: 2 }}>
        <Grid container gap={2} sx={{ pt: 2 }}>
          <Grid item md={4} xs={12}>
            <TextField
              {...stockTransferForm.register("driverName")}
              value={stockTransferForm.watch("driverName")}
              InputLabelProps={{
                shrink: true,
              }}
              label="Title"
              fullWidth
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Autocomplete
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
                <TextField {...params} label="Warehouse" />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {stockTransferForm.watch("fromWarehouseCode") ? (
        <>
          <Grid container gap={2} sx={{ pt: 3 }}>
            <Grid item md={2} xs={12}>
              <DatePicker
                onChange={(value) => {
                  stockTransferForm.setValue("date", value!);
                }}
                minDate={new Date()}
                label="Opname Date"
                value={stockTransferForm.watch("date")}
                renderInput={(params) => <TextField {...params} required />}
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

          <Box mt={2}>
            <Typography variant="h2">SCANNED PRODUCTS</Typography>
            <Grid container alignItems={"center"}>
              <Grid item>
                <TextField
                  sx={{ my: 2 }}
                  placeholder="Product Barcode"
                  inputProps={{
                    onKeyDown: handleBarcodeScan,
                  }}
                  InputProps={{
                    endAdornment: <QrCodeIcon />,
                  }}
                ></TextField>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => {
                    if (window.confirm("Ulangi Proses stock opname?")) {
                      setData([]);
                    }
                  }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>

            <MUIDataTable
              title=" "
              data={data}
              options={{
                search: false,
                download: false,
                filter: false,
                sort: false,
                print: false,
              }}
              columns={[
                {
                  name: "productName",
                  label: "Product Name",
                },
                {
                  name: "packagingCode",
                  label: "Packaging",
                },
                {
                  name: "qtyOnHand",
                  label: "Qty On Hand",
                },
                {
                  name: "qtyCounted",
                  label: "Qty Counted",
                },
                {
                  name: "difference",
                  label: "Difference",
                },
              ]}
            />
          </Box>

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
