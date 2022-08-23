import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import TruckForm from "@/components/Forms/TruckForm";
import type {
  TruckFormSubmitHandler,
  TruckFormValues,
} from "@/components/Forms/TruckForm";
import { FormHelperText, Typography } from "@mui/material";

type RouterQuery = {
  id: string;
};

export default function TruckEditPage() {
  const router = useRouter();
  const { id } = router.query as RouterQuery;

  const { data } = trpc.useQuery(["truck.find", id]);

  const updateMutatation = trpc.useMutation(["truck.update"], {
    onSuccess: () => {
      router.push("/management/trucks");
    },
  });

  const onSubmit: TruckFormSubmitHandler<TruckFormValues> = (data) => {
    updateMutatation.mutate(data);
  };

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Edit Truck
      </Typography>

      {data?.data ? (
        <TruckForm
          onSubmit={onSubmit}
          isEdit
          defaultValues={{
            truckCode: data.data.truckCode,
            name: data.data.name,
            policeNumber: data.data.policeNumber,
            type: data.data?.type,
          }}
        ></TruckForm>
      ) : null}

      <FormHelperText error={updateMutatation.isError}>
        {updateMutatation.error?.message}
      </FormHelperText>
    </MainLayout>
  );
}
