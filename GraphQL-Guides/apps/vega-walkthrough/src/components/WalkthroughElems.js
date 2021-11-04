function WalkthroughControls(props) {
  let sections = props.sections;
  let sectionIndex = props.sectionIndex;
  let backDisabled = props.backDisabled;
  let forwardDisabled = props.forwardDisabled;
  let runDisabled = props.runDisabled;
  let runQuery = props.runQuery;
  let setSection = props.setSection;

  return <div className="walkthrough-controls">
    <div className="walkthrough-controls-sections-pagination">
      <button className="walkthrough-control-button" disabled={backDisabled} onClick={() => setSection(sectionIndex - 1)}><i className="fa fa-arrow-left" /></button>
      <span className="walkthrough-controls-section">{sectionIndex + 1} - {sections[sectionIndex].title}</span>
      <button className="walkthrough-control-button" disabled={forwardDisabled} onClick={() => setSection(sectionIndex + 1)}><i className="fa fa-arrow-right" /></button>
    </div>
    <div className="walkthrough-controls-sections-run">
      <button disabled={runDisabled} className="walkthrough-control-button-run" onClick={runQuery}>Run Query <i className="fa fa-arrow-right"></i> </button>
    </div>
  </div>
}

export { WalkthroughControls };