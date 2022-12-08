import { ReactElement, useId } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
import { trpc } from "@/utils/trpc";
import { LoaderModal } from "@/components/Loader";
import Link from "next/link";
import { Box, Button } from "@mui/material";

import { Add } from "@mui/icons-material";
import MUIDataTable from "mui-datatables";
import { formatDate, formatMoney } from "@/utils/format";
import MoreMenu from "@/components/Menu/MoreMenu";
import { useRouter } from "next/router";
import StatusBadge from "@/components/Badges/StatusBadge";

export default function PurchaseInvoiceIndex() {
  const { data, isLoading } = trpc.purchaseInvoice.findAll.useQuery();
  const tableId = useId();
  const router = useRouter();

  return (
    <MainLayout>
      <Box p={2}>
        <Link href="/purchases/invoices/create">
          <Button variant="contained" startIcon={<Add />}>
            Create Purchase Invoice
          </Button>
        </Link>
      </Box>

      <MUIDataTable
        title="Purchase Invoices"
        options={{
          tableId: tableId,
          selectableRowsHideCheckboxes: true,
        }}
        data={data?.data || []}
        columns={[
          {
            label: "Inv No",
            name: "docNo",
          },
          {
            label: "Inv Date",
            name: "date",
            options: {
              customBodyRender: formatDate,
            },
          },
          {
            label: "Delivery Note (Surat Jalan)",
            name: "purchaseReceipt",
            options: {
              customBodyRender: (pr) => pr.deliveryNoteNo,
            },
          },
          {
            label: "Due Date",
            name: "dueDate",
            options: {
              customBodyRender: formatDate,
            },
          },
          {
            label: "DO No",
            name: "purchaseReceiptDocNo",
          },
          {
            label: "Supplier",
            name: "purchaseReceipt",
            options: {
              customBodyRender: (purchaseReceipt) =>
                purchaseReceipt.purchaseOrder.supplier.name,
            },
          },
          {
            label: "Status",
            name: "status",
            options: {
              customBodyRender: (status) => (
                <StatusBadge status={status}></StatusBadge>
              ),
            },
          },
          {
            label: "Amount",
            name: "totalAmount",
            options: {
              customBodyRender: formatMoney,
            },
          },
          {
            label: "Unpaid",
            name: "unpaidAmount",
            options: {
              customBodyRender: formatMoney,
            },
          },
          {
            name: "docNo",
            label: "Action",
            options: {
              filter: false,
              customBodyRender: (docNo, { rowData }) => {
                return (
                  <>
                    <MoreMenu
                      actions={[
                        {
                          label: "Detail",
                          onClick: () => {
                            router.push(`/purchases/receipt/${docNo}`);
                          },
                        },
                      ]}
                    ></MoreMenu>
                  </>
                );
              },
            },
          },
        ]}
      />
      <LoaderModal open={isLoading} />
    </MainLayout>
  );
}
