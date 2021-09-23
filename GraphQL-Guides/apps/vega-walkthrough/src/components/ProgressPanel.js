import { useEffect, useState, Fragment } from "react";

const progressContent = {
  'introduction': {
    head: 'Great!',
    content: 'Click to progress to the next level.'
  }
}

const defaultContent = {
  head: 'Great!',
  content: 'Click to progress to the next level.'
}

function ProgressPanel(props) {
  const success = props.success;
  const reason = props.reason;
  const section = props.section;
  const [content, setContent] = useState();

  useEffect(() => {
    let content;
    if(!success) {
      content = reason;
    }
    else {
      let contentDetails = progressContent[section.id];
      if(!contentDetails) {
        contentDetails = defaultContent;
      }
      content = <Fragment>
        <h3 className="walkthrough-progress-head">{contentDetails.head}</h3>
        <p className="walkthrough-progress-content">{contentDetails.content}</p>
      </Fragment>
    }
    setContent(content);
  }, [reason, success]);

  return <div className="walkthrough-progress-panel">
    {content}
  </div>
}

export default ProgressPanel;