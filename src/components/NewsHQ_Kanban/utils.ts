/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

interface QueryOptions {
  keywords?: string[];
  excludedKeywords?: string[];
  urgency?: number[];
  languages?: string[];
}

interface QueryPart {
  bool: {
    should?: QueryBase[];
    must?: QueryBase[];
    must_not?: QueryBase[];
  };
}

interface QueryBase {
  match?: { [key: string]: { query: string, operator?: string } };
  term?: { [key: string]: string };
  match_phrase?: { [key: string]: string };
  multi_match?: { query: string, fields: string[] };
  bool?: QueryPart; // Include bool property in QueryBase
}

interface Source {
  [key: string]: any;  // Consider providing a more detailed structure instead of `any`.
}


const keywordCases = ["title", "location", "tags", "owner", "content"];

export const queryBuilder = async (options: QueryOptions, sources: string[], breakingNews: boolean) => {
  try {
    if (breakingNews) sources = Object.keys(defaultDecks.sources);

    let qryKeyword = [],
      qryExcludedKeyword: any = [],
      arrUrgency: any = [],
      arrSources: any = [],
      arrLanguage: any = [],
      qryBase: any = { bool: { should: [], must: [] } },
      urgencies: any = breakingNews ? [1, 2] : options.urgency,
      languages: any = options.languages,
      isMatch: any = (options.keywords && options.keywords.length > 0) || (options.excludedKeywords && options.excludedKeywords.length > 0),
      isUrgency: any = urgencies && urgencies.length > 0,
      isLanguages: any = languages && languages.length > 0;

    if (isMatch) {
      qryKeyword = await keywordQueryBuilder(options.keywords);

      if (options.excludedKeywords && options.excludedKeywords.length > 0) {
        options.excludedKeywords.forEach((excludedKey: any) => {
          keywordCases.forEach(keywordCase => {
            qryExcludedKeyword.push({ match: { [keywordCase]: { query: excludedKey.toString(), operator: "and" } } });
          });
        });
      }

      if (qryKeyword.length > 0) qryBase.bool.must.push(...qryKeyword);
      if (qryExcludedKeyword.length > 0) qryBase.bool.must_not = qryExcludedKeyword;
    }

    if (isUrgency) {
      urgencies.forEach((urgency: any) => {
        arrUrgency.push({ match: { urgency } });
      });
      qryBase.bool.must.push({ bool: { should: arrUrgency } });
    }

    if (isLanguages) {
      languages.forEach((language: any) => {
        arrLanguage.push({ match: { language } });
      });
      qryBase.bool.must.push({ bool: { should: arrLanguage } });
    }

    if (sources && !breakingNews) {
      sources.forEach((sourceItem: any) => {
        arrSources.push({ term: { "source.keyword": sourceItem } });
      });
      qryBase.bool.must.push({ bool: { should: arrUrgency.bool ? arrUrgency.bool.should.concat(arrSources) : arrSources } });
    } else if (sources && breakingNews) {
      sources.forEach((sourceItem: any) => {
        arrSources.push({ term: { "source.keyword": sourceItem } });
      });
      qryBase.bool.should.push(...arrSources);
    }
    return qryBase;
  } catch (error) {
    console.log(error)
    return;
  }

};

const keywordQueryBuilder = async (tags: any) => {
  try {
    const boolQueries: any = [];


    for (const tagCounter in tags) {
      const keywords = tags[tagCounter].toUpperCase();
      const isOrOperation = keywords.includes(" OR ");

      if (isOrOperation) {
        const shouldQuery: any = { bool: { should: [] } };
        const orKeywords: any = keywords.split(" OR ");

        orKeywords.forEach((key: any) => {
          if (key.split(" ").length > 1) {
            keywordCases.forEach(field => {
              shouldQuery.bool.should.push({ match_phrase: { [field]: key } });
            });
          } else {
            shouldQuery.bool.should.push({ multi_match: { query: key, fields: keywordCases } });
          }
        });

        if (shouldQuery.bool.should.length > 0) boolQueries.push(shouldQuery);
      } else {
        const mustQuery: any = { bool: { must: [], should: [] } };
        const andKeywords: any = keywords.split(" AND ");

        andKeywords.forEach((key: any) => {
          if (andKeywords.length !== 1) key = key.trim();

          if (key.split(" ").length > 1) {
            keywordCases.forEach(field => {
              mustQuery.bool.should.push({ match_phrase: { [field]: key } });
            });
          } else {
            mustQuery.bool.must.push({ multi_match: { query: key, fields: keywordCases } });
          }
        });

        if (mustQuery.bool.must.length > 0 || mustQuery.bool.should.length > 0) boolQueries.push(mustQuery);
      }
    }

    return boolQueries;
  } catch (error) {
    console.log(error)
    return;
  }
};



const defaultDecks = {
  "sources": {
    "AA": {
      "filter": false,
      "filterResult": null,
      "page": 0,
      "offScroll": false,
      "refreshed": false,
      "firstItem": null,
      "index": 1,
      "deckSources": ["AA"],
      "deckName": "AA"
    },
    "APtext": {
      "filter": false,
      "filterResult": null,
      "page": 0,
      "offScroll": false,
      "refreshed": false,
      "firstItem": null,
      "index": 2,
      "deckSources": ["APtext"],
      "deckName": "APtext"
    },
    "BreakingNews": {
      "filter": false,
      "filterResult": null,
      "page": 0,
      "offScroll": false,
      "refreshed": false,
      "firstItem": null,
      "index": 3,
      "deckSources": ["AA", "APtext", "AP", "AFP", "AFPtext", "Reuterstext"],
      "deckName": "BreakingNews"
    },
    "Reuterstext": {
      "filter": false,
      "filterResult": null,
      "page": 0,
      "offScroll": false,
      "refreshed": false,
      "firstItem": null,
      "index": 4,
      "deckSources": ["Reuterstext"],
      "deckName": "Reuterstext"
    },
    "AFP": {
      "filter": false,
      "filterResult": null,
      "page": 0,
      "offScroll": false,
      "refreshed": false,
      "firstItem": null,
      "index": 5,
      "deckSources": ["AFPtext"],
      "deckName": "AFPtext"
    },
    "AP": {
      "filter": false,
      "filterResult": null,
      "page": 0,
      "offScroll": false,
      "refreshed": false,
      "firstItem": null,
      "index": 6,
      "deckSources": ["AP"],
      "deckName": "AP"
    },
    "Reuters": {
      "filter": false,
      "filterResult": null,
      "page": 0,
      "offScroll": false,
      "refreshed": false,
      "firstItem": null,
      "index": 7,
      "deckSources": ["Reuters"],
      "deckName": "Reuters"
    }
  }
}
