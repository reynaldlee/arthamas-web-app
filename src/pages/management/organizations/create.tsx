import { ReactElement } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";
import { Input, TextField } from "@mui/material";

export default function OrganizationCreatePage() {
  const { data } = trpc.useQuery(["org.findAll", { q: "test" }]);

  return (
    <MainLayout>
      <>
        <TextField name="orgId"></TextField>
        <TextField name="name"></TextField>
        <TextField name="address"></TextField>
      </>
    </MainLayout>
  );
}
