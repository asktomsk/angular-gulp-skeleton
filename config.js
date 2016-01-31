'use strict';

var compile = {
    isLiveReload:           false,
    liveReloadHost:         'localhost',
    liveReloadPort:         35729,
    buildNumberTemplate:    '%BUILD_NUMBER%',
    vendorHashTemplate:     '%VENDOR_HASH%'
};

var srcPaths = {
    index:          ['src/index.html'],
    indexStylus:    ['src/styl/index.styl'],
    allStylus:      ['src/styl/*.styl'],
    appJs:          ['src/js/app/**/*.js'],
    vendorJs:       'node_modules/',
    templates:      ['src/tpl/**/*.html']
};

var distPaths = {
    dist:           'dist/',
    scripts:        'dist/assets/js',
    styles:         'dist/assets/css',
    templates:      'dist/assets/templates'
};

var vendors = [
    'angular/angular.min.js',
    'angular-route/angular-route.min.js',
    'angular-resource/angular-resource.min.js',
    'ng-infinite-scroll/build/ng-infinite-scroll.min.js'
]
.map(function (path) {
    return srcPaths.vendorJs + path;
});

var templates = {
    moduleName:     'templates',
    prefix:         'tpl/'
};

var assetsNames = {
    styles:         'style.v' + compile.buildNumberTemplate + '.css',
    scriptVendor:   'vendor.v' + compile.vendorHashTemplate + '.js',
    scriptApp:      'app.v' + compile.buildNumberTemplate + '.js',
    templates:      'templates.v' + compile.buildNumberTemplate + '.js'
};

var indexReplaces = {
    style: {
        from:       /.*(href="\/assets\/css).*/g,
        to:         '<link rel="stylesheet" href="/assets/css/' 
            + assetsNames.styles + '">',
    },
    scriptVendor: {
        from:       /.*(src="\/assets\/js\/vendor).*/g,
        to:         '<script src="/assets/js/' 
            + assetsNames.scriptVendor + '"></script>'
    },
    scriptTemplate: {
        from:       /.*(src="\/assets\/templates\/template).*/g,
        to:         '<script src="/assets/templates/' 
            + assetsNames.templates + '"></script>'
    },
    scriptApp: {
        from:       /.*(src="\/assets\/js\/app).*/g,
        to:         '<script src="/assets/js/' 
            + assetsNames.scriptApp + '"></script>'
    },
    livereload: {
        from:       /<!-- livereload block -->/,
        to:         '<script src="http://' + compile.liveReloadHost + ':' 
            + compile.liveReloadPort + '/livereload.js?snipver=1"></script>'
    }
};

module.exports = {
    compile:        compile,
    srcPaths:       srcPaths,
    distPaths:      distPaths,
    vendors:        vendors,
    templates:      templates,
    assetsNames:    assetsNames,
    indexReplaces:  indexReplaces
};

