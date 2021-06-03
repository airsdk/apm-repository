import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

type Data = {
  name: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { q } = req.query;

  const packages = await prisma.package.findMany({
    where: {
      published: true,
      OR: [
        { name: { contains: String(q) } },
        { description: { contains: String(q) } },
        { identifier: { contains: String(q) } },
      ],
    },
    include: { 
      publisher: { select: { name: true, url: true } }, 
      tags: true },
  });

  res.status(200).json(packages);
};
