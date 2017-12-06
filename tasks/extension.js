import fs from 'fs';
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
import uglify from 'gulp-uglify';
const file = require('gulp-file');

const paths = {
    scripts: {
        entry: 'src/userscript/userscript.js',
        src: 'src/userscript/js/**/*.js',
        name: 'userscript.js'
    },
    styles: {
        entry: 'src/userscript/css/style.less',
        src: 'src/userscript/css/**/*.less'
    },
    background: {
        entry: 'src/background.js',
        name: 'background.js'
    },
    manifest: 'src/manifest.json',
    dest: 'dist/'
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

const styles = () => {
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
};

const cssToJs = () => {
    return gulp.src('./dist/style.css')
        .pipe(gulpCss2js({
            prefix: 'var ADBLOCKRECOVERYSTYLE = "',
            suffix: '";\n'
        }))
        .pipe(gulp.dest('./dist/'));
};

const userscriptConcat = () => {
    return gulp.src(['./dist/style.js', './dist/userscript.js'])
      .pipe(concat(paths.scripts.name))
      .pipe(gulp.dest('./dist/'));
};

const manifest = () => {
    const packageFile = JSON.parse(fs.readFileSync('package.json'));
    const manifest = JSON.parse(fs.readFileSync(paths.manifest));

    manifest.version = packageFile.version;
    manifest.description = packageFile.description;

    return gulp.src(paths.dest)
        .pipe(file('manifest.json', JSON.stringify(manifest)))
        .pipe(gulp.dest(paths.dest));
};

const uglifyJS = (done) => {
    if (process.env.NODE_ENV !== 'prod') {
        done();
        return false;
    }

    return gulp.src([paths.dest + paths.scripts.name, paths.dest + paths.background.name])
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest));
};

export default gulp.series(manifest, background, scripts, styles, cssToJs, userscriptConcat, uglifyJS, clean);
