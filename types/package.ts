import { PackageVersion } from 'types/packageVersion';

export type Package = {
    index: number;
    name: string;
    identifier: string;
    type: string;
    publishedAt: string;
    description: string;
    url: string;
    versions: Array<PackageVersion>;
}

