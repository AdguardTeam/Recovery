import gulp from 'gulp';
import optionsDev from './tasks/options-dev';
import userscriptDev from './tasks/userscript-dev';
import testsGhPages from './tasks/tests-gh-pages';
import downloadLocalizations from './tasks/download-localizations';
import uploadLocalization from './tasks/upload-localization';

gulp.task('options-dev', optionsDev);
gulp.task('userscript-dev', userscriptDev);
gulp.task('tests-gh-pages', testsGhPages);
gulp.task('download-localizations', downloadLocalizations);
gulp.task('upload-localization', uploadLocalization);
