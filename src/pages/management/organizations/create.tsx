import { ReactElement } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import OrganizationForm, {
  OrgFormValues,
} from "@/components/Forms/OrganizationForm";
import type { OrgFormSubmitHandler } from "@/components/Forms/OrganizationForm";
import { FormHelperText, Typography } from "@mui/material";

export default function OrganizationCreatePage() {
  const router = useRouter();

  const {
    mutate: submit,
    error,
    isError,
  } = trpc.org.create.useMutation({
    onSuccess: () => {
      router.push("/management/organizations");
    },
  });

  const onSave: OrgFormSubmitHandler<OrgFormValues> = (data) => {
    submit(data);
  };

  return (
    <MainLayout>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create New Organization
      </Typography>

      <OrganizationForm onSubmit={onSave}></OrganizationForm>
      <FormHelperText error={isError}>{error?.message}</FormHelperText>
    </MainLayout>
  );
}
