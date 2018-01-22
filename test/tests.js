/* global describe, it, expect */


describe('#URL Tests', function() {
    it('Check trusted links', function() {
        expect(window.controller.checkLink('google.com')).to.equal(undefined);
        expect(window.controller.checkLink('example.com')).to.equal(undefined);
        expect(window.controller.checkLink('cnews.com')).to.equal(undefined);
    });

    it('Check untrusted links', function() {
        expect(window.controller.checkLink('wetter.bild.de').domain).to.equal('bild.de');
        expect(window.controller.checkLink('cnews.ru').domain).to.equal('cnews.ru');
    });
});

describe('#Requirements Tests', function() {
    it('Check requirements with options', function() {
        var options = {
            warningIconsNearLinks: {
                show: false
            }
        };
        expect(window.controller.pageCheckRequirements(options)).to.equal(false);
    });
    it('Check requirements without options', function() {
        expect(window.controller.pageCheckRequirements({})).to.equal(false);
    });
});
