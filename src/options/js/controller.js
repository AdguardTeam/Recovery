export default class Options {
    constructor(store, view) {
        this.store = store;
        this.view = view;

        view.localization();
        view.updateOption(this.updateOption.bind(this));

        store.getData().then(response => {
            view.setOptions(response);
        });
    }

    updateOption(id, value) {
        const view = this.view;

        this.store.updateData(id, value).then(() => {
            view.showSaveStatus();
        });
    }
}
