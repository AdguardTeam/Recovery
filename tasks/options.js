import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import less from 'gulp-less';
import lessAutoprefix from 'less-plugin-autoprefix';
import uglify from 'gulp-uglify';

const paths = {
    scripts: {
        entry: 'src/options/js/main.js',
        src: 'src/options/js/**/*.js',
        name: 'options.js'
    },
    styles: {
        entry: 'src/options/css/options.less',
        src: 'src/options/css/**/*.less'
    },
    index: {
        src: './src/options/options.html'
    },
    images: {
        src: './src/common/img/**/*.{png,jpg,svg}',
        dest: './dist/common/img/'
    },
    fonts: {
        src: './src/common/fonts/**/*.ttf',
        dest: './dist/common/fonts/'
    },
    dest: 'dist/'
};

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

const styles = () => {
    const autoprefix = new lessAutoprefix({
        browsers: ['last 3 versions', '>1%', 'Firefox ESR', 'Opera 12.1']
    });

    return gulp.src(paths.styles.entry)
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(gulp.dest(paths.dest));
};

const images = () => {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
};

const fonts = () => {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
};

const index = () => {
    return gulp.src(paths.index.src)
        .pipe(gulp.dest(paths.dest));
};

const uglifyJS = (done) => {
    if (process.env.NODE_ENV !== 'prod') {
        done();
        return false;
    }

    return gulp.src(paths.dest + paths.scripts.name)
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest));
};

export default gulp.series(scripts, styles, images, fonts, index, uglifyJS);
