import dotenv from 'dotenv';

//dotenv.config();
console.log('Loading environment variables...');
dotenv.config({ debug: true })

interface Config {
  port: number;
  nodeEnv: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;