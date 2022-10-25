import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import OrganizationForm from "@/components/Forms/OrganizationForm";
import type {
  OrgFormSubmitHandler,
  OrgFormValues,
} from "@/components/Forms/OrganizationForm";
import { FormHelperText, Typography } from "@mui/material";

type RouterQuery = {
  id: string;
};

export default function OrganizationEditPage() {
  const router = useRouter();
  const { id } = router.query as RouterQuery;

  const { data } = trpc.org.find.useQuery(id);

  const updateMutatation = trpc.org.update.useMutation({
    onSuccess: () => {
      router.push("/management/organizations");
    },
  });

  const onSubmit: OrgFormSubmitHandler<OrgFormValues> = (data) => {
    updateMutatation.mutate(data);
  };

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Edit Organization
      </Typography>

      {data?.data ? (
        <OrganizationForm
          onSubmit={onSubmit}
          isEdit
          defaultValues={{
            address: data?.data?.address,
            code: data?.data?.code,
            orgCode: data?.data?.orgCode,
            name: data?.data?.name,
          }}
        ></OrganizationForm>
      ) : null}

      <FormHelperText error={updateMutatation.isError}>
        {updateMutatation.error?.message}
      </FormHelperText>
    </MainLayout>
  );
}
