/*
  Warnings:

  - The primary key for the `Inventory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `InventoryMovement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProductPackaging` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProductPrices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SKTDItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `VesselProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `GoodsReleaseOrderItem` DROP FOREIGN KEY `GoodsReleaseOrderItem_productCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `GoodsReleaseOrderItem` DROP FOREIGN KEY `GoodsReleaseOrderItem_productCode_packagingCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_productCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_productCode_packagingCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryMovement` DROP FOREIGN KEY `InventoryMovement_productCode_packagingCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `ProductPackaging` DROP FOREIGN KEY `ProductPackaging_productCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `ProductPrices` DROP FOREIGN KEY `ProductPrices_productCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `PurchaseInvoiceItem` DROP FOREIGN KEY `PurchaseInvoiceItem_productCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `PurchaseOrderItem` DROP FOREIGN KEY `PurchaseOrderItem_productCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `PurchaseOrderItem` DROP FOREIGN KEY `PurchaseOrderItem_productCode_packagingCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `PurchaseReceiptItem` DROP FOREIGN KEY `PurchaseReceiptItem_productCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `SKTDItem` DROP FOREIGN KEY `SKTDItem_productCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `SalesDeliveryItem` DROP FOREIGN KEY `SalesDeliveryItem_productCode_packagingCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `SalesInvoiceItem` DROP FOREIGN KEY `SalesInvoiceItem_productCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `SalesInvoiceItem` DROP FOREIGN KEY `SalesInvoiceItem_productCode_packagingCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `SalesOrderItem` DROP FOREIGN KEY `SalesOrderItem_productCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `SalesOrderItem` DROP FOREIGN KEY `SalesOrderItem_productCode_packagingCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `SalesQuoteItem` DROP FOREIGN KEY `SalesQuoteItem_productCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `SalesQuoteItem` DROP FOREIGN KEY `SalesQuoteItem_productCode_packagingCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `StockTransferItem` DROP FOREIGN KEY `StockTransferItem_productCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `StockTransferItem` DROP FOREIGN KEY `StockTransferItem_productCode_packagingCode_orgCode_fkey`;

-- DropForeignKey
ALTER TABLE `VesselProduct` DROP FOREIGN KEY `VesselProduct_productCode_orgCode_fkey`;

-- AlterTable
ALTER TABLE `GoodsReleaseOrderItem` MODIFY `productCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Inventory` DROP PRIMARY KEY,
    MODIFY `productCode` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`productCode`, `packagingCode`, `warehouseCode`, `orgCode`);

-- AlterTable
ALTER TABLE `InventoryMovement` DROP PRIMARY KEY,
    MODIFY `productCode` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`productCode`, `packagingCode`, `docType`, `orgCode`);

-- AlterTable
ALTER TABLE `Product` DROP PRIMARY KEY,
    MODIFY `productCode` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`productCode`, `orgCode`);

-- AlterTable
ALTER TABLE `ProductPackaging` DROP PRIMARY KEY,
    MODIFY `productCode` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`productCode`, `packagingCode`, `orgCode`);

-- AlterTable
ALTER TABLE `ProductPrices` DROP PRIMARY KEY,
    MODIFY `productCode` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`productCode`, `orgCode`, `portCode`, `customerCode`);

-- AlterTable
ALTER TABLE `PurchaseInvoiceItem` MODIFY `productCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `PurchaseOrderItem` MODIFY `productCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `PurchaseReceiptItem` MODIFY `productCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SKTDItem` DROP PRIMARY KEY,
    MODIFY `productCode` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`docNo`, `productCode`, `orgCode`);

-- AlterTable
ALTER TABLE `SalesDeliveryItem` MODIFY `productCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SalesInvoiceItem` MODIFY `productCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SalesOrderItem` MODIFY `productCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SalesQuoteItem` MODIFY `productCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `StockTransferItem` MODIFY `productCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `VesselProduct` DROP PRIMARY KEY,
    MODIFY `productCode` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`vesselCode`, `productCode`, `orgCode`);

-- AddForeignKey
ALTER TABLE `VesselProduct` ADD CONSTRAINT `VesselProduct_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPackaging` ADD CONSTRAINT `ProductPackaging_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPrices` ADD CONSTRAINT `ProductPrices_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryMovement` ADD CONSTRAINT `InventoryMovement_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuoteItem` ADD CONSTRAINT `SalesQuoteItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesQuoteItem` ADD CONSTRAINT `SalesQuoteItem_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderItem` ADD CONSTRAINT `SalesOrderItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderItem` ADD CONSTRAINT `SalesOrderItem_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReleaseOrderItem` ADD CONSTRAINT `GoodsReleaseOrderItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReleaseOrderItem` ADD CONSTRAINT `GoodsReleaseOrderItem_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesDeliveryItem` ADD CONSTRAINT `SalesDeliveryItem_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoiceItem` ADD CONSTRAINT `SalesInvoiceItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesInvoiceItem` ADD CONSTRAINT `SalesInvoiceItem_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransferItem` ADD CONSTRAINT `StockTransferItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockTransferItem` ADD CONSTRAINT `StockTransferItem_productCode_packagingCode_orgCode_fkey` FOREIGN KEY (`productCode`, `packagingCode`, `orgCode`) REFERENCES `ProductPackaging`(`productCode`, `packagingCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseReceiptItem` ADD CONSTRAINT `PurchaseReceiptItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseInvoiceItem` ADD CONSTRAINT `PurchaseInvoiceItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SKTDItem` ADD CONSTRAINT `SKTDItem_productCode_orgCode_fkey` FOREIGN KEY (`productCode`, `orgCode`) REFERENCES `Product`(`productCode`, `orgCode`) ON DELETE RESTRICT ON UPDATE CASCADE;
