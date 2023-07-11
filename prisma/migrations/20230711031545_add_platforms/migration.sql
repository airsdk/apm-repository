-- CreateTable
CREATE TABLE `Platform` (
    `index` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Platform_name_key`(`name`),
    PRIMARY KEY (`index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PackageVersionToPlatform` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PackageVersionToPlatform_AB_unique`(`A`, `B`),
    INDEX `_PackageVersionToPlatform_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PackageVersionToPlatform` ADD CONSTRAINT `_PackageVersionToPlatform_A_fkey` FOREIGN KEY (`A`) REFERENCES `PackageVersion`(`index`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PackageVersionToPlatform` ADD CONSTRAINT `_PackageVersionToPlatform_B_fkey` FOREIGN KEY (`B`) REFERENCES `Platform`(`index`) ON DELETE CASCADE ON UPDATE CASCADE;
