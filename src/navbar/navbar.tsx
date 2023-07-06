import React from 'react'
import Logo from '../assets/Logo.png';
import './navbar.css';
import { Link, NavLink } from 'react-router-dom';

export const Navbar = () => {
    return (
        <>
            <div className='bgPurple navTop d-flex align-items center text-white'>
                <div className='me-auto'>
                    <i className="bi bi-facebook  px-2 fs-6"></i>
                    <i className="bi bi-instagram px-2 fs-6"></i>
                    <i className="bi bi-twitter px-2 fs-6"></i>
                    <i className="bi bi-whatsapp px-2 fs-6"></i>
                </div>
                <div className='fs-6'>
                    <i className="bi bi-telephone-fill"></i>
                    <span className='ps-2 pe-4'>123-456-7890</span>
                    <i className="bi bi-envelope-fill"></i>
                    <span className='px-2'>info@example.com</span>
                </div>
            </div>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <img src={Logo} alt="Logo" />
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ps-xl-5 mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to={'/'}>
                                    <a className="nav-link fw-bold" aria-current="page">Home</a>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={'/products'}>
                                    <a className="nav-link fw-bold">Products</a>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
