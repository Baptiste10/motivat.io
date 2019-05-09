import React, {
    Component
} from 'react';

import ArgdownHandler from './argdownHandler'

class SvgMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: ""
        }
    }

    render() {
        return (
            <div className = "SvgMap" >
                <textarea value={this.state.text} onChange={e => {
                    e.preventDefault();
                    this.setState({
                        text: e.target.value
                    })
                }}/>
                <button onClick={e => {
                    e.preventDefault();
                    const handler = new ArgdownHandler(this.state.text);

                    handler.generateImage(document.getElementById("svg-container"));

                }}>generate</button>
                <div id="svg-container"></div>
            </div>
        );
    }
}

export default SvgMap;