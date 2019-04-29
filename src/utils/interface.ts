export interface PkgJsonDependency {
  pkgName: string,
  version: string
}

export type GitHook =
  "applypatch-msg"
  | "pre-applypatch"
  | "post-applypatch"
  | "pre-commit"
  | "prepare-commit-msg"
  | "commit-msg"
  | "post-commit"
  | "pre-rebase"
  | "post-checkout"
  | "post-merge"
  | "pre-push"
  | "post-update"
  | "push-to-checkout"
  | "pre-auto-gc"
  | "post-rewrite"
  | "sendemail-validate"
  | "fsmonitor-watchman"
  | "p4-pre-submit";

export interface HuskyHook {
  hook: GitHook,
  cmd: string
}

export interface Husky {
  huskyHooks: HuskyHook[]
}

export interface PkgJsonDependencies {
  devDependencies?: PkgJsonDependency[],
  dependencies?: PkgJsonDependency[]
}

export interface PkgJsonScript {
  npmScriptKey: string,
  npmScriptValue: string
}

export type PkgJsonScripts = PkgJsonScript[]

export interface CustomObj {
  key: string,
  value: Object
}

export interface PkgJsonContent {
  pkgJsonDependencies?: PkgJsonDependencies,
  pkgJsonScripts?: PkgJsonScripts,
  husky?: Husky,
  customObj?: CustomObj
}

export type Files = File[];

export interface File {
  path: string
  content: string
}
