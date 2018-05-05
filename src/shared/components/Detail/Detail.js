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
    getDetailData(post_id) {
        Axios.get('http://localhost:3000/api/detail/' + post_id)
            .then(res => {
                if (res) {
                    this.setState({
                        post_id: post_id,
                        post_detail: res.data
                    })
                }
            })
            .catch(e => console.log(e + ''))
    }
    componentDidMount() {
        let post_id = this.props.match.params.id
        this.getDetailData(post_id)
    }
    componentWillReceiveProps(nextProps) {
        let newPostId = nextProps.match.params.id
        if (newPostId != this.state.post_id) {
            this.getDetailData(newPostId)
        }
    }
}

export default Detail;