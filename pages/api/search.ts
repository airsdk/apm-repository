import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { processPackageDataArray } from "lib/utils/processPackageData";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { q, t } = req.query;

  const includePrerelease =
    req.query.includePrerelease === undefined
      ? false
      : req.query.includePrerelease;
  var excludedStatusValues = [];
  if (!includePrerelease) excludedStatusValues.push("prerelease");

  const tags = await prisma.tag.findMany({
    where: {
      name: { contains: String(t) },
    },
    select: {
      packages: {
        select: {
          index: true,
        },
      },
    },
  });

  const tagPackageIndexes = tags.flatMap((t) =>
    t.packages.flatMap((p) => p.index)
  );

  const packages = await prisma.package.findMany({
    where: {
      published: true,
      OR: [
        { name: { contains: String(q) } },
        { identifier: { contains: String(q) } },
        { description: { contains: String(q) } },
        { readme: { contains: String(q) } },
        { index: { in: tagPackageIndexes } },
        {
          tags: {
            some: { name: String(q) },
          },
        },
      ],
    },
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

  res.status(200).json(processPackageDataArray(packages));
};
