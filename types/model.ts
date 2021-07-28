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
  changelog: string;
  identifier: string;
  url: string;
  docUrl: string;
  type: string;
  published: boolean;
  publishedAt: string;
  publisher: Publisher;
  tags: Array<Tag>;
  versions: Array<PackageVersion>;
};

export type PackageVersion = {
  index: number;
  packageIndex: number;
  package?: Package;
  sourceUrl: string;
  checksum: string;
  version: string;
  published: boolean;
  publishedAt: string;
  dependencies: Array<PackageVersion>;
  parameters: Array<Parameter>;
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
