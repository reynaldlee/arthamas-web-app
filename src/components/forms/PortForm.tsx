import { Box, Button, Input, TextField, Typography } from "@mui/material";

import { SubmitHandler, useForm } from "react-hook-form";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";

export type PortFormValues = {
  portCode: string;
  name: string;
  address: string;
  area: string;
};
export type PortFormSubmitHandler<T> = SubmitHandler<T>;

type PortFormProps = {
  onSubmit: PortFormSubmitHandler<PortFormValues>;
  defaultValues?: Partial<PortFormValues>;
  isEdit?: boolean;
};

export default function OrganizationForm({
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
        orgCode: data.orgCode,
        ...(dirtyValues as any),
      });
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Organization Code"
          {...register("orgCode")}
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
        <TextField label="Alias" {...register("code")} required></TextField>
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
