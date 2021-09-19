import { Fragment, useState } from 'react';

function AppInfo() {
    const[infoDisplayed, setInfoDisplayed] = useState(false);

    function toggleInfo() {
        let newDisplayed = !infoDisplayed;
        setInfoDisplayed(newDisplayed);
    }

    return (
        <Fragment>
            <div className="info-panel">
                <div className="info-panel-info">
                    <p>Part of the <a href="https://vega-step-by-step.web.app/docs/vega/vega-react/">Vega - Step by Step using GraphQL</a> tutorial</p>
                </div>
            </div>
        </Fragment>
    );
}

export default AppInfo;