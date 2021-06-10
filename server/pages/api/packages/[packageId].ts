import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import type { Package } from 'types/package'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const packageId = req.query.packageId;

  const packageData = await prisma.package.findFirst({
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

  if (packageData)
  {
    res.status(200).json(packageData);
  }
  else 
  {
    res.status(404).json({})
  }

};
