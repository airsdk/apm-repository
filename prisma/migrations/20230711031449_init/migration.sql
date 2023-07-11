-- CreateTable
CREATE TABLE `Publisher` (
    `index` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `url` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Package` (
    `index` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `readme` LONGTEXT NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `docUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `type` VARCHAR(191) NOT NULL DEFAULT 'ane',
    `published` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `publisherIndex` INTEGER NOT NULL,
    `licenseIndex` INTEGER NULL,
    `purchaseUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `analyticsIndex` INTEGER NULL,

    UNIQUE INDEX `Package_identifier_key`(`identifier`),
    PRIMARY KEY (`index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PackageVersion` (
    `index` INTEGER NOT NULL AUTO_INCREMENT,
    `packageIndex` INTEGER NOT NULL,
    `sourceUrl` VARCHAR(191) NOT NULL,
    `changelog` LONGTEXT NULL,
    `checksum` VARCHAR(191) NOT NULL DEFAULT '',
    `version` VARCHAR(191) NOT NULL DEFAULT '0.0.0',
    `published` BOOLEAN NOT NULL DEFAULT false,
    `status` VARCHAR(191) NOT NULL DEFAULT '',
    `publishedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `analyticsIndex` INTEGER NULL,

    UNIQUE INDEX `PackageVersion_version_packageIndex_key`(`version`, `packageIndex`),
    PRIMARY KEY (`index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PackageVersionDependency` (
    `index` INTEGER NOT NULL AUTO_INCREMENT,
    `packageIndex` INTEGER NOT NULL,
    `version` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PackageVersionDependency_version_packageIndex_key`(`version`, `packageIndex`),
    PRIMARY KEY (`index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Parameter` (
    `index` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `required` BOOLEAN NOT NULL DEFAULT false,
    `defaultValue` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `Parameter_name_required_defaultValue_key`(`name`, `required`, `defaultValue`),
    PRIMARY KEY (`index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `index` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tag_name_key`(`name`),
    PRIMARY KEY (`index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `License` (
    `index` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL DEFAULT '',
    `url` VARCHAR(191) NOT NULL DEFAULT '',
    `public` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `License_type_url_key`(`type`, `url`),
    PRIMARY KEY (`index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Analytics` (
    `index` INTEGER NOT NULL AUTO_INCREMENT,
    `downloads` INTEGER NOT NULL DEFAULT 0,
    `installs` INTEGER NOT NULL DEFAULT 0,
    `uninstalls` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PackageToTag` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PackageToTag_AB_unique`(`A`, `B`),
    INDEX `_PackageToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PackageVersionToParameter` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PackageVersionToParameter_AB_unique`(`A`, `B`),
    INDEX `_PackageVersionToParameter_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PackageVersionToPackageVersionDependency` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PackageVersionToPackageVersionDependency_AB_unique`(`A`, `B`),
    INDEX `_PackageVersionToPackageVersionDependency_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Package` ADD CONSTRAINT `Package_publisherIndex_fkey` FOREIGN KEY (`publisherIndex`) REFERENCES `Publisher`(`index`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Package` ADD CONSTRAINT `Package_licenseIndex_fkey` FOREIGN KEY (`licenseIndex`) REFERENCES `License`(`index`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Package` ADD CONSTRAINT `Package_analyticsIndex_fkey` FOREIGN KEY (`analyticsIndex`) REFERENCES `Analytics`(`index`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackageVersion` ADD CONSTRAINT `PackageVersion_packageIndex_fkey` FOREIGN KEY (`packageIndex`) REFERENCES `Package`(`index`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackageVersion` ADD CONSTRAINT `PackageVersion_analyticsIndex_fkey` FOREIGN KEY (`analyticsIndex`) REFERENCES `Analytics`(`index`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackageVersionDependency` ADD CONSTRAINT `PackageVersionDependency_packageIndex_fkey` FOREIGN KEY (`packageIndex`) REFERENCES `Package`(`index`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PackageToTag` ADD CONSTRAINT `_PackageToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `Package`(`index`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PackageToTag` ADD CONSTRAINT `_PackageToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`index`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PackageVersionToParameter` ADD CONSTRAINT `_PackageVersionToParameter_A_fkey` FOREIGN KEY (`A`) REFERENCES `PackageVersion`(`index`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PackageVersionToParameter` ADD CONSTRAINT `_PackageVersionToParameter_B_fkey` FOREIGN KEY (`B`) REFERENCES `Parameter`(`index`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PackageVersionToPackageVersionDependency` ADD CONSTRAINT `_PackageVersionToPackageVersionDependency_A_fkey` FOREIGN KEY (`A`) REFERENCES `PackageVersion`(`index`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PackageVersionToPackageVersionDependency` ADD CONSTRAINT `_PackageVersionToPackageVersionDependency_B_fkey` FOREIGN KEY (`B`) REFERENCES `PackageVersionDependency`(`index`) ON DELETE CASCADE ON UPDATE CASCADE;
