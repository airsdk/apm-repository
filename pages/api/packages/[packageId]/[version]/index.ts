import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const packageId: string = String(req.query.packageId);
  const version: string = String(req.query.version);
  const includePrerelease: boolean =
    req.query.includePrerelease === undefined
      ? false
      : req.query.includePrerelease == "true";

  // Only populate this for a version query as we allow direct access to any version regardless of status
  var excludedStatusValues: string[] = [];
  var versionQuery: string = version;

  // Check for a version range query
  if (versionQuery.indexOf("x") >= 0) {
    // Remove x to get something like "4.5." from "4.5.x"
    versionQuery = versionQuery.substring(0, versionQuery.indexOf("x"));

    // This is a query so limit status
    if (!includePrerelease) excludedStatusValues.push("prerelease");
    excludedStatusValues.push("discontinued");
  }

  const packageData = await prisma.package.findFirst({
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
          parameters: true,
          platforms: true,
        },
        where: {
          published: true,
          version: {
            startsWith: versionQuery,
          },
          status: {
            notIn: excludedStatusValues,
          },
        },
        orderBy: {
          publishedAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (packageData) {
    res.status(200).json(packageData);
  } else {
    res.status(404).json({});
  }
};
