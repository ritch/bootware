# bootware

Drop [Bootstrap](http://twitter.github.com/bootstrap/) builds into your Node.js app. Just provide a `git://` url and you're all set.

## Examples

By default **bootware** will `git pull` the master [Bootstrap](http://twitter.github.com/bootstrap/) repo into `/tmp/<unique tag>`.

    var express = require('express')
      , bootware = require('bootware')
    ;

    app
      .use(bootware())
      .listen(3000)
    ;

You can then reference a built version of Bootstrap in like so:

    <link href="/bootstrap/css/bootstrap.css" rel="stylesheet">
    <link href="/bootstrap/css/bootstrap-responsive.css" rel="stylesheet">

### Local Development

If you are building your own fork or version of bootstrap you can point **bootware** at its local path.

    var express = require('express')
      , bootware = require('bootware')
    ;

    app
      .use(bootware({path: '~/Projects/my-bootstrap'}))
      .listen(3000)
    ;

If a local path is provided **bootware** will use `cp` instead of `git` to pull in the built version of bootstrap.
This makes it very easy to customize bootstrap in another directory while developing without having to commit files every time they change.

## Best Practices

### Repo

The intended use case for **bootware** is to fork bootstrap and modify it to suite your individual project needs.
Then pull it into any given site by referencing the fork's `git://` url.

    bootware({path: 'git://github.com/deployd/bootstrap.git'})

This means you will only ever have one version of your ui-kit (bootstrap) instead of building and migrating builds
into various projects or managing `git submodules`.

### Versioning

Sometimes you may want to prevent an app from getting the latest version of bootstrap. In this case provide a tag or branch.

    bootware({checkout: 'v2.0.1'}) // tag
    
or

    bootware({checkout: 'my-branch'}) // branch


    

