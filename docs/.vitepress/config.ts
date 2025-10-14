import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Web Developer Tools",
  description: "A collection of independent micro apps for web developers",
  lang: 'en-US',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#ff6b35' }],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'HTTP Codes', link: '/http-codes/' },
      { text: 'Color Palette Extractor', link: '/color-palette-extractor/' },
      { text: 'Color Palette Generator', link: '/color-palette-generator/' }
    ],

    sidebar: {
      '/http-codes/': [
        {
          text: 'HTTP Status Codes',
          items: [
            { text: 'Overview', link: '/http-codes/' },
            { text: 'All Codes', link: '/http-codes/codes' }
          ]
        },
        {
          text: '1xx Informational',
          collapsed: true,
          items: [
            { text: '100 Continue', link: '/http-codes/100' },
            { text: '101 Switching Protocols', link: '/http-codes/101' },
            { text: '102 Processing', link: '/http-codes/102' },
            { text: '103 Early Hints', link: '/http-codes/103' }
          ]
        },
        {
          text: '2xx Success',
          collapsed: true,
          items: [
            { text: '200 OK', link: '/http-codes/200' },
            { text: '201 Created', link: '/http-codes/201' },
            { text: '202 Accepted', link: '/http-codes/202' },
            { text: '203 Non-Authoritative Information', link: '/http-codes/203' },
            { text: '204 No Content', link: '/http-codes/204' },
            { text: '205 Reset Content', link: '/http-codes/205' },
            { text: '206 Partial Content', link: '/http-codes/206' },
            { text: '207 Multi-Status', link: '/http-codes/207' },
            { text: '208 Already Reported', link: '/http-codes/208' },
            { text: '226 IM Used', link: '/http-codes/226' }
          ]
        },
        {
          text: '3xx Redirection',
          collapsed: true,
          items: [
            { text: '300 Multiple Choices', link: '/http-codes/300' },
            { text: '301 Moved Permanently', link: '/http-codes/301' },
            { text: '302 Found', link: '/http-codes/302' },
            { text: '303 See Other', link: '/http-codes/303' },
            { text: '304 Not Modified', link: '/http-codes/304' },
            { text: '305 Use Proxy', link: '/http-codes/305' },
            { text: '306 Switch Proxy', link: '/http-codes/306' },
            { text: '307 Temporary Redirect', link: '/http-codes/307' },
            { text: '308 Permanent Redirect', link: '/http-codes/308' }
          ]
        },
        {
          text: '4xx Client Errors',
          collapsed: true,
          items: [
            { text: '400 Bad Request', link: '/http-codes/400' },
            { text: '401 Unauthorized', link: '/http-codes/401' },
            { text: '402 Payment Required', link: '/http-codes/402' },
            { text: '403 Forbidden', link: '/http-codes/403' },
            { text: '404 Not Found', link: '/http-codes/404' },
            { text: '405 Method Not Allowed', link: '/http-codes/405' },
            { text: '406 Not Acceptable', link: '/http-codes/406' },
            { text: '407 Proxy Authentication Required', link: '/http-codes/407' },
            { text: '408 Request Timeout', link: '/http-codes/408' },
            { text: '409 Conflict', link: '/http-codes/409' },
            { text: '410 Gone', link: '/http-codes/410' },
            { text: '411 Length Required', link: '/http-codes/411' },
            { text: '412 Precondition Failed', link: '/http-codes/412' },
            { text: '413 Payload Too Large', link: '/http-codes/413' },
            { text: '414 URI Too Long', link: '/http-codes/414' },
            { text: '415 Unsupported Media Type', link: '/http-codes/415' },
            { text: '416 Range Not Satisfiable', link: '/http-codes/416' },
            { text: '417 Expectation Failed', link: '/http-codes/417' },
            { text: '418 I\'m a teapot', link: '/http-codes/418' },
            { text: '421 Misdirected Request', link: '/http-codes/421' },
            { text: '422 Unprocessable Entity', link: '/http-codes/422' },
            { text: '423 Locked', link: '/http-codes/423' },
            { text: '424 Failed Dependency', link: '/http-codes/424' },
            { text: '425 Too Early', link: '/http-codes/425' },
            { text: '426 Upgrade Required', link: '/http-codes/426' },
            { text: '428 Precondition Required', link: '/http-codes/428' },
            { text: '429 Too Many Requests', link: '/http-codes/429' },
            { text: '431 Request Header Fields Too Large', link: '/http-codes/431' },
            { text: '451 Unavailable For Legal Reasons', link: '/http-codes/451' }
          ]
        },
        {
          text: '5xx Server Errors',
          collapsed: true,
          items: [
            { text: '500 Internal Server Error', link: '/http-codes/500' },
            { text: '501 Not Implemented', link: '/http-codes/501' },
            { text: '502 Bad Gateway', link: '/http-codes/502' },
            { text: '503 Service Unavailable', link: '/http-codes/503' },
            { text: '504 Gateway Timeout', link: '/http-codes/504' },
            { text: '505 HTTP Version Not Supported', link: '/http-codes/505' },
            { text: '506 Variant Also Negotiates', link: '/http-codes/506' },
            { text: '507 Insufficient Storage', link: '/http-codes/507' },
            { text: '508 Loop Detected', link: '/http-codes/508' },
            { text: '510 Not Extended', link: '/http-codes/510' },
            { text: '511 Network Authentication Required', link: '/http-codes/511' }
          ]
        },
        {
          text: 'Unofficial Codes',
          collapsed: true,
          items: [
            { text: '419 Page Expired', link: '/http-codes/419' },
            { text: '420 Method Failure', link: '/http-codes/420' },
            { text: '430 Request Header Fields Too Large', link: '/http-codes/430' },
            { text: '440 Login Time-out', link: '/http-codes/440' },
            { text: '449 Retry With', link: '/http-codes/449' },
            { text: '450 Blocked by Windows Parental Controls', link: '/http-codes/450' },
            { text: '509 Bandwidth Limit Exceeded', link: '/http-codes/509' },
            { text: '520 Web Server Returned Unknown Error', link: '/http-codes/520' },
            { text: '521 Web Server Is Down', link: '/http-codes/521' },
            { text: '522 Connection Timed Out', link: '/http-codes/522' },
            { text: '523 Origin Is Unreachable', link: '/http-codes/523' },
            { text: '524 A Timeout Occurred', link: '/http-codes/524' },
            { text: '525 SSL Handshake Failed', link: '/http-codes/525' },
            { text: '526 Invalid SSL Certificate', link: '/http-codes/526' },
            { text: '527 Railgun Error', link: '/http-codes/527' },
            { text: '529 Site Is Overloaded', link: '/http-codes/529' },
            { text: '530 Site Is Frozen', link: '/http-codes/530' },
            { text: '561 Unauthorized', link: '/http-codes/561' },
            { text: '598 Network Read Timeout Error', link: '/http-codes/598' },
            { text: '599 Network Connect Timeout Error', link: '/http-codes/599' },
            { text: '783 Unexpected Token', link: '/http-codes/783' },
            { text: '999 Request Denied', link: '/http-codes/999' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/webdev' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025'
    }
  }
})

