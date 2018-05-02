import React, { Component } from 'react';
import Axios from 'axios';

class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            post_id: '',
            post_detail: {}
        }
    }
    render() {
        return (
            <div>
                DETAIL {this.state.post_detail.post_message}
            </div>
        );
    }
    componentWillMount() {
        let post_id = this.props.match.params.id
        Axios.get('https://react-routest.herokuapp.com/api/detail/' + post_id)
            .then(res => {
                if (res) {
                    this.setState({
                        post_id: post_id,
                        post_detail: res.data
                    })
                    console.log(this.state)
                }
            })
            .catch(e => console.log(e + ''))
    }
}

export default Detail;