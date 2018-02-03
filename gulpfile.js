'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    rename = require('gulp-rename'),
    reload = browserSync.reload;


var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        // js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        // php: 'build/form/'
    },
    src: { //Пути откуда брать исходники
        html: '*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        // js: 'src/js/build.js',//В стилях и скриптах нам понадобятся только build файлы
        style: 'styles/build.less',
        img: 'img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        // php: 'src/form/*.php'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: '**/*.html',
        // js: 'src/js/**/*.js',
        style: 'styles/**/*.less',
        img: 'img/**/*.*',
        // php: 'src/form/*.php'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: './build'
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: 'dev'
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

// gulp.task('js:build', function () {
//     gulp.src(path.src.js) //Найдем наш main файл
//         .pipe(rigger()) //Прогоним через rigger
//         .pipe(sourcemaps.init()) //Инициализируем sourcemap
//         .pipe(uglify()) //Сожмем наш js
//         .pipe(sourcemaps.write()) //Пропишем карты
//         .pipe(rename({suffix: '.min'}))
//         .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
//         .pipe(reload({stream: true})); //И перезагрузим сервер
// });

// gulp.task('php:build', function () {
//     gulp.src(path.src.php) //Найдем наш main файл
//         .pipe(sourcemaps.init()) //Инициализируем sourcemap
//         .pipe(sourcemaps.write()) //Пропишем карты
//         .pipe(gulp.dest(path.build.php)) //Выплюнем готовый файл в build
//         .pipe(reload({stream: true})); //И перезагрузим сервер
// });

gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('build', [
    'html:build',
    // 'js:build',
    'style:build',
    'image:build',
    // 'php:build',
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    // watch([path.watch.js], function(event, cb) {
    //     gulp.start('js:build');
    // });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
});

// gulp.task('webserver', function () {
//     browserSync(config);
// });

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'watch']);