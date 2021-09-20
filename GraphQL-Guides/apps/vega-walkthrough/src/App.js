import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useQuery, gql } from "@apollo/client";
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/lint/lint';
import 'codemirror-graphql/hint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/mode';
import { getResultsTable } from './helpers/apollo_helpers';
import { sections, progressors } from './walkthrough/sections'
import { selectionSetMatchesResult } from '@apollo/client/cache/inmemory/helpers';


const MAX_RECORDS = 5;

const editorOptions = {
  lineNumbers: true,
  readOnly: false,
  mode: 'graphql',
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
  const [queryRunFromUI, setQueryRunFromUI] = useState(false);

  const [query, setQuery] = useState(gql`${initialTemplate}`);
  const { loading, error, data } = useQuery(query, { errorPolicy: 'all' });
  console.log(loading, error, data);

  let sectionID = sections[sectionIndex].id;

  function setInstructions(text) {
    console.log(text);
    setMarkdown(text);
  }

  useEffect(() => {
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

  }, [sectionID])


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
    }
    catch(e) { /* Ignore invalid queries */ };

    return newQuery;
  }

  function runQuery() {
    let gqlQuery = queryTextToGraphQL(value);
    setQuery(gqlQuery, query);
    setHasRun(true);
  }

  useEffect(() => {
    if(hasRun) {
      setQueryRunFromUI(true);
    }
  }, [query]);

  let resultsTable = 'Output from the query will be displayed here.'
  if(queryRunFromUI) {
    resultsTable = getResultsTable(data, loading, error, MAX_RECORDS);
  }

  function changeSection(dx) {
    let numSections = sections.length;
    let newSectionIndex = Math.min(Math.max(sectionIndex + dx, 0), numSections - 1);
    setSectionIndex(newSectionIndex);
  }

  useEffect(() => {
    setHasRun(false);
  }, [sectionIndex]);

  let backDisabled = (sectionIndex === 0);
  let forwardDisabled = (sectionIndex + 1 === sections.length);

  return (
    <div className="App">
      <div className="walkthrough-header">
        <h3>
          Vega Protocol GraphQL Walkthrough
        </h3>
      </div>
      <div className="walkthrough-panels">
        <div className="walkthrough-panel walkthrough-panels-tutorial">
          <div className="walkthrough-controls">
            <button className="walkthrough-control-button" disabled={backDisabled} onClick={() => changeSection(-1)}><i className="fa fa-arrow-left" /></button>
            <span>{sectionIndex + 1} - {sections[sectionIndex].title}</span>
            <button className="walkthrough-control-button" disabled={forwardDisabled} onClick={() => changeSection(+1)}><i className="fa fa-arrow-right" /></button>
            <button className="walkthrough-control-button-run" onClick={runQuery}>Run Query <i className="fa fa-arrow-right"></i> </button>
          </div>
          <div className="walkthrough-panels-tutorial-markdown">
            <ReactMarkdown>
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
            { resultsTable }
          </div>
        </div>
     </div>
     </div>
  );
}

export default App;
