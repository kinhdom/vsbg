import React, { Component } from 'react';

class Navbar extends Component {
    render() {
        return (
            <nav>
                <div className="nav-wrapper">
                    <a href="/" className="brand-logo">Logo</a>
                    <ul id="nav-mobile" className="right">
                        <li><a href="/">HOME</a></li>
                        <li><a href="/detail/3">Detail</a></li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Navbar;