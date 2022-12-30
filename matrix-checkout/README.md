# matrix-checkout-action

**A [GitHub Action](https://github.com/features/actions) that wraps [`actions/checkout`](https://github.com/actions/checkout) to checkout multiple additional repositories.**

![GitHub tag](https://img.shields.io/github/v/tag/jethub-iot/actions?sort=semver)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Usage

```yaml
- uses: actions/checkout@v3
- name: Checkout private actions
  uses: jethub-iot/actions/matrix-checkout@master
  with:
    token: ${{ secrets.GITHUB_MACHINE_TOKEN }}
    repositories: |
      [
        {
          repo: "myorg/repo1",
          path: "repo1",
          ref: "master",
          submodules: true,
          depth: 1
        },
        {
          repo: "myorg/repo2",
          path: "repo2",
          ref: "newbranch",
          submodules: false,
          depth: 0
        }        
      ]
```

The private actions can then be used like so:

```yaml
- name: Example
  uses: ../my-org/example-action
```

The token must have read access to the repositories. In the case of private repositories you'll want to create a [machine user](https://docs.github.com/en/developers/overview/managing-deploy-keys#machine-users), add the machine user to the repositories that you want to checkout and then generate a token for the machine user. Alternatively use [deploy keys](https://docs.github.com/en/developers/overview/managing-deploy-keys#deploy-keys) via the [`ssh-key` input](https://github.com/actions/checkout#usage).

## Inputs

- `repositories`: JSON array of repositories with repo, path, ref, submodules, depth values where:
  - `repo`: repository in the form of `owner/name`
  - `path`: relative path under `$GITHUB_WORKSPACE` to place the repositories. Default is `..` so that repositories are cloned to `./name`.
  - `ref`: is a branch name, tag or SHA to checkout or empty to checkout default branch.
  - `submodules`: whether to checkout submodules. Default is `true`.
  - `depth`: number of commits to fetch. Default is `1`.

Other inputs are forwarded to [`actions/checkout`](https://github.com/actions/checkout) (excluding `repository`, `ref`, `submodules`, `depth` and `persist-credentials` which is always `false`).

## License

[MIT](LICENSE)
