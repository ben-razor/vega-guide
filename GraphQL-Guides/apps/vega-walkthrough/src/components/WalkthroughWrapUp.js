import { useEffect } from "react";

function WalkthroughWrapUp(props) {
  let setCustomData = props.setCustomData;

  useEffect(() => {
    setTimeout(() => {
      setCustomData( { output: <div></div> });
    }, 10)
  }, [setCustomData]);
  
  return <div></div>
}


export default WalkthroughWrapUp;