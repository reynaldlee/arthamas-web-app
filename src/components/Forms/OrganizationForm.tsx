import { Box, Button, Input, TextField, Typography } from "@mui/material";

import { SubmitHandler, useForm } from "react-hook-form";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";

export type OrgFormValues = {
  orgCode: string;
  name: string;
  address: string;
  code: string;
};
export type OrgFormSubmitHandler<T> = SubmitHandler<T>;

type OrgFormProps = {
  onSubmit: OrgFormSubmitHandler<OrgFormValues>;
  defaultValues?: Partial<OrgFormValues>;
  isEdit?: boolean;
};

export default function OrganizationForm({
  onSubmit,
  isEdit,
  defaultValues,
}: OrgFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, dirtyFields, isDirty },
  } = useForm<OrgFormValues>({
    defaultValues: defaultValues,
  });

  const submit: OrgFormSubmitHandler<OrgFormValues> = (data) => {
    if (isEdit) {
      const dirtyValues = Object.fromEntries(
        Object.keys(dirtyFields).map((key) => [
          key,
          data[key as keyof OrgFormValues],
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
