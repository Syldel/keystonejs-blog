/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from 'next/link';

import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import { useState } from 'react';

import styled from '@emotion/styled';

import Layout from '../../templates/layout';
import Header from '../../components/header';

const FormGroup = styled.div({
  display: 'flex',
  marginBottom: 8,
  width: '100%',
  maxWidth: 500,
});

const Label = styled.label({
  width: 200,
});

const Input = styled.input({
  width: '100%',
  padding: 8,
  fontSize: '1em',
  borderRadius: 4,
  border: '1px solid hsl(200,20%,70%)',
});

const ADD_POST = gql`
  mutation AddPost(
    $title: String!
    $body: String!
    $authorId: ID!
    $posted: DateTime!
    $image: Upload!
  ) {
    createPost(
      data: {
        title: $title
        body: $body
        author: { connect: { id: $authorId } }
        posted: $posted
        image: $image
      }
    ) {
      id
      slug
    }
  }
`;

const leftChevron = color => <span css={{ width: '20px', height: '20px', display: 'flex', marginRight: '0.3rem' }} dangerouslySetInnerHTML={{__html: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 256 256" style="width: 100%" xml:space="preserve">
<style>.svg-node{fill: ${color}}</style>
<g class="svg-node"><polygon points="207.093,30.187 176.907,0 48.907,128 176.907,256 207.093,225.813 109.28,128"/></g>
</svg>`}} />;

export default () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const [slug, setSlug] = useState('');

  return (
    <Layout>
      <Header />
      <div css={{ margin: '48px 0' }}>
        <Link href="/" passHref>
          <a css={{ color: 'hsl(200,20%,50%)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>{leftChevron('hsl(200,20%,50%)')}Accueil</a>
        </Link>
        <h1>Nouvel Article</h1>

        {showBanner && (
          <div
            css={{
              background: slug ? '#90ee9061' : '#ee909061',
              border: `1px solid ${slug ? 'green' : 'red'}`,
              color: slug ? 'green' : 'red',
              padding: 12,
              marginBottom: 32,
              borderRadius: 6,
            }}
          >
            {slug ? (
              <span>
                <strong>Success!</strong> Post has been created.{' '}
                <Link href={`/post/[slug]?slug=${slug}`} as={`/post/${slug}`} passHref>
                  <a css={{ color: 'green' }}>Check it out</a>
                </Link>
              </span>
            ) : (
              <span>
                <strong>Whoops!</strong> Something has gone wrong
              </span>
            )}
          </div>
        )}

        <Query
          query={gql`
            {
              allUsers(where: { isAdmin: false }) {
                name
                email
                id
              }
            }
          `}
        >
          {({ data, loading, error }) => {
            if (loading) return <p>loading...</p>;
            if (error) return <p>Error!</p>;

            return (
              <Mutation
                mutation={ADD_POST}
                update={(cache, { data: { createPost } }) => {
                  setSlug(createPost.slug);
                  setShowBanner(true);
                }}
              >
                {createPost => {
                  return (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        createPost({
                          variables: {
                            title,
                            body,
                            image,
                            authorId: authorId || data.allUsers[0].id,
                            posted: new Date(),
                          },
                        });

                        setTitle('');
                        setBody('');
                      }}
                    >
                      <FormGroup>
                        <Label htmlFor="title">Title:</Label>
                        <Input
                          type="text"
                          name="title"
                          value={title}
                          onChange={event => {
                            setTitle(event.target.value);
                          }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="body">Body:</Label>
                        <textarea
                          css={{
                            width: '100%',
                            padding: 8,
                            fontSize: '1em',
                            borderRadius: 4,
                            border: '1px solid hsl(200,20%,70%)',
                            height: 200,
                            resize: 'none',
                          }}
                          name="body"
                          value={body}
                          onChange={event => {
                            setBody(event.target.value);
                          }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="image">Image URL:</Label>
                        <Input
                          type="file"
                          name="image"
                          // value={image}
                          onChange={event => {
                            setImage(event.target.files[0]);
                          }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="admin">Post as:</Label>
                        <select
                          name="admin"
                          css={{
                            width: '100%',
                            height: 32,
                            fontSize: '1em',
                            borderRadius: 4,
                            border: '1px solid hsl(200,20%,70%)',
                          }}
                          value={authorId}
                          onChange={event => {
                            setAuthorId(event.target.value);
                          }}
                        >
                          {data.allUsers.map(user => (
                            <option
                              value={user.id}
                              key={user.id}
                            >{`${user.name} <${user.email}>`}</option>
                          ))}
                        </select>
                      </FormGroup>
                      <input type="submit" value="submit" />
                    </form>
                  );
                }}
              </Mutation>
            );
          }}
        </Query>
      </div>
    </Layout>
  );
};
