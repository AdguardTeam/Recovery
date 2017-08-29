import del from 'del';
import gulp from 'gulp';
import browserSync from 'browser-sync';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import less from 'gulp-less';
import lessAutoprefix from 'less-plugin-autoprefix';
import inlineImages from 'less-plugin-inline-urls';
import inlineAssets from 'gulp-inline-assets';
import cleanCSS from 'gulp-clean-css';
import gulpCss2js from 'gulp-css2js';
import concat from 'gulp-concat';

const server = browserSync.create();

const paths = {
    src: 'src/common/**/*.{jpg,png,svg,json,html,js,less}',
    scripts: {
        entry: 'src/userscript.main.js',
        src: 'src/common/js/**/*.js',
        dest: 'dist/userscript/',
        name: 'userscript.user.js'
    },
    styles: {
        entry: 'src/common/css/style.less',
        src: 'src/common/css/**/*.less',
        dest: 'dist/userscript/'
    }
};

const clean = () => del(['./dist/userscript/style.**']);

const scripts = () => {
    return browserify().transform(babelify, {
            presets: ['stage-0', 'es2015'],
            plugins: ['transform-runtime', 'transform-decorators-legacy']
        })
        .require(paths.scripts.entry, {
            entry: true
        })
        .bundle()
        .pipe(source(paths.scripts.name))
        .pipe(buffer())
        .pipe(gulp.dest(paths.scripts.dest));
};

function styles() {
    const autoprefix = new lessAutoprefix({
        browsers: ['last 3 versions', '>1%', 'Firefox ESR', 'Opera 12.1']
    });

    return gulp.src(paths.styles.entry)
        .pipe(less({
            plugins: [autoprefix, inlineImages]
        }))
        .pipe(inlineAssets())
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.styles.dest));
}

function cssToJs() {
    return gulp.src('./dist/userscript/style.css')
        .pipe(gulpCss2js())
        .pipe(gulp.dest('./dist/userscript/'));
}

function userscriptConcat() {
    return gulp.src(['./src/userscript/compiler.meta.js', './dist/userscript/style.js', './dist/userscript/userscript.user.js'])
      .pipe(concat('userscript.user.js'))
      .pipe(gulp.dest('./dist/userscript/'));
}

function reload(done) {
    server.reload();
    done();
}

function serve(done) {
    server.init({
        server: {
            baseDir: './dist/userscript/'
        }
    });
    done();
}

const watch = () => gulp.watch(paths.src, gulp.series(scripts, styles, cssToJs, userscriptConcat, clean, reload));

let build;

if(process.env.NODE_ENV === 'production') {
    build = gulp.series(scripts, styles, cssToJs, userscriptConcat, clean);
}else {
    build = gulp.series(scripts, styles, cssToJs, userscriptConcat, clean, serve, watch);
}

export default build;
