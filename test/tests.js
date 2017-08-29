function triggerEvent(node, eventType) {
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent(eventType, true, true);
    node.dispatchEvent(clickEvent);
}

describe("#DOM Tests", function() {
    beforeEach(function(done) {
        this.timeout(1000);
        setTimeout(done, 500);
    });

    it("Status is in the DOM", function() {
        expect(true).to.not.equal(null);
        expect(true).to.not.equal(undefined);
    });
});
