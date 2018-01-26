import gulp from 'gulp';
import gutil from 'gulp-util';
import options from './options';
import popup from './popup';
import extension from './extension';
import testsGhPages from './tests-gh-pages';
import downloadLocalizations from './download-localizations';
import uploadLocalization from './upload-localization';
import zip from './zip';
import readmode from './readmode';

const end = (done) => {
    gutil.log(gutil.colors.green('Success!'));
    done();
};

export const dev = gulp.series(options, readmode, popup, extension, (done) => end(done));
export const ghtest = gulp.series(testsGhPages, (done) => end(done));
export const locales = gulp.series(downloadLocalizations, (done) => end(done));
export const upload = gulp.series(uploadLocalization, (done) => end(done));
export const archive = gulp.series(zip, (done) => end(done));
export const watch = () => gulp.watch('src/**/*.{jpg,png,svg,json,html,js,less}', dev);

export default dev;
