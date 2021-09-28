import logo from './img/v-vega-1-64.png'; 
import './App.css';
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { gql } from "@apollo/client";
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
import {useMediaQuery} from 'react-responsive';

import { sections } from './walkthrough/sections'
import GraphQLQuery from './components/GraphQLQuery';
import GraphQLSubscription from './components/GraphQLSubscription';
import GraphQLAuthQuery from  './components/GraphQLAuthQuery';
import ProgressPanel from './components/ProgressPanel';
import { SyntaxErrorBoundary } from './helpers/ErrorBoundary';
import VegaWallet from './components/VegaWallet';
import VegaTransaction from './components/VegaTransaction';
import VegaTransactionSigner from './components/VegaTransactionSigner';
import VegaOrdersWrapUp from './components/VegaOrdersWrapUp';
import WalkthroughWrapUp from './components/WalkthroughWrapUp';
import AppInfo from './components/AppInfo';

import { WalkthroughControls } from './components/WalkthroughElems';

const MAX_RECORDS = 8;

let editorOptions = {
  lineNumbers: true,
  readOnly: false,
  mode: 'graphql',
  theme: 'monokai',
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
  const [rest, setREST] = useState();
  const [syntaxError, setSyntaxError] = useState('');
  const [jsxComponent, setJsxComponent] = useState();
  const [customData, setCustomData] = useState(); // Output handler for non graphQL components like forms
  const [transactionDetails, setTransactionDetails] = useState(sessionTransactionDetails)
  const [tx, setTx] = useState('');
  const [propogate, setPropogate] = useState(true);
  const [runDisabled, setRunDisabled] = useState(false)
  const [resultData, setResultData] = useState();
  const [progressPanel, setProgressPanel] = useState();
  const [startFade, setStartFade] = useState();

  let section = sections[sectionIndex];

  const isTiny = useMediaQuery({ query: '(max-width: 576px)' })
  const isSmall = useMediaQuery({ query: '(max-width: 768px)' })

  useEffect(() => {
    let runDisabledAtSectionStart = section.runDisabled;
    setRunDisabled(runDisabledAtSectionStart)
  }, [section, setRunDisabled])


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

    if(section.id !== 'ordersprepare' && section.id !== 'orderssend') {
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

    if(section.graphQL) {
      setValue(section.graphQL);
    }
    else if(section.rest) {
      setValue(section.rest);
    }

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
    if(section.graphQL) {
      let gqlQuery = queryTextToGraphQL(value);

      if(gqlQuery) {
        setQuery(gqlQuery);
        setHasRun(true);
        setCustomData();
      }
    }
    else if(section.rest) {
      setREST(value);
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

  let output;
  if(isMutation) {
    output = <GraphQLAuthQuery query={query}
                              transactionDetails={transactionDetails}
                              setTransactionDetails={setTransactionDetails}
                              maxRecords={MAX_RECORDS} setResultData={setResultData}
                              section={section} setRunDisabled={setRunDisabled} />
  }
  else if(isSubscription) {
    output = <GraphQLSubscription query={query} maxRecords={MAX_RECORDS} setResultData={setResultData} />
  }
  else {
    output = <GraphQLQuery query={query} maxRecords={MAX_RECORDS} setResultData={setResultData} />
  }

  let editorComponent;

  if(jsxComponent) {
    if(section.id === 'orderswallet') {
      editorComponent = <div className="walkthrough-jsx-component">
        <VegaWallet section={section} tx={tx} propogate={propogate} 
                    setCustomData={setCustomData} setTransactionDetails={setTransactionDetails} 
                    setResultData={setResultData} />
      </div>;
    }
    else if(section.id === 'orderswrapup') {
      editorComponent = <div className="walkthrough-jsx-component">
        <VegaOrdersWrapUp setResultData={setResultData} setCustomData={setCustomData} />
      </div>;
    }
    else if(section.id === 'wrappingup') {
      editorComponent = <div className="walkthrough-jsx-component">
        <WalkthroughWrapUp setResultData={setResultData} setCustomData={setCustomData} />
      </div>;
    }
 }
  else {
    if(section.rest) {
      editorOptions.mode = 'json';
    }
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

  let walkthroughControls = <WalkthroughControls sections={sections} sectionIndex={sectionIndex}
                                                 backDisabled={backDisabled} forwardDisabled={forwardDisabled}
                                                 setSection={setSection} runDisabled={runDisabled}
                                                 runQuery={runQuery} />;
                       
  let outputPanel = <div className="walkthrough-panels-output">
    {section.id === 'ordersprepare' &&
      <VegaTransaction transactionDetails={sessionTransactionDetails} 
                      setTransactionDetails={setTransactionDetails}
                      setCustomData={setCustomData}
                      setValue={setValue} rest={rest} /> }
    {section.id === 'orderssend' &&
      <VegaTransactionSigner transactionDetails={sessionTransactionDetails} 
                      setTransactionDetails={setTransactionDetails}
                      setCustomData={setCustomData}
                      setValue={setValue}
                      setResultData={setResultData} setRunDisabled={setRunDisabled} /> }
    {
      (
      customOutput ? customOutput :
        (
          syntaxError ? resultsTableSyntaxError :
          <SyntaxErrorBoundary>
            {hasRun ? 
              (output) : 
              resultsTableDefault
            }
          </SyntaxErrorBoundary>
        )
      )
    }
  </div>
  
  return (
    <div className="App">
      <div className="walkthrough-header">
        <img alt="Vega GraphQL Walkthrough Logo" src={logo} className="walkthrough-logo"/>
        <h3 className="walkthrough-header-title">
          <span class="walkthrough-header-name">Vincent</span>  - A Vega Protocol GraphQL Walkthrough
        </h3>
      </div>
      {isTiny && walkthroughControls}
      <div className={"walkthrough-panels"}>
        <div className="walkthrough-panel walkthrough-panels-tutorial">
          {!isTiny && walkthroughControls}
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
          {!isTiny && outputPanel}
        </div>
        { isTiny &&
          <div className="walkthrough-panel walkthrough-panels-io">
            {isTiny && outputPanel}
          </div>
        }
     </div>
     <AppInfo />
     </div>
  );
}

export default App;
