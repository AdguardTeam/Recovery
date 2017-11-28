import del from 'del';
import gulp from 'gulp';
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

const paths = {
    src: 'src/common/**/*.{jpg,png,svg,json,html,js,less}',
    scripts: {
        entry: 'src/extension.js',
        src: 'src/common/js/**/*.js',
        name: 'userscript.js'
    },
    styles: {
        entry: 'src/common/css/style.less',
        src: 'src/common/css/**/*.less'
    },
    background: {
        entry: 'src/background.js',
        name: 'background.js'
    },
    dest: 'dist/',
    manifest: 'src/manifest.json'
};

const clean = () => del(['./dist/style.**']);

const scripts = () => {
    return browserify().transform(babelify, {
            presets: ['stage-0', 'es2015'],
            plugins: ['transform-runtime']
        })
        .require(paths.scripts.entry, {
            entry: true
        })
        .bundle()
        .pipe(source(paths.scripts.name))
        .pipe(buffer())
        .pipe(gulp.dest(paths.dest));
};

const background = () => {
    return browserify().transform(babelify, {
            presets: ['stage-0', 'es2015'],
            plugins: ['transform-runtime']
        })
        .require(paths.background.entry, {
            entry: true
        })
        .bundle()
        .pipe(source(paths.background.name))
        .pipe(buffer())
        .pipe(gulp.dest(paths.dest));
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
        .pipe(gulp.dest(paths.dest));
}

function cssToJs() {
    return gulp.src('./dist/style.css')
        .pipe(gulpCss2js({
            prefix: 'var ADBLOCKRECOVERYSTYLE = "',
            suffix: '";\n'
        }))
        .pipe(gulp.dest('./dist/'));
}

function userscriptConcat() {
    return gulp.src(['./dist/style.js', './dist/userscript.js'])
      .pipe(concat(paths.scripts.name))
      .pipe(gulp.dest('./dist/'));
}

const manifest = () => {
    return gulp.src(paths.manifest)
        .pipe(gulp.dest(paths.dest));
};

export default gulp.series(manifest, background, scripts, styles, cssToJs, userscriptConcat, clean);
