import { useEffect, useState } from "react";

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
      content = "Great! That's next level. Click to head to the next level: Markets";
    }
    setContent(content);
  }, [reason, success]);

  return <div className="walkthrough-progress-panel">
    {content}
  </div>
}

export default ProgressPanel;