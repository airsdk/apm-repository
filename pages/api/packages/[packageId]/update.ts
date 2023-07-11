import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import type { Package, Platform } from "@prisma/client";
import { version } from "process";
import { Prisma } from "@prisma/client";

const validatePlatform = (platform: Platform) => {
  platform.name = platform.name.toLowerCase();
  switch (platform.name) {
    case 'windows':
    case 'macos':
    case 'ios':
    case 'android':
    case 'linux':
      return true;
  }
  return false;
}


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.substr("token ".length);

  const includePrerelease: boolean =
    req.query.includePrerelease === undefined
      ? false
      : req.query.includePrerelease == "true";

  const packageId = req.query.packageId;

  const packageReq = req.body.packageDef;
  const readme = req.body.readme;
  const changelog = req.body.changelog;

  // TODO Need to validate data
  // Validate data
  // Validate published date
  var publishedAt = new Date().toISOString();
  if (packageReq.publishedAt.length > 0) {
    try {
      publishedAt = new Date(packageReq.publishedAt).toISOString();
    } catch (e) { }
  }
  if (packageReq.parameters === undefined) {
    packageReq.parameters = [];
  }
  var platforms = packageReq.platforms;
  packageReq.platforms = [];
  if (platforms !== undefined) {
    for (const platform of platforms) {
      if (validatePlatform(platform)) {
        packageReq.platforms.push(platform);
      }
    }
  }
  console.log(packageReq.platforms);

  // Some level of auth using a token
  // TODO improve this
  const publisher = await prisma.publisher.findFirst({
    where: {
      token: String(token),
    },
    include: {
      packages: {
        where: {
          identifier: String(packageId),
        },
      },
    },
  });

  if (!publisher) {
    // Unauthorised
    return res.status(401).json({
      packageId: String(packageId),
      success: false,
      message: "You are not authorised access this API",
    });
  }


  // Determine dependencies
  // TODO improve this ?
  let dependencies: Prisma.Enumerable<Prisma.PackageVersionDependencyCreateOrConnectWithoutPackageVersionsInput> =
    await Promise.all(
      packageReq.dependencies.map(
        async (d: { id: string; version: string }) => {
          var excludedStatusValues: string[] = [];
          var versionQuery: string = d.version;
          // Check for a version range query
          if (versionQuery.indexOf("x") >= 0) {
            // Remove x to get something like "4.5." from "4.5.x"
            versionQuery = versionQuery.substring(
              0,
              versionQuery.indexOf("x")
            );

            // This is a query so limit status
            if (!includePrerelease) excludedStatusValues.push("prerelease");
            excludedStatusValues.push("discontinued");
          }

          const p = await prisma.package.findFirst({
            where: { identifier: d.id },
            include: {
              versions: {
                where: {
                  published: true,
                  version: {
                    startsWith: versionQuery,
                  },
                  status: {
                    notIn: excludedStatusValues,
                  },
                },
                orderBy: {
                  publishedAt: "desc",
                },
                take: 1,
              },
            },
          });
          return {
            where: {
              packageVersionId: {
                version: d.version,
                packageIndex: p?.index,
              },
            },
            create: {
              version: d.version,
              packageIndex: p?.index,
            },
          };
        }
      )
    );

  if (publisher.packages.length > 0) {
    //
    // UPDATE / CREATE PACKAGE VERSION
    //
    const packageVersionUpdateResult = await prisma.packageVersion.upsert({
      where: {
        packageVersionId: {
          version: packageReq.version,
          packageIndex: publisher.packages[0].index,
        },
      },
      update: {
        sourceUrl: packageReq.sourceUrl,
        checksum: packageReq.checksum,
        version: packageReq.version,
        published: publishedFromStatus(packageReq.status),
        status: validateStatus(packageReq.status),
        publishedAt: publishedAt,
        changelog: changelog,
        dependencies: {
          connectOrCreate: dependencies,
        },
        parameters: {
          connectOrCreate: packageReq.parameters.map(
            (m: {
              name: string;
              required: boolean;
              defaultValue: string;
            }) => {
              return {
                create: {
                  name: m.name,
                  required: m.required,
                  defaultValue: m.defaultValue,
                },
                where: {
                  nameRequiredDefault: {
                    name: m.name,
                    required: m.required,
                    defaultValue: m.defaultValue,
                  },
                },
              };
            }
          ),
        },
        platforms: {
          connectOrCreate: packageReq.platforms.map((m: { name: String }) => {
            return {
              create: { name: m.name },
              where: { name: m.name },
            };
          }),
        },
      },
      create: {
        package: { connect: { index: publisher.packages[0].index } },
        sourceUrl: packageReq.sourceUrl,
        checksum: packageReq.checksum,
        version: packageReq.version,
        changelog: changelog,
        published: publishedFromStatus(packageReq.status),
        status: validateStatus(packageReq.status),
        publishedAt: publishedAt,
        dependencies: {
          connectOrCreate: dependencies,
        },
        parameters: {
          connectOrCreate: packageReq.parameters.map(
            (m: {
              name: string;
              required: boolean;
              defaultValue: string;
            }) => {
              return {
                create: {
                  name: m.name,
                  required: m.required,
                  defaultValue: m.defaultValue,
                },
                where: {
                  nameRequiredDefault: {
                    name: m.name,
                    required: m.required,
                    defaultValue: m.defaultValue,
                  },
                },
              };
            }
          ),
        },
        platforms: {
          connectOrCreate: packageReq.platforms.map((m: { name: String }) => {
            return {
              create: { name: m.name },
              where: { name: m.name },
            };
          }),
        },
      },
    });

    //
    // UPDATE EXISTING PACKAGE
    //
    let packageUpdate: Prisma.PackageUpdateInput = {
      name: packageReq.name,
      description: packageReq.description,
      readme: readme,
      url: packageReq.url,
      docUrl: packageReq.docUrl,
      purchaseUrl: packageReq.purchaseUrl,
      license: {
        connectOrCreate: {
          create: {
            type:
              packageReq.license !== undefined
                ? packageReq.license.type
                : "none",
            public:
              packageReq.license !== undefined
                ? packageReq.license.public
                : false,
            url:
              packageReq.license !== undefined ? packageReq.license.url : "",
          },
          where: {
            typeUrl: {
              type:
                packageReq.license !== undefined
                  ? packageReq.license.type
                  : "none",
              url:
                packageReq.license !== undefined
                  ? packageReq.license.url
                  : "",
            },
          },
        },
      },
      published: true,
      tags: {
        connectOrCreate: packageReq.tags.map((m: String) => {
          return {
            create: { name: m },
            where: { name: m },
          };
        }),
      },
    };

    console.log(packageUpdate);

    const packageNewResult = await prisma.package.update({
      where: {
        index: publisher.packages[0].index,
      },
      data: packageUpdate,
    });

    res.status(200).json({
      packageId: String(packageId),
      success: true,
      message: "Updated existing package",
      p: packageReq,
      n: packageNewResult,
    });
  } else {
    // check if package publisher not allowed
    const existingPackage = await prisma.package.findMany({
      where: {
        identifier: String(packageId),
      },
    });

    if (existingPackage.length > 0) {
      return res.status(401).json({
        packageId: String(packageId),
        success: false,
        message: "You are not authorised to modify this package",
      });
    }

    //
    // CREATE NEW PACKAGE + VERSION
    //
    let packageCreate: Prisma.PackageCreateInput = {
      name: packageReq.name,
      description: packageReq.description,
      readme: readme,
      identifier: String(packageId),
      url: packageReq.url,
      docUrl: packageReq.docUrl,
      purchaseUrl: packageReq.purchaseUrl,
      license: {
        connectOrCreate: {
          create: {
            type:
              packageReq.license !== undefined
                ? packageReq.license.type
                : "none",
            public:
              packageReq.license !== undefined
                ? packageReq.license.public
                : false,
            url:
              packageReq.license !== undefined
                ? packageReq.license.url
                : "",
          },
          where: {
            typeUrl: {
              type:
                packageReq.license !== undefined
                  ? packageReq.license.type
                  : "none",
              url:
                packageReq.license !== undefined
                  ? packageReq.license.url
                  : "",
            },
          },
        },
      },
      type: packageReq.type,
      published: true,
      publisher: {
        connect: {
          index: publisher.index,
        },
      },
      tags: {
        connectOrCreate: packageReq.tags.map((m: String) => {
          return {
            create: { name: m },
            where: { name: m },
          };
        }),
      },
      versions: {
        create: [
          {
            sourceUrl: packageReq.sourceUrl,
            checksum: packageReq.checksum,
            version: packageReq.version,
            changelog: changelog,
            published: publishedFromStatus(packageReq.status),
            status: validateStatus(packageReq.status),
            publishedAt: publishedAt,
            dependencies: {
              connectOrCreate: dependencies,
            },
            parameters: {
              connectOrCreate: packageReq.parameters.map(
                (m: {
                  name: string;
                  required: boolean;
                  defaultValue: string;
                }) => {
                  return {
                    create: {
                      name: m.name,
                      required: m.required,
                      defaultValue: m.defaultValue,
                    },
                    where: {
                      nameRequiredDefault: {
                        name: m.name,
                        required: m.required,
                        defaultValue: m.defaultValue,
                      },
                    },
                  };
                }
              ),
            },
            platforms: {
              connectOrCreate: packageReq.platforms.map((m: { name: String }) => {
                return {
                  create: { name: m.name },
                  where: { name: m.name },
                };
              }),
            },
          },
        ],
      },
    };

    const packageNewResult = await prisma.package.create({
      data: packageCreate,
    });

    res.status(200).json({
      packageId: String(packageId),
      success: true,
      message: "Created new package",
      p: packageReq,
      n: packageNewResult,
    });
  }

};

function validateStatus(status: string): string {
  if (status !== undefined) {
    switch (status) {
      case "release":
      case "prerelease":
      case "discontinued":
        return status;
    }
  }
  return "release";
}

function publishedFromStatus(status: string): boolean {
  if (validateStatus(status) == "removed") {
    return false;
  }
  return true;
}
