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

const editorOptions = {
  lineNumbers: true,
  readOnly: false,
  mode: 'graphql',
  autofocus: true,
  smartIndent: false,
  tabSize: 2,
  lineWrapping: true
}

function App() {
  const [value, setValue] = useState();
  const [markdown, setMarkdown] = useState();
  const [sectionID, setSectionID] = useState('introduction');

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

    let gqlFileName = `${sectionID}.gql`;
    import(`./graphql/${gqlFileName}`)
    .then(res => {
        fetch(res.default)
            .then(res => res.text())
            .then(res => setValue(res))
            .catch(err => console.log(err));
    })
    .catch(err => console.log(err));


    
  }, [sectionID])

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
            <button className="walkthrough-control-button"><i className="fa fa-arrow-left" /></button>
            <span>2. Querying Vega</span>
            <button className="walkthrough-control-button"><i className="fa fa-arrow-right" /></button>
          </div>
          <ReactMarkdown>
            {markdown}
          </ReactMarkdown>
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
            This is the output.
          </div>
        </div>
     </div>
     </div>
  );
}

export default App;
