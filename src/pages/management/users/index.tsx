import { ReactElement, useId } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";
import { LoaderModal } from "@/components/Loader";
import Link from "next/link";
import { Box, Button } from "@mui/material";

import { Add } from "@mui/icons-material";
import MUIDataTable from "mui-datatables";
import MoreMenu from "@/components/Menu/MoreMenu";
import { useRouter } from "next/router";

export default function UserIndex() {
  const { data, refetch, isLoading } = trpc.useQuery(["user.findAll"]);
  const tableId = useId();
  const router = useRouter();

  const userRole = trpc.useQuery([]);

  const { mutate: deleteData } = trpc.useMutation(["user.delete"]);

  const handleDelete = (id: number) => () => {
    deleteData(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return (
    <MainLayout>
      <Box p={2}>
        <Link href="/management/users/create">
          <Button variant="contained" startIcon={<Add />}>
            Create New User
          </Button>
        </Link>
      </Box>

      <MUIDataTable
        title="User List"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        columns={[
          { label: "User ID", name: "id" },
          { label: "Name", name: "name" },
          { label: "Username", name: "username" },
          { label: "Email", name: "email" },
          {
            name: "id",
            label: "Action",
            options: {
              filter: false,
              customBodyRender: (id) => {
                return (
                  <MoreMenu
                    actions={[
                      {
                        label: "Edit",
                        onClick: () =>
                          router.push(`/management/users/${id}/edit`),
                      },
                      {
                        label: "Delte",
                        danger: true,
                        onClick: () => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete this user`
                            )
                          ) {
                          }
                        },
                      },
                    ]}
                  />
                );
              },
            },
          },
        ]}
        data={data?.data || []}
      />
      <LoaderModal open={isLoading} />
    </MainLayout>
  );
}
