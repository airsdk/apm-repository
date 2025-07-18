import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { processPackageData } from "lib/utils/processPackageData";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const packageId = req.query.packageId;
  const includePrerelease =
    req.query.includePrerelease === undefined
      ? false
      : req.query.includePrerelease;
  var excludedStatusValues = ["discontinued"];
  if (!includePrerelease) excludedStatusValues.push("prerelease");

  let packageData = await prisma.package.findFirst({
    where: {
      published: true,
      identifier: String(packageId),
    },
    include: {
      publisher: { select: { name: true, url: true } },
      license: true,
      analytics: true,
      tags: true,
      versions: {
        include: {
          analytics: true,
          dependencies: {
            include: {
              package: true,
            },
          },
          parameters: {
            include: {
              platforms: true,
            },
          },
          platforms: true,
          platformParameters: true,
        },
        where: {
          published: true,
          status: { notIn: excludedStatusValues },
        },
        orderBy: {
          publishedAt: "desc",
        },
      },
    },
  });

  if (packageData) {
    packageData = processPackageData(packageData);
    res.status(200).json(packageData);
  } else {
    res.status(404).json({});
  }
};
