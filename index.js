module.exports = function(options) {
  var connect = require('connect')
    , crypto = require('crypto')
    , path = require('path')
    , exec = require('child_process').exec
    , options = options || {}
    , cwd = process.cwd()
    , repo = options.path || 'git://github.com/twitter/bootstrap.git'
    , checkout = options.checkout
    , hash = crypto.createHash('md5').update(repo + checkout).digest('hex')
    , cache = '/tmp/' + hash
    , exists = path.existsSync(cache)
    , dir = exists ? cache : '/tmp'
    , debug = options.debug
  ;

  // build a bash script to execute when the app boots  // 
    // var useGit = 
    //   , cmd = (
    //         useGit
    //           ? ['git', exists ? 'pull' : 'clone ' + repo + ' ' + hash, exists ? '' : ['&&', 'cd', hash].join(' ')]
    //           : ['cp', '-r', repo, '.']
    //       )
    //       .join(' ')
    // ;
  
  var cmd = '';
  
  if(~repo.indexOf('git://')) {
    if(exists) {
      // pull the existing repo
      cmd = 'git pull';
    } else {
      cmd = ['git clone', repo, hash, '&&', 'cd', hash].join(' ');
    }
        
    // always build
    cmd = ['cd', dir, '&&', cmd, '&&', 'make', 'bootstrap'].join(' ');
  } else {
    cmd = [exists ? '' : ['mkdir', cache, '&&'].join(' '),'cd', repo, '&&', 'rm -r ./bootstrap && make', 'bootstrap', '&&', 'cp -r', './bootstrap', cache].join(' ')
  }
  

  // log in debug mode
  debug && console.info('bootware ~', cmd);

  // grab latest
  exec(cmd, function(err, stdout, stderr) {
    debug && err && console.info('bootware ~\n', err);
    debug && console.info('bootware ~ built', repo, '@', cache);
    
    // done for now
    if(checkout) {
      exec('git checkout ' + checkout, function() {
        debug && console.info('bootware ~ checked out:', checkout);
      });
    }
  });
  
  var building;
  
  return function(req, res, next) {
    // provide bootstrap from the /tmp dir
    if(debug && !building) {
      console.info('building...');
      building = true;
      exec(cmd, function() {
        console.info('bootware ~ rebuilt');
        connect.static(cache)(req, res, next);
        setTimeout(function() {
          building = false;
        }, 3000);
      });
    } else {
      connect.static(cache).apply(this, arguments);
    }
  };
}