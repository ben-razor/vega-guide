import { useEffect } from "react";

function VegaOrdersWrapUp(props) {
  let setCustomData = props.setCustomData;
  let useForm = false;

  useEffect(() => {
    setTimeout(() => {
      setCustomData( { output: <div></div> });
    }, 10)
  }, [setCustomData]);
  
  function handleLinkFollowed() {
    props.setResultData(true)
  }

  let form;

  if(useForm) {
    form = <div className="walkthrough-details-form-panel">
      <div className="walkthrough-details-button-row">
        <a href="https://fairground.wtf/" target="_blank" rel="noreferrer">
          <button className="ordinary-button" value="Create Wallet" onClick={handleLinkFollowed}>
            Visit The Vega Fairground
          </button>
        </a>
      </div>
    </div>
  }

  return <div>{form}</div>
}


export default VegaOrdersWrapUp;