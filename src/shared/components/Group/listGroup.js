import React, { Component } from 'react';
import Group from './Group';

import Axios from 'axios';

class listGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrGroups: [],
            isFetchData: false
        }
    }
    render() {
        return (

            <div className="container" >
                {this.state.isFetchData ?
                    <div className="progress">
                        <div className="indeterminate"></div>
                    </div>
                    : null}
                <ul className="collection">
                    {this.state.arrGroups.map((group) => {
                        return (
                            <Group
                                key={group.id}
                                group_name={group.name}
                                group_id={group.id}
                                group_member_count={group.member_count}
                                group_description={group.description}

                            />

                        )
                    })}
                </ul>
            </div>
        );
    }
    componentDidMount() {
        this.setState({ isFetchData: true })
        console.log('Get groups ...')
        Axios.get('http://localhost:3000/api/mygroups')
            .then(res => {
                this.setState({
                    arrGroups: res.data,
                    isFetchData: false
                })
            })
    }
}

export default listGroup;