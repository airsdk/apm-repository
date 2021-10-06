import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const packageId = req.query.packageId;
  const version = req.query.version;

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
        },
        where: {
          version: String(version),
        },
        orderBy: {
          publishedAt: "desc",
        },
      },
    },
  });

  if (packageData) {
    res.status(200).json(packageData);
  } else {
    res.status(404).json({});
  }
};
