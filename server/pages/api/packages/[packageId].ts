import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type Data = {
  name: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const packageId = req.query.packageId;

  const packages = await prisma.package.findMany({
    where: {
      published: true,
      identifier: String(packageId)
    },
    include: { 
      publisher: { select: { name: true, url: true } }, 
      tags: true,
      parameters: true,
      dependencies: true
    },
  });

  res.status(200).json(packages);
};
