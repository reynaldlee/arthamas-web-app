import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import SupplierForm from "@/components/Forms/SupplierForm";
import type {
  SupplierFormSubmitHandler,
  SupplierFormValues,
} from "@/components/Forms/SupplierForm";
import { FormHelperText, Typography } from "@mui/material";

type RouterQuery = {
  id: string;
};

export default function PortEditPage() {
  const router = useRouter();
  const { id } = router.query as RouterQuery;

  const { data } = trpc.supplier.find.useQuery(id);

  const updateMutatation = trpc.supplier.update.useMutation({
    onSuccess: () => {
      router.push("/management/suppliers");
    },
  });

  const onSubmit: SupplierFormSubmitHandler<SupplierFormValues> = (data) => {
    updateMutatation.mutate(data);
  };

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Edit Supplier
      </Typography>

      {data?.data ? (
        <SupplierForm
          onSubmit={onSubmit}
          isEdit
          defaultValues={{
            ...data.data,
          }}
        ></SupplierForm>
      ) : null}

      <FormHelperText error={updateMutatation.isError}>
        {updateMutatation.error?.message}
      </FormHelperText>
    </MainLayout>
  );
}
