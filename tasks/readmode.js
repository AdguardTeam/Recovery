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
        entry: 'src/readmode/js/main.js',
        src: 'src/readmode/js/**/*.js',
        name: 'readmode.js'
    },
    styles: {
        entry: 'src/readmode/css/readmode.less',
        src: 'src/readmode/css/**/*.less'
    },
    index: {
        src: './src/readmode/readmode.html'
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

export default gulp.series(scripts, styles, index, uglifyJS);
