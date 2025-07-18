import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import type { Platform, Publisher } from "@prisma/client";
import { createNewPackage, getDependencies, getPublisher, updateExistingPackage } from "lib/utils/packageUpdates";


const validatePlatform = (platform: Platform | string) => {
  if (platform === null || platform === undefined) {
    return false;
  }
  if (typeof platform === "string") {
    platform = { name: platform } as Platform;
  }
  platform.name = platform.name.toLowerCase();
  switch (platform.name) {
    case 'windows':
    case 'macos':
    case 'tvos':
    case 'ios':
    case 'android':
    case 'linux':
      return true;
  }
  return false;
}

const checkAuthorised = async (publisher: any, packageId: string) => {

  if (publisher === null || publisher === undefined) {
    return false; // Unauthorised
  }

  if (publisher!.packages.length == 0) {
    // check if package is published by a different publisher
    const existingPackage = await prisma.package.findMany({
      where: {
        identifier: String(packageId),
      },
    });
    if (existingPackage.length > 0) {
      return false; // Package exists but not by this publisher
    }
  }
  return true; // Authorised
};


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.substr("token ".length);
  if (token === undefined) {
    return res.status(401).json({
      packageId: String(req.query.packageId),
      success: false,
      message: "You are not authorised access this API",
    });
  }

  const includePrerelease: boolean =
    req.query.includePrerelease === undefined
      ? false
      : req.query.includePrerelease == "true";

  const packageId = req.query.packageId;
  const packageReq = req.body.packageDef;
  const readme = req.body.readme;
  const changelog = req.body.changelog;

  const publisher = await getPublisher(token!, String(packageId));
  if (publisher == null) {
    return res.status(401).json({
      packageId: String(packageId),
      success: false,
      message: "You are not authorised access this API",
    });
  }
  const authorised = await checkAuthorised(publisher, String(packageId));
  if (!authorised) {
    return res.status(401).json({
      packageId: String(packageId),
      success: false,
      message: "You are not authorised to modify this package",
    });
  }

  // Validate published date
  var publishedAt = new Date().toISOString();
  if (packageReq.publishedAt.length > 0) {
    try {
      publishedAt = new Date(packageReq.publishedAt).toISOString();
    } catch (e) { }
  }

  // Validate parameters
  if (packageReq.parameters === undefined) {
    packageReq.parameters = [];
  }
  packageReq.parameters = packageReq.parameters.map((p: any) => {
    console.log( p );
    if (typeof p === "string") {
      p = { name: p } as any;
    }
    p.required = p.required === "true" || p.required === true;
    p.platforms = (p.platforms || []).filter((platform: any) => validatePlatform(platform));
    return p;
  });

  // Validate platforms
  if (packageReq.platforms === undefined) {
    packageReq.platforms = [];
  }
  packageReq.platforms = packageReq.platforms.map((p: Platform | string) => {
    if (typeof p === "string") {
      p = { name: p } as Platform;
    }
    p.name = p.name.toLowerCase();
    return p;
  })
    .filter((p: any) => validatePlatform(p));

  // Validate platform parameters - convert to array (name,value,platform)
  console.log("packageReq.platformParameters", packageReq.platformParameters);
  if (packageReq.platformParameters === undefined) {
    packageReq.platformParameters = [];
  }
  if (packageReq.platformParameters && typeof packageReq.platformParameters === 'object' && !Array.isArray(packageReq.platformParameters)) {
    const flattenedParams: { name: string; value: string; platform: string }[] = [];
    Object.keys(packageReq.platformParameters).forEach(platform => {
      const platformData = packageReq.platformParameters[platform];
      Object.keys(platformData).forEach(paramName => {
        flattenedParams.push({
          platform: platform,
          name: paramName,
          value: platformData[paramName]
        });
      });
    });
    packageReq.platformParameters = flattenedParams;
  }
  packageReq.platformParameters = packageReq.platformParameters.map((p: any) => {
    if (p.platform) p.platform = p.platform.toLowerCase();
    return p;
  })
    .filter((p: any) => validatePlatform(p.platform));

  // Determine dependencies
  let dependencies = await getDependencies(packageReq, includePrerelease);

  if (publisher!.packages.length > 0) {
    const packageNewResult = await updateExistingPackage(
      packageReq,
      readme,
      dependencies,
      publishedAt,
      changelog,
      publisher);
    res.status(200).json({
      packageId: String(packageId),
      success: true,
      message: "Updated existing package",
      p: packageReq,
      n: packageNewResult,
    });
  }
  else {
    const packageNewResult = await createNewPackage(
      packageReq,
      String(packageId),
      readme,
      dependencies,
      publishedAt,
      changelog,
      publisher
    );
    res.status(200).json({
      packageId: String(packageId),
      success: true,
      message: "Created new package",
      p: packageReq,
      n: packageNewResult,
    });
  }

};

