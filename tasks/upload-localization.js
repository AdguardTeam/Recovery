import gulp from 'gulp';
import md5 from 'gulp-hash-creator';
import fs from 'fs';
import request from 'request';

const path = {
    src: './src/_locales/en.json',
};

let oneskyapp;

function hashString(stringContent) {
    return md5({
        content: stringContent
    });
}

function prepare() {
    try {
        oneskyapp = fs.readFileSync('../oneskyapp.json').toString();
    } catch (err) {
        return false;
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const formData = {
        'file': fs.createReadStream(path.src),
        'file_format': 'HIERARCHICAL_JSON',
        'locale': 'en',
        'is_keeping_all_strings': 'false',
        'api_key': oneskyapp.apiKey,
        'dev_hash': hashString(timestamp + oneskyapp.secretKey),
        'timestamp': timestamp
    };

    return formData;
}

function uploadf() {
    const data = prepare();

    if (!oneskyapp) {
        return false;
    }

    return request.post({
        url: oneskyapp.url + oneskyapp.projectId + '/files',
        formData: data
    }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        } else {
            console.log('Upload successful!  Server responded with:', body);
        }
    });
}

export default gulp.series(uploadf);
