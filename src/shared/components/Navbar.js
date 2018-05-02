import React, { Component } from 'react';
import { Link } from 'react-router-dom'
class Navbar extends Component {
    render() {
        return (
            <nav>
                <div className="nav-wrapper">
                    <a href="/" className="brand-logo">Logo</a>
                    <ul id="nav-mobile" className="right">
                        <li><Link to="/">HOME</Link></li>
                        <li><Link to="/detail/3">Detail</Link></li>
                        <li><Link to="/top/1173636692750000">Top</Link></li>
                        <li><Link to="/group/1173636692750000">VSBG</Link></li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Navbar;