import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import UserForm, { UserFormValues } from "@/components/Forms/UserForm";
import type { UserFormSubmitHandler } from "@/components/Forms/UserForm";
import { FormHelperText, Typography } from "@mui/material";

export default function UserCreate() {
  const router = useRouter();

  const {
    mutate: submit,
    error,
    isError,
  } = trpc.user.create.useMutation({
    onSuccess: () => {
      router.push("/management/users");
    },
  });

  const onSave: UserFormSubmitHandler<UserFormValues> = (data) => {
    submit(data);
  };

  return (
    <MainLayout>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create New User
      </Typography>

      <UserForm onSubmit={onSave}></UserForm>
      <FormHelperText error={isError}>{error?.message}</FormHelperText>
    </MainLayout>
  );
}
