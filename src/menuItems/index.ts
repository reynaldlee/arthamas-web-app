import AnalyticsTwoToneIcon from "@mui/icons-material/AnalyticsTwoTone";
import AccountBalanceTwoToneIcon from "@mui/icons-material/AccountBalanceTwoTone";
import StoreTwoToneIcon from "@mui/icons-material/StoreTwoTone";
import AccountBalanceWalletTwoToneIcon from "@mui/icons-material/AccountBalanceWalletTwoTone";
import MonetizationOnTwoToneIcon from "@mui/icons-material/MonetizationOnTwoTone";
import KitchenTwoToneIcon from "@mui/icons-material/KitchenTwoTone";
import HealthAndSafetyTwoToneIcon from "@mui/icons-material/HealthAndSafetyTwoTone";
import ContactSupportTwoToneIcon from "@mui/icons-material/ContactSupportTwoTone";
import LocalLibraryTwoToneIcon from "@mui/icons-material/LocalLibraryTwoTone";
import DnsTwoToneIcon from "@mui/icons-material/DnsTwoTone";
import TaskAltTwoToneIcon from "@mui/icons-material/TaskAltTwoTone";
import DocumentScannerTwoToneIcon from "@mui/icons-material/DocumentScannerTwoTone";
import WorkTwoToneIcon from "@mui/icons-material/WorkTwoTone";
import SupervisorAccountTwoToneIcon from "@mui/icons-material/SupervisorAccountTwoTone";
import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import BusinessCenterTwoToneIcon from "@mui/icons-material/BusinessCenterTwoTone";
import AddShoppingCartTwoToneIcon from "@mui/icons-material/AddShoppingCartTwoTone";
import ViewInArTwoToneIcon from "@mui/icons-material/ViewInArTwoTone";
import AccountBoxTwoToneIcon from "@mui/icons-material/AccountBoxTwoTone";
import TravelExploreTwoToneIcon from "@mui/icons-material/TravelExploreTwoTone";
import StorefrontTwoToneIcon from "@mui/icons-material/StorefrontTwoTone";
import VpnKeyTwoToneIcon from "@mui/icons-material/VpnKeyTwoTone";
import ErrorTwoToneIcon from "@mui/icons-material/ErrorTwoTone";
import DesignServicesTwoToneIcon from "@mui/icons-material/DesignServicesTwoTone";
import SupportTwoToneIcon from "@mui/icons-material/SupportTwoTone";
import ReceiptTwoToneIcon from "@mui/icons-material/ReceiptTwoTone";
import BackupTableTwoToneIcon from "@mui/icons-material/BackupTableTwoTone";
import PermIdentityTwoToneIcon from "@mui/icons-material/PermIdentityTwoTone";
import LocalShippingTwoToneIcon from "@mui/icons-material/LocalShippingTwoTone";
import LocationCityTwoToneIcon from "@mui/icons-material/LocationCityTwoTone";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

export type NavMenuItem = {
  name: string;
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  link?: string;
  items?: NavMenuItem[];
};

export type NavMenu = {
  heading: string;
  items: NavMenuItem[];
};

const menuItems = [
  // {
  //   heading: "Dashboard & Reports",
  //   items: [
  //     {
  //       name: "Analytics",
  //       icon: AnalyticsTwoToneIcon,
  //       link: "/dashboards/analytics",
  //     },
  //     {
  //       name: "Reports",
  //       icon: AnalyticsTwoToneIcon,
  //       items: [
  //         {
  //           name: "Sales Report",
  //           link: "/reports/sales",
  //         },
  //         {
  //           name: "Purchases Report",
  //           link: "/reports/purchases",
  //         },
  //         {
  //           name: "Inventory Report",
  //           link: "/reports/inventory",
  //         },
  //         {
  //           name: "Account Receivable Report",
  //           link: "/reports/ar-aging",
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    heading: "Data Management",
    items: [
      {
        name: "Organizations",
        icon: LocationCityTwoToneIcon,
        link: "/management/organizations",
      },
      {
        name: "Area",
        icon: BusinessCenterTwoToneIcon,
        link: "/management/areas",
      },
      {
        name: "Warehouses",
        icon: BusinessCenterTwoToneIcon,
        link: "/management/warehouses",
      },
      {
        name: "Products",
        icon: ViewInArTwoToneIcon,
        link: "/management/products",
      },
      {
        name: "Trucks",
        icon: LocalShippingTwoToneIcon,
        link: "/management/trucks",
      },
      {
        name: "Suppliers",
        icon: StorefrontTwoToneIcon,
        link: "/management/suppliers",
      },
      // {
      //   name: "Supplier Categories",
      //   icon: StorefrontTwoToneIcon,
      //   link: "/management/supplier-categories",
      // },
      {
        name: "Vessels",
        icon: TravelExploreTwoToneIcon,
        link: "/management/vessels",
      },
      {
        name: "Ports",
        icon: TravelExploreTwoToneIcon,
        link: "/management/ports",
      },
      {
        name: "Customers",
        icon: AccountBoxTwoToneIcon,
        link: "/management/customers",
      },
      {
        name: "Customer Groups",
        icon: AccountTreeTwoToneIcon,
        link: "/management/customer-groups",
      },
      {
        name: "Users",
        icon: SupervisorAccountTwoToneIcon,
        link: "/management/users",
      },
      // {
      //   name: "Roles & Permissions",
      //   icon: PermIdentityTwoToneIcon,
      //   link: "/management/roles-permission",
      // },
    ],
  },
  {
    heading: "Penjualan",
    items: [
      {
        name: "Sales Quotes",
        icon: DocumentScannerTwoToneIcon,
        link: "/sales/quotes",
      },
      {
        name: "Sales Order",
        icon: DocumentScannerTwoToneIcon,
        link: "/sales/orders",
      },
      {
        name: "SP2B",
        icon: DocumentScannerTwoToneIcon,
        link: "/sales/sp2b",
      },
      {
        name: "Delivery",
        icon: DocumentScannerTwoToneIcon,
        link: "/sales/deliveries",
      },

      {
        name: "Sales Invoice",
        icon: DocumentScannerTwoToneIcon,
        link: "/sales/invoices",
      },
      {
        name: "Sales Payment",
        icon: DocumentScannerTwoToneIcon,
        link: "/sales/payments",
      },
      // {
      //   name: "Sales Return",
      //   icon: DocumentScannerTwoToneIcon,
      //   link: "/sales/returns",
      // },
    ],
  },
  {
    heading: "Pembelian",
    items: [
      {
        name: "Purchase Order",
        icon: AddShoppingCartTwoToneIcon,
        link: "/purchases/orders",
      },
      {
        name: "Purchase Invoice",
        icon: AddShoppingCartTwoToneIcon,
        link: "/purchases/invoices",
      },
      {
        name: "Purchase Payment",
        icon: AddShoppingCartTwoToneIcon,
        link: "/purchases/payments",
      },
      // {
      //   name: "Purchase Returns",
      //   icon: AddShoppingCartTwoToneIcon,
      //   link: "/purchases/returns",
      // },
    ],
  },
  {
    heading: "Inventory",
    items: [
      {
        name: "Inventory",
        link: "/inventories",
        icon: DesignServicesTwoToneIcon,
      },
      {
        name: "Create Product",
        link: "/management/products/create",
        icon: DesignServicesTwoToneIcon,
      },
      {
        name: "Stock Transfer",
        icon: DesignServicesTwoToneIcon,
        items: [
          {
            name: "Stock Transfer",
            link: "/inventories/stock-transfer",
          },
        ],
      },
      {
        name: "Stock Opname",
        link: "/inventories/stock-opname",
        icon: DesignServicesTwoToneIcon,
      },
      {
        name: "Stock Adjustment",
        link: "/inventories/stock-adjustment",
        icon: DesignServicesTwoToneIcon,
      },
    ],
  },
  {
    heading: "Warehouse",
    items: [
      {
        name: "SP2B",
        link: "/sales/sp2b",
        icon: DesignServicesTwoToneIcon,
      },
      {
        name: "Surat Jalan",
        link: "/sales/deliveries",
        icon: DesignServicesTwoToneIcon,
      },
      {
        name: "Penerimaan Stock Transfer",
        link: "/inventories/stock-transfer/receive",
        icon: DesignServicesTwoToneIcon,
      },
      {
        name: "Penerimaan Pembelian",
        link: "/purchases/receipt",
        icon: DesignServicesTwoToneIcon,
      },
    ],
  },
];

export default menuItems;
