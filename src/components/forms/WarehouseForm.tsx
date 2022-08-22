import { trpc } from "@/utils/trpc";
import {
  Autocomplete,
  Box,
  Button,
  Input,
  TextField,
  Typography,
} from "@mui/material";

import { SubmitHandler, useForm } from "react-hook-form";

export type WarehouseFormValues = {
  warehouseCode: string;
  name: string;
  phone?: string;
  address?: string;
  area: {
    areaCode: string;
    areaName: string;
  } | null;
};

export type WarehouseFormSubmitHandler<T> = SubmitHandler<T>;

type WarehouseFormProps = {
  onSubmit: WarehouseFormSubmitHandler<WarehouseFormValues>;
  defaultValues?: Partial<WarehouseFormValues>;
  isEdit?: boolean;
};

export default function WarehouseForm({
  onSubmit,
  isEdit,
  defaultValues,
}: WarehouseFormProps) {
  const areaData = trpc.useQuery(["area.findAll"]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, dirtyFields, isDirty },
  } = useForm<WarehouseFormValues>({
    defaultValues: defaultValues,
  });

  const submit: WarehouseFormSubmitHandler<WarehouseFormValues> = (data) => {
    if (isEdit) {
      const dirtyValues = Object.fromEntries(
        Object.keys(dirtyFields).map((key) => [
          key,
          data[key as keyof WarehouseFormValues],
        ])
      );

      return onSubmit({
        warehouseCode: data.warehouseCode,
        ...(dirtyValues as any),
      });
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Warehouse Code"
          {...register("warehouseCode")}
          required
          disabled={isEdit}
        ></TextField>
        <TextField label="Name" {...register("name")} required></TextField>
        <TextField label="Phone" {...register("phone")}></TextField>
        <TextField
          label="Address"
          {...register("address")}
          multiline
          rows={4}
        ></TextField>
        <Autocomplete
          options={(areaData.data?.data || []).map((item) => ({
            areaCode: item.areaCode,
            areaName: item.areaName,
          }))}
          defaultValue={defaultValues?.area}
          getOptionLabel={(option) => `${option.areaCode} - ${option.areaName}`}
          loading={areaData.isLoading}
          onChange={(_, value) => {
            setValue("area", value, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
          isOptionEqualToValue={(opt, value) => opt.areaCode === value.areaCode}
          renderInput={(params) => <TextField {...params} label="Area" />}
        ></Autocomplete>
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
