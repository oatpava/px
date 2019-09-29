// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
export const environment = {
  key: '',
  production: false,
  appName: 'Praxticol',
  appNameEng: 'Version 8.0',
  appAcronym: 'px8',

  reportServer: 'http://localhost:85/jasperserver/flow.html?',
  reportSite: 'nha',
  reportUser: 'jasperadmin',
  reportPass: 'jasperadmin',

  plugIn: 'http://localhost',
  url: 'http://localhost:4200/#',

  apiServer: "http://localhost:8080",
  apiName: "/pxservice/api",

  // apiServerArchive: "http://192.168.142.149:8080",
  // apiNameArchive: "/pxservice-nha/api",
  // apiServerHome: "http://PRAXiS-PC:82",
  // apiNameHome: "/pxservice-nha/api",
  
  buildDate: '2019-09-30'
};
