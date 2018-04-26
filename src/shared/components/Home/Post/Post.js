import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Post extends Component {
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
                                    <a target="_blank" href={'https://www.facebook.com/' + this.props.post_id}>
                                        <h4>{this.props.name}
                                            <span className="new badge blue" data-badge-caption="likes">{this.props.likes}</span>
                                        </h4>
                                    </a>
                                    <Link to={"/detail/" + this.props.uid} className="waves-effect waves-light btn" >
                                        detail
                                    </Link>

                                </li>
                                <li className="collection-item"><div>Alvin  <a href="#!" className="secondary-content"><i className="material-icons">send</i></a></div></li>
                                <li className="collection-item"><div>Alvin<a href="#!" className="secondary-content"><i className="material-icons">send</i></a></div></li>
                                <li className="collection-item"><div>Alvin<a href="#!" className="secondary-content"><i className="material-icons">send</i></a></div></li>
                                <li className="collection-item"><div>Alvin<a href="#!" className="secondary-content"><i className="material-icons">send</i></a></div></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Post;