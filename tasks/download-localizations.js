import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import gutil from 'gulp-util';
import downloadStream from 'gulp-download2';
import md5 from 'gulp-hash-creator';

const paths = {
    src: 'src/_locales/',
};

function hashString(stringContent) {
    return md5({
        content: stringContent
    });
}

function prepare() {
    let options = {
        locales: ['en', 'ru'],
        sourceFile: 'en.json'
    };

    let oneskyapp;

    try {
        oneskyapp = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../oneskyapp.json')));
    } catch (err) {
        gutil.log(gutil.colors.red(err));
        return false;
    }

    options = Object.assign(options, oneskyapp);

    let urls = [];

    options.locales.forEach((localization) => {
        const timestamp = Math.round(new Date().getTime() / 1000);
        let url = [];

        url.push(options.url + options.projectId);
        url.push('/translations?locale=' + localization);
        url.push('&source_file_name=' + options.sourceFile);
        url.push('&export_file_name=' + localization + '.json');
        url.push('&api_key=' + options.apiKey);
        url.push('&timestamp=' + timestamp);
        url.push('&dev_hash=' + hashString(timestamp + options.secretKey));

        urls.push({
            file: localization + '.json',
            url: url.join('')
        });
    });

    return urls;
}

function download() {
    const urls = prepare();

    return downloadStream(urls)
        .pipe(gulp.dest(paths.src));
}

export default download;
