const {SpecReporter, StacktraceOption} = require("jasmine-spec-reporter");

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
  spec: {
    displayStacktrace: StacktraceOption.NONE
  },
}));
