import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import WarehouseForm from "@/components/Forms/WarehouseForm";
import type {
  WarehouseFormSubmitHandler,
  WarehouseFormValues,
} from "@/components/Forms/WarehouseForm";
import { FormHelperText, Typography } from "@mui/material";

type RouterQuery = {
  id: string;
};

export default function WarehouseEditPage() {
  const router = useRouter();
  const { id } = router.query as RouterQuery;

  const { data } = trpc.useQuery(["warehouse.find", id]);

  const updateMutatation = trpc.useMutation(["warehouse.update"], {
    onSuccess: () => {
      router.push("/management/warehouses");
    },
  });

  const onSubmit: WarehouseFormSubmitHandler<WarehouseFormValues> = (data) => {
    updateMutatation.mutate({
      ...data,
      areaCode: data.area?.areaCode,
    });
  };

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Edit Warehouse
      </Typography>

      {data?.data ? (
        <WarehouseForm
          onSubmit={onSubmit}
          isEdit
          defaultValues={{
            warehouseCode: data.data.warehouseCode,
            area: data.data.area,
            name: data.data.name,
            address: data.data?.address!,
            phone: data.data?.phone!,
          }}
        ></WarehouseForm>
      ) : null}

      <FormHelperText error={updateMutatation.isError}>
        {updateMutatation.error?.message}
      </FormHelperText>
    </MainLayout>
  );
}
