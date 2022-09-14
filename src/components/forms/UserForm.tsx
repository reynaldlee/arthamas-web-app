import { trpc } from "@/utils/trpc";
import { Autocomplete, Box, Button, TextField } from "@mui/material";

import { SubmitHandler, useForm } from "react-hook-form";

export type UserFormValues = {
  id?: string;
  username: string;
  name: string;
  email: string;
  password: string;
  roleId: string;
};
export type UserFormSubmitHandler<T> = SubmitHandler<T>;

type UserFormProps = {
  onSubmit: UserFormSubmitHandler<UserFormValues>;
  defaultValues?: Partial<UserFormValues>;
  isEdit?: boolean;
};

export default function UserForm({
  onSubmit,
  isEdit,
  defaultValues,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, dirtyFields, isDirty },
    setValue,
  } = useForm<UserFormValues>({
    defaultValues: defaultValues,
  });

  const roles = trpc.useQuery(["role.findAll"]);

  const selectedRole = trpc.useQuery(["role.find", defaultValues?.roleId!], {
    enabled: !!roles?.data?.data,
  });

  const submit: UserFormSubmitHandler<UserFormValues> = (data) => {
    if (isEdit) {
      const dirtyValues = Object.fromEntries(
        Object.keys(dirtyFields).map((key) => [
          key,
          data[key as keyof UserFormValues],
        ])
      );

      return onSubmit({
        id: data.id,
        ...(dirtyValues as any),
      });
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField label="Name" {...register("name")} required></TextField>
        <TextField
          label="Username"
          {...register("username")}
          required
        ></TextField>
        <TextField label="Email" {...register("email")} required></TextField>
        <TextField
          label="Password"
          type="password"
          {...register("password")}
          required
        ></TextField>

        <Autocomplete
          options={(roles.data?.data || []).map((item) => ({
            roleId: item.roleId,
            name: item.name,
          }))}
          defaultValue={selectedRole.data?.data}
          getOptionLabel={(option) => `${option.name}`}
          loading={roles.isLoading}
          onChange={(_, value) => {
            setValue("roleId", value?.roleId!, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
          isOptionEqualToValue={(opt, value) => opt.roleId === value.roleId}
          renderInput={(params) => <TextField {...params} label="Role" />}
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
