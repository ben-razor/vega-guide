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
import { getResultsTable } from './helpers/apollo_helpers';
import { sections, progressors } from './walkthrough/sections'
import { selectionSetMatchesResult } from '@apollo/client/cache/inmemory/helpers';
import GraphQLQuery from './components/GraphQLQuery';
import GraphQLSubscription from './components/GraphQLSubscription';
import { SyntaxErrorBoundary } from './helpers/ErrorBoundary';
import rehypeRaw from 'rehype-raw';

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

function App() {
  const [value, setValue] = useState();
  const [markdown, setMarkdown] = useState();
  const [sectionIndex, setSectionIndex] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  const [query, setQuery] = useState(gql`${initialTemplate}`);
  const [syntaxError, setSyntaxError] = useState('');
  let isSubscription = query.definitions[0].operation === 'subscription';

  function setInstructions(text) {
    setMarkdown(text);
  }

  useEffect(() => {
    let sectionID = sections[sectionIndex].id;
    let mdFileName = `${sectionID}.md`;
    import(`./markdown/${mdFileName}`)
    .then(res => {
        fetch(res.default)
            .then(res => res.text())
            .then(res => setInstructions(res))
            .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

    setValue(sections[sectionIndex].graphQL);
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

  return (
    <div className="App">
      <div className="walkthrough-header">
        <h3 className="walkthrough-header-title">
          Vega Protocol GraphQL Walkthrough
        </h3>
      </div>
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
                  (isSubscription ?
                    <GraphQLSubscription maxRecords={MAX_RECORDS} query={query} /> :
                    <GraphQLQuery maxRecords={MAX_RECORDS} query={query} />
                  ) : syntaxError ? resultsTableSyntaxError : resultsTableDefault
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
