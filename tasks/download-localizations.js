import gulp from 'gulp';
import downloadStream from 'gulp-download-stream';
import md5 from 'gulp-hash-creator';
import oneskeyapp from '../oneskeyapp';

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

    options = Object.assign(options, oneskeyapp);

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

export default gulp.series(download);
