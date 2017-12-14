import gulp from 'gulp';
import options from './tasks/options';
import popup from './tasks/popup';
import extension from './tasks/extension';
import testsGhPages from './tasks/tests-gh-pages';
import downloadLocalizations from './tasks/download-localizations';
import uploadLocalization from './tasks/upload-localization';
import zip from './tasks/zip';

gulp.task('options', options);
gulp.task('popup', popup);
gulp.task('extension', extension);
gulp.task('tests-gh-pages', testsGhPages);
gulp.task('download-localizations', downloadLocalizations);
gulp.task('upload-localization', uploadLocalization);
gulp.task('zip', zip);

const watch = () => gulp.watch('src/**/*.{jpg,png,svg,json,html,js,less}', gulp.series(options, popup, extension));

gulp.task('watch', watch);
