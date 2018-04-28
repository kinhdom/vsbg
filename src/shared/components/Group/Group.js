import React, { Component } from 'react';

class Group extends Component {
    render() {
        return (
            <li className="collection-item avatar">
                <i className="material-icons circle red">play_arrow</i>
                <span className="title">{this.props.group_name}</span>
                <p>{this.props.group_member_count} members<br />
                    {this.props.description}
                </p>
                <a href={'/group/' + this.props.group_id} className="secondary-content"><i className="material-icons">grade</i></a>
            </li>
        );
    }
}

export default Group;