import gulp from 'gulp';
import zip from 'gulp-zip';

const paths = {
    dest: 'dist/**/*'
};

const createZip = () => {
    return gulp.src(paths.dest)
      .pipe(zip('archive.zip'))
      .pipe(gulp.dest('./out-zip/'));
};

export default gulp.series(createZip);
