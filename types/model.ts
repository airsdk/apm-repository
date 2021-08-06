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
  publishedAt: string;
  publisher: Publisher;
  tags: Array<Tag>;
  versions: Array<PackageVersion>;
  license: License;
  purchaseUrl: string;
  analytics: Analytics;
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
  publishedAt: string;
  dependencies: Array<PackageVersion>;
  parameters: Array<Parameter>;
  analytics: Analytics;
};

export type Parameter = {
  index: number;
  name: string;
  required: boolean;
  defaultValue: string;
};

export type Tag = {
  index: number;
  name: string;
};

export type License = {
  type: string;
  url: string;
  public: boolean;
}

export type Analytics = {
  installs: number;
  downloads: number;
  uninstalls: number;
}

