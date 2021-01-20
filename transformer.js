const obfuscatingTransformer = require('react-native-obfuscating-transformer')

const filter = filename => filename.startsWith('app/services/httpResources.js');

module.exports = obfuscatingTransformer({
  obfuscatorOptions: {
    compact: true,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 1,

    controlFlowFlattening: true,

    controlFlowFlatteningThreshold: 0.75,

    debugProtection: false,

    debugProtectionInterval: false,

    disableConsoleOutput: true,

    identifierNamesGenerator: 'hexadecimal',

    log: false,

    numbersToExpressions: true,

    renameGlobals: false,

    rotateStringArray: true,

    selfDefending: true,

    shuffleStringArray: true,

    simplify: true,

    splitStrings: true,

    stringArray: true,

    stringArrayThreshold: 0.75,

    stringArrayEncoding: ['base64'],
    stringArrayIndexesType: ['hexadecimal-number'],

    stringArrayIndexShift: true,

    stringArrayWrappersCount: 2,

    stringArrayWrappersChainedCalls: true,

    stringArrayWrappersParametersMaxCount: 2,

    stringArrayWrappersType: 'function',
    stringArrayWrappersParameters: 4,

    transformObjectKeys: true,

    unicodeEscapeSequence: false,
  },
  upstreamTransformer: require('metro-react-native-babel-transformer'),
  enableInDevelopment: true,
  filter,
  trace: true,
})
