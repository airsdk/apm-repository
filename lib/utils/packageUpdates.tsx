

import prisma from "../../lib/prisma";
import type { Package, PackageVersion, Platform } from "@prisma/client";
import { Prisma } from "@prisma/client";


const validateStatus = (status: string): string => {
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

const publishedFromStatus = (status: string): boolean => {
  if (validateStatus(status) == "removed") {
    return false;
  }
  return true;
}


const getPublisher = async (token: string, packageId: string) => {
  // Some level of auth using a token
  // TODO improve this
  const publisher = await prisma.publisher.findFirst({
    where: {
      token: token,
    },
    include: {
      packages: {
        where: {
          identifier: packageId,
        },
      },
    },
  });
  return publisher;
}


const getDependencies = async (packageReq: any, includePrerelease: boolean): Promise<Prisma.Enumerable<Prisma.PackageVersionDependencyCreateOrConnectWithoutPackageVersionsInput>> => {

  if (packageReq.dependencies === undefined) {
    // No dependencies so return empty array
    return [];
  }

  // Get dependencies
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

  return dependencies;
}


const upsertPackageVersion = async (
  packageReq: any,
  dependencies: Prisma.Enumerable<Prisma.PackageVersionDependencyCreateOrConnectWithoutPackageVersionsInput>,
  publishedAt: string,
  changelog: string,
  publisher: any
): Promise<PackageVersion> => {

  //
  // UPDATE / CREATE PACKAGE VERSION
  //
  const packageVersionUpdateResult = await prisma.packageVersion.upsert({
    where: {
      packageVersionId: {
        version: packageReq.version,
        packageIndex: publisher!.packages[0].index,
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
            description?: string;
            platforms?: string[];
          }) => {
            return {
              create: {
                name: m.name,
                required: m.required,
                defaultValue: m.defaultValue,
                description: m.description || "",
                platforms: {
                  connectOrCreate: (m.platforms ?? []).map((p: string) => {
                    return {
                      create: { name: p },
                      where: { name: p },
                    };
                  }),
                }
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
        connectOrCreate: packageReq.platforms.map((m: { name: string }) => {
          return {
            create: { name: m.name },
            where: { name: m.name },
          };
        }),
      },
      platformParameters: {
        connectOrCreate: packageReq.platformParameters.map((m: { name: string; value: string; platform: string }) => {
          return {
            create: {
              name: m.name,
              value: m.value,
              platform: m.platform.toLowerCase(),
            },
            where: {
              nameValuePlatform: {
                name: m.name,
                value: m.value,
                platform: m.platform.toLowerCase(),
              },
            },
          }
        }),
      },
    },
    create: {
      package: { connect: { index: publisher!.packages[0].index } },
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
            description?: string;
            platforms?: string[];
          }) => {
            return {
              create: {
                name: m.name,
                required: m.required,
                defaultValue: m.defaultValue,
                description: m.description || "",
                platforms: {
                  connectOrCreate: (m.platforms ?? []).map((p: string) => {
                    return {
                      create: { name: p },
                      where: { name: p },
                    };
                  }),
                }
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
        connectOrCreate: packageReq.platforms.map((m: { name: string }) => {
          return {
            create: { name: m.name },
            where: { name: m.name },
          };
        }),
      },
      platformParameters: {
        connectOrCreate: packageReq.platformParameters.map((m: { name: string; value: string; platform: string }) => {
          return {
            create: {
              name: m.name,
              value: m.value,
              platform: m.platform.toLowerCase(),
            },
            where: {
              nameValuePlatform: {
                name: m.name,
                value: m.value,
                platform: m.platform.toLowerCase(),
              },
            },
          }
        }),
      },
    }
  });

  console.log("upsertPackageVersion", packageVersionUpdateResult);

  await updatePackageVersionParameters( packageReq );

  return packageVersionUpdateResult;
}


const updatePackageVersionParameters = async (packageReq: any) => {
  for (const p of packageReq.parameters) {

    await prisma.parameter.update({
      where: {
        nameRequiredDefault: {
          name: p.name,
          required: p.required,
          defaultValue: p.defaultValue,
        },
      },
      data: {
        description: p.description || "",
      },
    });

    // Ensure the parameter platforms are connected
    const result = await prisma.parameter.findFirst({
      where: {
        name: p.name,
        required: p.required,
        defaultValue: p.defaultValue,
      },
      include: {
        platforms: true,
      },
    });

    if (result) {
      // Get platforms to connect (new platforms)
      const platformsToConnect = (p.platforms || []).filter((platform: string) => {
        return !result.platforms.some((existingPlatform: Platform) =>
          existingPlatform.name.toLowerCase() === platform.toLowerCase());
      });

      // Get platforms to disconnect (platforms no longer in the list)
      const platformsToDisconnect = result.platforms
        .filter((existingPlatform: Platform) =>
          !(p.platforms || []).some((platform: string) =>
            platform.toLowerCase() === existingPlatform.name.toLowerCase()));

      // Only update if there are changes
      if (platformsToConnect.length > 0 || platformsToDisconnect.length > 0) {
        console.log("Updating parameter platforms", p.name, platformsToConnect, platformsToDisconnect);
        await prisma.parameter.update({
          where: {
            nameRequiredDefault: {
              name: p.name,
              required: String(p.required) == 'true',
              defaultValue: p.defaultValue,
            },
          },
          data: {
            platforms: {
              // Connect new platforms
              connectOrCreate: platformsToConnect.map((platform: string) => ({
                create: { name: platform.toLowerCase() },
                where: { name: platform.toLowerCase() },
              })),
              // Disconnect removed platforms
              disconnect: platformsToDisconnect.map((platform: Platform) => ({
                name: platform.name,
              })),
            },
          },
        });
      }
    }
  }
}


const updateExistingPackage = async (
  packageReq: any,
  readme: string,
  dependencies: Prisma.Enumerable<Prisma.PackageVersionDependencyCreateOrConnectWithoutPackageVersionsInput>,
  publishedAt: string,
  changelog: string,
  publisher: any): Promise<Package> => {

  await upsertPackageVersion(
    packageReq,
    dependencies,
    publishedAt,
    changelog,
    publisher);


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
      connectOrCreate: packageReq.tags.map((m: string) => {
        return {
          create: { name: m },
          where: { name: m },
        };
      }),
    },
  };

  const packageNewResult = await prisma.package.update({
    where: {
      index: publisher!.packages[0].index,
    },
    data: packageUpdate,
  });

  return packageNewResult;
}


const createNewPackage = async (
  packageReq: any,
  packageId: string,
  readme: string,
  dependencies: Prisma.Enumerable<Prisma.PackageVersionDependencyCreateOrConnectWithoutPackageVersionsInput>,
  publishedAt: string,
  changelog: string,
  publisher: any
): Promise<Package> => {
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
        index: publisher!.index,
      },
    },
    tags: {
      connectOrCreate: packageReq.tags.map((m: string) => {
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
                description?: string;
                platforms?: string[];
              }) => {
                return {
                  create: {
                    name: m.name,
                    required: m.required,
                    defaultValue: m.defaultValue,
                    description: m.description || "",
                    platforms: {
                      connectOrCreate: (m.platforms ?? []).map((p: string) => {
                        return {
                          create: { name: p },
                          where: { name: p },
                        };
                      }),
                    }
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
            connectOrCreate: packageReq.platforms.map((m: { name: string }) => {
              return {
                create: { name: m.name },
                where: { name: m.name },
              };
            }),
          },
          platformParameters: {
            connectOrCreate: packageReq.platformParameters.map((m: { name: string; value: string; platform: string }) => {
              return {
                create: {
                  name: m.name,
                  value: m.value,
                  platform: m.platform.toLowerCase(),
                },
                where: {
                  nameValuePlatform: {
                    name: m.name,
                    value: m.value,
                    platform: m.platform.toLowerCase(),
                  },
                },
              }
            }),
          },
        },
      ],
    },
  };

  const packageNewResult = await prisma.package.create({
    data: packageCreate,
  });

  await updatePackageVersionParameters(packageReq);

  return packageNewResult;
}

export {
  getPublisher,
  getDependencies,
  upsertPackageVersion,
  updateExistingPackage,
  createNewPackage
};