import logo from './logo.svg';
import './App.css';
import { useState } from 'react'
import { useQuery, gql } from "@apollo/client";
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/lint/lint';
import 'codemirror-graphql/hint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/mode';

const options = {
  lineNumbers: true,
  readOnly: false,
  mode: 'graphql',
  autofocus: true,
  smartIndent: false,
  tabSize: 2
}

function App() {
  const [value, setValue] = useState();
  console.log(value);
  return (
    <div className="App">
      <div class="walkthrough-header">
        <h3>
          Vega Protocol GraphQL Walkthrough
        </h3>
      </div>
      <div class="walkthrough-panels">
        <div class="walkthrough-panel walkthrough-panels-tutorial">
          <div class="walkthrough-controls">
            <button class="walkthrough-control-button"><i class="fa fa-arrow-left" /></button>
            <span>2. Querying Vega</span>
            <button class="walkthrough-control-button"><i class="fa fa-arrow-right" /></button>
          </div>
          Type some GraphQL and see the output.
        </div>
        <div class="walkthrough-panel walkthrough-panels-io">
          <div class="walkthrough-panels-input">
            <CodeMirror value={value}
                options={options}
                onBeforeChange={(editor, data, value) => {
                  setValue(value);
                }}
                onChange={(editor, data, value) => {
                }}
              />
          </div>
          <div class="walkthrough-panels-output">
            This is the output.
          </div>
        </div>
     </div>
     </div>
  );
}

export default App;
