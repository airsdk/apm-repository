import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const packages = await prisma.package.findMany({
    where: { published: true },
    include: { publisher: { select: { name: true, url: true } } }
  });

  res.status(200).json(packages);
};
