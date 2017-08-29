export default class Options {
    constructor(store, view) {
        this.store = store;
        this.view = view;

        view.localization();
        view.updateOption(this.updateOption.bind(this));
        store.getOptions(function(data){
            view.setOptions(data);
        });
    }

    saveOptions() {
        const view = this.view;
        this.store.update(this.view.getOptions(), () => {
            view.showSaveStatus();
        });
    }

    updateOption(option, value) {
        this.store.updateOption(option, value, () => {
            console.log('upd');
        });
    }
}
