var userAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/52.0.2743.116 Chrome/52.0.2743.116 Safari/537.36"
var referer = "https://su-sso.strathmore.edu/cas-prd/login?service=https%3A%2F%2Fsu-sso.strathmore.edu%2Fsusams%2Fservlet%2Fedu%2Fstrathmore%2Fams%2Fsusams%2FInit.html"

module.exports = {
  path: "https://su-sso.strathmore.edu/cas-prd/login;",
  service: "?service=https://su-sso.strathmore.edu/susams/servlet/edu/strathmore/ams/susams/Init.html",
  loginUrl: "https://su-sso.strathmore.edu/cas-prd/login?service=https://su-sso.strathmore.edu/susams/servlet/edu/strathmore/ams/susams/Init.html",
  formData: {
    lt:"e1s1",
    _eventId:"submit",
    submit:"LOGIN"
  },
  getHeaders: {
    "User-Agent": userAgent,
    "Connection": "keep-alive",
    "Accept-Language": "en-US,en;q=0.5",
    "Host": "su-sso.strathmore.edu",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  },
  postHeaders: {
    "User-Agent": userAgent,
    "Connection": "keep-alive",
    "Accept-Language": "en-US,en;q=0.5",
    "Host": "su-sso.strathmore.edu",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Referer": referer,
  },
  e_LoginUrl: "https://elearning.strathmore.edu/login/index.php",
  e_IndexPage: "https://elearning.strathmore.edu"
}
