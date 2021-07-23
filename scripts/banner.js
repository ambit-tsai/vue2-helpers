const fs = require('fs')
const path = require('path')


const filePath = path.resolve(__dirname, '../package.json')
const fileText = fs.readFileSync(filePath, 'utf8')
const config = JSON.parse(fileText)


module.exports = `
/**
 * ${config.name}@${config.version}
 * ${config.description}
 * @author ${config.author}
 * @license ${config.license}
 * @see {@link ${config.homepage}}
 */`