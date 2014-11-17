var External;
(function (External) {
    var Library;
    (function (Library) {
        var MockExternalClass = (function () {
            function MockExternalClass() {
            }
            return MockExternalClass;
        })();
        Library.MockExternalClass = MockExternalClass;
    })(Library = External.Library || (External.Library = {}));
})(External || (External = {}));