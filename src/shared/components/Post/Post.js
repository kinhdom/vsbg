import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Axios from 'axios';
import querystring from 'querystring';

class Post extends Component {
    post2Group() {
        let moreCaption = 'Facebook: '
        let data = {
            from_id: this.props.uid,
            photo_url: this.props.image,
            caption: this.props.caption,
            group_id: '1416109728606342',
            access_token: 'EAAAAUaZA8jlABAP2JyvV2W6BscLhEm5itm312SOPw4xdHq4T2PviBzwboZCxp9qOAXzvXKoAbsewvL7AdKiwwIfMqTB7eSdIRs7fS41LZBiiTWz6AveP9ODeulgx2zc84sZCDNjdyAM5A66y0tBZBwZAFUpg6P2EYBWh8TrJ7pW3BH4wLWFTVXCgvH6p11RrhBK3x0PhUSSwZDZD'
        }
        Axios.post('http://react-routest.herokuapp.com/api/postPhoto2Group', querystring.stringify(data))
            .then(res => {
                M.toast({ html: 'Posted ' + res.data.msg })
                console.log(res.data.msg)
            })
            .catch(e => console.log(e + ''))
    }
    render() {
        return (
            <div className="row">
                <div className="card-panel grey lighten-5 z-depth-1">
                    <div className="row">
                        <div className="col s12 m4">
                            <img src={this.props.image} alt="" className="responsive-img" />
                        </div>
                        <div className="col s12 m8">
                            <p>{this.props.caption}</p>
                            <ul className="collection with-header">
                                <li className="collection-header">
                                    <a target="_blank" href={'https://www.facebook.com/' + this.props.uid}>
                                        <h4>{this.props.name}
                                            <span className="new badge blue" data-badge-caption="likes">{this.props.likes_count}</span>
                                        </h4>
                                    </a>
                                    <Link to={"/api/delete/" + this.props.post_id} className="waves-effect waves-light btn" >
                                        delete
                                    </Link>
                                    <Link to={"/detail/" + this.props.post_id} className="waves-effect waves-light btn" >
                                        Detail
                                    </Link>
                                </li>
                                <li className="collection-item"><div>Alvin  <a href="#!" className="secondary-content"><i className="material-icons">send</i></a></div></li>
                                <li className="collection-item"><div>Alvin<a href="#!" className="secondary-content"><i className="material-icons">send</i></a></div></li>
                                <li className="collection-item"><div>Alvin<a href="#!" className="secondary-content"><i className="material-icons">send</i></a></div></li>
                                <li className="collection-item"><div>Alvin<a href="#!" className="secondary-content"><i className="material-icons">send</i></a></div></li>
                                <a className="waves-effect waves-light btn" onClick={this.post2Group.bind(this)} ><i className="material-icons left">cloud</i>Post VSBG</a>
                            </ul>


                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default Post;