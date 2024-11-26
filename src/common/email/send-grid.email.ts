import sgMail from '~/config/send-grid.config'
import { signupTemplate } from './template'

interface SendEmailProps {
  to: string
  data: any
}

const sendEmail = async (props: SendEmailProps) => {
  try {
    const { subject, htmlTemplate } = signupTemplate(props.data)
    const msg = {
      to: props.to,
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject,
      html: htmlTemplate
    }
    console.log('msg', msg)
    return await sgMail.send(msg)
  } catch (error: any) {
    console.log('error', error.response.body)
    throw error
  }
}

export default sendEmail
