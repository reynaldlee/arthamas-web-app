import { ReactElement } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import OrganizationForm, {
  OrgFormValues,
} from "@/components/forms/OrganizationForm";
import type { OrgFormSubmitHandler } from "@/components/forms/OrganizationForm";
import { FormHelperText, Typography } from "@mui/material";

export default function OrganizationCreatePage() {
  const router = useRouter();

  const {
    mutate: submit,
    error,
    isError,
  } = trpc.useMutation(["org.create"], {
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
