import { ReactElement, useId } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";
import { LoaderModal } from "@/components/Loader";
import Link from "next/link";

import MUIDataTable from "mui-datatables";
import { formatDate, formatMoney } from "@/utils/format";
import MoreMenu from "@/components/Menu/MoreMenu";
import { useRouter } from "next/router";

export default function SalesPaymentIndex() {
  const { data, isLoading } = trpc.salesPayment.findAll.useQuery();

  const tableId = useId();
  const router = useRouter();

  const deletePayment = trpc.salesPayment.delete.useMutation();

  return (
    <MainLayout>
      <MUIDataTable
        title="Sales Payments"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        data={data?.data || []}
        columns={[
          { label: "Payment No", name: "docNo" },
          {
            label: "Paid Date",
            name: "date",
            options: {
              customBodyRender: formatDate,
            },
          },
          {
            label: "Customer",
            name: "customer",
            options: {
              customBodyRender: (customer) => customer.name,
            },
          },
          {
            label: "Currency",
            name: "currencyCode",
          },
          {
            label: "Amount",
            name: "totalAmount",
            options: {
              customBodyRender: (value) => formatMoney(value),
            },
          },
          // {
          //   name: "docNo",
          //   label: "Action",
          //   options: {
          //     filter: false,
          //     customBodyRender: (id) => {
          //       return (
          //         <>
          //           <MoreMenu
          //             actions={[
          //               {
          //                 label: "Edit",
          //                 onClick: () =>
          //                   router.push(`/sales/purchases/${id}/edit`),
          //               },
          //               {
          //                 label: "Delete Payment",
          //                 danger: true,
          //                 onClick: () => {
          //                   if (
          //                     window.confirm(
          //                       `Are you sure you want to cancel ${id}`
          //                     )
          //                   ) {
          //                     deletePayment.mutate(id, {
          //                       onSuccess: () => {
          //                         router.reload();
          //                       },
          //                     });
          //                   }
          //                 },
          //               },
          //             ]}
          //           ></MoreMenu>
          //         </>
          //       );
          //     },
          // },
          // },
        ]}
      />
      <LoaderModal open={isLoading} />
    </MainLayout>
  );
}
