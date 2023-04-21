import * as dotenv from 'dotenv'
import { Client } from '@elastic/elasticsearch';
dotenv.config()

const node = process.env.ELASTICSEARCH_NODE_URL;

export default new Client({ node });
