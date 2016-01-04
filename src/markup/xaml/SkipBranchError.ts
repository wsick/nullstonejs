module nullstone.markup.xaml {
    export class SkipBranchError extends Error {
        constructor() {
            super("Cannot skip branch when element contains more than 1 child element.");
        }
    }
}