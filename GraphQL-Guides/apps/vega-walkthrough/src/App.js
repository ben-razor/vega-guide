import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useMemo, Fragment } from 'react'
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
import { sections } from './walkthrough/sections'
import { selectionSetMatchesResult } from '@apollo/client/cache/inmemory/helpers';
import GraphQLQuery from './components/GraphQLQuery';
import GraphQLSubscription from './components/GraphQLSubscription';
import GraphQLAuthQuery from  './components/GraphQLAuthQuery';
import ProgressPanel from './components/ProgressPanel';
import { SyntaxErrorBoundary } from './helpers/ErrorBoundary';
import VegaWallet from './components/VegaWallet';
import VegaTransaction from './components/VegaTransaction';

const MAX_RECORDS = 8;

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

let sessionTransactionDetails;

function App() {
  const [value, setValue] = useState();
  const [markdown, setMarkdown] = useState();
  const [sectionIndex, setSectionIndex] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  const [query, setQuery] = useState(gql`${initialTemplate}`);
  const [syntaxError, setSyntaxError] = useState('');
  const [jsxComponent, setJsxComponent] = useState();
  const [customData, setCustomData] = useState(); // Output handler for non graphQL components like forms
  const [transactionDetails, setTransactionDetails] = useState(sessionTransactionDetails)
  const [tx, setTx] = useState('');
  const [propogate, setPropogate] = useState(true);
  const [resultData, setResultData] = useState();
  const [progressPanel, setProgressPanel] = useState();
  const [startFade, setStartFade] = useState();

  let section = sections[sectionIndex];
  let runDisabled = sections[sectionIndex].runDisabled;

  let isSubscription = query.definitions[0].operation === 'subscription';
  let isMutation = query.definitions[0].operation === 'mutation';

  if(transactionDetails) {
    sessionTransactionDetails = transactionDetails;
  }

  function setInstructions(text) {
    setMarkdown(text);
  }

  useEffect(() => {
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

    if(section.id !== 'ordersprepare') {
      setCustomData();
    }
    setResultData();
    setProgressPanel();

  }, [section, hasRun, jsxComponent])

  useEffect(() => {
    if(section.jsxComponent) {
      setJsxComponent(section.jsxComponent);
    }
    else {
      setJsxComponent();
    }

    setValue(section.graphQL);

    setStartFade(false);
    setTimeout(() => setStartFade(true), 1);
  }, [section]);

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
      setCustomData();
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
    client = <GraphQLAuthQuery query={query}
                               transactionDetails={transactionDetails}
                               setTransactionDetails={setTransactionDetails}
                               maxRecords={MAX_RECORDS} setResultData={setResultData} />
  }
  else if(isSubscription) {
    client = <GraphQLSubscription query={query} maxRecords={MAX_RECORDS} setResultData={setResultData} />
  }
  else {
    client = <GraphQLQuery query={query} maxRecords={MAX_RECORDS} setResultData={setResultData} />
  }

  let editorComponent;

  if(jsxComponent) {
    let section = sections[sectionIndex];

    editorComponent = <div className="walkthrough-jsx-component">
      <VegaWallet section={section} tx={tx} propogate={propogate} 
                  setCustomData={setCustomData} setTransactionDetails={setTransactionDetails} 
                  setResultData={setResultData}
            />
    </div>
  }
  else {
    editorComponent =  <CodeMirror 
      className="walkthrough-codemirror"
      value={value}
      options={editorOptions}
      onBeforeChange={(editor, data, value) => {
        setValue(value);
      }}
      onChange={(editor, data, value) => {
      }}
    />
  }

  useEffect(() => {
    if(!hasRun && !section.runDisabled) return;
    let success
    let reason;
    let progressPanel;

    if(resultData && section.progressor) {
      [ success, reason] = section.progressor.call(this, resultData);
      if(success) {
        progressPanel = <div onClick={() => setSection(sectionIndex + 1)}>
          <ProgressPanel success={success} reason={reason} section={section} />
        </div>
      }
    }

    setProgressPanel(progressPanel);
  }, [resultData, section, hasRun, sectionIndex])

  let customOutput;
  if(customData) {
    customOutput = customData.output;
  }

  return (
    <div className="App">
      <div className="walkthrough-header">
        <h3 className="walkthrough-header-title">
          Vega Protocol GraphQL Walkthrough
        </h3>
      </div>
      <div className={"walkthrough-panels"}>
        <div className="walkthrough-panel walkthrough-panels-tutorial">
          <div className="walkthrough-controls">
            <div className="walkthrough-controls-sections-pagination">
              <button className="walkthrough-control-button" disabled={backDisabled} onClick={() => setSection(sectionIndex - 1)}><i className="fa fa-arrow-left" /></button>
              <span>{sectionIndex + 1} - {sections[sectionIndex].title}</span>
              <button className="walkthrough-control-button" disabled={forwardDisabled} onClick={() => setSection(sectionIndex + 1)}><i className="fa fa-arrow-right" /></button>
            </div>
            <div className="walkthrough-controls-sections-run">
              <button disabled={runDisabled} className="walkthrough-control-button-run" onClick={runQuery}>Run Query <i className="fa fa-arrow-right"></i> </button>
            </div>
          </div>
          {progressPanel}
          <div className={`walkthrough-panels-tutorial-markdown ${startFade ? "walkthrough-fade-in" : "" }`} >
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
        <div className="walkthrough-panel walkthrough-panels-io">
          <div className="walkthrough-panels-input">
            <div className="walkthrough-codemirror-container">
              { editorComponent }
           </div>
         </div>
          <div className="walkthrough-panels-output">
            {section.id === 'ordersprepare' &&
              <VegaTransaction transactionDetails={sessionTransactionDetails} 
                               setTransactionDetails={setTransactionDetails}
                               setCustomData={setCustomData}
                               setValue={setValue} />
            }
            {
              (
              customOutput ? customOutput:
                (
                  syntaxError ? resultsTableSyntaxError :
                  <SyntaxErrorBoundary>
                    {hasRun ? 
                      (client) : 
                      resultsTableDefault
                    }
                  </SyntaxErrorBoundary>
                )
              )
            }
          </div>
        </div>
     </div>
     </div>
  );
}

export default App;
