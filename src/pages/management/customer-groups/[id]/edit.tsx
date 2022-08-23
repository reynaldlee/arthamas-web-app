import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import CustomerGroupForm from "@/components/Forms/CustomerGroupForm";
import type {
  CustomerGroupFormSubmitHandler,
  CustomerGroupFormValues,
} from "@/components/Forms/CustomerGroupForm";
import { FormHelperText, Typography } from "@mui/material";

type RouterQuery = {
  id: string;
};

export default function CustomerGroupEditPage() {
  const router = useRouter();
  const { id } = router.query as RouterQuery;

  const { data } = trpc.useQuery(["customerGroup.find", id]);

  const updateMutatation = trpc.useMutation(["customerGroup.update"], {
    onSuccess: () => {
      router.push("/management/customer-groups");
    },
  });

  const onSubmit: CustomerGroupFormSubmitHandler<CustomerGroupFormValues> = (
    data
  ) => {
    updateMutatation.mutate(data);
  };

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Edit Customer Group
      </Typography>

      {data?.data ? (
        <CustomerGroupForm
          onSubmit={onSubmit}
          isEdit
          defaultValues={{
            customerGroupCode: data.data.customerGroupCode,
            address: data.data?.address!,
            type: data.data?.type!,
            phone: data.data?.phone!,
            name: data.data.name,
          }}
        ></CustomerGroupForm>
      ) : null}

      <FormHelperText error={updateMutatation.isError}>
        {updateMutatation.error?.message}
      </FormHelperText>
    </MainLayout>
  );
}
