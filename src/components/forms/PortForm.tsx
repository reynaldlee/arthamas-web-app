import { Box, Button, Input, TextField, Typography } from "@mui/material";

import { SubmitHandler, useForm } from "react-hook-form";

export type PortFormValues = {
  portCode: string;
  name: string;
  address: string | null;
  area: string;
  lat: number | null;
  lng: number | null;
};
export type PortFormSubmitHandler<T> = SubmitHandler<T>;

type PortFormProps = {
  onSubmit: PortFormSubmitHandler<PortFormValues>;
  defaultValues?: Partial<PortFormValues>;
  isEdit?: boolean;
};

export default function PortForm({
  onSubmit,
  isEdit,
  defaultValues,
}: PortFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, dirtyFields, isDirty },
  } = useForm<PortFormValues>({
    defaultValues: defaultValues,
  });

  const submit: PortFormSubmitHandler<PortFormValues> = (data) => {
    if (isEdit) {
      const dirtyValues = Object.fromEntries(
        Object.keys(dirtyFields).map((key) => [
          key,
          data[key as keyof PortFormValues],
        ])
      );

      return onSubmit({
        portCode: data.portCode,
        ...(dirtyValues as any),
      });
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Port Code"
          {...register("portCode")}
          required
          disabled={isEdit}
        ></TextField>
        <TextField label="Name" {...register("name")} required></TextField>
        <TextField
          label="Address"
          {...register("address")}
          multiline
          rows={4}
        ></TextField>
        <TextField label="Area" {...register("area")}></TextField>

        <TextField
          type="number"
          inputProps={{
            step: 0.000001,
          }}
          label="Latitude"
          {...register("lat", {
            valueAsNumber: true,
          })}
        ></TextField>
        <TextField
          type="number"
          label="Longitude"
          inputProps={{
            step: 0.000001,
          }}
          {...register("lng", {
            valueAsNumber: true,
          })}
        ></TextField>
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
