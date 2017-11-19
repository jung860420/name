'use strict';

import config from './config';

import gulp from 'gulp';
import gutil from 'gulp-util';

import cleanCSS from 'gulp-clean-css';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import del from 'del';

import babel from 'gulp-babel';
import Cache from 'gulp-file-cache';
import nodemon from 'gulp-nodemon';

import webpack from 'gulp-webpack';
import webpackConfig from './webpack.config.js';

import browserSync from 'browser-sync';

let cache = new Cache();

const DIR = {
    SRC: 'src/'+config.dir,
    DEST: 'dist/'+config.dir
};

const SRC = {
    DATA: DIR.SRC + '/data/**',
    COMMONJS: DIR.SRC + '/js/common/**',
    JS: DIR.SRC + '/js/'+config.dir+'/**',
    CSS: DIR.SRC + '/css/*.css',
    FONT: DIR.SRC + '/css/font/*.*',
    HTML: DIR.SRC + '/*.html',
    IMAGES: DIR.SRC + '/images/**',
    SERVER: 'server/*.js'
};

const DEST = {
    DATA: DIR.DEST + '/data',
    COMMONJS: DIR.DEST + '/js/common',
    JS: DIR.DEST + '/js/'+config.dir,
    CSS: DIR.DEST + '/css',
    FONT: DIR.DEST + '/css/font',
    HTML: DIR.DEST + '/',
    IMAGES: DIR.DEST + '/images',
    SERVER: 'app'
};


gulp.task('clean', () => {
    return del.sync([DIR.DEST]);
});

gulp.task('data', () => {
    return gulp.src(SRC.DATA)
           .pipe(gulp.dest(DEST.DATA));

});

gulp.task('commonjs', () => {
    return gulp.src(SRC.COMMONJS)
           .pipe(gulp.dest(DEST.COMMONJS));
});

gulp.task('webpack', () => {
    return gulp.src('src/'+config.dir+'/js/'+config.dir+'/main.js')
           .pipe(webpack(webpackConfig))
           .pipe(gulp.dest('dist/'+config.dir+'/js'));
});

gulp.task('css', () => {
    return gulp.src(SRC.CSS)
           .pipe(cleanCSS({compatibility: 'ie8'}))
           .pipe(gulp.dest(DEST.CSS));
});

gulp.task('font', () => {
    return gulp.src(SRC.FONT)
           .pipe(gulp.dest(DEST.FONT));
});

gulp.task('html', () => {
    return gulp.src(SRC.HTML)
          .pipe(htmlmin({collapseWhitespace: true}))
          .pipe(gulp.dest(DEST.HTML))
});

gulp.task('images', () => {
    return gulp.src(SRC.IMAGES)
           .pipe(gulp.dest(DEST.IMAGES));
});

gulp.task('babel', () => {
    return gulp.src(SRC.SERVER)
           .pipe(cache.filter())
           .pipe(babel({
              presets: ['es2015']
           }))
           .pipe(cache.cache())
           .pipe(gulp.dest(DEST.SERVER));
});

gulp.task('watch', () => {
    let watcher = {
        webpack: gulp.watch(SRC.JS, ['webpack']),
        css: gulp.watch(SRC.CSS, ['css']),
        html: gulp.watch(SRC.HTML, ['html']),
        babel: gulp.watch(SRC.SERVER, ['babel'])
    };

    let notify = (event) => {
        gutil.log('File', gutil.colors.yellow(event.path), 'was', gutil.colors.magenta(event.type));
    };

    for(let key in watcher) {
        watcher[key].on('change', notify);
    }
});

gulp.task('start', ['babel'], () => {
    return nodemon({
        script: DEST.SERVER + '/main.js',
        watch: DEST.SERVER
    });
});

gulp.task('browser-sync', () => {
    browserSync.init(null, {
        proxy: "http://localhost:3000/"+config.dir,
        files: "dist/"+config.dir+"/**",
        port: 7000
    })
});

gulp.task(config.dir,
	['clean', 'data', 'commonjs', 'webpack', 'css', 'font', 'html', 'images', 'watch', 'start', 'browser-sync'],
	() => {
		gutil.log(gutil.colors.green('Running Build your repository') ,gutil.colors.blue('[ '+config.dir+' ]')); 
	}
);
