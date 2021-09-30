import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const includePrerelease =
    req.query.includePrerelease === undefined
      ? false
      : req.query.includePrerelease;
  var excludedStatusValues = [];
  if (!includePrerelease) excludedStatusValues.push("prerelease");

  const packages = await prisma.package.findMany({
    where: { published: true },
    include: {
      publisher: { select: { name: true, url: true } },
      tags: true,
      versions: {
        where: {
          published: true,
          status: { notIn: excludedStatusValues },
        },
        orderBy: {
          publishedAt: "desc",
        },
        take: 1,
      },
    },
  });

  res.status(200).json(packages);
};
