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
        let user_fb_access_token = this.state.user_fb_access_token
        let params = new URLSearchParams();
        params.append('group_id', group_id);
        params.append('user_fb_access_token', user_fb_access_token)
        console.log(params)
        axios.post('/api/updataDatabase', params)
            .then(res => {
                console.log(res)
            })


    }
    crawlDatabase() {
        let group_id = this.state.group_id
        let user_fb_access_token = this.state.user_fb_access_token
        let dataCrawl = {
            group_id: group_id,
            user_fb_access_token: user_fb_access_token
        }
        axios.post('/api/crawl', querystring.stringify(dataCrawl))
    }
    fetchData(group_id, page) {
        this.setState({ isFetchData: true })
        console.log('Newpost Fetching ' + page)
        let dataFetch = {
            group_id: group_id,
            page: page
        }
        return axios.post('/api/newpost/', querystring.stringify(dataFetch))
            .then(res => {
                if (res.status === 200 && res.data.message) {
                    this.setState({
                        arrPosts: this.state.arrPosts.concat(res.data.message),
                        isFetchData: false
                    })
                }
            })
            .catch(e => console.log('Err at fetchData (fix /api to 3000/api) ' + e))
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
                    <a className="waves-effect waves-light btn" onClick={this.crawlDatabase.bind(this)} >Crawl</a>
                    {this.state.arrPosts.map((post) => {
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
        this.fetchData(group_id, 1)
    }
    componentDidMount() {
        console.log('Did mount')
        let user_id = '5ae750c6acd6e04c662c5471';
        let group_id = this.props.match.params.group_id
        axios.post('/api/userinfo', querystring.stringify({ user_id: user_id }))
            .then(info => {
                console.log('Get info user done !')
                this.setState({
                    user_fb_id: info.data.user_fb_uid,
                    user_fb_access_token: info.data.user_fb_access_token,
                    group_id: group_id
                })
            })
            .catch(e => console.log('Err at did mount ' + e))
    }
}
export default NewPost;