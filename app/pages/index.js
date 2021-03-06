import Link from 'next/link';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { jsx } from '@emotion/core';
import { format } from 'date-fns';

import Layout from '../templates/layout';
import Header from '../components/header';
import Loading from '../components/loading';

/** @jsx jsx */

const Post = ({ post }) => {

  if (post && post.image && post.image.publicUrl) {
    post.image.thumbnailUrl = String(post.image.publicUrl).replace('upload/', 'upload/w_288,q_60/');
  }

  return (
    <Link href={`/post/[slug]?slug=${post.slug}`} as={`/post/${post.slug}`} passHref>
      <a
        css={{
          display: 'block',
          background: 'white',
          boxShadow: '0px 10px 20px hsla(200, 20%, 20%, 0.20)',
          marginBottom: 32,
          cursor: 'pointer',
          borderRadius: 6,
          overflow: 'hidden',
          ':hover': {
            textDecoration: 'none'
          },
        }}
      >
        <div className="row no-gutters">
          {post.image ? <img src={post.image.thumbnailUrl} css={{ width: '100%' }} className="col-sm-4" /> : <div css={{ backgroundColor: '#999' }} className="col-sm-4"></div>}
          <div className="col-sm-8">
            <article css={{ padding: '1em' }} >
              <h3 css={{ marginTop: 0 }}>{post.title}</h3>
              <section dangerouslySetInnerHTML={{ __html: post.intro }} css={{ color: 'hsl(200, 20%, 20%)' }}/>
              {showPostListPostedBy ? 
              <div css={{ marginTop: '1em', borderTop: '1px solid hsl(200, 20%, 80%)' }}>
                <p css={{ fontSize: '0.8em', marginBottom: 0, color: 'hsl(200, 20%, 50%)' }}>
                  Posté par {post.author ? post.author.name : 'Quelqu\'un'} le{' '}
                  {format(post.posted, 'DD/MM/YYYY')}
                </p>
              </div> : null}
            </article>
          </div>
        </div>
      </a>
    </Link>
  );
};

let showPostListPostedBy = true;

export default () => (
  <Layout>
    <Query
      query={gql`
        {
          allPosts (
            where: {status: published}
          ) {
            title
            id
            intro
            body
            posted
            slug
            image {
              publicUrl
            }
            author {
              name
            }
          }

          allSettings (
            where: {key: "showPostListPostedBy"}
          ) {
            key
            value
          }

          allNavItems (
            where: {published: true}
          ) {
            id
            name
            href
            target
          }
        }
      `}
    >
      {({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <p>Error!</p>;

        if (data.allSettings) {
          const settingsFiltered = data.allSettings.filter(k => k.key === 'showPostListPostedBy')[0];
          if (settingsFiltered) {
            showPostListPostedBy = (settingsFiltered.value === 'true' || settingsFiltered.value === true);
          }
        }

        return (
          <>
            <Header data={data.allNavItems} />
            <section css={{ margin: '48px 0' }}>
              <h2>À propos</h2>
              <p>
                Ce blog est dédié à ma passion pour la photographie. J'ai envie de partager avec vous mes voyages, mes avis, mes expériences.
                Bref, tout ce qui peut être intéressant dans le domaine de la photographie. J'espère que ça vous plaira.
              </p>
            </section>
            <section css={{ margin: '48px 0' }}>
              <h2>Les derniers articles</h2>
              <div>
                {data.allPosts.length ? (
                  data.allPosts.map(post => <Post post={post} key={post.id} />)
                ) : (
                  <p>No posts to display</p>
                )}
              </div>
            </section>
          </>
        );
      }}
    </Query>
  </Layout>
);
