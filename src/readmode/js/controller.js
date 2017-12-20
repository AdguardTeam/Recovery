export default class Options {
    constructor(view) {
        this.view = view;
        this.req();
    }

    getQueryParams(name) {
       const url = document.location.search;
       name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
       const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
       const results = regex.exec(url);

       return results ? results[1] : null;
    }

    req() {
        const url = this.getQueryParams('url');

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this.view.appendContent(xhr.responseText, url);
            }
        };
        xhr.send();
    }
}
