const dev = {
  s3: {
    REGION: 'us-east-2',
    BUCKET: 'notes-app-2-api-dev-attachmentsbucket-1oogf2zf89ci4',
  },
  apiGateway: {
    REGION: 'us-east-2',
    URL: 'https://rtqgv39cl5.execute-api.us-east-2.amazonaws.com/dev',
  },
  cognito: {
    REGION: 'us-east-2',
    USER_POOL_ID: 'us-east-2_jHDlKI00R',
    APP_CLIENT_ID: '6l6t2t74r8ilffjmbeoap01alj',
    IDENTITY_POOL_ID: 'us-east-2:03a692ff-f47e-45dd-9ca1-9881839e1a8d',
  },
  STRIPE_KEY: 'pk_test_KOV3LvurEIObtU8r6y92B8cu005v7ICtRs',
};

const prod = {
  STRIPE_KEY: 'pk_test_KOV3LvurEIObtU8r6y92B8cu005v7ICtRs',
  s3: {
    REGION: 'us-east-2',
    BUCKET: 'notes-app-2-api-prod-attachmentsbucket-1slkxpmxk8liw',
  },
  apiGateway: {
    REGION: 'us-east-2',
    URL: 'https://9ragv6vnu1.execute-api.us-east-2.amazonaws.com/prod',
  },
  cognito: {
    REGION: 'us-east-2',
    USER_POOL_ID: 'us-east-2_W8XyMV4XN',
    APP_CLIENT_ID: 'bg6e6ikmt2coscjl8th75r9d3',
    IDENTITY_POOL_ID: 'us-east-2:ed88086f-3a1f-43f3-9f55-7b242ef5c7f3',
  },
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod' ? prod : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config,
};
