import React, { Component } from 'react';
import axios from 'axios';
import Post from '../Post/Post';

class NewPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            arrPosts: [],
            isFetchData: false
        }
    }
    clickLoadMore() {
        this.setState({
            isFetchData: true,
            currentPage: this.state.currentPage + 1,
        })
        this.fetchData(this.state.currentPage + 1).then(res => {
            this.setState({
                isFetchData: false
            })
        })
    }
    fetchData(group_id, page) {
        this.setState({ isFetchData: true })
        console.log('HOME Fetching ' + page)
        return axios.get('https://vsbgnew.herokuapp.com/api/' + group_id + '/newpost/' + page)
            .then(res => {
                if (res.status === 200 && res.data.message) {
                    this.setState({
                        arrPosts: this.state.arrPosts.concat(res.data.message),
                        isFetchData: false
                    })
                }
            })
    }
    updateData() {

    }
    render() {
        return (
            <div>
                {this.state.isFetchData ?
                    <div className="progress">
                        <div className="indeterminate"></div>
                    </div>
                    : null}


                <div className="container">
                    {this.state.arrPosts.map((post) => {
                        return (
                            <Post
                                key={post._id}
                                post_id={post.post_id}
                                name={post.from_name}
                                uid={post.from_id}
                                image={post.image ? post.image : post.full_picture}
                                caption={post.post_message.slice(0, 250)}
                                likes={post.likes}
                            />
                        )
                    })}
                </div>
                <div className=" fixed-action-btn row center-align" onClick={this.clickLoadMore.bind(this)} >
                    <a className="btn-floating btn-large waves-effect waves-light red"><i className="material-icons">add</i></a>
                </div>
            </div>

        );
    }
    componentWillMount() {
        console.log('will mount')
        let group_id = this.props.match.params.group_id
        this.fetchData(group_id, 1)
    }
    componentDidMount() {
        
        // let group_id = this.props.match.params.group_id
        // axios.get('/api/' + group_id + '/addnew')
        //     .then(res => {
        //         console.log(res)
        //     })
    }
}
export default NewPost;