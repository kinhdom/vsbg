import React, { Component } from 'react';
import axios from 'axios';
import Post from '../Post/Post';
import querystring from 'querystring';

class NewPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            group_id: '',
            user_fb_id: '',
            user_fb_access_token: '',
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
        this.fetchData(this.state.group_id, this.state.currentPage + 1).then(res => {
            this.setState({
                isFetchData: false
            })
        })
    }
    updateDatabase() {
        let group_id = this.state.group_id
        let access_token = this.state.access_token
        let params = new URLSearchParams();
        params.append('group_id', group_id);
        params.append('access_token', access_token)
        axios.post('/api/updataDatabase', params)
            .then(res => {
                console.log(res)
            })


    }
    fetchData(group_id, page) {
        this.setState({ isFetchData: true })
        console.log('Newpost Fetching ' + page)
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
    render() {
        return (
            <div>
                {this.state.isFetchData ?
                    <div className="progress">
                        <div className="indeterminate"></div>
                    </div>
                    : null}


                <div className="container">
                    <a className="waves-effect waves-light btn" onClick={this.updateDatabase.bind(this)} >Update</a>
                    <a className="waves-effect waves-light btn" onClick={this.crawlDatabase} >Crawl</a>
                    {this.state.arrPosts.map((post) => {
                        console.log(post)
                        return (
                            <Post
                                key={post._id}
                                post_id={post.post_id}
                                name={post.from_name}
                                uid={post.from_id}
                                image={post.image ? post.image : post.full_picture}
                                caption={post.post_message}
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
        // let user_id = localStorage.getItem('')
        let user_id = '5ae750c6acd6e04c662c5471';
        axios.post('/api/userinfo', querystring.stringify({ user_id: user_id }))
            .then(info => {
                console.log(info.user_fb_access_token)
                this.setState({
                    user_fb_id: info.user_fb_uid,
                    user_fb_access_token: info.user_fb_access_token,
                    group_id: group_id
                })
            })
        this.fetchData(group_id, 1)
    }
    componentDidMount() {
        let group_id = this.props.match.params.group_id
        // axios.get('/api/' + group_id + '/addnew')
        //     .then(res => {
        //         console.log(res)
        //     })
    }
}
export default NewPost;