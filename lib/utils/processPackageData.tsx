import { ta } from "date-fns/locale";

// Processes package data for API responses
export const processPackageData = (packageData: any): any => {
    if (!packageData) {
        return null;
    }

    removeIndexFields(packageData);

    packageData.tags = packageData.tags.map((tag: any) => tag.name);

    // Simplify parameters.platforms from [ { name: "platform1" }, { name: "platform2" }] to ["platform1", "platform2"]
    packageData.versions.forEach((version: any) => {
        if (version.parameters && version.parameters.length > 0) {
            version.parameters.forEach((param: any) => {
                if (param.platforms && param.platforms.length > 0) {
                    param.platforms = param.platforms.map((platform: any) => platform.name);
                }
            });
        }
    });

    // Group platformParameters by platform
    for (const version of packageData.versions || []) {
        removeIndexFields(version);
        if (version.platformParameters && version.platformParameters.length > 0) {
            const groupedParams: Record<string, any> = {};
            version.platformParameters.forEach((param: any) => {
                if (!groupedParams[param.platform]) {
                    groupedParams[param.platform] = {};
                }
                groupedParams[param.platform][param.name] = param.value;
            });
            version.platformParameters = groupedParams;
        }
    }

    return packageData;
}


export const processPackageDataArray = (packages: any[]): any[] => {
    return packages.map(processPackageData);
}


const removeIndexFields = (data: any) => {
    delete data.index;
    delete data.packageIndex;
    delete data.licenseIndex
    delete data.publisherIndex;
    delete data.analyticsIndex;
    if (data.analytics) {
        delete data.analytics.index;
    }
    if (data.license) {
        delete data.license.index;
    }
    if (data.package) {
        removeIndexFields(data.package);
    }

    if (data.dependencies) {
        data.dependencies.forEach((dependency: any) => {
            removeIndexFields(dependency);
        });
    }

    if (data.parameters) {
        data.parameters.forEach((parameter: any) => {
            delete parameter.index;
        });
    }
    if (data.platforms) {
        data.platforms.forEach((platform: any) => {
            delete platform.index;
        });
    }
};