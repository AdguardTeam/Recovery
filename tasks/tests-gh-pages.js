import gulp from 'gulp';

const scripts = () => {
    return gulp.src([
        'test/**',
        'node_modules/mocha/mocha.*',
        'node_modules/chai/chai.js',
        'node_modules/babel-polyfill/dist/polyfill.js'
    ]).pipe(gulp.dest('./dist/test/'));
};

export default gulp.series(scripts);
