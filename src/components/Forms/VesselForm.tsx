import { trpc } from "@/utils/trpc";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Input,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import { SubmitHandler, useForm } from "react-hook-form";
import { vesselSchema } from "src/server/routers/vessel";
import { z } from "zod";

export type VesselFormValues = z.infer<typeof vesselSchema>;
export type VesselFormSubmitHandler<T> = SubmitHandler<T>;

type VesselFormProps = {
  onSubmit: VesselFormSubmitHandler<VesselFormValues>;
  defaultValues?: Partial<VesselFormValues>;
  isEdit?: boolean;
};

export default function VesselForm({
  onSubmit,
  isEdit,
  defaultValues,
}: VesselFormProps) {
  const customerData = trpc.customer.findAll.useQuery();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting, dirtyFields, isDirty },
  } = useForm<VesselFormValues>({
    defaultValues: defaultValues,
  });

  const selectedCustomer = trpc.customer.find.useQuery(
    watch("customerCode"),
      {
          enabled: !!watch("customerCode"),
          trpc: {}
      }
  );

  const submit: VesselFormSubmitHandler<VesselFormValues> = (data) => {
    if (isEdit) {
      const dirtyValues = Object.fromEntries(
        Object.keys(dirtyFields).map((key) => [
          key,
          data[key as keyof VesselFormValues],
        ])
      );

      return onSubmit({
        vesselCode: data.vesselCode,
        ...(dirtyValues as any),
      });
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Vessel Code"
          {...register("vesselCode")}
          required
          disabled={isEdit}
        ></TextField>
        <Autocomplete
          options={(customerData.data?.data || []).map((item) => ({
            customerCode: item.customerCode,
            name: item.name,
          }))}
          value={{
            customerCode: selectedCustomer.data?.data?.customerCode,
            name: selectedCustomer.data?.data?.name,
          }}
          getOptionLabel={(option) => `${option.name}`}
          loading={customerData.isLoading}
          onChange={(_, value) => {
            setValue("customerCode", value?.customerCode!, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
          isOptionEqualToValue={(opt, value) =>
            opt.customerCode === value.customerCode
          }
          renderInput={(params) => <TextField {...params} label="Customer" />}
        ></Autocomplete>
        <TextField label="Name" {...register("name")} required></TextField>
        <TextField label="Vessel Type" {...register("vesselType")}></TextField>
        <TextField
          label="Registration No"
          {...register("regNo")}
          required
        ></TextField>
        <TextField label="IMO Number" {...register("imoNumber")}></TextField>
        <TextField label="TEUS" {...register("teus")}></TextField>

        <FormControlLabel
          label="Enable All Products"
          control={
            <Switch
              checked={!!watch("isAllProduct")}
              onChange={(e) => {
                setValue("isAllProduct", e.target.checked, {
                  shouldDirty: true,
                });
              }}
            />
          }
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 2 }}
        disabled={isSubmitting || !isDirty}
      >
        {isEdit ? "Update" : "Submit"}
      </Button>
    </form>
  );
}
