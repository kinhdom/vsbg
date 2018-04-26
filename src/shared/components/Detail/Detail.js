import React, { Component } from 'react';

class Detail extends Component {
    constructor(props){
        super(props)
    }
    render() {
        return (
            <div>
                DETAIL {this.props.match.params.id}
            </div>
        );
    }
}

export default Detail;