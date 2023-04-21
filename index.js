import es from "./elasticsearch.js";
import fs from "fs";

const query = {
  bool: {
    ...(true && {
      should: [
        {
          match: {
            "content_id.exact": { query: "Three Tips For Chief", boost: 15 },
          },
        },
        {
          match: { "name.exact": { query: "Three Tips For Chief", boost: 10 } },
        },
        { match: { name: { query: "Three Tips For Chief", boost: 5 } } },
        {
          match: {
            "name.edge": {
              query: "Three Tips For Chief",
              operator: "and",
              boost: 2,
            },
          },
        },
        { match: { "name.edge": { query: "Three Tips For Chief", boost: 1 } } },
      ],
      minimum_should_match: 1,
    }),
  },
};

const params = {
  index: "pmmi-platform-content",
  size: 1000,
  ...(false && { from: 100 }),
  ...(true && { sort: "_score:desc" }),
  track_total_hits: true,
  _source: false,
  ...(true && { search_type: "dfs_query_then_fetch" }),
  body: { query, aggs: {} },
};

const { body } = await es.search(params);

const mapping = body.hits.hits
  .map((hit) => ({
    id: Number(hit._id.match(/[0-9]+$/)[0]),
    score: hit._score,
  }))
  .sort((a, b) => {
    if (a.score < b.score) {
      return 1;
    } else if (b.score < a.score) {
      return -1;
    }
    return 0;
  });

fs.writeFileSync('./output.json', JSON.stringify(mapping));
