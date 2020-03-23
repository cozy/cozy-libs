import { extractEmails, validateEmail } from './email'

describe('extractEmails', () => {
  it('tests extract emails', () => {
    const str1 =
      'Quentin Valmori <quentin.valmori@xxx.com>, quentin@cozycloud.cc, t@t'
    const emails1 = extractEmails(str1)
    expect(emails1).toEqual(['quentin.valmori@xxx.com', 'quentin@cozycloud.cc'])
    const str2 = 'quentin.valmori@xxx.com'
    const emails2 = extractEmails(str2)
    expect(emails2).toEqual(['quentin.valmori@xxx.com'])
    const str3 = 'myStr'
    const emails3 = extractEmails(str3)
    expect(emails3).toEqual(null)
    const str4 =
      'Quentin Valmori <quentin.valmori+test@xxx.com>, quentin@cozycloud.cc, t@t'
    const emails4 = extractEmails(str4)
    expect(emails4).toEqual([
      'quentin.valmori+test@xxx.com',
      'quentin@cozycloud.cc'
    ])
    const str5 = 'quentin...valmori@xxx.com; quentin+test@cozycloud.cc'
    const emails5 = extractEmails(str5)
    expect(emails5).toEqual([
      'quentin...valmori@xxx.com',
      'quentin+test@cozycloud.cc'
    ])
  })
  it('returns null if the content is not a string', () => {
    const strNostr = ['hi!']
    const emails = extractEmails(strNostr)
    expect(emails).toEqual(null)
  })
})

describe('validateEmail', () => {
  it('tests email', () => {
    expect(validateEmail('quentin@cozycloud.cc')).toEqual(true)
    expect(validateEmail('que.ntin@cozycloud.cc')).toEqual(true)
    expect(validateEmail('que.ntin+test@cozycloud.cc')).toEqual(true)
    expect(validateEmail('q@cozy')).toEqual(false)
    expect(validateEmail('q;@cozy.io')).toEqual(false)
    expect(validateEmail('que...ntin@cozy.io')).toEqual(true)
  })
})
