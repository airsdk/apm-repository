import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const packageId = req.query.packageId;
  const version = req.query.version;

  const packageData = await prisma.package.findFirst({
    where: {
      published: true,
      identifier: String(packageId),
    },
    orderBy: {
      publishedAt: "desc",
    },
    include: {
      publisher: { select: { name: true, url: true } },
      tags: true,
      versions: {
        include: {
          dependencies: 
          {
            include: 
            {
              package: true
            }
          },
          parameters: true,
        },
        where: {
          version: String(version),
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
