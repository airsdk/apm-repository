import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { q, t } = req.query;

  const tags = await prisma.tag.findMany({
    where: {
      name: {contains: String(q) }
    },
    select: {
      packages: {
        select: {
          index: true
        }
      }
    }
  });

  console.log( tags );
  const tagPackageIndexes = tags.flatMap( t => t.packages.flatMap( p => p.index ) );

  const packages = await prisma.package.findMany({
    where: {
      published: true,
      OR: [
        { name: { contains: String(q) } },
        { identifier: { contains: String(q) } },
        { description: { contains: String(q) } },
        { readme: { contains: String(q) } },
        { index: { in: tagPackageIndexes } },
        // { tags: { 
        //   where: { 
        //     name: { contains: String(q) } 
        //   }
        // }}
      ],
    },
    include: { 
      publisher: { select: { name: true, url: true } },
      tags: true,
      versions: {
        where: {
          published: true,
        },
        orderBy: {
          publishedAt: 'desc',
        },
        take: 1
      },
    },
  });

  // res.status(200).json(tagPackageIndexes);
  res.status(200).json(packages);
};
