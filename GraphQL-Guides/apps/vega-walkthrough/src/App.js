import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useQuery, useSubscription, gql } from "@apollo/client";
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/lint/lint';
import 'codemirror-graphql/hint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/mode';
import 'codemirror/theme/monokai.css';
import rehypeRaw from 'rehype-raw';

import { getResultsTable } from './helpers/apollo_helpers';
import { sections, progressors } from './walkthrough/sections'
import { selectionSetMatchesResult } from '@apollo/client/cache/inmemory/helpers';
import GraphQLQuery from './components/GraphQLQuery';
import GraphQLSubscription from './components/GraphQLSubscription';
import GraphQLAuthQuery from  './components/GraphQLAuthQuery';
import { SyntaxErrorBoundary } from './helpers/ErrorBoundary';
import VegaWallet from './components/VegaWallet';

const MAX_RECORDS = 5;

const editorOptions = {
  lineNumbers: true,
  readOnly: false,
  mode: 'graphql',
  theme: 'monokai',
  autofocus: true,
  smartIndent: false,
  tabSize: 2,
  lineWrapping: true
}

let initialTemplate = `{
  markets {
    id, name 
  }
}
`;

const token = 'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjM3NTUwNzYsImlzcyI6InZlZ2Egd2FsbGV0IiwiU2Vzc2lvbiI6IjQwNDJiNzMzMTk1YTA4ODY4M2RjNTZlODQzMzExNmViODVhN2FhMGY3N2Y5YTg1OTUyM2UwZGVhMzA2NTgwZTciLCJXYWxsZXQiOiJ2dzBnbjd4a3Z6MDQybGxlNGdhM3l4In0.XV7y_1on4Vusf46yZIBp89bZFm1qNa_aEqPYCfYsm5x39XGmYiNst9ln-U7H-qQh9Y88wfafFx9z-aXaSGWAcxTrCz-Jpr551oq03F-xfXq01RH0DEzv1eeW-dq0lUM_06E_BPhnJSuBXYFliYrEWMOZLL8CVD4A0jIs59VE6fi_BX2nIYLRjaP-TzWVHLJ6Efh4ixoBrXvplXuumoeDgVgaTDqNm1GAqjpVpmRPk6NFuUSx1zo6hRYe5sbKvWdHomd-pzUx_LCAedTCyif6tJBQlAKIYR7_HHllWwezRB1WSNmsXp5newfkESOeoCxoB_12xFqm3GLFHP1lZ86Y1_jQLRtuFS-f6M5saq1rYMQY3i2714-zAVUcgHehUjbdUjwzKKzEmRAOq-Joi-HiQq3zwd0--VXORzPo6HEBu-T5iJ-LsF6wDj4CD9sS-wqQwNhj9hpKxY8NBj9Tz2BVxtaNWpIXKuDpG0DnQpfNUYbXgvo64ViEz8ZSNM1JLplWjqjRWUW1vHzyxnTiKXqj2rWdMe4mo1Te-XkdCz7nPLBhhtdeSOGeI2uu_87023eaF9jXak74ms1p-98Msm7smAIm3eYS9_ZUNSHmM8h3FeTY5VQLg0Fhbbw-JXWuTlhPQJ6ny5nTtkFCxlGuFJPbASHRihHcTuQXIFwifGVe2rY';

function App() {
  const [value, setValue] = useState();
  const [markdown, setMarkdown] = useState();
  const [sectionIndex, setSectionIndex] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  const [query, setQuery] = useState(gql`${initialTemplate}`);
  const [syntaxError, setSyntaxError] = useState('');
  let isSubscription = query.definitions[0].operation === 'subscription';
  let isMutation = query.definitions[0].operation === 'mutation';

  function setInstructions(text) {
    setMarkdown(text);
  }

  useEffect(() => {
    let section = sections[sectionIndex];
    let sectionID = section.id;

    let mdFileName = `${sectionID}.md`;
    import(`./markdown/${mdFileName}`)
    .then(res => {
        fetch(res.default)
            .then(res => res.text())
            .then(res => setInstructions(res))
            .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

    setValue(section.graphQL);

  }, [sectionIndex, hasRun])


  /**
   * Takes a textual GraphQL query and returns an Apollo Query object.
   * 
   * If the query is invalid, the previous query is maintained.
   *  
   * @param {string} query 
   * @returns An Apollo GraphQL query object
   */
  function queryTextToGraphQL(queryText, prevQuery) {
    let newQuery = prevQuery;

    try {
      newQuery = gql`${queryText}`;
      setSyntaxError('');
    }
    catch(e) {
      console.log(e.message);
      setSyntaxError(e.message);
      newQuery = undefined;
    };

    return newQuery;
  }

  function runQuery() {
    let gqlQuery = queryTextToGraphQL(value);

    if(gqlQuery) {
      setQuery(gqlQuery);
      setHasRun(true);
    }
  }

  let resultsTableDefault = 'Output from the query will be displayed here.'
  let resultsTableSyntaxError = <div>There is a syntax error in your query.<p>And it goes a little something like this...</p><p>{syntaxError}</p></div>

  function setSection(newSectionIndex) {
    let numSections = sections.length;
    newSectionIndex = Math.min(Math.max(newSectionIndex, 0), numSections - 1);
    setHasRun(false);
    setSectionIndex(newSectionIndex);
  }

  let backDisabled = (sectionIndex === 0);
  let forwardDisabled = (sectionIndex + 1 === sections.length);

  let client;
  if(isMutation) {
    client = <GraphQLAuthQuery query={query} token={token} maxRecords={MAX_RECORDS} />
  }
  else if(isSubscription) {
    client = <GraphQLSubscription query={query} maxRecords={MAX_RECORDS} />
  }
  else {
    client = <GraphQLQuery query={query} maxRecords={MAX_RECORDS} />
  }

  let doWallet = false;
  return (
    <div className="App">
      <div className="walkthrough-header">
        <h3 className="walkthrough-header-title">
          Vega Protocol GraphQL Walkthrough
        </h3>
      </div>
      {doWallet && <VegaWallet />}
      <div className="walkthrough-panels">
        <div className="walkthrough-panel walkthrough-panels-tutorial">
          <div className="walkthrough-controls">
            <div className="walkthrough-controls-sections-pagination">
              <button className="walkthrough-control-button" disabled={backDisabled} onClick={() => setSection(sectionIndex - 1)}><i className="fa fa-arrow-left" /></button>
              <span>{sectionIndex + 1} - {sections[sectionIndex].title}</span>
              <button className="walkthrough-control-button" disabled={forwardDisabled} onClick={() => setSection(sectionIndex + 1)}><i className="fa fa-arrow-right" /></button>
            </div>
            <div className="walkthrough-controls-sections-run">
              <button className="walkthrough-control-button-run" onClick={runQuery}>Run Query <i className="fa fa-arrow-right"></i> </button>
            </div>
          </div>
          <div className="walkthrough-panels-tutorial-markdown">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
        <div className="walkthrough-panel walkthrough-panels-io">
          <div className="walkthrough-panels-input">
            <div className="walkthrough-codemirror-container">
              <CodeMirror 
                className="walkthrough-codemirror"
                value={value}
                options={editorOptions}
                onBeforeChange={(editor, data, value) => {
                  setValue(value);
                }}
                onChange={(editor, data, value) => {
                }}
              />
            </div>
         </div>
          <div className="walkthrough-panels-output">
            {syntaxError ? resultsTableSyntaxError :
              <SyntaxErrorBoundary>
                {hasRun ? 
                  (client) : 
                  resultsTableDefault
                }
              </SyntaxErrorBoundary>
            }
          </div>
        </div>
     </div>
     </div>
  );
}

export default App;
