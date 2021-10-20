// DO NOT MODIFY THIS FILE. This file is automatically generated by Tina
import { DocumentNode } from 'graphql';
import { gql } from 'tinacms';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** References another document, used as a foreign key */
  Reference: any;
  JSON: any;
};

export type SystemInfo = {
  __typename?: 'SystemInfo';
  filename: Scalars['String'];
  basename: Scalars['String'];
  breadcrumbs: Array<Scalars['String']>;
  path: Scalars['String'];
  relativePath: Scalars['String'];
  extension: Scalars['String'];
  template: Scalars['String'];
  collection: Collection;
};


export type SystemInfoBreadcrumbsArgs = {
  excludeExtension?: Maybe<Scalars['Boolean']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasPreviousPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  startCursor: Scalars['String'];
  endCursor: Scalars['String'];
};

export type Node = {
  id: Scalars['ID'];
};

export type Document = {
  sys?: Maybe<SystemInfo>;
  id: Scalars['ID'];
};

/** A relay-compliant pagination connection */
export type Connection = {
  totalCount: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  getCollection: Collection;
  getCollections: Array<Collection>;
  node: Node;
  getDocument: DocumentNode;
  getDocumentList: DocumentConnection;
  getDocumentFields: Scalars['JSON'];
  getPostsDocument: PostsDocument;
  getPostsList: PostsConnection;
  getGlobalDocument: GlobalDocument;
  getGlobalList: GlobalConnection;
  getAuthorsDocument: AuthorsDocument;
  getAuthorsList: AuthorsConnection;
  getPagesDocument: PagesDocument;
  getPagesList: PagesConnection;
};


export type QueryGetCollectionArgs = {
  collection?: Maybe<Scalars['String']>;
};


export type QueryNodeArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryGetDocumentArgs = {
  collection?: Maybe<Scalars['String']>;
  relativePath?: Maybe<Scalars['String']>;
};


export type QueryGetDocumentListArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryGetPostsDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
};


export type QueryGetPostsListArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryGetGlobalDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
};


export type QueryGetGlobalListArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryGetAuthorsDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
};


export type QueryGetAuthorsListArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryGetPagesDocumentArgs = {
  relativePath?: Maybe<Scalars['String']>;
};


export type QueryGetPagesListArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type DocumentConnectionEdges = {
  __typename?: 'DocumentConnectionEdges';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<DocumentNode>;
};

export type DocumentConnection = Connection & {
  __typename?: 'DocumentConnection';
  pageInfo?: Maybe<PageInfo>;
  totalCount: Scalars['Int'];
  edges?: Maybe<Array<Maybe<DocumentConnectionEdges>>>;
};

export type Collection = {
  __typename?: 'Collection';
  name: Scalars['String'];
  slug: Scalars['String'];
  label: Scalars['String'];
  path: Scalars['String'];
  format?: Maybe<Scalars['String']>;
  matches?: Maybe<Scalars['String']>;
  templates?: Maybe<Array<Maybe<Scalars['JSON']>>>;
  fields?: Maybe<Array<Maybe<Scalars['JSON']>>>;
  documents: DocumentConnection;
};


export type CollectionDocumentsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type DocumentNode = PostsDocument | GlobalDocument | AuthorsDocument | PagesDocument;

export type PostsAuthorDocument = AuthorsDocument;

export type Posts = {
  __typename?: 'Posts';
  title?: Maybe<Scalars['String']>;
  author?: Maybe<PostsAuthorDocument>;
  date?: Maybe<Scalars['String']>;
  heroImg?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  _body?: Maybe<Scalars['String']>;
};

export type PostsDocument = Node & Document & {
  __typename?: 'PostsDocument';
  id: Scalars['ID'];
  sys: SystemInfo;
  data: Posts;
  form: Scalars['JSON'];
  values: Scalars['JSON'];
  dataJSON: Scalars['JSON'];
};

export type PostsConnectionEdges = {
  __typename?: 'PostsConnectionEdges';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<PostsDocument>;
};

export type PostsConnection = Connection & {
  __typename?: 'PostsConnection';
  pageInfo?: Maybe<PageInfo>;
  totalCount: Scalars['Int'];
  edges?: Maybe<Array<Maybe<PostsConnectionEdges>>>;
};

export type GlobalHeaderIcon = {
  __typename?: 'GlobalHeaderIcon';
  color?: Maybe<Scalars['String']>;
  style?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type GlobalHeaderNav = {
  __typename?: 'GlobalHeaderNav';
  href?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
};

export type GlobalHeader = {
  __typename?: 'GlobalHeader';
  icon?: Maybe<GlobalHeaderIcon>;
  color?: Maybe<Scalars['String']>;
  nav?: Maybe<Array<Maybe<GlobalHeaderNav>>>;
};

export type GlobalFooterSocial = {
  __typename?: 'GlobalFooterSocial';
  facebook?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
  github?: Maybe<Scalars['String']>;
};

export type GlobalFooter = {
  __typename?: 'GlobalFooter';
  color?: Maybe<Scalars['String']>;
  social?: Maybe<GlobalFooterSocial>;
};

export type GlobalTheme = {
  __typename?: 'GlobalTheme';
  color?: Maybe<Scalars['String']>;
  font?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  darkMode?: Maybe<Scalars['String']>;
};

export type Global = {
  __typename?: 'Global';
  header?: Maybe<GlobalHeader>;
  footer?: Maybe<GlobalFooter>;
  theme?: Maybe<GlobalTheme>;
};

export type GlobalDocument = Node & Document & {
  __typename?: 'GlobalDocument';
  id: Scalars['ID'];
  sys: SystemInfo;
  data: Global;
  form: Scalars['JSON'];
  values: Scalars['JSON'];
  dataJSON: Scalars['JSON'];
};

export type GlobalConnectionEdges = {
  __typename?: 'GlobalConnectionEdges';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<GlobalDocument>;
};

export type GlobalConnection = Connection & {
  __typename?: 'GlobalConnection';
  pageInfo?: Maybe<PageInfo>;
  totalCount: Scalars['Int'];
  edges?: Maybe<Array<Maybe<GlobalConnectionEdges>>>;
};

export type Authors = {
  __typename?: 'Authors';
  name?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
};

export type AuthorsDocument = Node & Document & {
  __typename?: 'AuthorsDocument';
  id: Scalars['ID'];
  sys: SystemInfo;
  data: Authors;
  form: Scalars['JSON'];
  values: Scalars['JSON'];
  dataJSON: Scalars['JSON'];
};

export type AuthorsConnectionEdges = {
  __typename?: 'AuthorsConnectionEdges';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<AuthorsDocument>;
};

export type AuthorsConnection = Connection & {
  __typename?: 'AuthorsConnection';
  pageInfo?: Maybe<PageInfo>;
  totalCount: Scalars['Int'];
  edges?: Maybe<Array<Maybe<AuthorsConnectionEdges>>>;
};

export type PagesBlocksHeroActions = {
  __typename?: 'PagesBlocksHeroActions';
  label?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['Boolean']>;
  link?: Maybe<Scalars['String']>;
};

export type PagesBlocksHeroImage = {
  __typename?: 'PagesBlocksHeroImage';
  src?: Maybe<Scalars['String']>;
  alt?: Maybe<Scalars['String']>;
};

export type PagesBlocksHero = {
  __typename?: 'PagesBlocksHero';
  tagline?: Maybe<Scalars['String']>;
  headline?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  actions?: Maybe<Array<Maybe<PagesBlocksHeroActions>>>;
  image?: Maybe<PagesBlocksHeroImage>;
  color?: Maybe<Scalars['String']>;
};

export type PagesBlocksFeaturesItemsIcon = {
  __typename?: 'PagesBlocksFeaturesItemsIcon';
  color?: Maybe<Scalars['String']>;
  style?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type PagesBlocksFeaturesItems = {
  __typename?: 'PagesBlocksFeaturesItems';
  icon?: Maybe<PagesBlocksFeaturesItemsIcon>;
  title?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type PagesBlocksFeatures = {
  __typename?: 'PagesBlocksFeatures';
  items?: Maybe<Array<Maybe<PagesBlocksFeaturesItems>>>;
  color?: Maybe<Scalars['String']>;
};

export type PagesBlocksContent = {
  __typename?: 'PagesBlocksContent';
  body?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
};

export type PagesBlocksTestimonial = {
  __typename?: 'PagesBlocksTestimonial';
  quote?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
};

export type PagesBlocks = PagesBlocksHero | PagesBlocksFeatures | PagesBlocksContent | PagesBlocksTestimonial;

export type Pages = {
  __typename?: 'Pages';
  blocks?: Maybe<Array<Maybe<PagesBlocks>>>;
};

export type PagesDocument = Node & Document & {
  __typename?: 'PagesDocument';
  id: Scalars['ID'];
  sys: SystemInfo;
  data: Pages;
  form: Scalars['JSON'];
  values: Scalars['JSON'];
  dataJSON: Scalars['JSON'];
};

export type PagesConnectionEdges = {
  __typename?: 'PagesConnectionEdges';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<PagesDocument>;
};

export type PagesConnection = Connection & {
  __typename?: 'PagesConnection';
  pageInfo?: Maybe<PageInfo>;
  totalCount: Scalars['Int'];
  edges?: Maybe<Array<Maybe<PagesConnectionEdges>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addPendingDocument: DocumentNode;
  updateDocument: DocumentNode;
  createDocument: DocumentNode;
  updatePostsDocument: PostsDocument;
  createPostsDocument: PostsDocument;
  updateGlobalDocument: GlobalDocument;
  createGlobalDocument: GlobalDocument;
  updateAuthorsDocument: AuthorsDocument;
  createAuthorsDocument: AuthorsDocument;
  updatePagesDocument: PagesDocument;
  createPagesDocument: PagesDocument;
};


export type MutationAddPendingDocumentArgs = {
  collection: Scalars['String'];
  relativePath: Scalars['String'];
  template?: Maybe<Scalars['String']>;
};


export type MutationUpdateDocumentArgs = {
  collection: Scalars['String'];
  relativePath: Scalars['String'];
  params: DocumentMutation;
};


export type MutationCreateDocumentArgs = {
  collection: Scalars['String'];
  relativePath: Scalars['String'];
  params: DocumentMutation;
};


export type MutationUpdatePostsDocumentArgs = {
  relativePath: Scalars['String'];
  params: PostsMutation;
};


export type MutationCreatePostsDocumentArgs = {
  relativePath: Scalars['String'];
  params: PostsMutation;
};


export type MutationUpdateGlobalDocumentArgs = {
  relativePath: Scalars['String'];
  params: GlobalMutation;
};


export type MutationCreateGlobalDocumentArgs = {
  relativePath: Scalars['String'];
  params: GlobalMutation;
};


export type MutationUpdateAuthorsDocumentArgs = {
  relativePath: Scalars['String'];
  params: AuthorsMutation;
};


export type MutationCreateAuthorsDocumentArgs = {
  relativePath: Scalars['String'];
  params: AuthorsMutation;
};


export type MutationUpdatePagesDocumentArgs = {
  relativePath: Scalars['String'];
  params: PagesMutation;
};


export type MutationCreatePagesDocumentArgs = {
  relativePath: Scalars['String'];
  params: PagesMutation;
};

export type DocumentMutation = {
  posts?: Maybe<PostsMutation>;
  global?: Maybe<GlobalMutation>;
  authors?: Maybe<AuthorsMutation>;
  pages?: Maybe<PagesMutation>;
};

export type PostsMutation = {
  title?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  heroImg?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  _body?: Maybe<Scalars['String']>;
};

export type GlobalHeaderIconMutation = {
  color?: Maybe<Scalars['String']>;
  style?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type GlobalHeaderNavMutation = {
  href?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
};

export type GlobalHeaderMutation = {
  icon?: Maybe<GlobalHeaderIconMutation>;
  color?: Maybe<Scalars['String']>;
  nav?: Maybe<Array<Maybe<GlobalHeaderNavMutation>>>;
};

export type GlobalFooterSocialMutation = {
  facebook?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
  github?: Maybe<Scalars['String']>;
};

export type GlobalFooterMutation = {
  color?: Maybe<Scalars['String']>;
  social?: Maybe<GlobalFooterSocialMutation>;
};

export type GlobalThemeMutation = {
  color?: Maybe<Scalars['String']>;
  font?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  darkMode?: Maybe<Scalars['String']>;
};

export type GlobalMutation = {
  header?: Maybe<GlobalHeaderMutation>;
  footer?: Maybe<GlobalFooterMutation>;
  theme?: Maybe<GlobalThemeMutation>;
};

export type AuthorsMutation = {
  name?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
};

export type PagesBlocksHeroActionsMutation = {
  label?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['Boolean']>;
  link?: Maybe<Scalars['String']>;
};

export type PagesBlocksHeroImageMutation = {
  src?: Maybe<Scalars['String']>;
  alt?: Maybe<Scalars['String']>;
};

export type PagesBlocksHeroMutation = {
  tagline?: Maybe<Scalars['String']>;
  headline?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  actions?: Maybe<Array<Maybe<PagesBlocksHeroActionsMutation>>>;
  image?: Maybe<PagesBlocksHeroImageMutation>;
  color?: Maybe<Scalars['String']>;
};

export type PagesBlocksFeaturesItemsIconMutation = {
  color?: Maybe<Scalars['String']>;
  style?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type PagesBlocksFeaturesItemsMutation = {
  icon?: Maybe<PagesBlocksFeaturesItemsIconMutation>;
  title?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type PagesBlocksFeaturesMutation = {
  items?: Maybe<Array<Maybe<PagesBlocksFeaturesItemsMutation>>>;
  color?: Maybe<Scalars['String']>;
};

export type PagesBlocksContentMutation = {
  body?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
};

export type PagesBlocksTestimonialMutation = {
  quote?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
};

export type PagesBlocksMutation = {
  hero?: Maybe<PagesBlocksHeroMutation>;
  features?: Maybe<PagesBlocksFeaturesMutation>;
  content?: Maybe<PagesBlocksContentMutation>;
  testimonial?: Maybe<PagesBlocksTestimonialMutation>;
};

export type PagesMutation = {
  blocks?: Maybe<Array<Maybe<PagesBlocksMutation>>>;
};

export type GetCollectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCollectionsQuery = { __typename?: 'Query', getCollections: Array<{ __typename?: 'Collection', name: string }> };

export type GetGlobalDocQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlobalDocQuery = { __typename?: 'Query', getGlobalDocument: { __typename?: 'GlobalDocument', data: { __typename?: 'Global', header?: Maybe<{ __typename?: 'GlobalHeader', color?: Maybe<string>, icon?: Maybe<{ __typename?: 'GlobalHeaderIcon', color?: Maybe<string>, style?: Maybe<string>, name?: Maybe<string> }>, nav?: Maybe<Array<Maybe<{ __typename?: 'GlobalHeaderNav', href?: Maybe<string>, label?: Maybe<string> }>>> }>, footer?: Maybe<{ __typename?: 'GlobalFooter', color?: Maybe<string>, social?: Maybe<{ __typename?: 'GlobalFooterSocial', facebook?: Maybe<string>, twitter?: Maybe<string>, instagram?: Maybe<string>, github?: Maybe<string> }> }>, theme?: Maybe<{ __typename?: 'GlobalTheme', color?: Maybe<string>, font?: Maybe<string>, icon?: Maybe<string>, darkMode?: Maybe<string> }> } } };

export type GetAuthorDocumentQueryVariables = Exact<{
  path: Scalars['String'];
}>;


export type GetAuthorDocumentQuery = { __typename?: 'Query', getAuthorsDocument: { __typename?: 'AuthorsDocument', data: { __typename?: 'Authors', name?: Maybe<string>, avatar?: Maybe<string> } } };

export type GetPostsDocumentPartsTestFragment = { __typename?: 'PostsDocument', form: any };

export type PostsPartsFragment = { __typename?: 'Posts', title?: Maybe<string>, date?: Maybe<string>, heroImg?: Maybe<string>, excerpt?: Maybe<string>, _body?: Maybe<string> };

export type GlobalPartsFragment = { __typename?: 'Global', header?: Maybe<{ __typename?: 'GlobalHeader', color?: Maybe<string>, icon?: Maybe<{ __typename?: 'GlobalHeaderIcon', color?: Maybe<string>, style?: Maybe<string>, name?: Maybe<string> }>, nav?: Maybe<Array<Maybe<{ __typename?: 'GlobalHeaderNav', href?: Maybe<string>, label?: Maybe<string> }>>> }>, footer?: Maybe<{ __typename?: 'GlobalFooter', color?: Maybe<string>, social?: Maybe<{ __typename?: 'GlobalFooterSocial', facebook?: Maybe<string>, twitter?: Maybe<string>, instagram?: Maybe<string>, github?: Maybe<string> }> }>, theme?: Maybe<{ __typename?: 'GlobalTheme', color?: Maybe<string>, font?: Maybe<string>, icon?: Maybe<string>, darkMode?: Maybe<string> }> };

export type AuthorsPartsFragment = { __typename?: 'Authors', name?: Maybe<string>, avatar?: Maybe<string> };

export type PagesPartsFragment = { __typename?: 'Pages', blocks?: Maybe<Array<Maybe<{ __typename?: 'PagesBlocksHero', tagline?: Maybe<string>, headline?: Maybe<string>, text?: Maybe<string>, color?: Maybe<string>, actions?: Maybe<Array<Maybe<{ __typename?: 'PagesBlocksHeroActions', label?: Maybe<string>, type?: Maybe<string>, icon?: Maybe<boolean>, link?: Maybe<string> }>>>, image?: Maybe<{ __typename?: 'PagesBlocksHeroImage', src?: Maybe<string>, alt?: Maybe<string> }> } | { __typename?: 'PagesBlocksFeatures', color?: Maybe<string>, items?: Maybe<Array<Maybe<{ __typename?: 'PagesBlocksFeaturesItems', title?: Maybe<string>, text?: Maybe<string>, icon?: Maybe<{ __typename?: 'PagesBlocksFeaturesItemsIcon', color?: Maybe<string>, style?: Maybe<string>, name?: Maybe<string> }> }>>> } | { __typename?: 'PagesBlocksContent', body?: Maybe<string>, color?: Maybe<string> } | { __typename?: 'PagesBlocksTestimonial', quote?: Maybe<string>, author?: Maybe<string>, color?: Maybe<string> }>>> };

export type GetPostsDocumentQueryVariables = Exact<{
  relativePath: Scalars['String'];
}>;


export type GetPostsDocumentQuery = { __typename?: 'Query', getPostsDocument: { __typename?: 'PostsDocument', data: { __typename?: 'Posts', title?: Maybe<string>, date?: Maybe<string>, heroImg?: Maybe<string>, excerpt?: Maybe<string>, _body?: Maybe<string> } } };

export type GetGlobalDocumentQueryVariables = Exact<{
  relativePath: Scalars['String'];
}>;


export type GetGlobalDocumentQuery = { __typename?: 'Query', getGlobalDocument: { __typename?: 'GlobalDocument', data: { __typename?: 'Global', header?: Maybe<{ __typename?: 'GlobalHeader', color?: Maybe<string>, icon?: Maybe<{ __typename?: 'GlobalHeaderIcon', color?: Maybe<string>, style?: Maybe<string>, name?: Maybe<string> }>, nav?: Maybe<Array<Maybe<{ __typename?: 'GlobalHeaderNav', href?: Maybe<string>, label?: Maybe<string> }>>> }>, footer?: Maybe<{ __typename?: 'GlobalFooter', color?: Maybe<string>, social?: Maybe<{ __typename?: 'GlobalFooterSocial', facebook?: Maybe<string>, twitter?: Maybe<string>, instagram?: Maybe<string>, github?: Maybe<string> }> }>, theme?: Maybe<{ __typename?: 'GlobalTheme', color?: Maybe<string>, font?: Maybe<string>, icon?: Maybe<string>, darkMode?: Maybe<string> }> } } };

export type GetAuthorsDocumentQueryVariables = Exact<{
  relativePath: Scalars['String'];
}>;


export type GetAuthorsDocumentQuery = { __typename?: 'Query', getAuthorsDocument: { __typename?: 'AuthorsDocument', data: { __typename?: 'Authors', name?: Maybe<string>, avatar?: Maybe<string> } } };

export type GetPagesDocumentQueryVariables = Exact<{
  relativePath: Scalars['String'];
}>;


export type GetPagesDocumentQuery = { __typename?: 'Query', getPagesDocument: { __typename?: 'PagesDocument', data: { __typename?: 'Pages', blocks?: Maybe<Array<Maybe<{ __typename?: 'PagesBlocksHero', tagline?: Maybe<string>, headline?: Maybe<string>, text?: Maybe<string>, color?: Maybe<string>, actions?: Maybe<Array<Maybe<{ __typename?: 'PagesBlocksHeroActions', label?: Maybe<string>, type?: Maybe<string>, icon?: Maybe<boolean>, link?: Maybe<string> }>>>, image?: Maybe<{ __typename?: 'PagesBlocksHeroImage', src?: Maybe<string>, alt?: Maybe<string> }> } | { __typename?: 'PagesBlocksFeatures', color?: Maybe<string>, items?: Maybe<Array<Maybe<{ __typename?: 'PagesBlocksFeaturesItems', title?: Maybe<string>, text?: Maybe<string>, icon?: Maybe<{ __typename?: 'PagesBlocksFeaturesItemsIcon', color?: Maybe<string>, style?: Maybe<string>, name?: Maybe<string> }> }>>> } | { __typename?: 'PagesBlocksContent', body?: Maybe<string>, color?: Maybe<string> } | { __typename?: 'PagesBlocksTestimonial', quote?: Maybe<string>, author?: Maybe<string>, color?: Maybe<string> }>>> } } };

export const GetPostsDocumentPartsTestFragmentDoc = gql`
    fragment getPostsDocumentPartsTest on PostsDocument {
  form
}
    `;
export const PostsPartsFragmentDoc = gql`
    fragment PostsParts on Posts {
  title
  date
  heroImg
  excerpt
  _body
}
    `;
export const GlobalPartsFragmentDoc = gql`
    fragment GlobalParts on Global {
  header {
    icon {
      color
      style
      name
    }
    color
    nav {
      href
      label
    }
  }
  footer {
    color
    social {
      facebook
      twitter
      instagram
      github
    }
  }
  theme {
    color
    font
    icon
    darkMode
  }
}
    `;
export const AuthorsPartsFragmentDoc = gql`
    fragment AuthorsParts on Authors {
  name
  avatar
}
    `;
export const PagesPartsFragmentDoc = gql`
    fragment PagesParts on Pages {
  blocks {
    ... on PagesBlocksHero {
      tagline
      headline
      text
      actions {
        label
        type
        icon
        link
      }
      image {
        src
        alt
      }
      color
    }
    ... on PagesBlocksFeatures {
      items {
        icon {
          color
          style
          name
        }
        title
        text
      }
      color
    }
    ... on PagesBlocksContent {
      body
      color
    }
    ... on PagesBlocksTestimonial {
      quote
      author
      color
    }
  }
}
    `;
export const GetCollectionsDocument = gql`
    query getCollections {
  getCollections {
    name
  }
}
    `;
export const GetGlobalDocDocument = gql`
    query getGlobalDoc {
  getGlobalDocument(relativePath: "index.json") {
    data {
      ...GlobalParts
    }
  }
}
    ${GlobalPartsFragmentDoc}`;
export const GetAuthorDocumentDocument = gql`
    query GetAuthorDocument($path: String!) {
  getAuthorsDocument(relativePath: $path) {
    data {
      ...AuthorsParts
    }
  }
}
    ${AuthorsPartsFragmentDoc}`;
export const GetPostsDocumentDocument = gql`
    query getPostsDocument($relativePath: String!) {
  getPostsDocument(relativePath: $relativePath) {
    data {
      ...PostsParts
    }
  }
}
    ${PostsPartsFragmentDoc}`;
export const GetGlobalDocumentDocument = gql`
    query getGlobalDocument($relativePath: String!) {
  getGlobalDocument(relativePath: $relativePath) {
    data {
      ...GlobalParts
    }
  }
}
    ${GlobalPartsFragmentDoc}`;
export const GetAuthorsDocumentDocument = gql`
    query getAuthorsDocument($relativePath: String!) {
  getAuthorsDocument(relativePath: $relativePath) {
    data {
      ...AuthorsParts
    }
  }
}
    ${AuthorsPartsFragmentDoc}`;
export const GetPagesDocumentDocument = gql`
    query getPagesDocument($relativePath: String!) {
  getPagesDocument(relativePath: $relativePath) {
    data {
      ...PagesParts
    }
  }
}
    ${PagesPartsFragmentDoc}`;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    getCollections(variables?: GetCollectionsQueryVariables, options?: C): Promise<GetCollectionsQuery> {
      return requester<GetCollectionsQuery, GetCollectionsQueryVariables>(GetCollectionsDocument, variables, options);
    },
    getGlobalDoc(variables?: GetGlobalDocQueryVariables, options?: C): Promise<GetGlobalDocQuery> {
      return requester<GetGlobalDocQuery, GetGlobalDocQueryVariables>(GetGlobalDocDocument, variables, options);
    },
    GetAuthorDocument(variables: GetAuthorDocumentQueryVariables, options?: C): Promise<GetAuthorDocumentQuery> {
      return requester<GetAuthorDocumentQuery, GetAuthorDocumentQueryVariables>(GetAuthorDocumentDocument, variables, options);
    },
    getPostsDocument(variables: GetPostsDocumentQueryVariables, options?: C): Promise<GetPostsDocumentQuery> {
      return requester<GetPostsDocumentQuery, GetPostsDocumentQueryVariables>(GetPostsDocumentDocument, variables, options);
    },
    getGlobalDocument(variables: GetGlobalDocumentQueryVariables, options?: C): Promise<GetGlobalDocumentQuery> {
      return requester<GetGlobalDocumentQuery, GetGlobalDocumentQueryVariables>(GetGlobalDocumentDocument, variables, options);
    },
    getAuthorsDocument(variables: GetAuthorsDocumentQueryVariables, options?: C): Promise<GetAuthorsDocumentQuery> {
      return requester<GetAuthorsDocumentQuery, GetAuthorsDocumentQueryVariables>(GetAuthorsDocumentDocument, variables, options);
    },
    getPagesDocument(variables: GetPagesDocumentQueryVariables, options?: C): Promise<GetPagesDocumentQuery> {
      return requester<GetPagesDocumentQuery, GetPagesDocumentQueryVariables>(GetPagesDocumentDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;

// TinaSDK generated code

import { LocalClient } from 'tinacms'
const tinaClient = new LocalClient();
const requester: (doc: any, vars?: any, options?: any) => Promise<any> = async (
  doc,
  vars,
  _options
) => {
  const data = await tinaClient.request(doc, { variables: vars });
  return data;
};
export const getTinaClient = ()=>getSdk(requester)

