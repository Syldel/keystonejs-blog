import React from 'react';
import { Router } from 'next/router';
import Loading from './loading';
import ActiveLink from './active-link';

const links = [
  { href: 'https://zeit.co/now', label: 'ZEIT' },
  { href: 'https://github.com/zeit/next.js', label: 'GitHub' },
  { href: '/post/conseils-instagram-pour-les-debutants', label: 'post' },
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`;
  return link;
});

class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ssrDone: false
    }
  }
  componentDidMount() {
    this.setState({ ssrDone: true, online: navigator.onLine })
  }
  render() {
    if (!this.state.ssrDone) {
      return <Loading />;
    }

    return (
      <nav className="navbar">
        <ul className="nav">
          <li className="nav-item">
            <ActiveLink activeClassName="active" href="/">
              <a className="nav-link">Accueil</a>
            </ActiveLink>
          </li>
          {links.map(({ key, href, label }) => (
            <li className="nav-item" key={key}>
              <ActiveLink activeClassName="active" href={href}>
                <a className="nav-link">{label}</a>
              </ActiveLink>
            </li>
          ))}
        </ul>

        <style jsx>{`
        .navbar {
          background-color: hsl(200,20%,50%);
          padding: 0.5rem;
          margin-top: 2rem;
          box-shadow: 0px 10px 20px hsla(200, 20%, 20%, 0.20);
          border-radius: 6px;
        }
        .nav-link {
          color: #ccc;
        }
        .nav-link.active {
          color: hsl(200,20%,50%);
          background-color: #eee;
          border-radius: 6px;
        }
        .nav-link.active:hover {
          color: hsl(200,20%,50%);
        }
        .nav-link:hover {
          color: #fff;
        }

        /*:global(body) {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
            Helvetica, sans-serif;
        }*/
      `}</style>

      </nav>);
  }
}

export default Nav;