import React, { Component } from 'react';
import axios from 'axios';
import Post from '../Post/Post'
class TopPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrPosts: []
        }
    }
    render() {
        return (
            <div>
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
            </div>
        );
    }
    fetchData(group_id, page) {
        console.log('Fetching ' + page)
        return axios.get('http://localhost:3000/api/' + group_id + '/top/' + page)
            .then(res => {
                if (res.status === 200 && res.data.message) {
                    this.setState({
                        arrPosts: this.state.arrPosts.concat(res.data.message)
                    })
                }
            })
    }
    componentDidMount() {
        console.log('Top')
        let group_id = this.props.match.params.group_id
        this.fetchData(group_id, 1)
    }
}

export default TopPost;