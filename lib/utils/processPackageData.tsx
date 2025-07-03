
// Processes package data for API responses
export const processPackageData = (packageData: any): any => {
    if (!packageData) {
        return null;
    }

    // Group platformParameters by platform
    for (const version of packageData.versions || []) {
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