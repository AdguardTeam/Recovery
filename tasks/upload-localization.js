import gulp from 'gulp';
import md5 from 'gulp-hash-creator';
import oneskeyapp from '../oneskeyapp';
import fs from 'fs';
import request from 'request';

const path = {
    src: './src/_locales/en.json',
};

function hashString(stringContent) {
    return md5({
        content: stringContent
    });
}

function prepare() {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const formData = {
        file: fs.createReadStream(path.src),
        file_format: 'HIERARCHICAL_JSON',
        locale: 'en',
        is_keeping_all_strings: 'false',
        api_key: oneskeyapp.apiKey,
        dev_hash: hashString(timestamp + oneskeyapp.secretKey),
        timestamp: timestamp
    };

    return formData;
}

function uploadf() {
    const data = prepare();

    return request.post({
        url: oneskeyapp.url + oneskeyapp.projectId + '/files',
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
