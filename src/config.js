export default {
  s3: {
    REGION: 'ap-southeast-2',
    BUCKET: 'notes-app-uploads-hibo',
  },
  apiGateway: {
    REGION: 'us-east-2',
    URL: 'https://nuz0q6ycgb.execute-api.us-east-2.amazonaws.com/prod',
  },
  cognito: {
    REGION: 'us-east-2',
    USER_POOL_ID: 'us-east-2_Pv4ZTFU3H',
    APP_CLIENT_ID: '1dh1i958rj6b4gflkt6l24qrt',
    IDENTITY_POOL_ID: 'us-east-2:5b5ba052-a0ec-4265-b27c-9d85c76ce8ac',
  },
};
