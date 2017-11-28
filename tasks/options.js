import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import less from 'gulp-less';
import lessAutoprefix from 'less-plugin-autoprefix';
import uglify from 'gulp-uglify';

const paths = {
    src: 'src/options/**/*.{jpg,png,svg,json,html,js,less}',
    scripts: {
        entry: 'src/options/js/main.js',
        src: 'src/options/js/**/*.js',
        dest: 'dist/options/',
        name: 'options.js'
    },
    styles: {
        entry: 'src/options/css/main.less',
        src: 'src/options/css/**/*.less',
        dest: 'dist/options/'
    },
    pages: {
        src: './src/options/pages/**/*.html',
        dest: './dist/options/pages/'
    },
    images: {
        src: './src/options/img/**/*.{png,jpg,svg}',
        dest: './dist/options/img/'
    },
    fonts: {
        src: './src/options/fonts/**/*',
        dest: './dist/options/fonts/'
    },
    index: {
        src: './src/options/index.html',
        dest: './dist/options/'
    }
};

function scripts() {
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
        .pipe(gulp.dest(paths.scripts.dest));
}

function minifyScripts() {
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
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest));
}

function styles() {
    const autoprefix = new lessAutoprefix({
        browsers: ['last 3 versions', '>1%', 'Firefox ESR', 'Opera 12.1']
    });

    return gulp.src(paths.styles.entry)
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

function pages() {
    return gulp.src(paths.pages.src)
        .pipe(gulp.dest(paths.pages.dest));
}

function images() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
}

function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
}

function index() {
    return gulp.src(paths.index.src)
        .pipe(gulp.dest(paths.index.dest));
}

let build;

if (process.env.NODE_ENV === 'production') {
    build = gulp.series(minifyScripts, styles, pages, images, fonts, index);
} else {
    build = gulp.series(scripts, styles, pages, images, fonts, index);
}

export default build;
