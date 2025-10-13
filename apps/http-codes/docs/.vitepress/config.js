import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'HTTP Codes Explainer',
  description: 'Comprehensive guide to HTTP status codes. Lookup and understand HTTP response codes with detailed explanations, usage examples, and best practices for web developers.',
  lang: 'en-US',
  
  // SEO: Sitemap generation
  sitemap: {
    hostname: 'https://httpcodes.shadowlanes.com'
  },
  
  // SEO: Head meta tags
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'canonical', href: 'https://httpcodes.shadowlanes.com' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'description', content: 'Comprehensive guide to HTTP status codes. Lookup and understand HTTP response codes with detailed explanations, usage examples, and best practices for web developers.' }],
    ['meta', { name: 'keywords', content: 'HTTP status codes, HTTP response codes, 404 error, 200 OK, 500 error, REST API, web development, HTTP reference' }],
    ['meta', { name: 'author', content: 'shadowlanes' }],
    ['meta', { name: 'robots', content: 'index, follow' }]
  ],
  
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'All Codes', link: '/codes/' }
    ],
    sidebar: [
      {
        text: '1xx Informational',
        items: [
          { text: '100 Continue', link: '/100' },
          { text: '101 Switching Protocols', link: '/101' },
          { text: '102 Processing', link: '/102' },
          { text: '103 Early Hints', link: '/103' }
        ]
      },
      {
        text: '2xx Success',
        items: [
          { text: '200 OK', link: '/200' },
          { text: '201 Created', link: '/201' },
          { text: '202 Accepted', link: '/202' },
          { text: '203 Non-Authoritative Information', link: '/203' },
          { text: '204 No Content', link: '/204' },
          { text: '205 Reset Content', link: '/205' },
          { text: '206 Partial Content', link: '/206' },
          { text: '207 Multi-Status', link: '/207' },
          { text: '208 Already Reported', link: '/208' },
          { text: '226 IM Used', link: '/226' }
        ]
      },
      {
        text: '3xx Redirection',
        items: [
          { text: '300 Multiple Choices', link: '/300' },
          { text: '301 Moved Permanently', link: '/301' },
          { text: '302 Found', link: '/302' },
          { text: '303 See Other', link: '/303' },
          { text: '304 Not Modified', link: '/304' },
          { text: '307 Temporary Redirect', link: '/307' },
          { text: '308 Permanent Redirect', link: '/308' }
        ]
      },
      {
        text: '4xx Client Errors',
        items: [
          { text: '400 Bad Request', link: '/400' },
          { text: '401 Unauthorized', link: '/401' },
          { text: '402 Payment Required', link: '/402' },
          { text: '403 Forbidden', link: '/403' },
          { text: '404 Not Found', link: '/404' },
          { text: '405 Method Not Allowed', link: '/405' },
          { text: '406 Not Acceptable', link: '/406' },
          { text: '407 Proxy Authentication Required', link: '/407' },
          { text: '408 Request Timeout', link: '/408' },
          { text: '409 Conflict', link: '/409' },
          { text: '410 Gone', link: '/410' },
          { text: '411 Length Required', link: '/411' },
          { text: '412 Precondition Failed', link: '/412' },
          { text: '413 Payload Too Large', link: '/413' },
          { text: '414 URI Too Long', link: '/414' },
          { text: '415 Unsupported Media Type', link: '/415' },
          { text: '416 Range Not Satisfiable', link: '/416' },
          { text: '417 Expectation Failed', link: '/417' },
          { text: '418 I\'m a teapot', link: '/418' },
          { text: '421 Misdirected Request', link: '/421' },
          { text: '422 Unprocessable Entity', link: '/422' },
          { text: '423 Locked', link: '/423' },
          { text: '424 Failed Dependency', link: '/424' },
          { text: '425 Too Early', link: '/425' },
          { text: '426 Upgrade Required', link: '/426' },
          { text: '428 Precondition Required', link: '/428' },
          { text: '429 Too Many Requests', link: '/429' },
          { text: '431 Request Header Fields Too Large', link: '/431' },
          { text: '451 Unavailable For Legal Reasons', link: '/451' }
        ]
      },
      {
        text: '5xx Server Errors',
        items: [
          { text: '500 Internal Server Error', link: '/500' },
          { text: '501 Not Implemented', link: '/501' },
          { text: '502 Bad Gateway', link: '/502' },
          { text: '503 Service Unavailable', link: '/503' },
          { text: '504 Gateway Timeout', link: '/504' },
          { text: '505 HTTP Version Not Supported', link: '/505' },
          { text: '506 Variant Also Negotiates', link: '/506' },
          { text: '507 Insufficient Storage', link: '/507' },
          { text: '508 Loop Detected', link: '/508' },
          { text: '510 Not Extended', link: '/510' },
          { text: '511 Network Authentication Required', link: '/511' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shadowlanes/webdev/tree/main/apps/http-codes' }
    ]
  }
})
