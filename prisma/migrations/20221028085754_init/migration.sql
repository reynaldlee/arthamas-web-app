-- CreateTable
CREATE TABLE `Org` (
    `orgCode` VARCHAR(20) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `logoFileId` VARCHAR(191) NULL,
    `code` VARCHAR(10) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(40) NOT NULL,
    `username` VARCHAR(20) NOT NULL,
    `email` VARCHAR(40) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserOrg` (
    `userId` INTEGER NOT NULL,
    `orgCode` VARCHAR(191) NOT NULL,
    `isDefault` BOOLEAN NOT NULL,

    PRIMARY KEY (`userId`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `roleId` VARCHAR(20) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `permission` VARCHAR(191) NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `name` VARCHAR(191) NOT NULL,
    `permission` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Permission_permission_key`(`permission`),
    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerGroup` (
    `customerGroupCode` VARCHAR(20) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `address` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`customerGroupCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `customerCode` VARCHAR(20) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `address` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `customerGroupCode` VARCHAR(191) NULL,
    `contactEmail` VARCHAR(191) NULL,
    `NPWP` VARCHAR(40) NULL,
    `NPWPAddress` VARCHAR(255) NULL,
    `salespersonCode` VARCHAR(20) NULL,
    `top` INTEGER NOT NULL,
    `orgCode` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`customerCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerContact` (
    `contactName` VARCHAR(20) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `jobTitle` VARCHAR(40) NOT NULL,
    `customerCode` VARCHAR(20) NOT NULL,
    `orgCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`contactName`, `customerCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vessel` (
    `vesselCode` VARCHAR(20) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `regNo` VARCHAR(40) NOT NULL,
    `vesselType` VARCHAR(40) NULL,
    `imoNumber` VARCHAR(40) NULL,
    `teus` VARCHAR(40) NULL,
    `customerCode` VARCHAR(20) NOT NULL,
    `isAllProduct` BOOLEAN NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`vesselCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VesselProduct` (
    `vesselCode` VARCHAR(20) NOT NULL,
    `productCode` VARCHAR(20) NOT NULL,
    `orgCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`vesselCode`, `productCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Truck` (
    `truckCode` VARCHAR(20) NOT NULL,
    `policeNumber` VARCHAR(10) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `type` VARCHAR(40) NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(40) NOT NULL,
    `updatedBy` VARCHAR(40) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`truckCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Warehouse` (
    `warehouseCode` VARCHAR(20) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `address` VARCHAR(191) NULL,
    `barcodeRequired` BOOLEAN NULL,
    `areaCode` VARCHAR(20) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`warehouseCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Area` (
    `areaCode` VARCHAR(20) NOT NULL,
    `areaName` VARCHAR(40) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`areaCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Port` (
    `portCode` VARCHAR(20) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `address` VARCHAR(191) NULL,
    `area` VARCHAR(191) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `lat` DECIMAL(65, 30) NULL,
    `lng` DECIMAL(65, 30) NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`portCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `supplierCode` VARCHAR(20) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `contactEmail` VARCHAR(191) NULL,
    `phone` VARCHAR(20) NULL,
    `address` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `top` INTEGER NOT NULL,
    `NPWP` VARCHAR(191) NULL,
    `NPWPAddress` VARCHAR(191) NULL,
    `supplierCategoryCode` VARCHAR(20) NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`supplierCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Salesperson` (
    `salespersonCode` VARCHAR(20) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(20) NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`salespersonCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierCategory` (
    `supplierCategoryCode` VARCHAR(20) NOT NULL,
    `supplierCategoryName` VARCHAR(40) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`supplierCategoryCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `fileId` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `fileSize` DOUBLE NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `mimetype` VARCHAR(191) NOT NULL,
    `ext` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `salesQuoteDocNo` VARCHAR(191) NULL,
    `salesOrderDocNo` VARCHAR(191) NULL,

    PRIMARY KEY (`fileId`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `productCode` VARCHAR(20) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `desc` TEXT NULL,
    `sku` VARCHAR(20) NULL,
    `nptNumber` VARCHAR(40) NULL,
    `nptValidFrom` DATE NULL,
    `nptValidTo` DATE NULL,
    `unitPrice` DECIMAL(15, 2) NOT NULL,
    `productGradeCode` VARCHAR(10) NOT NULL,
    `productTypeCode` VARCHAR(20) NULL,
    `productCategoryCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`productCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductGrade` (
    `productGradeCode` VARCHAR(10) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`productGradeCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductPackaging` (
    `productCode` VARCHAR(20) NOT NULL,
    `packagingCode` VARCHAR(10) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `unitCode` VARCHAR(10) NOT NULL,
    `unitQty` DECIMAL(15, 2) NOT NULL,
    `unitPrice` DECIMAL(15, 2) NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`productCode`, `packagingCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Packaging` (
    `packagingCode` VARCHAR(10) NOT NULL,
    `name` VARCHAR(20) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`packagingCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Unit` (
    `unitCode` VARCHAR(10) NOT NULL,
    `unitName` VARCHAR(20) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`unitCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `serviceCode` VARCHAR(20) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `unitPrice` DECIMAL(15, 2) NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`serviceCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BankAccount` (
    `bankAccountCode` VARCHAR(20) NOT NULL,
    `bankAccountNumber` VARCHAR(20) NOT NULL,
    `bankAccountName` VARCHAR(40) NOT NULL,
    `bankName` VARCHAR(40) NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`bankAccountCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductPrices` (
    `productCode` VARCHAR(20) NOT NULL,
    `portCode` VARCHAR(10) NOT NULL,
    `customerCode` VARCHAR(20) NOT NULL,
    `unitPrice` DECIMAL(15, 2) NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`productCode`, `orgCode`, `portCode`, `customerCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Currency` (
    `currencyCode` VARCHAR(3) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `rateIdr` DECIMAL(15, 2) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`currencyCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tax` (
    `taxCode` VARCHAR(10) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `taxRate` DECIMAL(15, 2) NOT NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `orgCode` VARCHAR(20) NOT NULL,
    `isWithholding` BOOLEAN NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`taxCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductType` (
    `productTypeCode` VARCHAR(20) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`productTypeCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductCategory` (
    `productCategoryCode` VARCHAR(20) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`productCategoryCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventory` (
    `productCode` VARCHAR(20) NOT NULL,
    `packagingCode` VARCHAR(10) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `minStock` DECIMAL(15, 2) NOT NULL,
    `qtyOnHand` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `qtyReserved` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `warehouseCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`productCode`, `packagingCode`, `warehouseCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryMovement` (
    `productCode` VARCHAR(20) NOT NULL,
    `packagingCode` VARCHAR(10) NOT NULL,
    `qty` DECIMAL(15, 2) NOT NULL,
    `docType` ENUM('SalesQuote', 'SalesOrder', 'GoodsRelease', 'SalesDelivery', 'SalesPayment', 'SalesReturn', 'PurchaseOrder', 'PurchaseReceipt', 'PurchasePayment', 'PurchaseReturn', 'InventoryAdjustment', 'StockTransfer') NOT NULL,
    `docNo` VARCHAR(20) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`productCode`, `packagingCode`, `docType`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesQuote` (
    `docNo` VARCHAR(40) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `customerCode` VARCHAR(20) NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL,
    `exchangeRate` DECIMAL(15, 2) NOT NULL,
    `portCode` VARCHAR(10) NOT NULL,
    `date` DATE NOT NULL,
    `validUntil` DATE NOT NULL,
    `vesselCode` VARCHAR(20) NOT NULL,
    `warehouseCode` VARCHAR(20) NOT NULL,
    `shipTo` TEXT NOT NULL,
    `totalProduct` DECIMAL(15, 2) NOT NULL,
    `totalService` DECIMAL(15, 2) NOT NULL,
    `taxAmount` DECIMAL(15, 2) NULL,
    `taxRate` DECIMAL(15, 2) NULL,
    `taxCode` VARCHAR(10) NULL,
    `totalBeforeTax` DECIMAL(15, 2) NOT NULL,
    `totalAmount` DECIMAL(15, 2) NOT NULL,
    `docType` ENUM('SalesQuote', 'SalesOrder', 'GoodsRelease', 'SalesDelivery', 'SalesPayment', 'SalesReturn', 'PurchaseOrder', 'PurchaseReceipt', 'PurchasePayment', 'PurchaseReturn', 'InventoryAdjustment', 'StockTransfer') NULL,
    `status` ENUM('Open', 'Completed', 'Cancelled') NOT NULL,
    `memo` TEXT NULL,
    `cancelledAt` DATETIME(3) NULL,
    `cancelledBy` VARCHAR(20) NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesQuoteItem` (
    `docNo` VARCHAR(40) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `productCode` VARCHAR(20) NOT NULL,
    `packagingCode` VARCHAR(10) NOT NULL,
    `desc` VARCHAR(191) NULL,
    `qty` DECIMAL(15, 2) NOT NULL,
    `unitQty` DECIMAL(15, 2) NOT NULL,
    `totalUnitQty` DECIMAL(15, 2) NOT NULL,
    `unitCode` VARCHAR(10) NOT NULL,
    `unitPrice` DECIMAL(15, 2) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `salesOrderDocNo` VARCHAR(40) NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `lineNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesQuoteService` (
    `orgCode` VARCHAR(20) NOT NULL,
    `docNo` VARCHAR(40) NOT NULL,
    `serviceCode` VARCHAR(20) NOT NULL,
    `unitPrice` DECIMAL(15, 2) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `desc` VARCHAR(191) NULL,
    `salesOrderDocNo` VARCHAR(40) NULL,

    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesOrder` (
    `docNo` VARCHAR(40) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `customerCode` VARCHAR(20) NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL,
    `portCode` VARCHAR(10) NOT NULL,
    `poNumber` VARCHAR(40) NULL,
    `poDate` DATE NULL,
    `poNotes` TEXT NULL,
    `date` DATE NOT NULL,
    `dueDate` DATE NOT NULL,
    `vesselCode` VARCHAR(20) NOT NULL,
    `warehouseCode` VARCHAR(20) NOT NULL,
    `shipTo` TEXT NOT NULL,
    `totalProduct` DECIMAL(15, 2) NOT NULL,
    `totalService` DECIMAL(15, 2) NOT NULL,
    `taxAmount` DECIMAL(15, 2) NOT NULL,
    `taxCode` VARCHAR(10) NOT NULL,
    `taxRate` DECIMAL(15, 2) NULL DEFAULT 0,
    `totalAmount` DECIMAL(15, 2) NULL DEFAULT 0,
    `exchangeRate` DECIMAL(15, 2) NOT NULL,
    `totalBeforeTax` DECIMAL(15, 2) NOT NULL,
    `isSKTD` BOOLEAN NOT NULL,
    `status` ENUM('Open', 'Partial', 'OnProgress', 'Completed', 'Cancelled') NOT NULL,
    `memo` TEXT NULL,
    `cancelledAt` DATETIME(3) NULL,
    `cancelledBy` VARCHAR(20) NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `salesQuoteDocNo` VARCHAR(40) NULL,

    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesOrderItem` (
    `docNo` VARCHAR(40) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `productCode` VARCHAR(20) NOT NULL,
    `packagingCode` VARCHAR(10) NOT NULL,
    `qty` DECIMAL(15, 2) NOT NULL,
    `unitPrice` DECIMAL(15, 2) NOT NULL,
    `unitQty` DECIMAL(15, 2) NOT NULL,
    `totalUnitQty` DECIMAL(15, 2) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `unitCode` VARCHAR(10) NOT NULL,
    `desc` VARCHAR(191) NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `lineNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesOrderService` (
    `docNo` VARCHAR(40) NOT NULL,
    `serviceCode` VARCHAR(20) NOT NULL,
    `unitPrice` DECIMAL(15, 2) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `desc` VARCHAR(191) NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `serviceCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsReleaseOrder` (
    `docNo` VARCHAR(40) NOT NULL,
    `salesOrderDocNo` VARCHAR(40) NOT NULL,
    `deliveryDate` DATE NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `warehouseCode` VARCHAR(20) NOT NULL,
    `memo` TEXT NOT NULL,
    `status` ENUM('Open', 'Completed', 'Cancelled') NOT NULL,
    `cancelledAt` DATETIME(3) NULL,
    `cancelledBy` VARCHAR(191) NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsReleaseOrderItem` (
    `docNo` VARCHAR(40) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `productCode` VARCHAR(20) NOT NULL,
    `packagingCode` VARCHAR(10) NOT NULL,
    `desc` VARCHAR(191) NULL,
    `unitQty` DECIMAL(15, 2) NOT NULL,
    `totalUnitQty` DECIMAL(15, 2) NOT NULL,
    `unitCode` VARCHAR(10) NOT NULL,
    `qty` DECIMAL(15, 2) NOT NULL,
    `salesOrderItemDocNo` VARCHAR(40) NOT NULL,
    `salesOrderItemLineNo` INTEGER NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `lineNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesDelivery` (
    `docNo` VARCHAR(20) NOT NULL,
    `goodsReleaseOrderDocNo` VARCHAR(20) NOT NULL,
    `salesOrderDocNo` VARCHAR(40) NOT NULL,
    `warehouseCode` VARCHAR(20) NOT NULL,
    `date` DATE NOT NULL,
    `deliveryDate` DATE NOT NULL,
    `truckCode` VARCHAR(20) NOT NULL,
    `driverName` VARCHAR(40) NOT NULL,
    `status` ENUM('Open', 'OnProgress', 'Completed', 'Cancelled') NOT NULL,
    `memo` VARCHAR(191) NULL,
    `orgCode` VARCHAR(191) NOT NULL,
    `cancelledAt` DATETIME(3) NULL,
    `cancelledBy` VARCHAR(20) NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `salesInvoiceDocNo` VARCHAR(40) NULL,
    `salesInvoiceOrgCode` VARCHAR(20) NULL,

    UNIQUE INDEX `SalesDelivery_goodsReleaseOrderDocNo_orgCode_key`(`goodsReleaseOrderDocNo`, `orgCode`),
    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesDeliveryPrint` (
    `docNo` VARCHAR(20) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`docNo`, `orgCode`, `createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesDeliveryItem` (
    `docNo` VARCHAR(40) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `desc` VARCHAR(191) NULL,
    `productCode` VARCHAR(20) NOT NULL,
    `packagingCode` VARCHAR(10) NOT NULL,
    `qty` DECIMAL(15, 2) NOT NULL,
    `salesOrderItemLineNo` INTEGER NOT NULL,
    `salesOrderItemDocNo` VARCHAR(40) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `lineNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesDeliveryItemDetail` (
    `barcode` VARCHAR(191) NOT NULL,
    `docNo` VARCHAR(40) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `lineNo`, `orgCode`, `barcode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesInvoice` (
    `docNo` VARCHAR(40) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `salesOrderDocNo` VARCHAR(40) NOT NULL,
    `date` DATE NOT NULL,
    `customerCode` VARCHAR(40) NOT NULL,
    `bankAccountCode` VARCHAR(20) NULL,
    `dueDate` DATE NOT NULL,
    `totalBeforeTax` DECIMAL(15, 2) NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL,
    `exchangeRate` DECIMAL(15, 2) NOT NULL,
    `taxCode` VARCHAR(10) NOT NULL,
    `taxRate` DECIMAL(15, 2) NULL DEFAULT 0,
    `taxAmount` DECIMAL(15, 2) NULL DEFAULT 0,
    `withholdingTaxRate` DECIMAL(15, 2) NULL DEFAULT 0,
    `withholdingTaxAmount` DECIMAL(15, 2) NULL DEFAULT 0,
    `totalAmount` DECIMAL(15, 2) NOT NULL,
    `unpaidAmount` DECIMAL(15, 2) NOT NULL,
    `paidAmount` DECIMAL(15, 2) NOT NULL,
    `totalProduct` DECIMAL(15, 2) NOT NULL,
    `totalService` DECIMAL(15, 2) NOT NULL,
    `status` ENUM('Open', 'Partial', 'Paid', 'Cancelled') NOT NULL,
    `memo` VARCHAR(191) NOT NULL,
    `salesDeliveryDocNo` VARCHAR(40) NOT NULL,
    `cancelledAt` DATETIME(3) NULL,
    `cancelledBy` VARCHAR(20) NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SalesInvoice_salesDeliveryDocNo_orgCode_key`(`salesDeliveryDocNo`, `orgCode`),
    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesInvoiceItem` (
    `docNo` VARCHAR(40) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `desc` VARCHAR(191) NULL,
    `qty` DECIMAL(15, 2) NOT NULL,
    `unitQty` DECIMAL(15, 2) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `totalUnitQty` DECIMAL(15, 2) NOT NULL,
    `unitPrice` DECIMAL(15, 2) NOT NULL,
    `unitCode` VARCHAR(10) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `productCode` VARCHAR(40) NOT NULL,
    `packagingCode` VARCHAR(40) NOT NULL,
    `salesDeliveryDocNo` VARCHAR(40) NULL,
    `salesDeliveryItemLineNo` INTEGER NULL,
    `salesOrderDocNo` VARCHAR(40) NULL,
    `salesOrderItemLineNo` INTEGER NULL,

    PRIMARY KEY (`docNo`, `lineNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesInvoiceService` (
    `docNo` VARCHAR(40) NOT NULL,
    `serviceCode` VARCHAR(40) NOT NULL,
    `desc` VARCHAR(191) NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `unitPrice` DECIMAL(15, 2) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `salesOrderDocNo` VARCHAR(40) NOT NULL,

    PRIMARY KEY (`docNo`, `serviceCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesPayment` (
    `docNo` VARCHAR(40) NOT NULL,
    `refNo` VARCHAR(40) NOT NULL,
    `date` DATE NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL,
    `exchangeRate` DECIMAL(15, 2) NOT NULL,
    `taxRate` DECIMAL(15, 2) NULL DEFAULT 0,
    `taxAmount` DECIMAL(15, 2) NULL DEFAULT 0,
    `withholdingTaxRate` DECIMAL(15, 2) NULL DEFAULT 0,
    `withholdingTaxAmount` DECIMAL(15, 2) NULL DEFAULT 0,
    `memo` VARCHAR(191) NOT NULL,
    `totalBeforeTax` DECIMAL(15, 2) NOT NULL,
    `totalAmount` DECIMAL(15, 2) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `cancelledAt` DATETIME(3) NULL,
    `cancelledBy` VARCHAR(20) NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentMethod` (
    `paymentMethodCode` VARCHAR(20) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`paymentMethodCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesPaymentDetail` (
    `docNo` VARCHAR(40) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `salesInvoiceDocNo` VARCHAR(40) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `lineNo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesReturn` (
    `docNo` VARCHAR(40) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `date` DATE NOT NULL,
    `salesOrderDocNo` VARCHAR(40) NOT NULL,
    `taxRate` DECIMAL(15, 2) NULL DEFAULT 0,
    `taxAmount` DECIMAL(15, 2) NULL DEFAULT 0,
    `withholdingTaxRate` DECIMAL(15, 2) NULL DEFAULT 0,
    `withholdingTaxAmount` DECIMAL(15, 2) NULL DEFAULT 0,
    `totalBeforeTax` DECIMAL(15, 2) NOT NULL,
    `totalAmount` DECIMAL(15, 2) NOT NULL,

    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesReturnItem` (
    `docNo` VARCHAR(40) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `qty` DECIMAL(15, 2) NOT NULL,
    `unitPrice` DECIMAL(15, 2) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `notes` TEXT NOT NULL,
    `orgCode` VARCHAR(191) NOT NULL,
    `salesOrderItemDocNo` VARCHAR(40) NOT NULL,
    `salesOrderItemlineNo` INTEGER NOT NULL,
    `salesOrderItemOrgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `lineNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseOrder` (
    `docNo` VARCHAR(40) NOT NULL,
    `date` DATE NOT NULL,
    `dueDate` DATE NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `supplierCode` VARCHAR(20) NOT NULL,
    `shipTo` VARCHAR(191) NOT NULL,
    `warehouseCode` VARCHAR(20) NOT NULL,
    `status` ENUM('Open', 'OnProgress', 'Completed', 'Cancelled') NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL,
    `exchangeRate` DECIMAL(15, 2) NOT NULL DEFAULT 1,
    `memo` VARCHAR(191) NULL,
    `top` INTEGER NULL,
    `totalProduct` DECIMAL(15, 2) NOT NULL,
    `totalService` DECIMAL(15, 2) NOT NULL,
    `taxRate` DECIMAL(15, 2) NULL DEFAULT 0,
    `taxAmount` DECIMAL(15, 2) NULL DEFAULT 0,
    `totalBeforeTax` DECIMAL(15, 2) NOT NULL,
    `totalAmount` DECIMAL(15, 2) NOT NULL,
    `cancelledAt` DATETIME(3) NULL,
    `cancelledBy` VARCHAR(20) NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseOrderItem` (
    `docNo` VARCHAR(40) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `desc` VARCHAR(191) NULL,
    `productCode` VARCHAR(20) NOT NULL,
    `packagingCode` VARCHAR(10) NOT NULL,
    `qty` DECIMAL(15, 2) NOT NULL,
    `unitPrice` DECIMAL(15, 2) NOT NULL,
    `unitQty` DECIMAL(15, 2) NOT NULL,
    `unitCode` VARCHAR(10) NOT NULL,
    `totalUnitQty` DECIMAL(15, 2) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `lineNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseReturn` (
    `docNo` VARCHAR(40) NOT NULL,
    `date` DATE NOT NULL,
    `notes` TEXT NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `purchaseOrderDocNo` VARCHAR(20) NOT NULL,
    `totalBeforeTax` DECIMAL(15, 2) NOT NULL,
    `totalAmount` DECIMAL(15, 2) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseReturnItem` (
    `docNo` VARCHAR(191) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `qty` DECIMAL(15, 2) NOT NULL,
    `unitPrice` DECIMAL(15, 2) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `purchaseOrderItemDocNo` VARCHAR(40) NOT NULL,
    `purchaseOrderItemProductCode` VARCHAR(20) NOT NULL,
    `purchaseOrderItemPackagingCode` VARCHAR(10) NOT NULL,
    `purchaseOrderItemOrgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `lineNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockTransfer` (
    `docNo` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `fromWarehouseCode` VARCHAR(191) NOT NULL,
    `toWarehouseCode` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `orgCode` VARCHAR(191) NOT NULL,
    `notes` TEXT NOT NULL,
    `driverName` VARCHAR(191) NULL,
    `truckCode` VARCHAR(191) NOT NULL,
    `cancelledAt` DATETIME(3) NULL,
    `cancelledBy` VARCHAR(40) NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockTransferItem` (
    `docNo` VARCHAR(40) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `productCode` VARCHAR(20) NOT NULL,
    `packagingCode` VARCHAR(10) NOT NULL,
    `qty` DECIMAL(15, 2) NOT NULL,
    `unitQty` DECIMAL(15, 2) NOT NULL,
    `totalUnitQty` DECIMAL(15, 2) NOT NULL,
    `unitCode` VARCHAR(10) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `lineNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockTransferReceipt` (
    `docNo` VARCHAR(40) NOT NULL,
    `receiptTime` DATETIME(3) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockTransferReceiptItem` (
    `docNo` VARCHAR(40) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `receiptTime` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `stockTransferReceiptDocNo` VARCHAR(40) NOT NULL,
    `stockTransferReceiptOrgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `lineNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseReceipt` (
    `docNo` VARCHAR(40) NOT NULL,
    `deliveryNoteNo` VARCHAR(40) NOT NULL,
    `purchaseOrderDocNo` VARCHAR(40) NOT NULL,
    `warehouseCode` VARCHAR(20) NOT NULL,
    `date` DATE NOT NULL,
    `memo` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseReceiptItem` (
    `docNo` VARCHAR(40) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `purchaseOrderDocNo` VARCHAR(40) NOT NULL,
    `purchaseOrderLineNo` INTEGER NOT NULL,
    `productCode` VARCHAR(20) NOT NULL,
    `packagingCode` VARCHAR(10) NOT NULL,
    `batchNo` VARCHAR(191) NOT NULL DEFAULT '',
    `qty` DECIMAL(15, 2) NOT NULL,
    `unitCode` VARCHAR(10) NOT NULL,
    `unitQty` DECIMAL(15, 2) NOT NULL,
    `totalUnitQty` DECIMAL(15, 2) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `lineNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseInvoice` (
    `docNo` VARCHAR(20) NOT NULL,
    `date` DATE NOT NULL,
    `dueDate` DATE NOT NULL,
    `orgCode` VARCHAR(191) NOT NULL,
    `status` ENUM('Open', 'Partial', 'Paid', 'Cancelled') NOT NULL,
    `purchaseReceiptDocNo` VARCHAR(40) NOT NULL,
    `taxRate` DECIMAL(15, 2) NULL,
    `taxAmount` DECIMAL(15, 2) NULL,
    `withholdingTaxRate` DECIMAL(15, 2) NULL,
    `withholdingTaxAmount` DECIMAL(15, 2) NULL,
    `totalBeforeTax` DECIMAL(15, 2) NOT NULL,
    `totalAmount` DECIMAL(15, 2) NOT NULL,
    `cancelledAt` DATETIME(3) NULL,
    `cancelledBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseInvoiceItem` (
    `docNo` VARCHAR(40) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `purchaseReceiptDocNo` VARCHAR(40) NOT NULL,
    `purchaseReceiptLineNo` INTEGER NOT NULL,
    `productCode` VARCHAR(20) NOT NULL,
    `packagingCode` VARCHAR(10) NOT NULL,
    `qty` DECIMAL(15, 2) NOT NULL,
    `unitPrice` DECIMAL(15, 2) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `purchaseOrderItemDocNo` VARCHAR(40) NULL,
    `purchaseOrderItemLineNo` INTEGER NULL,
    `purchaseOrderItemOrgCode` VARCHAR(20) NULL,

    PRIMARY KEY (`docNo`, `lineNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchasePayment` (
    `docNo` VARCHAR(40) NOT NULL,
    `refNo` VARCHAR(40) NOT NULL,
    `date` DATE NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL,
    `exchangeRate` DECIMAL(15, 2) NOT NULL,
    `taxRate` DECIMAL(15, 2) NULL DEFAULT 0,
    `taxAmount` DECIMAL(15, 2) NULL DEFAULT 0,
    `withholdingTaxRate` DECIMAL(15, 2) NULL DEFAULT 0,
    `withholdingTaxAmount` DECIMAL(15, 2) NULL DEFAULT 0,
    `memo` VARCHAR(191) NOT NULL,
    `totalBeforeTax` DECIMAL(15, 2) NOT NULL,
    `totalAmount` DECIMAL(15, 2) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `cancelledAt` DATETIME(3) NULL,
    `cancelledBy` VARCHAR(20) NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchasePaymentDetail` (
    `docNo` VARCHAR(40) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,
    `purchaseInvoiceDocNo` VARCHAR(40) NOT NULL,

    PRIMARY KEY (`docNo`, `lineNo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SKTD` (
    `docNo` VARCHAR(40) NOT NULL,
    `customerCode` VARCHAR(40) NOT NULL,
    `validFrom` DATE NOT NULL,
    `validUntil` DATE NOT NULL,
    `type` ENUM('VOLUMES', 'PRODUCTS') NOT NULL,
    `totalVolume` DECIMAL(15, 2) NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SKTDItem` (
    `docNo` VARCHAR(40) NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `productCode` VARCHAR(20) NOT NULL,
    `totalVolume` DECIMAL(15, 2) NOT NULL,
    `remainingVolume` DECIMAL(15, 2) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `productCode`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SKTDUsage` (
    `docNo` VARCHAR(40) NOT NULL,
    `salesOrderItemLineNo` INTEGER NOT NULL,
    `salesOrderDocNo` VARCHAR(20) NOT NULL,
    `qty` DECIMAL(15, 2) NOT NULL,
    `updatedBy` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `orgCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`docNo`, `salesOrderDocNo`, `orgCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserOrg` ADD CONSTRAINT `UserOrg_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserOrg` ADD CONSTRAINT `UserOrg_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerGroup` ADD CONSTRAINT `CustomerGroup_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_customerGroupCode_orgCode_fkey` FOREIGN KEY (`customerGroupCode`, `orgCode`) REFERENCES `CustomerGroup`(`customerGroupCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_salespersonCode_orgCode_fkey` FOREIGN KEY (`salespersonCode`, `orgCode`) REFERENCES `Salesperson`(`salespersonCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerContact` ADD CONSTRAINT `CustomerContact_customerCode_orgCode_fkey` FOREIGN KEY (`customerCode`, `orgCode`) REFERENCES `Customer`(`customerCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vessel` ADD CONSTRAINT `Vessel_customerCode_orgCode_fkey` FOREIGN KEY (`customerCode`, `orgCode`) REFERENCES `Customer`(`customerCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vessel` ADD CONSTRAINT `Vessel_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VesselProduct` ADD CONSTRAINT `VesselProduct_vesselCode_orgCode_fkey` FOREIGN KEY (`vesselCode`, `orgCode`) REFERENCES `Vessel`(`vesselCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VesselProduct` ADD CONSTRAINT `VesselProduct_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VesselProduct` ADD CONSTRAINT `VesselProduct_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Truck` ADD CONSTRAINT `Truck_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Warehouse` ADD CONSTRAINT `Warehouse_areaCode_orgCode_fkey` FOREIGN KEY (`areaCode`, `orgCode`) REFERENCES `Area`(`areaCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Warehouse` ADD CONSTRAINT `Warehouse_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Area` ADD CONSTRAINT `Area_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Port` ADD CONSTRAINT `Port_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_supplierCategoryCode_orgCode_fkey` FOREIGN KEY (`supplierCategoryCode`, `orgCode`) REFERENCES `SupplierCategory`(`supplierCategoryCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salesperson` ADD CONSTRAINT `Salesperson_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierCategory` ADD CONSTRAINT `SupplierCategory_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_salesQuoteDocNo_orgCode_fkey` FOREIGN KEY (`salesQuoteDocNo`, `orgCode`) REFERENCES `SalesQuote`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_salesOrderDocNo_orgCode_fkey` FOREIGN KEY (`salesOrderDocNo`, `orgCode`) REFERENCES `SalesOrder`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_productGradeCode_orgCode_fkey` FOREIGN KEY (`productGradeCode`, `orgCode`) REFERENCES `ProductGrade`(`productGradeCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_productTypeCode_orgCode_fkey` FOREIGN KEY (`productTypeCode`, `orgCode`) REFERENCES `ProductType`(`productTypeCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_productCategoryCode_orgCode_fkey` FOREIGN KEY (`productCategoryCode`, `orgCode`) REFERENCES `ProductCategory`(`productCategoryCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductGrade` ADD CONSTRAINT `ProductGrade_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPackaging` ADD CONSTRAINT `ProductPackaging_packagingCode_orgCode_fkey` FOREIGN KEY (`packagingCode`, `orgCode`) REFERENCES `Packaging`(`packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPackaging` ADD CONSTRAINT `ProductPackaging_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPackaging` ADD CONSTRAINT `ProductPackaging_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPackaging` ADD CONSTRAINT `ProductPackaging_unitCode_orgCode_fkey` FOREIGN KEY (`unitCode`, `orgCode`) REFERENCES `Unit`(`unitCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Packaging` ADD CONSTRAINT `Packaging_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Unit` ADD CONSTRAINT `Unit_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_currencyCode_orgCode_fkey` FOREIGN KEY (`currencyCode`, `orgCode`) REFERENCES `Currency`(`currencyCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankAccount` ADD CONSTRAINT `BankAccount_currencyCode_orgCode_fkey` FOREIGN KEY (`currencyCode`, `orgCode`) REFERENCES `Currency`(`currencyCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankAccount` ADD CONSTRAINT `BankAccount_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPrices` ADD CONSTRAINT `ProductPrices_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPrices` ADD CONSTRAINT `ProductPrices_portCode_orgCode_fkey` FOREIGN KEY (`portCode`, `orgCode`) REFERENCES `Port`(`portCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPrices` ADD CONSTRAINT `ProductPrices_customerCode_orgCode_fkey` FOREIGN KEY (`customerCode`, `orgCode`) REFERENCES `Customer`(`customerCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPrices` ADD CONSTRAINT `ProductPrices_currencyCode_orgCode_fkey` FOREIGN KEY (`currencyCode`, `orgCode`) REFERENCES `Currency`(`currencyCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPrices` ADD CONSTRAINT `ProductPrices_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency` ADD CONSTRAINT `Currency_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tax` ADD CONSTRAINT `Tax_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductType` ADD CONSTRAINT `ProductType_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCategory` ADD CONSTRAINT `ProductCategory_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_warehouseCode_orgCode_fkey` FOREIGN KEY (`warehouseCode`, `orgCode`) REFERENCES `Warehouse`(`warehouseCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryMovement` ADD CONSTRAINT `InventoryMovement_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryMovement` ADD CONSTRAINT `InventoryMovement_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuote` ADD CONSTRAINT `SalesQuote_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuote` ADD CONSTRAINT `SalesQuote_customerCode_orgCode_fkey` FOREIGN KEY (`customerCode`, `orgCode`) REFERENCES `Customer`(`customerCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuote` ADD CONSTRAINT `SalesQuote_currencyCode_orgCode_fkey` FOREIGN KEY (`currencyCode`, `orgCode`) REFERENCES `Currency`(`currencyCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuote` ADD CONSTRAINT `SalesQuote_portCode_orgCode_fkey` FOREIGN KEY (`portCode`, `orgCode`) REFERENCES `Port`(`portCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuote` ADD CONSTRAINT `SalesQuote_vesselCode_orgCode_fkey` FOREIGN KEY (`vesselCode`, `orgCode`) REFERENCES `Vessel`(`vesselCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuote` ADD CONSTRAINT `SalesQuote_warehouseCode_orgCode_fkey` FOREIGN KEY (`warehouseCode`, `orgCode`) REFERENCES `Warehouse`(`warehouseCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuote` ADD CONSTRAINT `SalesQuote_taxCode_orgCode_fkey` FOREIGN KEY (`taxCode`, `orgCode`) REFERENCES `Tax`(`taxCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuoteItem` ADD CONSTRAINT `SalesQuoteItem_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `SalesQuote`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuoteItem` ADD CONSTRAINT `SalesQuoteItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuoteItem` ADD CONSTRAINT `SalesQuoteItem_packagingCode_orgCode_fkey` FOREIGN KEY (`packagingCode`, `orgCode`) REFERENCES `Packaging`(`packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuoteItem` ADD CONSTRAINT `SalesQuoteItem_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuoteItem` ADD CONSTRAINT `SalesQuoteItem_unitCode_orgCode_fkey` FOREIGN KEY (`unitCode`, `orgCode`) REFERENCES `Unit`(`unitCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuoteItem` ADD CONSTRAINT `SalesQuoteItem_salesOrderDocNo_orgCode_fkey` FOREIGN KEY (`salesOrderDocNo`, `orgCode`) REFERENCES `SalesOrder`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuoteItem` ADD CONSTRAINT `SalesQuoteItem_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuoteService` ADD CONSTRAINT `SalesQuoteService_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `SalesQuote`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuoteService` ADD CONSTRAINT `SalesQuoteService_serviceCode_orgCode_fkey` FOREIGN KEY (`serviceCode`, `orgCode`) REFERENCES `Service`(`serviceCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuoteService` ADD CONSTRAINT `SalesQuoteService_salesOrderDocNo_orgCode_fkey` FOREIGN KEY (`salesOrderDocNo`, `orgCode`) REFERENCES `SalesOrder`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrder` ADD CONSTRAINT `SalesOrder_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrder` ADD CONSTRAINT `SalesOrder_customerCode_orgCode_fkey` FOREIGN KEY (`customerCode`, `orgCode`) REFERENCES `Customer`(`customerCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrder` ADD CONSTRAINT `SalesOrder_currencyCode_orgCode_fkey` FOREIGN KEY (`currencyCode`, `orgCode`) REFERENCES `Currency`(`currencyCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrder` ADD CONSTRAINT `SalesOrder_portCode_orgCode_fkey` FOREIGN KEY (`portCode`, `orgCode`) REFERENCES `Port`(`portCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrder` ADD CONSTRAINT `SalesOrder_vesselCode_orgCode_fkey` FOREIGN KEY (`vesselCode`, `orgCode`) REFERENCES `Vessel`(`vesselCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrder` ADD CONSTRAINT `SalesOrder_warehouseCode_orgCode_fkey` FOREIGN KEY (`warehouseCode`, `orgCode`) REFERENCES `Warehouse`(`warehouseCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrder` ADD CONSTRAINT `SalesOrder_taxCode_orgCode_fkey` FOREIGN KEY (`taxCode`, `orgCode`) REFERENCES `Tax`(`taxCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrder` ADD CONSTRAINT `SalesOrder_salesQuoteDocNo_orgCode_fkey` FOREIGN KEY (`salesQuoteDocNo`, `orgCode`) REFERENCES `SalesQuote`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderItem` ADD CONSTRAINT `SalesOrderItem_packagingCode_orgCode_fkey` FOREIGN KEY (`packagingCode`, `orgCode`) REFERENCES `Packaging`(`packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderItem` ADD CONSTRAINT `SalesOrderItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderItem` ADD CONSTRAINT `SalesOrderItem_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderItem` ADD CONSTRAINT `SalesOrderItem_unitCode_orgCode_fkey` FOREIGN KEY (`unitCode`, `orgCode`) REFERENCES `Unit`(`unitCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderItem` ADD CONSTRAINT `SalesOrderItem_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `SalesOrder`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderItem` ADD CONSTRAINT `SalesOrderItem_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderService` ADD CONSTRAINT `SalesOrderService_serviceCode_orgCode_fkey` FOREIGN KEY (`serviceCode`, `orgCode`) REFERENCES `Service`(`serviceCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderService` ADD CONSTRAINT `SalesOrderService_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `SalesOrder`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderService` ADD CONSTRAINT `SalesOrderService_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReleaseOrder` ADD CONSTRAINT `GoodsReleaseOrder_salesOrderDocNo_orgCode_fkey` FOREIGN KEY (`salesOrderDocNo`, `orgCode`) REFERENCES `SalesOrder`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReleaseOrder` ADD CONSTRAINT `GoodsReleaseOrder_warehouseCode_orgCode_fkey` FOREIGN KEY (`warehouseCode`, `orgCode`) REFERENCES `Warehouse`(`warehouseCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReleaseOrder` ADD CONSTRAINT `GoodsReleaseOrder_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReleaseOrderItem` ADD CONSTRAINT `GoodsReleaseOrderItem_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `GoodsReleaseOrder`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReleaseOrderItem` ADD CONSTRAINT `GoodsReleaseOrderItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReleaseOrderItem` ADD CONSTRAINT `GoodsReleaseOrderItem_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReleaseOrderItem` ADD CONSTRAINT `GoodsReleaseOrderItem_salesOrderItemDocNo_salesOrderItemLin_fkey` FOREIGN KEY (`salesOrderItemDocNo`, `salesOrderItemLineNo`, `orgCode`) REFERENCES `SalesOrderItem`(`docNo`, `lineNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReleaseOrderItem` ADD CONSTRAINT `GoodsReleaseOrderItem_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesDelivery` ADD CONSTRAINT `SalesDelivery_goodsReleaseOrderDocNo_orgCode_fkey` FOREIGN KEY (`goodsReleaseOrderDocNo`, `orgCode`) REFERENCES `GoodsReleaseOrder`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesDelivery` ADD CONSTRAINT `SalesDelivery_salesOrderDocNo_orgCode_fkey` FOREIGN KEY (`salesOrderDocNo`, `orgCode`) REFERENCES `SalesOrder`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesDelivery` ADD CONSTRAINT `SalesDelivery_warehouseCode_orgCode_fkey` FOREIGN KEY (`warehouseCode`, `orgCode`) REFERENCES `Warehouse`(`warehouseCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesDelivery` ADD CONSTRAINT `SalesDelivery_truckCode_orgCode_fkey` FOREIGN KEY (`truckCode`, `orgCode`) REFERENCES `Truck`(`truckCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesDelivery` ADD CONSTRAINT `SalesDelivery_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesDeliveryPrint` ADD CONSTRAINT `SalesDeliveryPrint_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesDeliveryItem` ADD CONSTRAINT `SalesDeliveryItem_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `SalesDelivery`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesDeliveryItem` ADD CONSTRAINT `SalesDeliveryItem_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesDeliveryItem` ADD CONSTRAINT `SalesDeliveryItem_salesOrderItemDocNo_salesOrderItemLineNo__fkey` FOREIGN KEY (`salesOrderItemDocNo`, `salesOrderItemLineNo`, `orgCode`) REFERENCES `SalesOrderItem`(`docNo`, `lineNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesDeliveryItem` ADD CONSTRAINT `SalesDeliveryItem_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesDeliveryItemDetail` ADD CONSTRAINT `SalesDeliveryItemDetail_docNo_lineNo_orgCode_fkey` FOREIGN KEY (`docNo`, `lineNo`, `orgCode`) REFERENCES `SalesDeliveryItem`(`docNo`, `lineNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesDeliveryItemDetail` ADD CONSTRAINT `SalesDeliveryItemDetail_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoice` ADD CONSTRAINT `SalesInvoice_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoice` ADD CONSTRAINT `SalesInvoice_salesDeliveryDocNo_orgCode_fkey` FOREIGN KEY (`salesDeliveryDocNo`, `orgCode`) REFERENCES `SalesDelivery`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoice` ADD CONSTRAINT `SalesInvoice_salesOrderDocNo_orgCode_fkey` FOREIGN KEY (`salesOrderDocNo`, `orgCode`) REFERENCES `SalesOrder`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoice` ADD CONSTRAINT `SalesInvoice_customerCode_orgCode_fkey` FOREIGN KEY (`customerCode`, `orgCode`) REFERENCES `Customer`(`customerCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoice` ADD CONSTRAINT `SalesInvoice_bankAccountCode_orgCode_fkey` FOREIGN KEY (`bankAccountCode`, `orgCode`) REFERENCES `BankAccount`(`bankAccountCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoice` ADD CONSTRAINT `SalesInvoice_currencyCode_orgCode_fkey` FOREIGN KEY (`currencyCode`, `orgCode`) REFERENCES `Currency`(`currencyCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoiceItem` ADD CONSTRAINT `SalesInvoiceItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoiceItem` ADD CONSTRAINT `SalesInvoiceItem_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoiceItem` ADD CONSTRAINT `SalesInvoiceItem_packagingCode_orgCode_fkey` FOREIGN KEY (`packagingCode`, `orgCode`) REFERENCES `Packaging`(`packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoiceItem` ADD CONSTRAINT `SalesInvoiceItem_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoiceItem` ADD CONSTRAINT `SalesInvoiceItem_salesDeliveryDocNo_salesDeliveryItemLineNo_fkey` FOREIGN KEY (`salesDeliveryDocNo`, `salesDeliveryItemLineNo`, `orgCode`) REFERENCES `SalesDeliveryItem`(`docNo`, `lineNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoiceItem` ADD CONSTRAINT `SalesInvoiceItem_salesOrderDocNo_salesOrderItemLineNo_orgCo_fkey` FOREIGN KEY (`salesOrderDocNo`, `salesOrderItemLineNo`, `orgCode`) REFERENCES `SalesOrderItem`(`docNo`, `lineNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoiceItem` ADD CONSTRAINT `SalesInvoiceItem_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `SalesInvoice`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoiceService` ADD CONSTRAINT `SalesInvoiceService_serviceCode_orgCode_fkey` FOREIGN KEY (`serviceCode`, `orgCode`) REFERENCES `Service`(`serviceCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoiceService` ADD CONSTRAINT `SalesInvoiceService_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoiceService` ADD CONSTRAINT `SalesInvoiceService_salesOrderDocNo_serviceCode_orgCode_fkey` FOREIGN KEY (`salesOrderDocNo`, `serviceCode`, `orgCode`) REFERENCES `SalesOrderService`(`docNo`, `serviceCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoiceService` ADD CONSTRAINT `SalesInvoiceService_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `SalesInvoice`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesPayment` ADD CONSTRAINT `SalesPayment_currencyCode_orgCode_fkey` FOREIGN KEY (`currencyCode`, `orgCode`) REFERENCES `Currency`(`currencyCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesPayment` ADD CONSTRAINT `SalesPayment_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesPaymentDetail` ADD CONSTRAINT `SalesPaymentDetail_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `SalesPayment`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesPaymentDetail` ADD CONSTRAINT `SalesPaymentDetail_salesInvoiceDocNo_orgCode_fkey` FOREIGN KEY (`salesInvoiceDocNo`, `orgCode`) REFERENCES `SalesInvoice`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesPaymentDetail` ADD CONSTRAINT `SalesPaymentDetail_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesReturn` ADD CONSTRAINT `SalesReturn_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesReturn` ADD CONSTRAINT `SalesReturn_salesOrderDocNo_orgCode_fkey` FOREIGN KEY (`salesOrderDocNo`, `orgCode`) REFERENCES `SalesOrder`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesReturnItem` ADD CONSTRAINT `SalesReturnItem_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `SalesReturn`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesReturnItem` ADD CONSTRAINT `SalesReturnItem_salesOrderItemDocNo_salesOrderItemlineNo_sa_fkey` FOREIGN KEY (`salesOrderItemDocNo`, `salesOrderItemlineNo`, `salesOrderItemOrgCode`) REFERENCES `SalesOrderItem`(`docNo`, `lineNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesReturnItem` ADD CONSTRAINT `SalesReturnItem_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_supplierCode_orgCode_fkey` FOREIGN KEY (`supplierCode`, `orgCode`) REFERENCES `Supplier`(`supplierCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_warehouseCode_orgCode_fkey` FOREIGN KEY (`warehouseCode`, `orgCode`) REFERENCES `Warehouse`(`warehouseCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_currencyCode_orgCode_fkey` FOREIGN KEY (`currencyCode`, `orgCode`) REFERENCES `Currency`(`currencyCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `PurchaseOrder`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_unitCode_orgCode_fkey` FOREIGN KEY (`unitCode`, `orgCode`) REFERENCES `Unit`(`unitCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReturn` ADD CONSTRAINT `PurchaseReturn_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReturn` ADD CONSTRAINT `PurchaseReturn_purchaseOrderDocNo_orgCode_fkey` FOREIGN KEY (`purchaseOrderDocNo`, `orgCode`) REFERENCES `PurchaseOrder`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReturnItem` ADD CONSTRAINT `PurchaseReturnItem_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `PurchaseReturn`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReturnItem` ADD CONSTRAINT `PurchaseReturnItem_docNo_lineNo_orgCode_fkey` FOREIGN KEY (`docNo`, `lineNo`, `orgCode`) REFERENCES `PurchaseOrderItem`(`docNo`, `lineNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReturnItem` ADD CONSTRAINT `PurchaseReturnItem_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransfer` ADD CONSTRAINT `StockTransfer_fromWarehouseCode_orgCode_fkey` FOREIGN KEY (`fromWarehouseCode`, `orgCode`) REFERENCES `Warehouse`(`warehouseCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransfer` ADD CONSTRAINT `StockTransfer_toWarehouseCode_orgCode_fkey` FOREIGN KEY (`toWarehouseCode`, `orgCode`) REFERENCES `Warehouse`(`warehouseCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransfer` ADD CONSTRAINT `StockTransfer_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransfer` ADD CONSTRAINT `StockTransfer_truckCode_orgCode_fkey` FOREIGN KEY (`truckCode`, `orgCode`) REFERENCES `Truck`(`truckCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransferItem` ADD CONSTRAINT `StockTransferItem_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `StockTransfer`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransferItem` ADD CONSTRAINT `StockTransferItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransferItem` ADD CONSTRAINT `StockTransferItem_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransferItem` ADD CONSTRAINT `StockTransferItem_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransferReceipt` ADD CONSTRAINT `StockTransferReceipt_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransferReceiptItem` ADD CONSTRAINT `StockTransferReceiptItem_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransferReceiptItem` ADD CONSTRAINT `StockTransferReceiptItem_stockTransferReceiptDocNo_stockTra_fkey` FOREIGN KEY (`stockTransferReceiptDocNo`, `stockTransferReceiptOrgCode`) REFERENCES `StockTransferReceipt`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReceipt` ADD CONSTRAINT `PurchaseReceipt_purchaseOrderDocNo_orgCode_fkey` FOREIGN KEY (`purchaseOrderDocNo`, `orgCode`) REFERENCES `PurchaseOrder`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReceipt` ADD CONSTRAINT `PurchaseReceipt_warehouseCode_orgCode_fkey` FOREIGN KEY (`warehouseCode`, `orgCode`) REFERENCES `Warehouse`(`warehouseCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReceipt` ADD CONSTRAINT `PurchaseReceipt_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReceiptItem` ADD CONSTRAINT `PurchaseReceiptItem_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `PurchaseReceipt`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReceiptItem` ADD CONSTRAINT `PurchaseReceiptItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReceiptItem` ADD CONSTRAINT `PurchaseReceiptItem_packagingCode_orgCode_fkey` FOREIGN KEY (`packagingCode`, `orgCode`) REFERENCES `Packaging`(`packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReceiptItem` ADD CONSTRAINT `PurchaseReceiptItem_purchaseOrderDocNo_purchaseOrderLineNo__fkey` FOREIGN KEY (`purchaseOrderDocNo`, `purchaseOrderLineNo`, `orgCode`) REFERENCES `PurchaseOrderItem`(`docNo`, `lineNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReceiptItem` ADD CONSTRAINT `PurchaseReceiptItem_unitCode_orgCode_fkey` FOREIGN KEY (`unitCode`, `orgCode`) REFERENCES `Unit`(`unitCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReceiptItem` ADD CONSTRAINT `PurchaseReceiptItem_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseInvoice` ADD CONSTRAINT `PurchaseInvoice_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseInvoice` ADD CONSTRAINT `PurchaseInvoice_purchaseReceiptDocNo_orgCode_fkey` FOREIGN KEY (`purchaseReceiptDocNo`, `orgCode`) REFERENCES `PurchaseReceipt`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseInvoiceItem` ADD CONSTRAINT `PurchaseInvoiceItem_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `PurchaseInvoice`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseInvoiceItem` ADD CONSTRAINT `PurchaseInvoiceItem_purchaseReceiptDocNo_purchaseReceiptLin_fkey` FOREIGN KEY (`purchaseReceiptDocNo`, `purchaseReceiptLineNo`, `orgCode`) REFERENCES `PurchaseReceiptItem`(`docNo`, `lineNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseInvoiceItem` ADD CONSTRAINT `PurchaseInvoiceItem_packagingCode_orgCode_fkey` FOREIGN KEY (`packagingCode`, `orgCode`) REFERENCES `Packaging`(`packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseInvoiceItem` ADD CONSTRAINT `PurchaseInvoiceItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseInvoiceItem` ADD CONSTRAINT `PurchaseInvoiceItem_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseInvoiceItem` ADD CONSTRAINT `PurchaseInvoiceItem_purchaseOrderItemDocNo_purchaseOrderIte_fkey` FOREIGN KEY (`purchaseOrderItemDocNo`, `purchaseOrderItemLineNo`, `purchaseOrderItemOrgCode`) REFERENCES `PurchaseOrderItem`(`docNo`, `lineNo`, `orgCode`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasePayment` ADD CONSTRAINT `PurchasePayment_currencyCode_orgCode_fkey` FOREIGN KEY (`currencyCode`, `orgCode`) REFERENCES `Currency`(`currencyCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasePayment` ADD CONSTRAINT `PurchasePayment_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasePaymentDetail` ADD CONSTRAINT `PurchasePaymentDetail_docNo_orgCode_fkey` FOREIGN KEY (`docNo`, `orgCode`) REFERENCES `PurchasePayment`(`docNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasePaymentDetail` ADD CONSTRAINT `PurchasePaymentDetail_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SKTD` ADD CONSTRAINT `SKTD_customerCode_orgCode_fkey` FOREIGN KEY (`customerCode`, `orgCode`) REFERENCES `Customer`(`customerCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SKTD` ADD CONSTRAINT `SKTD_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SKTDItem` ADD CONSTRAINT `SKTDItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SKTDItem` ADD CONSTRAINT `SKTDItem_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SKTDUsage` ADD CONSTRAINT `SKTDUsage_salesOrderDocNo_salesOrderItemLineNo_orgCode_fkey` FOREIGN KEY (`salesOrderDocNo`, `salesOrderItemLineNo`, `orgCode`) REFERENCES `SalesOrderItem`(`docNo`, `lineNo`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SKTDUsage` ADD CONSTRAINT `SKTDUsage_orgCode_fkey` FOREIGN KEY (`orgCode`) REFERENCES `Org`(`orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;
