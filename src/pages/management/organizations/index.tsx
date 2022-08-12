import { ReactElement } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";

export default function Organization() {
  const { data } = trpc.useQuery(["org.findAll", { q: "test" }]);

  return (
    <MainLayout>
      <p>{data?.data[0]?.address}</p>
    </MainLayout>
  );
}
