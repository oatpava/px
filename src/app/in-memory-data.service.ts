import { InMemoryDbService } from 'angular-in-memory-web-api'

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let folders = [
     {
      id:1,
      icon: 'dns',
      name: 'Workflow',
      subSubject: '01/02/2016 เวลา 09:54',
      route: '/main/dms/dmsFolder',
      detail: 'Workflow'
    },
    {
      id:2,
      icon: 'dns',
      name: 'Project Management',
      subSubject: '01/03/2016 เวลา 15:59',
      route: '/main/dms/dmsFolder',
      detail: 'Project Management'
    },
    {
      id:3,
      icon: 'dns',
      name: 'Legal',
      subSubject: '10/04/2016 เวลา 11:50',
      route: '/main/dms/dmsFolder',
      detail: 'Legal'
    },
    {
      id:4,
      icon: 'dns',
      name: 'Service',
      subSubject: '19/04/2016 เวลา 08:34',
      route: '/main/dms/dmsFolder',
      detail: 'Service'
    },
    {
      id:5,
      icon: 'folder',
      name: 'Outsourcing',
      subSubject: '20/10/2016 เวลา 14:07',
      route: '/main/dms/document',
      detail: 'Outsourcing'
    },
    {
      id:6,
      icon: 'folder',
      name: 'Sale',
      subSubject: '10/11/2016 เวลา 11:37',
      route: '/main/dms/document',
      detail: 'Outsourcing'
    },
    {
      id:7,
      icon: 'folder',
      name: 'Sale',
      subSubject: '10/11/2016 เวลา 11:37',
      route: '/main/dms/document',
      detail: 'Outsourcing'
    },
    {
      id:8,
      icon: 'folder',
      name: 'Sale',
      subSubject: '10/11/2016 เวลา 11:37',
      route: '/main/dms/document',
      detail: 'Outsourcing'
    },
    {
      id:16,
      icon: 'folder',
      name: 'Sale',
      subSubject: '10/11/2016 เวลา 11:37',
      route: '/main/dms/document',
      detail: 'Outsourcing'
    },
    {
      id:16,
      icon: 'folder',
      name: 'Sale',
      subSubject: '10/11/2016 เวลา 11:37',
      route: '/main/dms/document',
      detail: 'Outsourcing'
    },
    {
      id:16,
      icon: 'folder',
      name: 'Sale',
      subSubject: '10/11/2016 เวลา 11:37',
      route: '/main/dms/document',
      detail: 'Outsourcing'
    },
    {
      id:16,
      icon: 'folder',
      name: 'Sale',
      subSubject: '10/11/2016 เวลา 11:37',
      route: '/main/dms/document',
      detail: 'Outsourcing'
    },
    {
      id:16,
      icon: 'folder',
      name: 'Sale',
      subSubject: '10/11/2016 เวลา 11:37',
      route: '/main/dms/document',
      detail: 'Outsourcing'
    },
    ]
    return { folders }
  }
}