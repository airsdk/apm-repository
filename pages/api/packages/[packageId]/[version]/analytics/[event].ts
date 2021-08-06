import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../../lib/prisma";
import { PackageVersion } from "types/model";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const packageId = req.query.packageId;
  const version = req.query.version;
  const event = req.query.event;

  var updateData: any = {};
  let createData: any = {};

  if (event == "install") {
    updateData = { installs: { increment: 1 } };
    createData = { installs: 1 };
  } else if (event == "uninstall") {
    updateData = { uninstalls: { increment: 1 } };
    createData = { uninstalls: 1 };
  } else if (event == "download") {
    updateData = { downloads: { increment: 1 } };
    createData = { downloads: 1 };
  } else {
    res.status(400).json({ success: false, message: "Invalid event type" });
    return;
  }

  const packageVersionData = await prisma.packageVersion.findFirst({
    where: {
      published: true,
      package: {
        identifier: String(packageId),
      },
      version: String(version),
    },
    include: {
      package: true,
    },
  });

  if (packageVersionData) {
    var versionAnalytics: any = {};
    var packageAnalytics: any = {};
    if (packageVersionData.analyticsIndex) {
      versionAnalytics = await prisma.analytics.update({
        where: { index: packageVersionData.analyticsIndex },
        data: updateData,
      });
    } else {
      versionAnalytics = await prisma.analytics.create({
        data: createData,
      });
      await prisma.packageVersion.update({
        where: { index: packageVersionData.index },
        data: { analyticsIndex: versionAnalytics.index },
      });
    }

    if (packageVersionData.package.analyticsIndex) {
      packageAnalytics = await prisma.analytics.update({
        where: { index: packageVersionData.package.analyticsIndex },
        data: updateData,
      });
    } else {
      packageAnalytics = await prisma.analytics.create({
        data: createData,
      });
      await prisma.package.update({
        where: { index: packageVersionData.package.index },
        data: { analyticsIndex: packageAnalytics.index },
      });
    }

    res.status(200).json({
      success: true,
      analytics: versionAnalytics,
      packageAnalytics,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Invalid package or version",
    });
  }
};
