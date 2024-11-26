import path from 'path'
import { template } from './const.template'
import fs from 'fs'

interface ResponseTemplate {
  subject: string
  htmlTemplate: string
}

const getTemplate = (templateName: keyof typeof template, subject: string, data: any): ResponseTemplate => {
  const htmlTemplateData = fs.readFileSync(path.join(__dirname, template[templateName]), 'utf-8')
  console.log('htmlTemplateData', htmlTemplateData)
  // Replace placeholders in the template with actual data
  const replacedTemplate = Object.keys(data).reduce((acc, key) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    return acc.replace(regex, data[key])
  }, htmlTemplateData)

  // Update htmlTemplate with the replaced content
  const htmlTemplate = replacedTemplate
  console.log('htmlTemplate', htmlTemplate)
  return {
    subject,
    htmlTemplate
  }
}

const signupTemplate = (data: any): ResponseTemplate => {
  return getTemplate('SIGNUP', 'Welcome to Our Platform', data)
}

export { signupTemplate }
