interface MethodsObj {
  [key: string]: string;
}
interface VersionsObj {
  [key: string]: string;
}

interface Methods {
  [key: string]: MethodsObj;
}
interface Versions {
  [key: string]: VersionsObj;
}

interface ApiDefaults {
  methods: Methods;
  versions: Versions;
}

const defaults: ApiDefaults = {
  methods: {
    GET: {
      method: 'GET',
    },
    POST: {
      method: 'POST',
    },
    PUT: {
      method: 'PUT',
    },
    DELETE: {
      method: 'DELETE',
    },
  },
  versions: {
    v1: {
      version: '/xapi/v1',
    },
    weatherV25: {
      version: '/data/2.5',
    },
  },
};

export default defaults;
