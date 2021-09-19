import { Fragment } from 'react';
import vega_logo from '../img/vega_logo.svg';

function SideBar() {
    return (
        <Fragment>
            <div className="side-bar">
            <a href="https://vega.xyz/" title="Vega Protocol: Decentralized Derivatives Trading Platform">
                <img alt="Vega Protocol Logo" className="logo-vega" src={vega_logo} />
            </a>
            <div className="side-bar-text">
                Vega Protocol is a decentralized derivatives platform.
            </div>
            <div className="side-bar-text side-bar-about-app">
                This is a ReactJS demo app to interact with the Vega GraphQL API.
            </div>
            </div>
        </Fragment>
   )
}

export default SideBar;