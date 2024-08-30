import path from 'path'
import YAML from 'yamljs'

const generateDataURL = path.join(__dirname, 'generate-data.yaml')
const accountURL = path.join(__dirname, 'account-management.yaml')
const productURL = path.join(__dirname, 'product-management.yaml')

const generateDataPath = YAML.load(generateDataURL)
const accountPath = YAML.load(accountURL)
const productPath = YAML.load(productURL)

const paths = {
  ...generateDataPath,
  ...accountPath,
  ...productPath
}
export default paths
