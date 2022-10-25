import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

import { useRouter } from "next/router";
import VesselForm from "@/components/Forms/VesselForm";
import type {
  VesselFormSubmitHandler,
  VesselFormValues,
} from "@/components/Forms/VesselForm";
import { FormHelperText, Typography } from "@mui/material";

type RouterQuery = {
  id: string;
};

export default function VesselEditPage() {
  const router = useRouter();
  const { id } = router.query as RouterQuery;

  const { data } = trpc.useQuery(["vessel.find", id]);

  const updateMutatation = trpc.useMutation(["vessel.update"], {
    onSuccess: () => {
      router.push("/management/vessels");
    },
  });

  const onSubmit: VesselFormSubmitHandler<VesselFormValues> = (data) => {
    updateMutatation.mutate(data);
  };

  console.log();

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Edit Vessel
      </Typography>

      {data?.data ? (
        <VesselForm
          onSubmit={onSubmit}
          isEdit
          defaultValues={{
            vesselCode: data.data.vesselCode,
            name: data.data.name,
            vesselType: data.data.vesselType,
            regNo: data.data.regNo,
            customerCode: data.data.customerCode,
            imoNumber: data.data.imoNumber,
            teus: data.data.teus,
            isAllProduct: data.data.isAllProduct,
          }}
        ></VesselForm>
      ) : null}

      <FormHelperText error={updateMutatation.isError}>
        {updateMutatation.error?.message}
      </FormHelperText>
    </MainLayout>
  );
}
