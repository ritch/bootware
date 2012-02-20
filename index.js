module.exports = function(options) {
  var connect = require('connect')
    , crypto = require('crypto')
    , path = require('path')
    , exec = require('child_process').exec
    , cwd = process.cwd()
    , repo = options.path || options.git || 'git://github.com/twitter/bootstrap.git'
    , hash = crypto.createHash('md5').update(cwd + repo + hash).digest('hex')
    , cache = '/tmp/' + hash
    , exists = path.existsSync(cache)
    , dir = exists ? cache : '/tmp'
  ;

  // defaults
  options = options || {};
  
  // build a bash script to execute when the app boots
  var useGit = ~repo.indexOf('git://') || options.git
    , cmd = (
          useGit
            ? ['git', exists ? 'pull' : 'clone', repo, hash, exists ? '' : ['&&', 'cd', hash].join(' ')]
            : ['cp', '-r', repo, '.']
        )
        .join(' ')
  ;

  // move to tmp or the cache dir
  process.chdir(dir);

  console.info([cmd, '&&', 'make', 'bootstrap'].join(' '));

  // grab latest
  exec([cmd, '&&', 'make', 'bootstrap'].join(' '), function() {
    console.info('pulled', repo, 'into', cache);
  });
  
  // move back
  process.chdir(cwd);
  
  return connect.static(cache);
}