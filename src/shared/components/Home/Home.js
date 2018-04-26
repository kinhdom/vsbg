import React, { Component } from 'react';
import axios from 'axios';
import Post from './Post/Post'

class Home extends Component {
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
    fetchData(page) {
        console.log('Fetching ' + page)
        return axios.get('https://vsbgme.herokuapp.com/api/newpost/' + page)
            .then(res => {
                if (res.status === 200 && res.data.message) {
                    this.setState({
                        arrPosts: this.state.arrPosts.concat(res.data.message)
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
                    {this.state.arrPosts.map((post) => {
                        return (
                            <Post
                                key={post.id}
                                post_id={post.id}
                                name={post.from.name}
                                uid={post.from.id}
                                image={post.full_picture}
                                caption={post.message.slice(0, 250)}
                                likes ={post.likes.count}
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
    componentDidMount() {
        this.fetchData(1)
    }
}
export default Home;