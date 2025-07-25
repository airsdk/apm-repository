export type Publisher = {
  index: number;
  name: string;
  description: string;
  url: string;
};

export type Package = {
  index: number;
  name: string;
  description: string;
  readme: string;
  identifier: string;
  url: string;
  docUrl: string;
  type: string;
  published: boolean;
  status: string;
  publishedAt: string;
  publisher: Publisher;
  tags: Array<Tag>;
  versions: Array<PackageVersion>;
  license: License;
  purchaseUrl: string;
  analytics?: Analytics;
};

export type PackageVersion = {
  index: number;
  packageIndex: number;
  changelog: string;
  package?: Package;
  sourceUrl: string;
  checksum: string;
  version: string;
  published: boolean;
  status: string;
  publishedAt: string;
  dependencies: Array<PackageVersion>;
  parameters: Array<Parameter>;
  platforms: Array<Platform>;
  analytics?: Analytics;
};

export type Platform = {
  index: number;
  name: string;
};

export type Parameter = {
  index: number;
  name: string;
  required: boolean;
  defaultValue: string;
  description?: string;
  platforms?: Array<Platform>;
};

export type Tag = {
  index: number;
  name: string;
};

export type License = {
  type: string;
  url: string;
  public: boolean;
};

export type Analytics = {
  installs: number;
  downloads: number;
  uninstalls: number;
};
